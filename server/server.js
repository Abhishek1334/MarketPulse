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

app.use(
	cors({
		origin: "*", // Allow all origins
		methods: "*", // Allow all HTTP methods
		allowedHeaders: "*", // Allow all headers
		credentials: true,
	})
);

// Body parser middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", authMiddleware, watchlistRoutes);
app.use("/api/stock", authMiddleware, stocksRoutes);

// Error handling
app.use(errorHandler);

// Test route
app.get("/", (req, res) => {
    res.send("Server Started Successfully");
});

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