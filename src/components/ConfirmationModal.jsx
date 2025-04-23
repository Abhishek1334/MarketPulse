import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
const ConfirmationModal = ({ open, setOpen, onConfirm, onCancel, watchlist }) => {

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className={
					"sm:max-w-[425px] bg-[var(--background-900)] text-[var(--text-50)]"
				}
			>
				<DialogHeader>
					<DialogTitle className={"text-lg font-semibold"}>
						Are you sure?
					</DialogTitle>
				</DialogHeader>
				<p className="text-md font-medium text-muted-foreground">
					Are you sure you want to delete this {watchlist ? "watchlist" : "stock"}? This action
					is irreversible.
				</p>
				<div className="flex justify-end gap-4">
					<button
						className="font-[Raleway] border-2 border-[var(--background-50)] px-3 py-2 rounded-2xl text-base font-semibold text-[var(--background-50)]"
						onClick={onCancel}
					>
						Cancel
					</button>
					<button
						className="font-[Raleway] border-2 border-red-500 px-3 py-2 rounded-2xl text-base font-semibold text-red-500"
						onClick={onConfirm}
					>
						Delete
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
	
	
};

export default ConfirmationModal;
