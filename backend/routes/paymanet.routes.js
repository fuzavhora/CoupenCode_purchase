import express from "express";
import {
  createPayPalOrder,
  verifyPaypalPayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/paypal-create-order", createPayPalOrder);
router.post("/paypal-verify", verifyPaypalPayment);

export default router;
