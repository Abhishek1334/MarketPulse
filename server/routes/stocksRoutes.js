import express from "express";
import { searchStock } from "../controllers/externalStockController.js";
const router = express.Router();

router.get("/search", searchStock);

export default router;