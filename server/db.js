import mongoose from "mongoose";

// Cached connection. On serverless (Vercel), function instances are reused
// across warm invocations, so we cache the connection on the global object
// to survive module-level re-evaluation and avoid connection storms.
let cached = global._mongooseCache;
if (!cached) {
	cached = global._mongooseCache = { conn: null, promise: null };
}

export const connectDB = async () => {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		const mongoURI = process.env.MONGO_URI;
		if (!mongoURI) {
			throw new Error("MONGO_URI environment variable is not set");
		}
		cached.promise = mongoose
			.connect(mongoURI, { bufferCommands: false })
			.then((m) => {
				console.log("✅ MongoDB connected");
				return m;
			})
			.catch((err) => {
				cached.promise = null; // allow retry on next request
				throw err;
			});
	}

	cached.conn = await cached.promise;
	return cached.conn;
};
