import mongoose from "mongoose";

const holdingSchema = new mongoose.Schema(
	{
		symbol: { type: String, required: true, uppercase: true, trim: true },
		shares: { type: Number, required: true, min: 0 },
		averagePrice: { type: Number, required: true, min: 0 },
		purchaseDate: { type: Date, default: Date.now },
		notes: { type: String, default: "" },
		sector: { type: String, default: "Unknown" },
	},
	{ timestamps: true }
);

const transactionSchema = new mongoose.Schema(
	{
		symbol: { type: String, required: true, uppercase: true, trim: true },
		type: {
			type: String,
			enum: ["buy", "sell", "dividend", "split"],
			required: true,
		},
		shares: { type: Number, required: true },
		price: { type: Number, required: true },
		date: { type: Date, default: Date.now },
		fees: { type: Number, default: 0 },
		notes: { type: String, default: "" },
	},
	{ timestamps: true }
);

const portfolioSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		holdings: { type: [holdingSchema], default: [] },
		transactions: { type: [transactionSchema], default: [] },
		settings: {
			currency: { type: String, default: "USD" },
			showUnrealizedGains: { type: Boolean, default: true },
			includeDividends: { type: Boolean, default: true },
			taxRate: { type: Number, default: 0.15 },
			rebalanceThreshold: { type: Number, default: 0.05 },
		},
	},
	{ timestamps: true }
);

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
