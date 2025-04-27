import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
	baseURL: API_URL, // Should be "https://marketpulse-gifx.onrender.com/api"
	withCredentials: true,
});
// Add a response interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (
			error.response &&
			error.response.status === 401 &&
			error.response.data.message === "TokenExpired"
		) {
			
			// Remove token from localStorage
			localStorage.removeItem("stock-dashboard-store");

			// Optional: redirect to login or show toast
			window.location.href = "/login"; // or use your router
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;