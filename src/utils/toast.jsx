import { toast } from "react-toastify";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import React from "react";

const ToastIcon = ({ icon: Icon, className }) => (
	<Icon className={`w-5 h-5 ${className}`} />
);

export const showSuccess = (message) => {
	toast.success(message, {
		icon: <ToastIcon icon={CheckCircle} className="text-[var(--accent-600)]" />,
		className: "toast-success",
		autoClose: 3000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
	});
};

export const showError = (message) => {
	toast.error(message, {
		icon: <ToastIcon icon={XCircle} className="text-red-500" />,
		className: "toast-error",
		autoClose: 4000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
	});
};

export const showInfo = (message) => {
	toast.info(message, {
		icon: <ToastIcon icon={Info} className="text-[var(--primary-600)]" />,
		className: "toast-info",
		autoClose: 3000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
	});
};

export const showWarning = (message) => {
	toast.warning(message, {
		icon: <ToastIcon icon={AlertTriangle} className="text-yellow-500" />,
		className: "toast-warning",
		autoClose: 3500,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
	});
};
