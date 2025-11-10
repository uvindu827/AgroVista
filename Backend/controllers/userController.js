import User from "../models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";
import Order from "../models/orderModel.js";

dotenv.config();

// Use environment variables for email credentials
const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // e.g. skyrek7@gmail.com
    pass: process.env.EMAIL_PASS, // e.g. app password
  },
});

// Helper to sanitize user object (exclude sensitive info)
function sanitizeUser(user) {
  const { password, ...userData } = user.toObject ? user.toObject() : user;
  return userData;
}

// Helper to resolve user id from different middleware shapes
function getUserId(req) {
  return req.user?.userId || req.user?.id || req.user?._id || null;
}

// User registration
export async function registerUser(req, res) {
  try {
    const data = req.body;
    data.password = bcrypt.hashSync(data.password, 10);
    const newUser = new User(data);
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "User registration failed" });
  }
}

// User login
export async function loginUser(req, res) {
  try {
    // If the DB is not connected, return a clear 503 so the client knows
      // If the DB is not connected, allow a developer-friendly mock login when
      // `USE_INPROCESS_MOCK=1` is set in .env. This lets the frontend and
      // inspector flows be exercised without a running MongoDB during local dev.
      if (!mongoose.connection || mongoose.connection.readyState !== 1) {
        console.warn('Login attempted but MongoDB is not connected (readyState=' + (mongoose.connection ? mongoose.connection.readyState : 'none') + ')');

        // Developer shortcut: return a mock authenticated user when requested.
        if (process.env.USE_INPROCESS_MOCK === '1') {
          console.info('USE_INPROCESS_MOCK=1 — returning mock login response');

          // Allow a dev to force a role using the X-MOCK-ROLE header (useful when
          // exercising role-specific UI like the agricultural inspector). If not
          // provided, try to infer the role from the email (emails containing
          // "inspect" or "agri" will be treated as inspector accounts). Default
          // to 'farmer' for other cases.
          const forcedRole = (req.headers && (req.headers['x-mock-role'] || req.headers['X-MOCK-ROLE'])) || null;
          const emailForMock = (req.body && req.body.email) || 'dev@example.com';
          let inferredRole = 'farmer';
          const emailLower = String(emailForMock).toLowerCase();
          if (forcedRole) {
            inferredRole = String(forcedRole).toLowerCase();
          } else if (emailLower.includes('inspect') || emailLower.includes('inspector') || emailLower.includes('agri')) {
            inferredRole = 'agricultural inspector';
          }

          const mockUser = {
            _id: '000000000000000000000000',
            firstName: 'Dev',
            lastName: 'User',
            email: emailForMock,
            role: inferredRole,
            profilePicture: null,
            phone: null,
            emailVerified: false,
          };
          const token = jwt.sign(
            {
              userId: mockUser._id,
              firstName: mockUser.firstName,
              lastName: mockUser.lastName,
              email: mockUser.email,
              role: mockUser.role,
              profilePicture: mockUser.profilePicture,
              phone: mockUser.phone,
              emailVerified: mockUser.emailVerified,
            },
            process.env.JWT_SECRET || 'dev_jwt_secret',
            { expiresIn: '7d' }
          );

          return res.json({ message: 'Login successful (mock)', token, user: sanitizeUser(mockUser) });
        }

        return res.status(503).json({ error: 'Authentication service temporarily unavailable. Please try again later.' });
      }
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.isBlocked) return res.status(403).json({ error: "Your account is blocked please contact the admin" });

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ error: "Login failed" });

    const token = jwt.sign(
      {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        phone: user.phone,
        emailVerified: user.emailVerified,
      },
      process.env.JWT_SECRET || 'dev_jwt_secret',
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user: sanitizeUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
}

// Role checkers (can be moved to middleware for better design)
export function isItAdmin(req) { return req.user?.role === "admin"; }
export function isItCustomer(req) { return req.user?.role === "customer"; }
export function isItFarmer(req) { return req.user?.role === "farmer"; }
export function isItBuyer(req) { return req.user?.role === "buyer"; }
export function isItAgriculturalInspector(req) { return req.user?.role === "agricultural inspector"; }
export function isItToolDealer(req) { return req.user?.role === "tool dealer"; }

// Get all users (admin only)
export async function getAllUsers(req, res) {
  if (!isItAdmin(req)) return res.status(403).json({ error: "Unauthorized" });
  try {
    const users = await User.find();
    res.json(users.map(sanitizeUser));
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ error: "Failed to get users" });
  }
}

