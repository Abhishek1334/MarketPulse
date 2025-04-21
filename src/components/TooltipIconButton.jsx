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
					className="p-2 bg-[var(--background-100)] rounded-full transition-all hover:bg-[var(--background-200)] text-[var(--text-950)]"
					aria-label={label}
				>
					<Icon className="w-4 h-4" />
				</button>
			</TooltipTrigger>
			<TooltipContent className="bg-[var(--background-200)] text-sm text-[var(--text-900)]">
				{label}
			</TooltipContent>
		</Tooltip>
	);
};

export default TooltipIconButton;
