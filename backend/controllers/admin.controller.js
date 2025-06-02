import Admin from "../models/admin.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Product from "../models/product.model.js";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }
        // Find admin by username
        const admin = await Admin.findOne({ username });
        if (!admin || admin.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        // Check password (assuming passwords are stored hashed, use bcrypt to compare)
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        // Generate JWT token
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        // Return success response with token
        res.json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
            },
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const addProduct = async (req, res) => {
    try {
        const { name, description, price, numberOfCoupen } = req.body;
        // const image = req.file?.filename || req.body.image; // Use uploaded file or fallback to image URL
        console.log(req.file);
        
        const image = req.file ? req.file.filename : null // Use uploaded file path or fallback to image URL

        if (!name || !description || !price || !image) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const coupenNumber = parseInt(numberOfCoupen) || 3;

        const couponCodes = [];
        for (let i = 0; i < coupenNumber; i++) {
            couponCodes.push(generateCouponCode());
        }

        const newProduct = new Product({
            name,
            description,
            price: parseFloat(price),
            image,
            couponCodes,
            createdAt: new Date(),
        });

        await newProduct.save();

        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("Add product error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


// // Function to generate random 12-character coupon code
function generateCouponCode(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}