import { toast } from "react-toastify";

export const showSuccess = (message) => {
	toast.success(message, {
		icon: "✅",
		className: "toast-success",
	});
};

export const showError = (message) => {
	toast.error(message, {
		icon: "❌",
		className: "toast-error",
	});
};
