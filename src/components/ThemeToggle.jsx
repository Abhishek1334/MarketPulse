import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import useStore from "@/context/Store"; 
const ThemeToggle = () => {
	const { theme, toggleTheme } = useStore();

	useEffect(() => {
		if (theme === "dark") {
			document.body.classList.add("dark");
		} else {
			document.body.classList.remove("dark");
		}
	}, [theme]);

	return (
		<div className="mr-4">
			<button
				onClick={toggleTheme}
				className="p-2 rounded-full bg-[var(--background-200)] dark:bg-[var(--background-300)] hover:bg-[var(--background-300)] dark:hover:bg-[var(--background-400)] transition-colors border border-[var(--border-color)] dark:border-[var(--border-color)]"
			>
				{theme === "dark" ? (
					<Sun size={18} className="text-[var(--accent-500)] dark:text-[var(--accent-400)]" />
				) : (
					<Moon size={18} className="text-[var(--text-700)] dark:text-[var(--primary-400)]" />
				)}
			</button>
		</div>
	);
};

export default ThemeToggle;
