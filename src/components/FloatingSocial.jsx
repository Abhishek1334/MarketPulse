import React, { useState } from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';

const FloatingSocial = () => {
	const [isExpanded, setIsExpanded] = useState(false);

	const socialLinks = [
		{
			name: "GitHub",
			icon: <Github className="w-5 h-5 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />,
			url: "https://github.com/Abhishek1334/",
			color: "hover:bg-[var(--background-700)] hover:text-[var(--text-50)] dark:hover:bg-[var(--background-600)]",
			bgColor: "bg-[var(--background-100)] dark:bg-[var(--background-200)]",
			borderColor: "border-[var(--background-300)] dark:border-[var(--background-400)]"
		},
		{
			name: "Portfolio",
			icon: <Globe className="w-5 h-5 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />,
			url: "https://abhishek-rajoria.vercel.app/",
			color: "hover:bg-[var(--primary-600)] hover:text-[var(--text-50)] dark:hover:bg-[var(--primary-500)]",
			bgColor: "bg-[var(--background-100)] dark:bg-[var(--background-200)]",
			borderColor: "border-[var(--background-300)] dark:border-[var(--background-400)]"
		},
		{
			name: "LinkedIn",
			icon: <Linkedin className="w-5 h-5 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />,
			url: "https://www.linkedin.com/in/abhishekrajoria/",
			color: "hover:bg-blue-600 hover:text-[var(--text-50)] dark:hover:bg-blue-500",
			bgColor: "bg-[var(--background-100)] dark:bg-[var(--background-200)]",
			borderColor: "border-[var(--background-300)] dark:border-[var(--background-400)]"
		},
		{
			name: "Email",
			icon: <Mail className="w-5 h-5 text-[var(--primary-500)] dark:text-[var(--primary-400)]" />,
			url: "mailto:Abhishekrajoria24@gmail.com",
			color: "hover:bg-[var(--accent-600)] hover:text-[var(--text-50)] dark:hover:bg-[var(--accent-500)]",
			bgColor: "bg-[var(--background-100)] dark:bg-[var(--background-200)]",
			borderColor: "border-[var(--background-300)] dark:border-[var(--background-400)]"
		}
	];

	return (
		<div 
			className="fixed bottom-6 right-6 z-50"
			onMouseEnter={() => setIsExpanded(true)}
			onMouseLeave={() => setIsExpanded(false)}
		>
			<div className="relative">
				{/* Hover Bridge - Invisible area to prevent collapse when moving from button to links */}
				<div 
					className="absolute bottom-12 right-0 w-14 h-20 pointer-events-auto"
					onMouseEnter={() => setIsExpanded(true)}
				></div>

				{/* Social Links */}
				<div className={`absolute bottom-16 right-0 flex flex-col gap-3 transition-all duration-200 ${
					isExpanded 
						? 'opacity-100 translate-y-0 pointer-events-auto' 
						: 'opacity-0 translate-y-2 pointer-events-none'
				}`}>
					{socialLinks.map((link, index) => (
						<a
							key={index}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className={`flex items-center justify-center w-12 h-12 ${link.bgColor} backdrop-blur-lg border ${link.borderColor} rounded-full shadow-lg transition-all duration-200 ${link.color} hover:scale-110 hover:shadow-xl group`}
							title={link.name}
						>
							{link.icon}
							{/* Tooltip */}
							<div className="absolute right-14 bg-[var(--background-800)] dark:bg-[var(--background-700)] text-[var(--text-50)] px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
								{link.name}
								<div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-[var(--background-800)] dark:border-l-[var(--background-700)] border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
							</div>
						</a>
					))}
				</div>

				{/* Main Toggle Button */}
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-600)] hover:from-[var(--primary-700)] hover:to-[var(--accent-700)] text-[var(--text-50)] rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 group max-sm:w-10 max-sm:h-10 relative"
					title="Social Links"
				>
					{/* Plus Icon */}
					<div className={`relative z-10 transition-transform duration-200 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}>
						<div className="w-5 h-5 relative">
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-0.5 h-5 bg-[var(--text-50)] rounded-full"></div>
							</div>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-5 h-0.5 bg-[var(--text-50)] rounded-full"></div>
							</div>
						</div>
					</div>
				</button>
			</div>
		</div>
	);
};

export default FloatingSocial; 