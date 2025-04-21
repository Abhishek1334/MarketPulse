import React from "react";

const ConfirmationModal = ({ onConfirm, onCancel }) => {
	return (
		<div className="modal-overlay">
			<div className="modal-box">
				<h2 className="modal-header">
					Are you sure you want to delete this item?
				</h2>
				<div className="flex justify-between gap-4">
					<button onClick={onConfirm} className="button-confirm">
						Confirm
					</button>
					<button onClick={onCancel} className="button-cancel">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
