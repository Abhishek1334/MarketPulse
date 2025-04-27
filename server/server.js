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

const corsOptions = {
	origin: "https://market-pulse-two.vercel.app", //  Replace with your Vercel origin
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	allowedHeaders: ["Content-Type", "Authorization"], //  Include 'Authorization' if you use it
	credentials: true, //  This is crucial
};
app.use(cors(corsOptions));
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