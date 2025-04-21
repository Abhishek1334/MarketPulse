import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
	symbol: {
		type: String,
		required: true,
		uppercase: true, // symbols are usually uppercase
		trim: true,
	},
	note: {
		type: String,
		default: "",
	},
	targetPrice: {
		type: Number,
		default: null,
	},
	addedAt: {
		type: Date,
		default: Date.now,
	},
	},	
	{	timestamps: true }
);

const watchlistSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		stocks: {
			type: [stockSchema],
			default: [],
		},
	},
	{ timestamps: true }
);

watchlistSchema.index({ user: 1 });
watchlistSchema.index({ user: 1, name: 1 }, { unique: true });

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

export default Watchlist;
