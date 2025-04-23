import { Navigate, Outlet } from "react-router-dom";
import useStore from "@/context/Store";

const ProtectedRoute = () => {
	const user = useStore((state) => state.user);
	const hasHydrated = useStore.persist.hasHydrated();
	

	if (!hasHydrated) {
		return <div className="text-center py-20 text-xl">Loading...</div>;
	}

	return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
