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

const app = express(); // Initialize Express first

// CORS Configuration
const corsOptions = {
	origin: [
		"https://market-pulse-two.vercel.app",
		"http://localhost:5173", // Add localhost for development
	],
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Array format
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};

// Apply middleware in correct order
app.use(cors(corsOptions)); // CORS first
app.use(express.json()); // Then body parser

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", authMiddleware, watchlistRoutes);
app.use("/api/stock", authMiddleware, stocksRoutes);

// Test route
app.get("/", (req, res) => {
	res.send("Server Started Successfully");
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// DB connection
const connectDB = async () => {
	try {
		await mongoose.connect(mongoURI);
		console.log("✅ MongoDB Connected Successfully!!");

		app.listen(PORT, () => {
			console.log(`🚀 Server running on PORT: ${PORT}`);
		});
	} catch (error) {
		console.error("❌ MongoDB Connection Error:", error.message);
		process.exit(1);
	}
};

connectDB();
