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
				className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
			>
				{theme === "dark" ? (
					<Sun size={18} className="text-yellow-400" />
				) : (
					<Moon size={18} className="text-gray-800" />
				)}
			</button>
		</div>
	);
};

export default ThemeToggle;
