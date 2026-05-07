import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authMiddleware from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";
import stocksRoutes from "./routes/stocksRoutes.js";
import portfolioRoutes from "./routes/portfolioRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();

// CORS: allow same-origin (no Origin header) and any origin in CORS_ORIGINS.
// Comma-separated list, e.g.: CORS_ORIGINS=http://localhost:5173,https://example.com
const allowedOrigins = (process.env.CORS_ORIGINS || "")
	.split(",")
	.map((s) => s.trim())
	.filter(Boolean);

app.use(
	cors({
		origin: (origin, cb) => {
			if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
				return cb(null, true);
			}
			return cb(new Error("Not allowed by CORS"));
		},
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	})
);

app.use(express.json());

// Lazy DB connect: every request waits for the cached promise (instant on warm starts).
app.use(async (req, res, next) => {
	try {
		await connectDB();
		next();
	} catch (err) {
		console.error("DB connection failed:", err);
		next(err);
	}
});

app.use("/api/auth", authRoutes);
app.use("/api/watchlist", authMiddleware, watchlistRoutes);
app.use("/api/stock", authMiddleware, stocksRoutes);
app.use("/api/portfolio", authMiddleware, portfolioRoutes);
app.use("/api/ai", authMiddleware, aiRoutes);

app.get("/api", (req, res) => {
	res.json({ status: "ok", service: "MarketPulse API" });
});

app.use(errorHandler);

export default app;
