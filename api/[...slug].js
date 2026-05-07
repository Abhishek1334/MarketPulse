// Vercel Function entry. The catch-all filename ensures every /api/* request
// hits this function with the original req.url intact, so Express routing works.
import app from "../server/app.js";
export default app;
