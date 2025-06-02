// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Product from "./models/product.model.js";

// dotenv.config();

// // Function to generate random 12-character coupon code
// function generateCouponCode(length = 12) {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let code = "";
//   for (let i = 0; i < length; i++) {
//     code += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return code;
// }

// // Products array, adding empty couponCodes array to each
// const products = [
//   { name: "Product 1", description: "Description 1", price: 100, image: "https://via.placeholder.com/150" },
//   { name: "Product 2", description: "Description 2", price: 200, image: "https://via.placeholder.com/150" },
//   { name: "Product 3", description: "Description 3", price: 300, image: "https://via.placeholder.com/150" },
//   { name: "Product 4", description: "Description 4", price: 400, image: "https://via.placeholder.com/150" },
//   { name: "Product 5", description: "Description 5", price: 500, image: "https://via.placeholder.com/150" },
//   { name: "Product 6", description: "Description 6", price: 600, image: "https://via.placeholder.com/150" },
//   { name: "Product 7", description: "Description 7", price: 700, image: "https://via.placeholder.com/150" },
//   { name: "Product 8", description: "Description 8", price: 800, image: "https://via.placeholder.com/150" },
//   { name: "Product 9", description: "Description 9", price: 900, image: "https://via.placeholder.com/150" },
//   { name: "Product 10", description: "Description 10", price: 1000, image: "https://via.placeholder.com/150" },
// ];

// // Connect and seed
// mongoose.connect(process.env.MONGO_URI).then(async () => {
//   // Clear existing products
//   await Product.deleteMany({});

//   // Add 3 random coupon codes per product
//   const productsWithCoupons = products.map((product) => ({
//     ...product,
//     couponCodes: [
//       generateCouponCode(),
//       generateCouponCode(),
//       generateCouponCode(),
//     ],
//   }));

//   // Insert all products
//   await Product.insertMany(productsWithCoupons);

//   console.log("Seeded products with coupon codes");
//   process.exit();
// }).catch((err) => {
//   console.error("MongoDB connection error:", err);
// });


import bcrypt from "bcryptjs";

function convertToHash(password) {
  return bcrypt.hashSync(password, 10);
}

console.log(convertToHash("admin123"));
