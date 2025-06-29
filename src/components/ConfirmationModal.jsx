import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

const ConfirmationModal = ({ open, setOpen, onConfirm, onCancel, watchlist }) => {
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-200)] dark:border-[var(--background-300)] shadow-2xl max-w-md">
				<DialogHeader className="space-y-3">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
							<AlertTriangle className="w-6 h-6 text-white" />
						</div>
						<div>
							<DialogTitle className="text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
								Confirm Deletion
							</DialogTitle>
							<DialogDescription className="text-[var(--text-600)] dark:text-[var(--text-400)]">
								This action cannot be undone
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="py-4">
					<p className="text-[var(--text-700)] dark:text-[var(--text-300)] leading-relaxed">
						Are you sure you want to delete this{" "}
						<span className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
							{watchlist ? "watchlist" : "stock"}
						</span>
						? This action is irreversible and will permanently remove all associated data.
					</p>
				</div>

				<div className="flex gap-3 pt-4">
					<Button
						variant="outline"
						onClick={onCancel}
						className="flex-1 border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-700)] dark:text-[var(--text-300)] hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)]"
					>
						Cancel
					</Button>
					<Button
						onClick={onConfirm}
						className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg"
					>
						<Trash2 className="w-4 h-4 mr-2" />
						Delete
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmationModal;
