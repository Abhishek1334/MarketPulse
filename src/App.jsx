import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import useStore from "./context/Store";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
	const initializeUser = useStore((state) => state.initializeUser);

	useEffect(() => {
		initializeUser();
	}, []);

	return (
		<div className="bg-[var(--background-50)]  min-h-screen transition-all duration-500 ease-in-out">
			<ToastContainer
				transition={Slide}
				position="top-right"
				autoClose={2500}
				theme="light"
				closeOnClick
				draggable
			/>

			<Outlet />
		</div>
	);
}

export default App;
