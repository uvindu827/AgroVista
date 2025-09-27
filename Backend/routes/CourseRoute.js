import express from "express";
import * as courseController from "../controllers/Coursecontroller.js";
import { protect } from "../middleware/auth.js";
import { parser } from "../config/cloudinary.js";

const router = express.Router();

// Public routes
router.get("/", courseController.getAllCourses);

// Protected routes
router.get("/paid", protect, courseController.getPaidCourses);  // <--- protected with `protect`

// Other protected routes
router.post("/", protect, parser.single("image"), courseController.createCourse);
router.get("/:id", protect, courseController.getCourseById);
router.put("/:id", protect, parser.single("image"), courseController.updateCourse);
router.delete("/:id", protect, courseController.deleteCourse);
router.post("/restore/:id", protect, courseController.restoreCourse);

// User registration
router.post("/register/:userId", protect, courseController.registerUserToCourse);
router.get("/registered/:userId", protect, courseController.getRegisteredCoursesForUser);

export default router;