// Block/unblock user (admin only)
export async function blockOrUnblockUser(req, res) {
  if (!isItAdmin(req)) return res.status(403).json({ error: "Unauthorized" });
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: "User blocked/unblocked successfully" });
  } catch (err) {
    console.error("Block/unblock error:", err);
    res.status(500).json({ error: "Failed to update user block status" });
  }
}

// Get current user info
export function getUser(req, res) {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });
  res.json(sanitizeUser(req.user));
}

// Google login
export async function loginWithGoogle(req, res) {
  const { accessToken } = req.body;
  try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let user = await User.findOne({ email: response.data.email });
    if (!user) {
      user = new User({
        email: response.data.email,
        password: bcrypt.hashSync("123", 10),
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        address: "Not Given",
        phone: "Not given",
        profilePicture: response.data.picture,
        emailVerified: true,
        role: "customer",
      });
      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        phone: user.phone,
        emailVerified: user.emailVerified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user: sanitizeUser(user) });
  } catch (e) {
    console.error("Google login error:", e);
    res.status(500).json({ error: "Failed to login with google" });
  }
}

// Send OTP email
export async function sendOTP(req, res) {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });

  try {
    const otp = Math.floor(Math.random() * 9000) + 1000;

    const newOTP = new OTP({ email: req.user.email, otp });
    await newOTP.save();

    const message = {
      from: process.env.EMAIL_USER,
      to: req.user.email,
      subject: "Validating OTP",
      text: "Your OTP code is " + otp,
    };

    transport.sendMail(message, (err) => {
      if (err) {
        console.error("Send OTP email error:", err);
        res.status(500).json({ error: "Failed to send OTP" });
      } else {
        res.json({ message: "OTP sent successfully" });
      }
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

// Verify OTP
export async function verifyOTP(req, res) {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });

  const { code } = req.body;

  try {
    const otpEntry = await OTP.findOne({ email: req.user.email, otp: code });
    if (!otpEntry) return res.status(404).json({ error: "Invalid OTP" });

    await OTP.deleteOne({ email: req.user.email, otp: code });
    await User.updateOne({ email: req.user.email }, { emailVerified: true });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
}

// Get profile
export async function getProfile(req, res) {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });
  try {
    const uid = getUserId(req);
    const user = await User.findById(uid).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(sanitizeUser(user));
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to get profile" });
  }
}

// Update profile
export async function updateProfile(req, res) {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });

  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = bcrypt.hashSync(updates.password, 10);
    }

    const uid = getUserId(req);
    const updatedUser = await User.findByIdAndUpdate(uid, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Profile updated successfully", user: sanitizeUser(updatedUser) });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

// Delete account
export async function deleteAccount(req, res) {
  if (!req.user) return res.status(403).json({ error: "Unauthorized" });
  try {
    const uid = getUserId(req);
    await User.findByIdAndDelete(uid);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
}

// Fetch paid courses for logged-in user
export const getPaidCourses = async (req, res) => {
  try {
  const userId = getUserId(req);

  const orders = await Order.find({ userId }).populate("courses.courseId");

    const purchasedCourses = [];

    orders.forEach((order) => {
      order.courses.forEach((c) => {
        if (c.courseId) purchasedCourses.push(c.courseId);
      });
    });

    // Remove duplicates
    const uniqueCourses = purchasedCourses.filter(
      (course, index, self) =>
        index === self.findIndex((c) => c._id.toString() === course._id.toString())
    );

    res.json(uniqueCourses);
  } catch (error) {
    console.error("Error fetching paid courses:", error);
    res.status(500).json({ message: "Failed to fetch paid courses" });
  }
};

// Admin update user
export async function updateUser(req, res) {
  if (!isItAdmin(req)) return res.status(403).json({ error: "Unauthorized" });

  try {
    const userId = req.params.id;
    const updates = req.body;
    if (updates.password) {
      updates.password = bcrypt.hashSync(updates.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated successfully", user: sanitizeUser(updatedUser) });
  } catch (err) {
    console.error("Admin update user error:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
}

// Admin delete user
export async function deleteUser(req, res) {
  if (!isItAdmin(req)) return res.status(403).json({ error: "Unauthorized" });

  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
}

// Get users by role
export async function getUsersByRole(req, res) {
  try {
    let { role } = req.params;
    if (role === "tool-dealer") role = "tool dealer";
    else if (role === "agricultural-inspector") role = "agricultural inspector";

    const validRoles = ["customer", "buyer", "farmer", "tool dealer", "agricultural inspector", "admin"];
    if (!validRoles.includes(role)) return res.status(400).json({ error: "Invalid role" });

    const users = await User.find({ role });
    res.json(users.map(sanitizeUser));
  } catch (err) {
    console.error("Get users by role error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}
