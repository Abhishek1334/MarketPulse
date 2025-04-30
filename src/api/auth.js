import axios from "./axiosInstance.js";

export const LoginUser = async (email, password) => {
	try {
		if (!email || !password) {
			throw new Error("All the fields are required.");
		}

		const response = await axios.post("/auth/login", {
			email,
			password,
		});		

		return response.data;
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(
			error.response.data.message ||
				"Something went wrong with the server."
		);
	}
};


export const RegisterUser = async ( username, email, password ) => {
	try{
		if( !email || !username || !password ){
			throw new Error("All the fields are required.");
		}

		const response = await axios.post("/auth/register", {
			name : username,
			email,
			password
		});

		return response.data;
		
	} catch (error) {
		console.error("Error Response:", error.response.data);
		throw new Error(
			error.response.data.message || 
				"Something went wrong with the server."
		)
	}
}