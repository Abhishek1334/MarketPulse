import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Edit3, DollarSign, FileText, Loader2 } from "lucide-react";

const EditStockModal = ({
	open,
	setOpen,
	initialNote = "",
	initialTargetPrice = "",
	onEditConfirm,
	onEditCancel,
	isLoading,
}) => {
	const [note, setNote] = useState(initialNote);
	const [targetPrice, setTargetPrice] = useState(initialTargetPrice);
	const [isEditing, setIsEditing] = useState(true);

	const handleSubmit = () => {
		if(note === initialNote && targetPrice === initialTargetPrice){
			setIsEditing(false);
			return
		}

		onEditConfirm(note.trim(), targetPrice);
		setOpen(false);
	};

	const resetForm = () => {
		setNote(initialNote);
		setTargetPrice(initialTargetPrice);
		setIsEditing(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(val) => {
				setOpen(val);
				if (!val) resetForm();
			}}
		>
			<DialogContent className="bg-[var(--background-100)] dark:bg-[var(--background-200)] border-[var(--background-200)] dark:border-[var(--background-300)] shadow-2xl max-w-md">
				<DialogHeader className="space-y-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-gradient-to-br from-[var(--primary-500)] to-[var(--accent-500)] rounded-lg flex items-center justify-center">
							<Edit3 className="w-5 h-5 text-white" />
						</div>
						<div>
							<DialogTitle className="text-xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
								Edit Stock Details
							</DialogTitle>
							<DialogDescription className="text-[var(--text-600)] dark:text-[var(--text-400)]">
								Update the note and target price for this stock
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="space-y-6 mt-6">
					<div className="space-y-2">
						<Label htmlFor="note" className="text-[var(--text-700)] dark:text-[var(--text-300)] font-medium">
							Note
						</Label>
						<div className="relative">
							<FileText className="absolute left-3 top-3 w-4 h-4 text-[var(--text-500)] dark:text-[var(--text-400)]" />
							<Textarea
								id="note"
								rows={3}
								placeholder="Add a note about this stock..."
								className="pl-10 bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-900)] dark:text-[var(--text-50)] placeholder:text-[var(--text-500)] dark:placeholder:text-[var(--text-400)] focus:border-[var(--primary-500)] dark:focus:border-[var(--primary-400)] focus:ring-[var(--primary-500)] dark:focus:ring-[var(--primary-400)] resize-none"
								value={note}
								onChange={(e) => {
									setNote(e.target.value);
									if (note === initialNote) {
										setIsEditing(false);
									}
									setIsEditing(true);
								}}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="targetPrice" className="text-[var(--text-700)] dark:text-[var(--text-300)] font-medium">
							Target Price
						</Label>
						<div className="relative">
							<DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-500)] dark:text-[var(--text-400)]" />
							<Input
								id="targetPrice"
								type="number"
								step="0.01"
								placeholder="0.00"
								className="pl-10 bg-[var(--background-50)] dark:bg-[var(--background-100)] border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-900)] dark:text-[var(--text-50)] placeholder:text-[var(--text-500)] dark:placeholder:text-[var(--text-400)] focus:border-[var(--primary-500)] dark:focus:border-[var(--primary-400)] focus:ring-[var(--primary-500)] dark:focus:ring-[var(--primary-400)]"
								value={targetPrice}
								onChange={(e) => setTargetPrice(e.target.value)}
							/>
						</div>
					</div>
				</div>

				<div className="flex gap-3 pt-6">
					<Button
						variant="outline"
						onClick={() => {
							resetForm();
							onEditCancel();
						}}
						className="flex-1 border-[var(--background-300)] dark:border-[var(--background-400)] text-[var(--text-700)] dark:text-[var(--text-300)] hover:bg-[var(--background-200)] dark:hover:bg-[var(--background-300)]"
					>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={!isEditing || isLoading}
						className="flex-1 bg-gradient-to-r from-[var(--primary-500)] to-[var(--accent-500)] hover:from-[var(--primary-600)] hover:to-[var(--accent-600)] text-white shadow-lg"
					>
						{isLoading ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Saving...
							</>
						) : (
							<>
								<Edit3 className="w-4 h-4 mr-2" />
								Save Changes
							</>
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EditStockModal;


//how do i run resetform on clicking dialog close button or pressing escape key

// answer : 
