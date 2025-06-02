import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export const adminMiddleware = (req, res, next) => {
  try {
    // Extract token from header or cookie
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1]; // Get token after "Bearer "
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(403).json({ message: "Forbidden: No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is admin or superadmin
    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    console.error("Admin Middleware Error:", error);
    res.status(403).json({ message: "Forbidden: Admin access required" });
  }
};
