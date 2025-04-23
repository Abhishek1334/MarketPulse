import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

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
			onOpenChange={() => {
				setOpen(false);
				resetForm();
			}}
		>
			<DialogContent
				className="sm:max-w-[425px] bg-[var(--background-900)] text-[var(--text-50)]"
			>
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">
						Edit Stock Details
					</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					You can edit the stock note and target price here.
				</DialogDescription>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">
							Note
						</label>
						<textarea
							className="w-full bg-[var(--background-100)] text-[var(--text-950)] p-2 rounded-md"
							rows={3}
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
					<div>
						<label className="block text-sm font-medium mb-1">
							Target Price
						</label>
						<input
							type="number"
							step="0.01"
							className="w-full bg-[var(--background-100)] text-[var(--text-950)] p-2 rounded-md"
							value={targetPrice}
							onChange={(e) => setTargetPrice(e.target.value)}
						/>
					</div>
				</div>

				<div className="flex justify-end gap-4 mt-6">
					<button
						className="font-[Raleway] border-2 border-[var(--background-50)] px-3 py-2 rounded-2xl text-base font-semibold text-[var(--background-50)]"
						onClick={() => {
							resetForm();
							onEditCancel();
						}}
					>
						Cancel
					</button>
					<button
						className="font-[Raleway] border-2 border-green-500 px-3 py-2 rounded-2xl text-base font-semibold text-green-500 disabled:opacity-45 disabled:cursor-not-allowed"
						onClick={handleSubmit}
						disabled={!isEditing || isLoading}
					>
						{isLoading ? "Saving..." : "Save"}
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EditStockModal;


//how do i run resetform on clicking dialog close button or pressing escape key

// answer : 
