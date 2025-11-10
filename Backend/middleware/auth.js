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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');

    // If mongoose is connected, prefer loading the full User document
    try {
      if (require('mongoose').connection && require('mongoose').connection.readyState === 1) {
        const user = await User.findById(decoded.userId).select("-password");
        if (user) {
          req.user = user;
          req.user.id = user._id;
          if (process.env.NODE_ENV !== 'production') console.log("User ID from token (DB):", req.user?.id);
          return next();
        }
      }
    } catch (dbErr) {
      // If DB lookup failed (e.g., no connection), fall back to decoded token payload
      console.warn('User DB lookup failed in auth middleware, falling back to token payload:', dbErr && dbErr.message ? dbErr.message : dbErr);
    }

    // Fallback: use decoded token payload as req.user so dev mock tokens still work
    req.user = decoded;
    // Normalize id field
    req.user.id = decoded.userId || decoded.id || decoded._id || null;
    if (process.env.NODE_ENV !== 'production') console.log("User ID from token (decoded):", req.user?.id);
    return next();
  } catch (err) {
    console.error("JWT Error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
};

export { authenticateUser as protect };
