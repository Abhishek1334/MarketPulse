import { showError } from "@/utils/toast.js";
import useStore from "../../context/Store.js";

const Header = () => {

	const user = useStore((state) => state.user);

	

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return "Good Morning";
		if (hour < 18) return "Good Afternoon";
		return "Good Evening";
	};

	if(!user) {
		showError("You are not logged in.");
	}

	if(!user) return (
		<div className=" bg-[var(--background-100)] text-[var(--text-950)] p-15  shadow-md rounded-lg flex flex-col justify-evenly transition-all duration-500  ease-in-out
		max-md:p-2">
			<h1 className="text-2xl font-bold mb-4 flex items-center gap-4 ">
				{" "}
				{getGreeting()},<div className="loader "></div>
			</h1>
			<div className="text-md font-Nunito max-sm:text-sm ">
				<p>
					<div className="loader"></div>
				</p>
			</div>
		</div>
	);

	return (
		<div className=" bg-[var(--background-100)] text-[var(--text-950)] p-15  shadow-md rounded-lg flex flex-col justify-evenly transition-all duration-500 ease-in-out max-md:p-6">
			<h1 className="text-2xl font-bold mb-4 ">
				{" "}
				{getGreeting()}, {user.name.split(" ")[0]}!
			</h1>
			<div className="text-md font-Nunito max-sm:text-sm ">
				<p>
					<span className="font-semibold">Email:</span> {user.email}
				</p>
			</div>
		</div>
	);
}

export default Header