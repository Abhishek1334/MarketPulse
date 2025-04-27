// server.js (Your Express server file)
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js"; // Adjust the path if needed
import watchlistRoutes from "./routes/watchlist.js"; // Adjust the path if needed
import stockRoutes from "./routes/stock.js"; // Adjust the path if needed
import errorHandler from "./middleware/error.js"; // Adjust the path if needed

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// **AGGRESSIVE CORS CONFIGURATION**
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

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("✅ MongoDB Connected Successfully!!"))
	.catch((err) => console.error("MongoDB Connection Error:", err));

// Apply routes
app.use("/api/auth", authRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/stock", stockRoutes);

// Error handler middleware
app.use(errorHandler);

app.get("/", (req, res) => {
	res.send("Server is running!");
});

app.listen(PORT, () => {
	console.log(`🚀 Server running on PORT: ${PORT}`);
	console.log(`Express server started and listening on port: ${PORT}`);
});
