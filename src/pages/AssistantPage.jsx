import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, Sparkles, Bot, User as UserIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SUGGESTED = [
	"What's my portfolio worth right now?",
	"How is AAPL doing today?",
	"What's my biggest holding by value?",
	"What's my unrealized gain across my portfolio?",
];

const getToken = () => {
	const stored = localStorage.getItem("stock-dashboard-store");
	const parsed = stored ? JSON.parse(stored) : null;
	return parsed?.state?.user?.token || "";
};

const AssistantPage = () => {
	const [input, setInput] = useState("");
	const scrollRef = useRef(null);

	const { messages, sendMessage, status, error } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/ai/chat",
			headers: () => ({ Authorization: `Bearer ${getToken()}` }),
		}),
	});

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [messages, status]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const text = input.trim();
		if (!text || status === "streaming" || status === "submitted") return;
		sendMessage({ text });
		setInput("");
	};

	const handleSuggested = (q) => {
		if (status === "streaming" || status === "submitted") return;
		sendMessage({ text: q });
	};

	const isBusy = status === "streaming" || status === "submitted";

	return (
		<div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[var(--background-50)] to-[var(--background-100)] dark:from-[var(--background-50)] dark:to-[var(--background-100)] px-4 py-6 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<header className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-xl flex items-center justify-center">
						<Sparkles className="w-5 h-5 text-white" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)]">
							MarketPulse Assistant
						</h1>
						<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-300)]">
							Ask about your portfolio, stocks, or market data. Powered by Gemini 2.5 Flash via the AI SDK.
						</p>
					</div>
				</header>

				{messages.length === 0 && (
					<Card className="mb-4 bg-[var(--background-50)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--background-200)]">
						<CardContent className="p-4">
							<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-300)] mb-3">
								Try one of these:
							</p>
							<div className="flex flex-wrap gap-2">
								{SUGGESTED.map((q) => (
									<Button
										key={q}
										onClick={() => handleSuggested(q)}
										variant="outline"
										size="sm"
										className="text-xs sm:text-sm"
									>
										{q}
									</Button>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				<div className="space-y-4 mb-4">
					{messages.map((m) => (
						<div
							key={m.id}
							className={`flex gap-3 ${
								m.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							{m.role === "assistant" && (
								<div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center flex-shrink-0">
									<Bot className="w-4 h-4 text-white" />
								</div>
							)}
							<div
								className={`max-w-[85%] rounded-2xl px-4 py-3 ${
									m.role === "user"
										? "bg-[var(--primary-500)] text-white"
										: "bg-[var(--background-100)] dark:bg-[var(--background-200)] text-[var(--text-950)] dark:text-[var(--text-50)] border border-[var(--background-200)] dark:border-[var(--background-300)]"
								}`}
							>
								{m.parts?.map((p, i) => {
									if (p.type === "text") {
										return (
											<div key={i} className="whitespace-pre-wrap text-sm sm:text-base">
												{p.text}
											</div>
										);
									}
									if (typeof p.type === "string" && p.type.startsWith("tool-")) {
										const name = p.type.replace("tool-", "");
										return (
											<div
												key={i}
												className="text-xs italic opacity-70 my-1"
												title={p.state}
											>
												🔧 Used: {name}
												{p.state === "input-streaming" || p.state === "input-available"
													? "..."
													: ""}
											</div>
										);
									}
									return null;
								})}
							</div>
							{m.role === "user" && (
								<div className="w-8 h-8 bg-[var(--background-300)] dark:bg-[var(--background-400)] rounded-lg flex items-center justify-center flex-shrink-0">
									<UserIcon className="w-4 h-4 text-[var(--text-700)] dark:text-[var(--text-200)]" />
								</div>
							)}
						</div>
					))}
					{isBusy && (
						<div className="flex gap-3 justify-start">
							<div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center flex-shrink-0">
								<Bot className="w-4 h-4 text-white" />
							</div>
							<div className="bg-[var(--background-100)] dark:bg-[var(--background-200)] rounded-2xl px-4 py-3 border border-[var(--background-200)] dark:border-[var(--background-300)]">
								<div className="flex gap-1">
									<div className="w-2 h-2 bg-[var(--text-400)] rounded-full animate-bounce" />
									<div className="w-2 h-2 bg-[var(--text-400)] rounded-full animate-bounce [animation-delay:120ms]" />
									<div className="w-2 h-2 bg-[var(--text-400)] rounded-full animate-bounce [animation-delay:240ms]" />
								</div>
							</div>
						</div>
					)}
					{error && (
						<div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
							<AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
							<span>{error.message || "Something went wrong."}</span>
						</div>
					)}
					<div ref={scrollRef} />
				</div>

				<form onSubmit={handleSubmit} className="sticky bottom-4">
					<Card className="bg-[var(--background-50)]/95 dark:bg-[var(--background-200)]/95 backdrop-blur-md shadow-lg border-[var(--background-200)] dark:border-[var(--background-300)]">
						<CardContent className="p-3 flex gap-2 items-center">
							<input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Ask about your portfolio..."
								className="flex-1 bg-transparent outline-none text-[var(--text-950)] dark:text-[var(--text-50)] placeholder:text-[var(--text-500)] text-sm sm:text-base"
								disabled={isBusy}
								autoComplete="off"
							/>
							<Button
								type="submit"
								disabled={!input.trim() || isBusy}
								size="icon"
								className="bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] text-white"
							>
								<Send className="w-4 h-4" />
							</Button>
						</CardContent>
					</Card>
				</form>
			</div>
		</div>
	);
};

export default AssistantPage;
