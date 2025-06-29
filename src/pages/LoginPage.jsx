import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { LoginUser } from "../api/auth.js";
import useStore from "../context/Store.js";
import { showSuccess, showError } from "@/utils/toast.jsx";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import Icon from "../components/Icon.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const loginRef = useRef(null);

	const navigate = useNavigate();
	const login = useStore((state) => state.login);
	const user = useStore((state) => state.user);
	
	useEffect(() => {
		if (user) navigate("/dashboard");
	}, [user, navigate]);

	// GSAP Animations
	useEffect(() => {
		const ctx = gsap.context(() => {
			// Background elements animation
			gsap.fromTo(".bg-decoration", {
				scale: 0,
				opacity: 0,
				rotation: -180
			}, {
				scale: 1,
				opacity: 0.6,
				rotation: 0,
				duration: 1.5,
				stagger: 0.2,
				ease: "back.out(1.7)"
			});

			// Main card animation
			gsap.fromTo(".login-card", {
				y: 100,
				opacity: 0,
				scale: 0.8
			}, {
				y: 0,
				opacity: 1,
				scale: 1,
				duration: 1,
				ease: "power3.out",
				delay: 0.3
			});

			// Form elements animation
			gsap.fromTo(".form-element", {
				y: 30,
				opacity: 0
			}, {
				y: 0,
				opacity: 1,
				duration: 0.6,
				stagger: 0.1,
				ease: "power2.out",
				delay: 0.8
			});

		}, loginRef);

		return () => ctx.revert();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "email") setEmail(value);
		if (name === "password") setPassword(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!email || !password) {
			showError("All fields are required.");
			return;
		}

		setIsLoading(true);
		try {
			const data = await LoginUser(email, password);
			const { user, token } = data;
			login({ user, token });
			showSuccess("Welcome back! Login successful.");
			navigate("/dashboard");
		} catch (error) {
			showError(error.message || "Login failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div ref={loginRef} className="min-h-screen bg-gradient-to-br from-[var(--background-50)] via-[var(--background-100)] to-[var(--background-200)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
			{/* Background Decorations */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="bg-decoration absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--primary-500)]/10 rounded-full mix-blend-multiply filter blur-xl"></div>
				<div className="bg-decoration absolute top-3/4 right-1/4 w-64 h-64 bg-[var(--accent-500)]/10 rounded-full mix-blend-multiply filter blur-xl"></div>
				<div className="bg-decoration absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--secondary-500)]/5 rounded-full mix-blend-multiply filter blur-2xl"></div>
			</div>

			{/* Main Content */}
			<div className="w-full max-w-md relative z-10">
				{/* Header Badge */}
				<div className="form-element text-center mb-8">
					<Badge variant="outline" className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background-100)]/80 backdrop-blur-sm border-[var(--primary-500)]/20">
						<Sparkles className="w-4 h-4 text-[var(--primary-500)]" />
						Welcome back to MarketPulse
					</Badge>
				</div>

				{/* Login Card */}
				<Card className="login-card bg-[var(--background-100)]/95 backdrop-blur-lg border-[var(--background-300)] shadow-2xl">
					<CardHeader className="text-center space-y-4 pb-8">
						<div className="form-element flex justify-center">
							<div className="relative">
								<Icon iconSize="16" iconColor="light" className="hover:scale-110 transition-transform duration-300" />
								<div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] rounded-full animate-pulse"></div>
							</div>
						</div>
						<div className="form-element space-y-2">
							<CardTitle className="text-3xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)]">
								Sign In
							</CardTitle>
							<CardDescription className="text-[var(--text-600)] dark:text-[var(--text-300)] text-lg">
								Access your investment dashboard
							</CardDescription>
						</div>
					</CardHeader>

					<CardContent className="space-y-6">
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Email Field */}
							<div className="form-element space-y-2">
								<label className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-50)]">
									Email Address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Mail className="h-5 w-5 text-[var(--text-400)]" />
									</div>
									<input
										type="email"
										name="email"
										value={email}
										placeholder="Enter your email"
										onChange={handleChange}
										className="w-full pl-10 pr-4 py-3 bg-[var(--background-200)] border border-[var(--background-300)] rounded-lg text-[var(--text-950)] dark:text-[var(--text-50)] placeholder-[var(--text-500)] dark:placeholder-[var(--text-300)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all duration-200"
										required
										autoComplete="email"
									/>
								</div>
							</div>

							{/* Password Field */}
							<div className="form-element space-y-2">
								<label className="text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-50)]">
									Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<Lock className="h-5 w-5 text-[var(--text-400)]" />
									</div>
									<input
										type={showPassword ? "text" : "password"}
										name="password"
										value={password}
										placeholder="Enter your password"
										onChange={handleChange}
										className="w-full pl-10 pr-12 py-3 bg-[var(--background-200)] border border-[var(--background-300)] rounded-lg text-[var(--text-950)] placeholder-[var(--text-500)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all duration-200"
										required
										autoComplete="current-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--text-400)] hover:text-[var(--text-600)] transition-colors duration-200"
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isLoading}
								className="form-element w-full bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-600)] hover:from-[var(--primary-700)] hover:to-[var(--accent-700)] text-white dark:text-[var(--text-50)] font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
							>
								{isLoading ? (
									<div className="flex items-center justify-center gap-2">
										<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
										Signing In...
									</div>
								) : (
									<div className="flex items-center justify-center gap-2">
										Sign In
										<ArrowRight className="w-5 h-5" />
									</div>
								)}
							</Button>
						</form>

						{/* Divider */}
						<div className="form-element relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-[var(--background-300)]"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-4 bg-[var(--background-100)] text-[var(--text-500)]">
									New to MarketPulse?
								</span>
							</div>
						</div>

						{/* Register Link */}
						<div className="form-element text-center">
							<Link to="/register">
								<Button variant="ghost" className="w-full hover:bg-[var(--background-200)] transition-colors duration-200">
									Create an account
									<ArrowRight className="w-4 h-4 ml-2" />
								</Button>
							</Link>
						</div>

						{/* Back to Home */}
						<div className="form-element text-center pt-4">
							<Link 
								to="/"
								className="text-sm text-[var(--text-500)] hover:text-[var(--text-700)] transition-colors duration-200"
							>
								← Back to homepage
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default LoginPage;
