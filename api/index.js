// Handles bare /api requests. /api/* nested paths are handled by [...slug].js.
// Both files re-export the same Express app from server/app.js.
import app from "../server/app.js";
export default app;
