// src/app/page.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
	TrendingUp, 
	BarChart3, 
	Shield, 
	Zap, 
	ArrowRight,
	Play,
	CheckCircle,
	Sparkles,
	Target,
	Rocket,
	ArrowUpRight,
	Download,
	Users,
	Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/Icon";
import useStore from "@/context/Store";
import ThemeToggle from "@/components/ThemeToggle";

gsap.registerPlugin(ScrollTrigger);

const Homepage = () => {
	const navigate = useNavigate();
	const { isLoggedIn } = useStore();
	const [isVisible, setIsVisible] = useState(false);
	const heroRef = useRef(null);
	const featuresRef = useRef(null);
	const statsRef = useRef(null);
	const ctaRef = useRef(null);
	const testimonialsRef = useRef(null);

	useEffect(() => {
		setIsVisible(true);
		
		const ctx = gsap.context(() => {
			// Hero animations with enhanced timing
			const heroTl = gsap.timeline();
			
			heroTl.fromTo(".hero-badge", {
				scale: 0,
				opacity: 0,
				rotation: -180
			}, {
				scale: 1,
				opacity: 1,
				rotation: 0,
				duration: 1,
				ease: "back.out(1.7)"
			})
			.fromTo(".hero-title", {
				y: 100,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 1.2,
				ease: "power3.out"
			}, "-=0.5")
			.fromTo(".hero-subtitle", {
				y: 50,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 1,
				ease: "power3.out"
			}, "-=0.8")
			.fromTo(".floating-icon", {
				scale: 0,
				opacity: 0,
				rotation: 360
			}, {
				scale: 1,
				opacity: 1,
				rotation: 0,
				duration: 1,
				ease: "back.out(1.7)"
			}, "-=0.6")
			.fromTo(".hero-buttons", {
				y: 30,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 1,
				ease: "power3.out"
			}, "-=0.4")
			.fromTo(".trust-indicators", {
				y: 20,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 0.8,
				stagger: 0.1,
				ease: "power3.out"
			}, "-=0.2");

			// Animated background elements
			gsap.to(".bg-orb-1", {
				x: 100,
				y: -50,
				duration: 20,
				repeat: -1,
				yoyo: true,
				ease: "power2.inOut"
			});

			gsap.to(".bg-orb-2", {
				x: -80,
				y: 60,
				duration: 25,
				repeat: -1,
				yoyo: true,
				ease: "power2.inOut"
			});

			gsap.to(".bg-orb-3", {
				x: 60,
				y: -80,
				duration: 30,
				repeat: -1,
				yoyo: true,
				ease: "power2.inOut"
			});

			// Enhanced floating animation for hero icon
			gsap.to(".floating-icon", {
				y: -30,
				rotation: 5,
				duration: 3,
				yoyo: true,
				repeat: -1,
				ease: "power2.inOut"
			});

			// Features animation with stagger
			gsap.fromTo(".feature-card", {
				y: 100,
				opacity: 0,
				scale: 0.8
			}, {
				y: 0,
				opacity: 1,
				scale: 1,
				duration: 1,
				stagger: 0.15,
				ease: "power3.out",
				scrollTrigger: {
					trigger: featuresRef.current,
					start: "top 80%",
					end: "bottom 20%",
				}
			});

			// Stats animation with counting effect
			gsap.fromTo(".stat-item", {
				scale: 0,
				opacity: 0
			}, {
				scale: 1,
				opacity: 1,
				duration: 0.8,
				stagger: 0.1,
				ease: "back.out(1.7)",
				scrollTrigger: {
					trigger: statsRef.current,
					start: "top 80%",
				}
			});

			// Testimonials animation
			gsap.fromTo(".testimonial-card", {
				y: 50,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 0.8,
				stagger: 0.2,
				ease: "power3.out",
				scrollTrigger: {
					trigger: testimonialsRef.current,
					start: "top 80%",
				}
			});

			// CTA animation
			gsap.fromTo(".cta-content", {
				y: 50,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 1,
				ease: "power3.out",
				scrollTrigger: {
					trigger: ctaRef.current,
					start: "top 80%",
				}
			});

		}, heroRef);

		return () => ctx.revert();
	}, []);

	const handleGetStarted = () => {
		if (isLoggedIn()) {
			navigate("/dashboard");
		} else {
			navigate("/register");
		}
	};

	const features = [
		{
			icon: <TrendingUp className="h-7 w-7" />,
			title: "Real-time Analytics",
			description: "Get instant market insights with live data feeds and advanced charting tools.",
			color: "from-blue-500 to-cyan-500",
			bgColor: "bg-blue-500/10"
		},
		{
			icon: <BarChart3 className="h-7 w-7" />,
			title: "Smart Watchlists",
			description: "Create and manage custom watchlists with intelligent stock recommendations.",
			color: "from-purple-500 to-pink-500",
			bgColor: "bg-purple-500/10"
		},
		{
			icon: <Shield className="h-7 w-7" />,
			title: "Secure & Reliable",
			description: "Bank-level security with 99.9% uptime for uninterrupted trading insights.",
			color: "from-green-500 to-emerald-500",
			bgColor: "bg-green-500/10"
		},
		{
			icon: <Zap className="h-7 w-7" />,
			title: "Lightning Fast",
			description: "Optimized performance delivers market data in milliseconds, not seconds.",
			color: "from-orange-500 to-red-500",
			bgColor: "bg-orange-500/10"
		},
		{
			icon: <Target className="h-7 w-7" />,
			title: "AI-Powered Insights",
			description: "Advanced algorithms provide personalized investment recommendations.",
			color: "from-indigo-500 to-purple-500",
			bgColor: "bg-indigo-500/10"
		},
		{
			icon: <Rocket className="h-7 w-7" />,
			title: "Portfolio Optimization",
			description: "Optimize your portfolio with data-driven strategies and risk management.",
			color: "from-teal-500 to-cyan-500",
			bgColor: "bg-teal-500/10"
		}
	];

	const stats = [
		{ value: "50K+", label: "Active Users", icon: <Users className="h-5 w-5" /> },
		{ value: "1M+", label: "Stocks Tracked", icon: <TrendingUp className="h-5 w-5" /> },
		{ value: "99.9%", label: "Uptime", icon: <Shield className="h-5 w-5" /> },
		{ value: "24/7", label: "Support", icon: <Heart className="h-5 w-5" /> }
	];

	const testimonials = [
		{
			name: "Sarah Johnson",
			role: "Portfolio Manager",
			company: "Tech Investments",
			content: "MarketPulse has transformed how I analyze markets. The real-time data and AI insights have given me a significant edge.",
			rating: 5,
			avatar: "SJ"
		},
		{
			name: "Michael Chen",
			role: "Day Trader",
			company: "Independent",
			content: "The lightning-fast performance and intuitive interface make it my go-to platform for market analysis.",
			rating: 5,
			avatar: "MC"
		},
		{
			name: "Emily Rodriguez",
			role: "Financial Analyst",
			company: "Global Finance",
			content: "The advanced analytics and smart watchlists have streamlined my workflow significantly.",
			rating: 5,
			avatar: "ER"
		}
	];

	return (
		<div ref={heroRef} className="min-h-screen bg-gradient-to-br from-[var(--background-50)] via-[var(--background-100)] to-[var(--background-200)] dark:from-[var(--background-50)] dark:via-[var(--background-100)] dark:to-[var(--background-200)]">
			{/* Floating Theme Toggle */}
			<div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
				<ThemeToggle />
			</div>

			{/* Animated Background Orbs */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="bg-orb-1 absolute top-20 left-10 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-[var(--primary-400)]/20 to-[var(--accent-400)]/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
				<div className="bg-orb-2 absolute top-40 right-20 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-r from-[var(--accent-400)]/20 to-[var(--secondary-400)]/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-75"></div>
				<div className="bg-orb-3 absolute bottom-20 left-1/3 w-36 h-36 sm:w-72 sm:h-72 bg-gradient-to-r from-[var(--secondary-400)]/20 to-[var(--primary-400)]/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-150"></div>
			</div>

			{/* Hero Section */}
			<section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:pt-0">
				<div className="max-w-7xl mx-auto text-center relative z-10">
					{/* Badge */}
					<div className="hero-badge inline-flex items-center mb-6 sm:mb-8">
						<Badge variant="outline" className="px-3 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium bg-[var(--background-100)]/90 dark:bg-[var(--background-200)]/90 backdrop-blur-md border-[var(--primary-500)]/30 dark:border-[var(--primary-400)]/50 shadow-lg">
							<Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />
							<span className="hidden sm:inline">New: Advanced Analytics Dashboard</span>
							<span className="sm:hidden">New Analytics</span>
							<ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 text-[var(--accent-500)] dark:text-[var(--accent-400)]" />
						</Badge>
					</div>

					{/* Main heading */}
					<h1 className="hero-title text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-6 sm:mb-8 leading-tight">
						Master the
						<span className="bg-gradient-to-r from-[var(--primary-500)] via-[var(--accent-500)] to-[var(--secondary-500)] bg-clip-text text-transparent dark:from-[var(--primary-400)] dark:via-[var(--accent-400)] dark:to-[var(--secondary-400)]"> Market</span>
						<br />
						<span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">with MarketPulse</span>
					</h1>

					{/* Subtitle */}
					<p className="hero-subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl text-[var(--text-600)] dark:text-[var(--text-300)] mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light px-4">
						Real-time analytics, smart watchlists, and powerful insights to help you make informed investment decisions in today's dynamic market.
					</p>

					{/* Floating Icon */}
					<div className="floating-icon mb-8 sm:mb-12">
						<div className="relative">
							<Icon iconSize="80" iconColor="light" className="mx-auto drop-shadow-2xl sm:w-[120px] sm:h-[120px]" />
							<div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-400)] to-[var(--accent-400)] rounded-full blur-2xl opacity-30 animate-pulse"></div>
						</div>
					</div>

					{/* CTA Buttons */}
					<div className="hero-buttons flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
						<Button 
							onClick={handleGetStarted}
							size="lg"
							className="group bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] hover:from-[var(--primary-600)] hover:to-[var(--accent-600)] text-white font-bold px-6 py-4 sm:px-10 sm:py-6 rounded-2xl shadow-2xl hover:shadow-[0_20px_40px_rgba(168,85,247,0.3)] transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 text-base sm:text-lg w-full sm:w-auto"
						>
							{isLoggedIn() ? "Go to Dashboard" : "Start Free Trial"}
							<ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
						</Button>
						
						<Button 
							variant="outline"
							size="lg"
							onClick={() => navigate("/login")}
							className="group font-bold px-6 py-4 sm:px-10 sm:py-6 rounded-2xl border-2 border-[var(--primary-500)]/30 hover:border-[var(--primary-500)]/60 hover:bg-[var(--primary-500)]/10 transition-all duration-500 dark:text-[var(--text-50)] dark:border-[var(--primary-400)]/50 dark:hover:bg-[var(--primary-400)]/20 text-base sm:text-lg backdrop-blur-sm w-full sm:w-auto"
						>
							<Play className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
							Watch Demo
						</Button>
					</div>

					{/* Trust indicators */}
					<div className="trust-indicators flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-[var(--text-500)] dark:text-[var(--text-400)] px-4">
						<div className="flex items-center bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-[var(--background-200)] dark:border-[var(--background-300)]">
							<CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[var(--accent-500)] dark:text-[var(--accent-400)]" />
							Free to start
						</div>
						<div className="flex items-center bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-[var(--background-200)] dark:border-[var(--background-300)]">
							<Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[var(--secondary-500)] dark:text-[var(--secondary-400)]" />
							Secure & Private
						</div>
						<div className="flex items-center bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm px-3 py-2 sm:px-4 sm:py-2 rounded-full border border-[var(--background-200)] dark:border-[var(--background-300)]">
							<Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />
							Real-time Data
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section ref={featuresRef} className="py-16 sm:py-24 bg-[var(--background-100)]/50 dark:bg-[var(--background-200)]/50 relative">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 sm:mb-20">
						<Badge variant="outline" className="mb-4 sm:mb-6 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--accent-500)]/30 dark:border-[var(--accent-400)]/50">
							<Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[var(--accent-500)] dark:text-[var(--accent-400)]" />
							Powerful Features
						</Badge>
						<h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-4 sm:mb-6 px-4">
							Everything you need to succeed
						</h2>
						<p className="text-base sm:text-xl text-[var(--text-600)] dark:text-[var(--text-300)] max-w-3xl mx-auto leading-relaxed px-4">
							Powered tools and features designed to give you an edge in the market
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
						{features.map((feature, index) => (
							<Card key={index} className="feature-card group hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border-[var(--background-200)] dark:border-[var(--background-300)] bg-[var(--background-50)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm overflow-hidden relative">
								<div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
								<CardHeader className="text-center pb-4 sm:pb-6 relative">
									<div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
										{React.cloneElement(feature.icon, { className: "h-6 w-6 sm:h-8 sm:w-8 text-white" })}
									</div>
									<CardTitle className="text-xl sm:text-2xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)] group-hover:text-[var(--primary-600)] dark:group-hover:text-[var(--primary-400)] transition-colors">
										{feature.title}
									</CardTitle>
								</CardHeader>
								<CardContent className="px-4 sm:px-6">
									<CardDescription className="text-[var(--text-600)] dark:text-[var(--text-300)] leading-relaxed text-sm sm:text-lg">
										{feature.description}
									</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Why Choose MarketPulse Section */}
			<section ref={statsRef} className="py-16 sm:py-20 bg-gradient-to-r from-[var(--primary-500)]/10 via-[var(--accent-500)]/10 to-[var(--secondary-500)]/10 dark:from-[var(--primary-500)]/20 dark:via-[var(--accent-500)]/20 dark:to-[var(--secondary-500)]/20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 sm:mb-16">
						<h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-4 sm:mb-6">
							Why Choose MarketPulse?
						</h2>
						<p className="text-base sm:text-xl text-[var(--text-600)] dark:text-[var(--text-300)] max-w-3xl mx-auto leading-relaxed px-4">
							Built for traders who demand accuracy, speed, and insights
						</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
						<div className="text-center group">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
								<TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-2">
								Live Market Data
							</h3>
							<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-300)]">
								Real-time stock prices and market movements
							</p>
						</div>
						
						<div className="text-center group">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
								<BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-2">
								Advanced Analytics
							</h3>
							<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-300)]">
								Professional-grade charting and analysis tools
							</p>
						</div>
						
						<div className="text-center group">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
								<Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-2">
								Secure Platform
							</h3>
							<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-300)]">
								Bank-level security for your data and privacy
							</p>
						</div>
						
						<div className="text-center group">
							<div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
								<Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
							</div>
							<h3 className="text-lg sm:text-xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-2">
								Lightning Fast
							</h3>
							<p className="text-sm text-[var(--text-600)] dark:text-[var(--text-300)]">
								Optimized for speed and performance
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Get Started Section */}
			<section ref={testimonialsRef} className="py-16 sm:py-24 bg-[var(--background-100)]/50 dark:bg-[var(--background-200)]/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12 sm:mb-20">
						<Badge variant="outline" className="mb-4 sm:mb-6 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-[var(--background-100)]/80 dark:bg-[var(--background-200)]/80 backdrop-blur-sm border-[var(--secondary-500)]/30 dark:border-[var(--secondary-400)]/50">
							<Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[var(--secondary-500)] dark:text-[var(--secondary-400)]" />
							Ready to Trade?
						</Badge>
						<h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-4 sm:mb-6 px-4">
							Start your trading journey today
						</h2>
						<p className="text-base sm:text-xl text-[var(--text-600)] dark:text-[var(--text-300)] max-w-3xl mx-auto leading-relaxed px-4">
							Join traders who trust MarketPulse for their investment decisions and market analysis
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
						<div className="text-center group">
							<div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
								<TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
							</div>
							<h3 className="text-xl sm:text-2xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-3">
								Track Markets
							</h3>
							<p className="text-sm sm:text-base text-[var(--text-600)] dark:text-[var(--text-300)] leading-relaxed">
								Monitor real-time stock prices, market trends, and portfolio performance with advanced analytics
							</p>
						</div>
						
						<div className="text-center group">
							<div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
								<BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
							</div>
							<h3 className="text-xl sm:text-2xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-3">
								Analyze Data
							</h3>
							<p className="text-sm sm:text-base text-[var(--text-600)] dark:text-[var(--text-300)] leading-relaxed">
								Access professional-grade charting tools, technical indicators, and market insights
							</p>
						</div>
						
						<div className="text-center group">
							<div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
								<Target className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
							</div>
							<h3 className="text-xl sm:text-2xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-3">
								Make Decisions
							</h3>
							<p className="text-sm sm:text-base text-[var(--text-600)] dark:text-[var(--text-300)] leading-relaxed">
								Make informed investment decisions with comprehensive market data and analysis tools
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section ref={ctaRef} className="py-16 sm:py-24 bg-gradient-to-r from-[var(--primary-500)]/10 via-[var(--accent-500)]/10 to-[var(--secondary-500)]/10 dark:from-[var(--primary-500)]/20 dark:via-[var(--accent-500)]/20 dark:to-[var(--secondary-500)]/20 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-400)]/5 to-[var(--accent-400)]/5"></div>
				<div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
					<div className="cta-content">
						<Badge variant="outline" className="mb-4 sm:mb-6 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-[var(--background-100)]/90 dark:bg-[var(--background-200)]/90 backdrop-blur-sm border-[var(--accent-500)]/30 dark:border-[var(--accent-400)]/50">
							<Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[var(--accent-500)] dark:text-[var(--accent-400)]" />
							Ready to Start?
						</Badge>
						<h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)] mb-4 sm:mb-6 px-4">
							Transform your trading today
						</h2>
						<p className="text-base sm:text-xl text-[var(--text-600)] dark:text-[var(--text-300)] mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
							Join MarketPulse today and get access to professional-grade market analytics, real-time data, and intelligent insights.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
							<Button 
								onClick={handleGetStarted}
								size="lg"
								className="group bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] hover:from-[var(--primary-600)] hover:to-[var(--accent-600)] text-white font-bold px-8 py-4 sm:px-12 sm:py-6 rounded-2xl shadow-2xl hover:shadow-[0_20px_40px_rgba(168,85,247,0.3)] transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 text-base sm:text-lg w-full sm:w-auto"
							>
								{isLoggedIn() ? "Go to Dashboard" : "Get Started Free"}
								<ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
							</Button>
							<Button 
								variant="outline"
								size="lg"
								className="group font-bold px-8 py-4 sm:px-12 sm:py-6 rounded-2xl border-2 border-[var(--primary-500)]/30 hover:border-[var(--primary-500)]/60 hover:bg-[var(--primary-500)]/10 transition-all duration-500 dark:text-[var(--text-50)] dark:border-[var(--primary-400)]/50 dark:hover:bg-[var(--primary-400)]/20 text-base sm:text-lg backdrop-blur-sm w-full sm:w-auto"
							>
								<Download className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
								Download App
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Homepage;
