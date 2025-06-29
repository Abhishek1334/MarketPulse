import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const TooltipIconButton = ({ icon: Icon, label, onClick }) => {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					onClick={onClick}
					className="p-2 bg-[var(--background-100)] rounded-full transition-all hover:bg-[var(--background-200)] text-[var(--text-950)] dark:text-[var(--text-50)] dark:bg-[var(--background-300)] dark:border-[var(--primary-300)]"
					aria-label={label}
				>
					<Icon className="w-4 h-4" />
				</button>
			</TooltipTrigger>
			<TooltipContent className="bg-[var(--background-200)] dark:bg-[var(--background-300)] text-sm text-[var(--text-900)] dark:text-[var(--text-50)]">
				{label}
			</TooltipContent>
		</Tooltip>
	);
};

export default TooltipIconButton;
