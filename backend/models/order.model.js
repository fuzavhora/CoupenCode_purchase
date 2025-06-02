import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Credit Card", "UPI", "Net Banking", "Razorpay", 'paypal'], required: true },
  paymentStatus: { type: String, enum: ["Pending", "Success", "Failed"], default: "Pending" },
  orderStatus: { type: String, enum: ["Processing", "Shipped", "Delivered"], default: "Processing" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
