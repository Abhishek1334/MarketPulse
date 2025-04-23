import { useEffect, useState } from "react";
import { RegisterUser } from "../api/auth";
import useStore from "../context/Store";
import { useNavigate, Link } from "react-router-dom";
import { showSuccess, showError } from "../utils/toast";
import { Eye, EyeClosed } from "lucide-react";

const RegisterPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	
	const navigate = useNavigate();
	const login = useStore((state) => state.login);
	const user = useStore((state) => state.user);

	useEffect(() => {
		if (user) navigate("/dashboard");
	}, [user, navigate]);

	
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email || !username || !password) {
			showError("All the fields are required.");
			return;
		}

		setIsLoading(true);
		try {
			const data = await RegisterUser(username, email, password);
			const { user, token } = data;
			login({ user, token });
			showSuccess("Registration successful.");
			navigate("/dashboard");
		} catch (error) {
			showError(error.message || "Registration failed.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "email") setEmail(value);
		if (name === "password") setPassword(value);
		if (name === "name") setUsername(value);
	};

	return (
		<div className="flex flex-col h-screen justify-center items-center px-4 bg-[var(--background-50)]  transition-all duration-1000 ease-in-out">
			<div className="shadow-lg p-8 rounded-2xl max-w-sm w-full bg-[var(--background-950)]  text-[var(--text-50)]">
				<h1 className="text-3xl font-bold mb-6 text-center">
					Register
				</h1>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<input
						type="text"
						name="name"
						value={username}
						placeholder="Name"
						onChange={handleChange}
						className="modal-inputField"
						required
						autoComplete="name"
					/>
					<input
						type="email"
						name="email"
						value={email}
						placeholder="Email"
						onChange={handleChange}
						className="modal-inputField"
						required
						autoComplete="email"
					/>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							value={password}
							placeholder="Password"
							onChange={handleChange}
							className="modal-inputField"
							required
							autoComplete="current-password"
						/>
						<div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[var(--text-950)] transition-all duration-300 ease-in-out">
							{showPassword ? (
								<Eye
									size={20}
									onClick={() => setShowPassword(false)}
								/>
							) : (
								<EyeClosed
									size={20}
									onClick={() => setShowPassword(true)}
								/>
							)}
						</div>
					</div>
					<button
						type="submit"
						className="modal-button"
						disabled={isLoading}
					>
						{isLoading ? (
							<div className="flex justify-center items-center">
								<div className="loader"></div>
							</div>
						) : (
							"Sign Up"
						)}
					</button>
				</form>
				<p className="mt-4 text-center text-sm ">
					Already have an account ?{" "}
					<Link
						to="/login"
						className="text-[var(--secondary-500)] font-bold hover:underline"
					>
						Login here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default RegisterPage;
