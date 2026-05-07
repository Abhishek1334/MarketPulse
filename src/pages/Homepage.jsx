import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowUpRight, Github } from "lucide-react";
import useStore from "@/context/Store";
import ThemeToggle from "@/components/ThemeToggle";

const FEATURES = [
	{
		num: "01",
		title: "Watchlists",
		body: "Curate the symbols you watch. Real-time quotes, hand-grouped, kept lean.",
	},
	{
		num: "02",
		title: "Portfolio",
		body: "Holdings and transactions persisted to MongoDB. Real prices, real history, no fictional charts.",
	},
	{
		num: "03",
		title: "Assistant",
		body: "Ask about any holding. Powered by Gemini, grounded in your actual portfolio data via tool calls.",
	},
];

const Homepage = () => {
	const navigate = useNavigate();
	const isLoggedIn = useStore((s) => s.isLoggedIn);
	const heroRef = useRef(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.fromTo(
				".reveal",
				{ y: 24, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 1,
					ease: "expo.out",
					stagger: 0.08,
				}
			);
		}, heroRef);
		return () => ctx.revert();
	}, []);

	const handleStart = () => {
		if (isLoggedIn()) navigate("/dashboard");
		else navigate("/register");
	};

	return (
		<div ref={heroRef} className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
			{/* Header — minimal, no logo flourish */}
			<header className="reveal max-w-6xl mx-auto px-6 sm:px-10 py-6 flex justify-between items-center">
				<span className="font-serif text-xl font-medium tracking-tight">
					MarketPulse
				</span>
				<nav className="flex items-center gap-6 text-sm">
					<ThemeToggle />
					<button
						onClick={() => navigate("/login")}
						className="hover:text-[var(--accent)] hidden sm:inline transition-colors"
					>
						Sign in
					</button>
				</nav>
			</header>

			{/* Hero — left-aligned, editorial proportions */}
			<section className="max-w-6xl mx-auto px-6 sm:px-10 pt-16 sm:pt-24 md:pt-32 pb-20 sm:pb-28">
				<div className="max-w-4xl">
					<div className="reveal num text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[var(--text-muted)] mb-8">
						A focused stock tracker · 2026
					</div>

					<h1 className="reveal font-serif text-5xl sm:text-7xl md:text-[5.5rem] lg:text-[7rem] leading-[0.95] tracking-tight mb-8 font-medium">
						The pulse of <br className="hidden sm:block" />
						the market,
						<br />
						<span
							className="italic font-light"
							style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'slnt' -8" }}
						>
							in your hands.
						</span>
					</h1>

					<p className="reveal text-lg sm:text-xl text-[var(--text-muted)] max-w-xl leading-[1.6] mb-12">
						Track what you own. Watch what matters. Read the signals before
						they shout.
					</p>

					<div className="reveal flex flex-wrap items-center gap-6">
						<button
							onClick={handleStart}
							className="group inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--accent-fg)] px-7 py-3.5 text-sm font-semibold tracking-wide hover:bg-[var(--accent-hover)] active:bg-[var(--accent-pressed)] transition-colors"
						>
							{isLoggedIn() ? "Open dashboard" : "Get started"}
							<ArrowUpRight
								className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
							/>
						</button>
						<button
							onClick={() => navigate("/login")}
							className="text-sm hover:text-[var(--accent)] transition-colors underline-offset-4 decoration-1 hover:underline"
						>
							Sign in
						</button>
					</div>
				</div>
			</section>

			{/* Hairline */}
			<div className="border-t border-[var(--border)]" />

			{/* Features — three columns, no cards, asymmetric label numbering */}
			<section className="max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
				<div className="grid md:grid-cols-3 gap-12 md:gap-16">
					{FEATURES.map((f) => (
						<div key={f.num} className="reveal">
							<div className="num text-xs text-[var(--text-subtle)] mb-5">
								{f.num} / 03
							</div>
							<h3 className="font-serif text-3xl mb-4 font-medium tracking-tight">
								{f.title}
							</h3>
							<p className="text-[var(--text-muted)] leading-[1.6]">
								{f.body}
							</p>
						</div>
					))}
				</div>
			</section>

			<div className="border-t border-[var(--border)]" />

			{/* Quote — single editorial line, sets the tone */}
			<section className="max-w-4xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
				<blockquote className="reveal font-serif text-2xl sm:text-3xl md:text-4xl leading-tight italic font-light text-[var(--text)]"
					style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60, 'slnt' -6" }}>
					"In investing, what is comfortable is rarely profitable."
				</blockquote>
				<div className="reveal num text-xs uppercase tracking-[0.18em] text-[var(--text-subtle)] mt-6">
					Robert Arnott
				</div>
			</section>

			<div className="border-t border-[var(--border)]" />

			{/* CTA — quiet, single line of intent */}
			<section className="max-w-6xl mx-auto px-6 sm:px-10 py-20 sm:py-28">
				<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
					<div className="max-w-2xl">
						<h2 className="reveal font-serif text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.05] mb-4">
							Start tracking.
						</h2>
						<p className="reveal text-[var(--text-muted)] text-lg leading-relaxed">
							Free during the open beta. No card. No spam.
						</p>
					</div>
					<button
						onClick={handleStart}
						className="reveal group self-start md:self-auto inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--accent-fg)] px-7 py-3.5 text-sm font-semibold tracking-wide hover:bg-[var(--accent-hover)] active:bg-[var(--accent-pressed)] transition-colors whitespace-nowrap"
					>
						{isLoggedIn() ? "Open dashboard" : "Get started"}
						<ArrowUpRight
							className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
						/>
					</button>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-[var(--border)]">
				<div className="max-w-6xl mx-auto px-6 sm:px-10 py-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-sm text-[var(--text-subtle)]">
					<div className="num">
						MarketPulse · v1.0 · built by{" "}
						<a
							href="https://github.com/Abhishek1334"
							target="_blank"
							rel="noreferrer"
							className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors underline-offset-4 hover:underline"
						>
							Abhishek
						</a>
					</div>
					<a
						href="https://github.com/Abhishek1334/MarketPulse"
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
					>
						<Github className="w-4 h-4" />
						View source
					</a>
				</div>
			</footer>
		</div>
	);
};

export default Homepage;
