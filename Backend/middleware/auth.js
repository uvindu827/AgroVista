// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (process.env.NODE_ENV !== 'production') console.log("Auth Header:", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    if (user) req.user.id = user._id; // Ensure req.user.id is set
  if (process.env.NODE_ENV !== 'production') console.log("User ID from token:", req.user?.id);
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

export { authenticateUser as protect };
