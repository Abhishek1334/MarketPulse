// Local-dev launcher. Vercel uses api/[...slug].js instead.
import app from "./app.js";
import { connectDB } from "./db.js";

const PORT = process.env.PORT || 5000;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`🚀 Server running on PORT ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("❌ Failed to start:", err.message);
		process.exit(1);
	});
