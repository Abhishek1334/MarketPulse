import express from "express";
import {
	getPortfolio,
	addHolding,
	updateHolding,
	deleteHolding,
	addTransaction,
	updateSettings,
	importPortfolio,
} from "../controllers/portfolioController.js";

const router = express.Router();

router.get("/", getPortfolio);
router.post("/holdings", addHolding);
router.put("/holdings/:holdingId", updateHolding);
router.delete("/holdings/:holdingId", deleteHolding);
router.post("/transactions", addTransaction);
router.put("/settings", updateSettings);
router.post("/import", importPortfolio);

export default router;
