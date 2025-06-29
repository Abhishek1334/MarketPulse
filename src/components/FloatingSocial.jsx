import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, Linkedin, Mail, Globe } from 'lucide-react';
import { gsap } from 'gsap';

const FloatingSocial = () => {
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		// Initial animation
		gsap.fromTo('.floating-social-container', {
			scale: 0,
			opacity: 0,
			y: 50
		}, {
			scale: 1,
			opacity: 1,
			y: 0,
			duration: 0.6,
			ease: "back.out(1.7)",
			delay: 1
		});
	}, []);

	useEffect(() => {
		if (isExpanded) {
			gsap.to('.social-link', {
				y: 0,
				opacity: 1,
				scale: 1,
				duration: 0.3,
				stagger: 0.1,
				ease: "power2.out"
			});
		} else {
			gsap.to('.social-link', {
				y: 20,
				opacity: 0,
				scale: 0.8,
				duration: 0.2,
				stagger: 0.05,
				ease: "power2.in"
			});
		}
	}, [isExpanded]);

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
			url: "mailto:abhishekrajoria@gmail.com",
			color: "hover:bg-[var(--accent-600)] hover:text-[var(--text-50)] dark:hover:bg-[var(--accent-500)]",
			bgColor: "bg-[var(--background-100)] dark:bg-[var(--background-200)]",
			borderColor: "border-[var(--background-300)] dark:border-[var(--background-400)]"
		}
	];

	return (
		<div className="floating-social-container fixed bottom-6 right-6 z-50">
			<div className="relative">
				{/* Social Links */}
				<div className={`absolute bottom-16 right-0 flex flex-col gap-3 transition-all duration-300 ${isExpanded ? 'pointer-events-auto' : 'pointer-events-none'}`}>
					{socialLinks.map((link, index) => (
						<a
							key={index}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className={`social-link flex items-center justify-center w-12 h-12 ${link.bgColor} backdrop-blur-lg border ${link.borderColor} rounded-full shadow-lg transition-all duration-300 ${link.color} opacity-0 translate-y-5 scale-75 hover:scale-110 hover:shadow-xl group `}
							title={link.name}
						>
							{link.icon}
							{/* Tooltip */}
							<div className="absolute right-14 bg-[var(--background-800)] dark:bg-[var(--background-700)] text-[var(--text-50)] px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
								{link.name}
								<div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-[var(--background-800)] dark:border-l-[var(--background-700)] border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
							</div>
						</a>
					))}
				</div>

				{/* Main Toggle Button */}
				<button
					onMouseEnter={() => setIsExpanded(true)}
					onMouseLeave={() => setIsExpanded(false)}
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[var(--primary-600)] to-[var(--accent-600)] hover:from-[var(--primary-700)] hover:to-[var(--accent-700)] text-[var(--text-50)] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group max-sm:w-10 max-sm:h-10 relative overflow-hidden"
					title="Social Links"
				>
					{/* Animated background */}
					<div className="absolute inset-0 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
					
					{/* Icon */}
					<div className={`relative z-10 transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}>
						<div className="w-6 h-6 relative">
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-1 h-6 bg-[var(--text-50)] rounded-full transition-all duration-300"></div>
							</div>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-6 h-1 bg-[var(--text-50)] rounded-full transition-all duration-300"></div>
							</div>
						</div>
					</div>

					{/* Pulse effect */}
					<div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--primary-400)] to-[var(--accent-400)] opacity-0 group-hover:opacity-20 animate-ping"></div>
				</button>

				{/* Hover Area Extension */}
				<div 
					className="absolute -top-20 -left-4 w-20 h-24 opacity-0 pointer-events-auto"
					onMouseEnter={() => setIsExpanded(true)}
					onMouseLeave={() => setIsExpanded(false)}
				></div>
			</div>
		</div>
	);
};

export default FloatingSocial; 