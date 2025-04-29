import React from "react";
import useStore from "../context/Store";
import LogoDark from "../assets/logoicons/LogoDark.svg";
import LogoLight from "../assets/logoicons/LogoLight.svg";
import { useNavigate } from "react-router-dom";
import clsx from "clsx"; // A utility for conditionally joining classNames

const Icon = ({ iconSize, iconColor, className }) => {
	const { theme } = useStore();
	const { user } = useStore();
	const navigate = useNavigate();

	const handleLogoClick = (e) => {
		e.preventDefault();
		if (user) {
			navigate("/dashboard");
		} else {
			navigate("/");
		}
	};

	const size = iconSize ? `h-${iconSize} w-${iconSize}` : "h-10 w-10"; // Default to h-10 if no iconSize

	let src;
	if (iconColor === "dark") {
		src = LogoLight;
	} else if (iconColor === "light") {
		src = LogoDark;
	} else {
		src = theme === "light" ? LogoDark : LogoLight;
	}

	return (
		<img
			src={src}
			alt="Company Logo"
			className={clsx(size, className)} // Merge heightClass and passed className
			onClick={handleLogoClick}
		/>
	);
};

export default Icon;
