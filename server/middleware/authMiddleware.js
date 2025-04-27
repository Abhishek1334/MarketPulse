// import jwt from "jsonwebtoken";
// import User from "../models/user.js";
// import { createError } from "../utils/createError.js";

// const authMiddleware = async (req, res, next) => {
// 	try {
// 		const bearerToken = req.headers.authorization;

// 		if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
// 			throw createError("Unauthorized Access", 401);
// 		}

// 		const token = bearerToken.split(" ")[1];

// 		const decoded = jwt.verify(token, process.env.JWT_SECRET);

// 		if (!decoded?.userId) {
// 			throw createError("Invalid token payload", 401);
// 		}

// 		const user = await User.findById(decoded.userId).select("-password");
		
// 		if (!user) {
// 			throw createError("User not found", 404);
// 		}

// 		req.user = user;
// 		next();
// 	} catch (error) {
// 		console.error("Auth Error: ", error);

// 		if (error.name === "TokenExpiredError") {
// 			return res.status(401).json({ message: "TokenExpired" });
// 		}

// 		return res
// 			.status(401)
// 			.json({ message: error.message || "Unauthorized Access" });
// 	}
// };

// export default authMiddleware;
