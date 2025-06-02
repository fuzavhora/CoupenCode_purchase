import express from "express";
import { createOrder, getUserOrders } from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/user", getUserOrders);

export default router;
