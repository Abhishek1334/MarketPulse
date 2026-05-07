import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowUpRight, Github } from "lucide-react";
import useStore from "@/context/Store";
import ThemeToggle from "@/components/ThemeToggle";

const SPEC = [
	{ label: "Frontend", lines: ["React 19", "Vite 6", "Tailwind 4"] },
	{ label: "Backend", lines: ["Express 5", "MongoDB Atlas", "Vercel Functions"] },
	{ label: "AI", lines: ["Gemini 2.5 Flash", "AI SDK v6", "tool-calling"] },
	{ label: "Data", lines: ["Twelve Data", "60s LRU cache"] },
];

const FEATURES = [
	{
		num: "01",
		title: "Watchlists",
		body: "Curate the symbols you watch. Real-time quotes, hand-grouped, kept lean. Unlimited per account.",
		size: "lg",
	},
	{
		num: "02",
		title: "Portfolio",
		body: "Holdings + transactions persisted to Mongo. Real prices on load, real history from your trades.",
		size: "md",
	},
	{
		num: "03",
		title: "Assistant",
		body: "Ask in plain English. Tool-calls into your data, never invents numbers.",
		size: "md",
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
					stagger: 0.06,
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
		<div ref={heroRef} className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
			{/* Header — minimal */}
			<header className="reveal max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-6 flex justify-between items-center">
				<span className="font-serif text-xl font-medium tracking-tight">
					MarketPulse
				</span>
				<nav className="flex items-center gap-6 text-sm">
					<ThemeToggle />
					<button
						onClick={() => navigate("/login")}
						className="hover:text-[var(--accent)] transition-colors hidden sm:inline"
					>
						Sign in
					</button>
				</nav>
			</header>

			{/* Hero — asymmetric 7/5 split, headline + spec sheet */}
			<section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-24 lg:pt-32 pb-20 sm:pb-28 lg:pb-36">
				<div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-end">
					{/* Headline column — 7/12 */}
					<div className="lg:col-span-7">
						<div className="reveal num text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[var(--text-muted)] mb-8">
							A focused stock tracker · 2026
						</div>

						<h1 className="reveal font-serif text-[14vw] sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] leading-[0.9] tracking-tight mb-10 font-medium">
							The pulse <br />
							of the market,
							<br />
							<span
								className="italic font-light"
								style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'slnt' -8" }}
							>
								in your hands.
							</span>
						</h1>

						<p className="reveal text-lg sm:text-xl text-[var(--text-muted)] max-w-xl leading-[1.6] mb-12">
							Track what you own. Watch what matters. Read the signals
							before they shout.
						</p>

						<div className="reveal flex flex-wrap items-center gap-6">
							<button
								onClick={handleStart}
								className="group inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--accent-fg)] px-7 py-3.5 text-sm font-semibold tracking-wide hover:bg-[var(--accent-hover)] active:bg-[var(--accent-pressed)] transition-colors"
							>
								{isLoggedIn() ? "Open dashboard" : "Get started"}
								<ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
							</button>
							<button
								onClick={() => navigate("/login")}
								className="text-sm hover:text-[var(--accent)] transition-colors underline-offset-4 decoration-1 hover:underline"
							>
								Sign in
							</button>
						</div>
					</div>

					{/* Spec sheet column — 5/12, typographic, no card */}
					<aside className="reveal lg:col-span-5 lg:pl-8 lg:border-l lg:border-[var(--border)]">
						<div className="num text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)] mb-8">
							Build sheet
						</div>
						<dl className="space-y-7">
							{SPEC.map((s) => (
								<div key={s.label} className="grid grid-cols-12 gap-4 items-baseline">
									<dt className="num col-span-4 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
										{s.label}
									</dt>
									<dd className="col-span-8 num text-sm sm:text-[15px] text-[var(--text)] leading-[1.7]">
										{s.lines.map((l, i) => (
											<div key={i}>{l}</div>
										))}
									</dd>
								</div>
							))}
						</dl>
					</aside>
				</div>
			</section>

			<div className="border-t border-[var(--border)]" />

			{/* Features — magazine layout: feature 01 spans 7 cols (lead), 02 + 03 stacked in 5 cols */}
			<section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-32 relative">
				{/* Oversized section numeral as design element */}
				<div
					aria-hidden
					className="reveal absolute -top-2 sm:-top-6 right-6 sm:right-10 lg:right-16 font-serif text-[16vw] sm:text-[11rem] lg:text-[14rem] leading-none text-[var(--text)] opacity-[0.04] select-none pointer-events-none"
					style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 0" }}
				>
					What
				</div>

				<div className="num text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)] mb-12 sm:mb-16 relative">
					— What you get
				</div>

				<div className="grid lg:grid-cols-12 gap-12 lg:gap-16 relative">
					{/* Lead feature — 7/12 cols, larger type */}
					<article className="reveal lg:col-span-7">
						<div className="num text-xs text-[var(--text-subtle)] mb-6">
							{FEATURES[0].num} / 03
						</div>
						<h3 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6 font-medium tracking-tight leading-[1.05]">
							{FEATURES[0].title}
						</h3>
						<p className="text-[var(--text-muted)] leading-[1.65] text-lg max-w-lg">
							{FEATURES[0].body}
						</p>
					</article>

					{/* Stacked features — 5/12 cols */}
					<div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-[var(--border)] space-y-12">
						{FEATURES.slice(1).map((f) => (
							<article key={f.num} className="reveal">
								<div className="num text-xs text-[var(--text-subtle)] mb-4">
									{f.num} / 03
								</div>
								<h3 className="font-serif text-2xl sm:text-3xl mb-3 font-medium tracking-tight">
									{f.title}
								</h3>
								<p className="text-[var(--text-muted)] leading-[1.6] text-[15px]">
									{f.body}
								</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<div className="border-t border-[var(--border)]" />

			{/* Pull quote — magazine pull quote treatment, indented + decorative */}
			<section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
				<div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
					<div className="lg:col-span-2 num text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)] pt-3">
						— Disposition
					</div>
					<blockquote className="reveal lg:col-span-9 lg:col-start-3 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] italic font-light text-[var(--text)]"
						style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60, 'slnt' -6" }}>
						"In investing, what is comfortable
						<br className="hidden sm:block" />
						is rarely profitable."
						<footer className="reveal num not-italic text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)] mt-8 font-normal">
							Robert Arnott
						</footer>
					</blockquote>
				</div>
			</section>

			<div className="border-t border-[var(--border)]" />

			{/* CTA — split, varied padding */}
			<section className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-36">
				<div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end">
					<div className="lg:col-span-7">
						<div className="num text-[10px] uppercase tracking-[0.22em] text-[var(--text-subtle)] mb-6">
							— Begin
						</div>
						<h2 className="reveal font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight leading-[0.95] mb-6">
							Start <em
								className="italic font-light"
								style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'slnt' -8" }}
							>
								tracking.
							</em>
						</h2>
						<p className="reveal text-[var(--text-muted)] text-lg max-w-md leading-relaxed">
							Free during the open beta. No card. No spam.
						</p>
					</div>
					<div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-[var(--border)] flex flex-col gap-4">
						<button
							onClick={handleStart}
							className="reveal group inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-fg)] px-7 py-4 text-sm font-semibold tracking-wide hover:bg-[var(--accent-hover)] active:bg-[var(--accent-pressed)] transition-colors w-full"
						>
							{isLoggedIn() ? "Open dashboard" : "Get started"}
							<ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
						</button>
						<a
							href="https://github.com/Abhishek1334/MarketPulse"
							target="_blank"
							rel="noreferrer"
							className="reveal group inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-semibold tracking-wide text-[var(--text)] border border-[var(--border-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
						>
							<Github className="w-4 h-4" />
							Read the case study
						</a>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-[var(--border)]">
				<div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-sm text-[var(--text-subtle)]">
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
