import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
      })
      .status(200)
      .json({ msg: "Login successful", user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").json({ msg: "Logged out" });
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  const orders = await Order.find({ user: req.user._id }).populate("products.product");

  const simplifiedOrders = orders.map(order => ({
    _id: order._id,
    status: order.status,
    totalAmount: order.totalAmount,
    products: order.products.map(p => ({
      _id: p.product._id,
      name: p.product.name,
      quantity: p.quantity
    }))
  }));

  res.json({ user, orders: simplifiedOrders });
}