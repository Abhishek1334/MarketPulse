import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { RegisterUser } from "../api/auth.js";
import useStore from "../context/Store.js";
import { showSuccess, showError } from "@/utils/toast.jsx";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle, X } from "lucide-react";
import Icon from "../components/Icon.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const registerRef = useRef(null);
	
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
			gsap.fromTo(".register-card", {
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

		}, registerRef);

		return () => ctx.revert();
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();

		const { name, email, password, confirmPassword } = formData;

		if (!name || !email || !password || !confirmPassword) {
			showError("All fields are required.");
			return;
		}

		if (password !== confirmPassword) {
			showError("Passwords do not match.");
			return;
		}

		if (password.length < 6) {
			showError("Password must be at least 6 characters long.");
			return;
		}

		setIsLoading(true);
		try {
			const data = await RegisterUser(name, email, password);
			const { user, token } = data;
			login({ user, token });
			showSuccess("Account created successfully! Welcome to MarketPulse.");
			navigate("/dashboard");
		} catch (error) {
			showError(error.message || "Registration failed. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Password strength indicator
	const getPasswordStrength = (password) => {
		if (password.length === 0) return { strength: 0, text: "", color: "" };
		if (password.length < 6) return { strength: 25, text: "Weak", color: "text-red-500" };
		if (password.length < 8) return { strength: 50, text: "Fair", color: "text-yellow-500" };
		if (password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
			return { strength: 100, text: "Strong", color: "text-green-500" };
		}
		return { strength: 75, text: "Good", color: "text-blue-500" };
	};

	const passwordStrength = getPasswordStrength(formData.password);

	return (
		<div ref={registerRef} className="min-h-screen bg-gradient-to-br from-[var(--background-50)] via-[var(--background-100)] to-[var(--background-200)] flex items-center justify-center px-2 sm:px-4 py-4 sm:py-6 md:py-12 relative overflow-hidden">
			{/* Background Decorations */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="bg-decoration absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[var(--primary-500)]/10 rounded-full mix-blend-multiply filter blur-xl"></div>
				<div className="bg-decoration absolute top-3/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-[var(--accent-500)]/10 rounded-full mix-blend-multiply filter blur-xl"></div>
				<div className="bg-decoration absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-[var(--secondary-500)]/5 rounded-full mix-blend-multiply filter blur-2xl"></div>
			</div>

			{/* Main Content */}
			<div className="w-full max-w-md relative z-10">
				{/* Header Badge */}
				<div className="form-element text-center mb-4 sm:mb-6 md:mb-8">
					<Badge variant="outline" className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 bg-[var(--background-100)]/80 backdrop-blur-sm border-[var(--primary-500)]/20 text-xs sm:text-sm">
						<Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary-500)]" />
						<span className="hidden xs:inline">Join MarketPulse Today</span>
						<span className="xs:hidden">Join Today</span>
					</Badge>
				</div>

				{/* Register Card */}
				<Card className="register-card bg-[var(--background-100)]/95 backdrop-blur-lg border-[var(--background-300)] shadow-2xl">
					<CardHeader className="text-center space-y-2 sm:space-y-3 md:space-y-4 pb-4 sm:pb-6 md:pb-8 px-3 sm:px-6">
						<div className="form-element flex justify-center">
							<div className="relative">
								<Icon iconSize="12" iconColor="light" className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 hover:scale-110 transition-transform duration-300" />
								<div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] rounded-full animate-pulse"></div>
							</div>
						</div>
						<div className="form-element space-y-1 sm:space-y-2">
							<CardTitle className="text-2xl sm:text-3xl font-bold text-[var(--text-950)] dark:text-[var(--text-50)]">
								Create Account
							</CardTitle>
							<CardDescription className="text-sm sm:text-base md:text-lg text-[var(--text-600)] dark:text-[var(--text-300)]">
								Start your investment journey with us
							</CardDescription>
						</div>
					</CardHeader>

					<CardContent className="space-y-4 sm:space-y-5 md:space-y-6 px-3 sm:px-6">
						<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
							{/* Name Field */}
							<div className="form-element space-y-1.5 sm:space-y-2">
								<label className="text-xs sm:text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-50)]">
									Full Name
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
										<User className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--text-400)]" />
									</div>
					<input
						type="text"
						name="name"
										value={formData.name}
										placeholder="Enter your full name"
						onChange={handleChange}
										className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-[var(--background-200)] border border-[var(--background-300)] rounded-lg text-sm sm:text-base text-[var(--text-950)] dark:text-[var(--text-50)] placeholder-[var(--text-500)] dark:placeholder-[var(--text-300)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all duration-200"
						required
						autoComplete="name"
					/>
								</div>
							</div>

							{/* Email Field */}
							<div className="form-element space-y-1.5 sm:space-y-2">
								<label className="text-xs sm:text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-50)]">
									Email Address
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
										<Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--text-400)]" />
									</div>
					<input
						type="email"
						name="email"
										value={formData.email}
										placeholder="Enter your email"
						onChange={handleChange}
										className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 bg-[var(--background-200)] border border-[var(--background-300)] rounded-lg text-sm sm:text-base text-[var(--text-950)] dark:text-[var(--text-50)] placeholder-[var(--text-500)] dark:placeholder-[var(--text-300)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all duration-200"
						required
						autoComplete="email"
					/>
								</div>
							</div>

							{/* Password Field */}
							<div className="form-element space-y-1.5 sm:space-y-2">
								<label className="text-xs sm:text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-50)]">
									Password
								</label>
					<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
										<Lock className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--text-400)]" />
									</div>
						<input
							type={showPassword ? "text" : "password"}
							name="password"
										value={formData.password}
										placeholder="Create a password"
							onChange={handleChange}
										className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 md:py-3 bg-[var(--background-200)] border border-[var(--background-300)] rounded-lg text-sm sm:text-base text-[var(--text-950)] dark:text-[var(--text-50)] placeholder-[var(--text-500)] dark:placeholder-[var(--text-300)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all duration-200"
							required
										autoComplete="new-password"
						/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-[var(--text-400)] hover:text-[var(--text-600)] transition-colors duration-200"
									>
							{showPassword ? (
											<EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
										) : (
											<Eye className="h-4 w-4 sm:h-5 sm:w-5" />
										)}
									</button>
								</div>
								
								{/* Password Strength Indicator */}
								{formData.password && (
									<div className="space-y-1.5 sm:space-y-2">
										<div className="flex items-center justify-between text-xs">
											<span className="text-[var(--text-600)]">Password strength:</span>
											<span className={`font-medium ${passwordStrength.color}`}>
												{passwordStrength.text}
											</span>
										</div>
										<div className="w-full bg-[var(--background-300)] rounded-full h-1.5 sm:h-2">
											<div 
												className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
													passwordStrength.strength === 100 ? 'bg-green-500' :
													passwordStrength.strength >= 75 ? 'bg-blue-500' :
													passwordStrength.strength >= 50 ? 'bg-yellow-500' : 'bg-red-500'
												}`}
												style={{ width: `${passwordStrength.strength}%` }}
											></div>
										</div>
									</div>
								)}
							</div>

							{/* Confirm Password Field */}
							<div className="form-element space-y-1.5 sm:space-y-2">
								<label className="text-xs sm:text-sm font-medium text-[var(--text-700)] dark:text-[var(--text-50)]">
									Confirm Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
										<Lock className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--text-400)]" />
									</div>
									<input
										type={showConfirmPassword ? "text" : "password"}
										name="confirmPassword"
										value={formData.confirmPassword}
										placeholder="Confirm your password"
										onChange={handleChange}
										className="w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 md:py-3 bg-[var(--background-200)] border border-[var(--background-300)] rounded-lg text-sm sm:text-base text-[var(--text-950)] dark:text-[var(--text-50)] placeholder-[var(--text-500)] dark:placeholder-[var(--text-300)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all duration-200"
										required
										autoComplete="new-password"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center text-[var(--text-400)] hover:text-[var(--text-600)] transition-colors duration-200"
									>
										{showConfirmPassword ? (
											<EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
										) : (
											<Eye className="h-4 w-4 sm:h-5 sm:w-5" />
										)}
									</button>
								</div>
								
								{/* Password Match Indicator */}
								{formData.confirmPassword && (
									<div className={`flex items-center gap-1.5 sm:gap-2 text-xs ${
										formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
									}`}>
										{formData.password === formData.confirmPassword ? (
											<>
												<CheckCircle className="w-3 h-3 flex-shrink-0" />
												<span>Passwords match</span>
											</>
										) : (
											<>
												<X className="w-3 h-3 flex-shrink-0" />
												<span>Passwords don't match</span>
											</>
							)}
						</div>
								)}
					</div>

														{/* Submit Button */}
							<Button
								type="submit"
								disabled={isLoading}
								className="form-element w-full bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-600)] hover:from-[var(--primary-700)] hover:to-[var(--accent-700)] text-white dark:text-[var(--text-50)] font-semibold px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
							>
						{isLoading ? (
									<div className="flex items-center justify-center gap-1.5 sm:gap-2">
										<div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
										<span className="hidden xs:inline">Creating Account...</span>
										<span className="xs:hidden">Loading...</span>
							</div>
						) : (
									<div className="flex items-center justify-center gap-1.5 sm:gap-2">
										<span className="hidden xs:inline">Create Account</span>
										<span className="xs:hidden">Create</span>
										<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
									</div>
						)}
							</Button>
				</form>

						{/* Terms */}
						<div className="form-element text-center text-[10px] sm:text-xs text-[var(--text-500)] leading-relaxed px-2">
							By creating an account, you agree to our{" "}
							<a href="#" className="text-[var(--primary-600)] hover:underline">Terms of Service</a>{" "}
							and{" "}
							<a href="#" className="text-[var(--primary-600)] hover:underline">Privacy Policy</a>
						</div>

						{/* Divider */}
						<div className="form-element relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-[var(--background-300)]"></div>
							</div>
							<div className="relative flex justify-center text-xs sm:text-sm">
								<span className="px-2 sm:px-4 bg-[var(--background-100)] text-[var(--text-500)]">
									Already have an account?
								</span>
							</div>
						</div>

						{/* Login Link */}
						<div className="form-element text-center">
							<Link to="/login">
								<Button variant="ghost" className="w-full hover:bg-[var(--background-200)] transition-colors duration-200 text-sm sm:text-base py-2 sm:py-2.5">
									<span className="hidden xs:inline">Sign in to your account</span>
									<span className="xs:hidden">Sign in</span>
									<ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
								</Button>
							</Link>
						</div>

						{/* Back to Home */}
						<div className="form-element text-center pt-2 sm:pt-4">
					<Link
								to="/"
								className="text-xs sm:text-sm text-[var(--text-500)] hover:text-[var(--text-700)] transition-colors duration-200"
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

export default RegisterPage;
