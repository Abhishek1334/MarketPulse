import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authMiddleware from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import stocksRoutes from "./routes/stocksRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

console.log("Starting server...");

// Validate env vars
if (!mongoURI) {
	console.error("❌ MONGO_URI is not defined in .env");
	process.exit(1);
}
console.log("MONGO_URI:", mongoURI);

// CORS Configuration
const corsOptions = {
	origin: ["https://marketpulse-glx.onrender.com", "http://localhost:5173"],
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};
console.log("CORS Options:", corsOptions);
app.use(cors(corsOptions));
console.log("CORS middleware applied.");
app.use(express.json());
// Routes
console.log("Applying auth routes at /api/auth");
app.use("/api/auth", authRoutes);
console.log("Applying watchlist routes at /api/watchlist");
app.use("/api/watchlist", authMiddleware, watchlistRoutes);
console.log("Applying stock routes at /api/stock");
app.use("/api/stock", authMiddleware, stocksRoutes);

// Error handling
console.log("Applying error handler middleware.");
app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
	console.log("Handling GET request to /");
	res.send("Server Started Successfully");
});

// DB connection
const connectDB = async () => {
	try {
		console.log("Connecting to MongoDB...");
		await mongoose.connect(mongoURI);
		console.log("✅ MongoDB Connected Successfully!!");

		const server = app.listen(PORT, () => {
			console.log(`🚀 Server running on PORT: ${PORT}`);
		});

		server.on("listening", () => {
			console.log("Express server started and listening on port:", PORT);
		});

		server.on("error", (error) => {
			console.error("Express server error:", error);
		});
	} catch (error) {
		console.error("❌ MongoDB Connection Error:", error.message);
		process.exit(1);
	}
};

connectDB();
