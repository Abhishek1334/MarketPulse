// Single Vercel Function entry. /api/* requests are routed here via
// vercel.json rewrites; we reconstruct the original path from the
// __path query param so Express can route the request.
import app from "../server/app.js";

export default function handler(req, res) {
	if (req.url) {
		const u = new URL(req.url, "http://localhost");
		const innerPath = u.searchParams.get("__path");
		if (innerPath !== null) {
			u.searchParams.delete("__path");
			u.pathname = "/api/" + innerPath;
			req.url = u.pathname + u.search;
		}
	}
	return app(req, res);
}
