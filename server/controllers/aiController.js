import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import axios from "axios";
import Portfolio from "../models/portfolio.js";
import { createError } from "../utils/createError.js";

const SYSTEM_PROMPT = `You are MarketPulse Assistant — a financial data assistant inside the MarketPulse stock app.

The user is signed in. You have tools to fetch their portfolio, look up stock quotes, and search symbols. Use them whenever the user asks about specific data; do not make up numbers.

Style:
- Be concise. Default 2–4 sentences. Expand only when asked.
- Format prices as $1,234.56 and changes as 12.3%.
- When citing a holding: "AAPL · 10 sh @ $180.42 (cost basis $1,804)".

Boundaries:
- Provide factual analysis only. Do NOT recommend buy/sell decisions or give personalized investment advice.
- If the user asks for a recommendation, briefly note that you can't, then offer factual context instead.
- Decline politely if asked about non-financial topics.
- If a tool errors, say so briefly and suggest the user retry.`;

export const chatHandler = async (req, res, next) => {
	try {
		if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
			return res.status(503).json({
				error: "AI assistant not configured. Set GOOGLE_GENERATIVE_AI_API_KEY in the server environment (free key at https://aistudio.google.com/app/apikey).",
			});
		}

		const { messages } = req.body || {};
		if (!Array.isArray(messages) || messages.length === 0) {
			throw createError("messages array is required.", 400);
		}

		const userId = req.user._id;
		const apiKey = process.env.TWELVE_DATA_API_KEY;

		const fetchQuoteRaw = async (symbol) => {
			const { data } = await axios.get("https://api.twelvedata.com/quote", {
				params: { symbol, apikey: apiKey },
			});
			return data;
		};

		const tools = {
			getPortfolioSummary: tool({
				description:
					"Returns the signed-in user's portfolio: holdings (with current price and unrealized gain), recent transactions, and aggregate metrics. Use whenever the user asks about THEIR holdings, value, gain, or performance.",
				inputSchema: z.object({}),
				execute: async () => {
					const portfolio = await Portfolio.findOne({ user: userId });
					if (!portfolio || portfolio.holdings.length === 0) {
						return {
							holdings: [],
							transactions: [],
							message: "User has no holdings yet.",
						};
					}

					const symbols = [...new Set(portfolio.holdings.map((h) => h.symbol))];
					let priceMap = {};
					try {
						const data = await fetchQuoteRaw(symbols.join(","));
						const quotes = Array.isArray(data)
							? data
							: data?.symbol
								? [data]
								: Object.values(data || {}).filter((v) => v && v.symbol);
						priceMap = Object.fromEntries(
							quotes.map((q) => [q.symbol, parseFloat(q.close || q.price || 0)])
						);
					} catch (e) {
						console.warn("Quote fetch failed in tool:", e.message);
					}

					const holdings = portfolio.holdings.map((h) => {
						const price = priceMap[h.symbol] ?? h.averagePrice;
						return {
							symbol: h.symbol,
							shares: h.shares,
							averagePrice: h.averagePrice,
							currentPrice: price,
							marketValue: Number((h.shares * price).toFixed(2)),
							costBasis: Number((h.shares * h.averagePrice).toFixed(2)),
							unrealizedGain: Number(
								(h.shares * (price - h.averagePrice)).toFixed(2)
							),
							sector: h.sector,
						};
					});
					const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0);
					const totalCost = holdings.reduce((s, h) => s + h.costBasis, 0);

					return {
						holdings,
						transactions: portfolio.transactions.slice(-20).map((t) => ({
							symbol: t.symbol,
							type: t.type,
							shares: t.shares,
							price: t.price,
							date: t.date,
						})),
						totalValue: Number(totalValue.toFixed(2)),
						totalCost: Number(totalCost.toFixed(2)),
						totalGain: Number((totalValue - totalCost).toFixed(2)),
						totalGainPercent:
							totalCost > 0
								? Number((((totalValue - totalCost) / totalCost) * 100).toFixed(2))
								: 0,
					};
				},
			}),

			getStockQuote: tool({
				description:
					"Get the current quote for a single stock symbol: price, day change, day range, 52-week range, volume.",
				inputSchema: z.object({
					symbol: z.string().describe("Stock ticker symbol, e.g., AAPL or MSFT"),
				}),
				execute: async ({ symbol }) => {
					try {
						const data = await fetchQuoteRaw(symbol);
						if (data?.status === "error") {
							return { error: data.message || "Symbol lookup failed" };
						}
						return {
							symbol: data.symbol,
							name: data.name,
							price: parseFloat(data.close || 0),
							previousClose: parseFloat(data.previous_close || 0),
							percentChange: parseFloat(data.percent_change || 0),
							dayHigh: parseFloat(data.high || 0),
							dayLow: parseFloat(data.low || 0),
							fiftyTwoWeekHigh: parseFloat(
								data?.fifty_two_week?.high || data["52_week_high"] || 0
							),
							fiftyTwoWeekLow: parseFloat(
								data?.fifty_two_week?.low || data["52_week_low"] || 0
							),
							volume: parseInt(data.volume || 0),
						};
					} catch (e) {
						return { error: e.message || "Quote lookup failed" };
					}
				},
			}),

			searchSymbol: tool({
				description:
					"Search for stock symbols by company name or partial ticker. Returns up to 5 matches.",
				inputSchema: z.object({
					query: z.string().describe("Company name or partial ticker, e.g., 'tesla'"),
				}),
				execute: async ({ query }) => {
					try {
						const { data } = await axios.get(
							"https://api.twelvedata.com/symbol_search",
							{ params: { symbol: query, apikey: apiKey } }
						);
						const items = (data?.data || []).slice(0, 5).map((item) => ({
							symbol: item.symbol,
							name: item.instrument_name || item.name,
							exchange: item.exchange,
							type: item.instrument_type,
						}));
						return { results: items };
					} catch (e) {
						return { error: e.message || "Search failed" };
					}
				},
			}),
		};

		const result = streamText({
			model: google("gemini-2.5-flash"),
			system: SYSTEM_PROMPT,
			messages: await convertToModelMessages(messages),
			tools,
			stopWhen: stepCountIs(5),
		});

		result.pipeUIMessageStreamToResponse(res);
	} catch (error) {
		console.error("AI chat error:", error);
		next(
			createError(
				error.message || "Failed to handle chat",
				error.statusCode || 500
			)
		);
	}
};
