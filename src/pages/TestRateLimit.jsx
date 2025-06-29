import React, { useState } from "react";
import useRateLimitedFetch from "../service/RateLimiting";

const testSymbols = [
	"AAPL",
	"GOOGL",
	"TSLA",
	"MSFT",
	"AMZN",
	"TSLA",
	"GOOGL",
	"META",
	"NFLX",
	"NVDA",
	"BABA",
	"INTC",
	"UBER",
	"SHOP",
	"PYPL",
	"AMZN",
];

const TestRateLimit = () => {
	const { addToQueue, results, isFetching } = useRateLimitedFetch();
	const [queued, setQueued] = useState([]);
	const [requestCount, setRequestCount] = useState(0);
	const [loading, setLoading] = useState(false);

	const triggerFetch = () => {
		setQueued(testSymbols);
		testSymbols.forEach((symbol) => addToQueue(symbol));
	};

	// Update request count
	useState(() => {
		if (results.length > requestCount) {
			setRequestCount(results.length);
		}
	}, [results]);

	const handleTestRateLimit = () => {
		setLoading(true);
		triggerFetch();
	};

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">
				🚀 Rate Limited Fetch Test
			</h2>
			<button
				onClick={handleTestRateLimit}
				disabled={loading}
				className="bg-[var(--primary-600)] text-[var(--text-50)] px-4 py-2 rounded hover:bg-[var(--primary-700)]"
			>
				{loading ? "Testing..." : "Test Rate Limit"}
			</button>

			<div className="mt-6">
				<h3 className="font-semibold mb-2">Queued Symbols:</h3>
				<ul className="list-disc ml-6 text-[var(--text-700)]">
					{queued.map((s, i) => (
						<li key={i}>{s}</li>
					))}
				</ul>
			</div>

			<div className="mt-6">
				<h3 className="font-semibold mb-2">📊 Results:</h3>
				{isFetching && <p className="text-yellow-600">Fetching...</p>}
				<p>Requests Made: {requestCount}</p>
				<pre className="bg-[var(--background-100)] p-4 rounded max-h-[400px] overflow-auto text-xs">
					{JSON.stringify(results, null, 2)}
				</pre>
			</div>

			<div className="mt-6">
				<h3 className="font-semibold mb-2">Rate Limiting Status:</h3>
				<p className="text-[var(--text-600)]">
					- If "Fetching..." is displayed, the system is fetching data
					for a symbol.
				</p>
				<p className="text-[var(--text-600)]">
					- If the limits are exceeded, you will see messages
					indicating rate limits are hit.
				</p>
			</div>
		</div>
	);
};

export default TestRateLimit;
