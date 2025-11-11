import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  restoreCourse,
  getPaidCourses,
  registerUserToCourse,
  getRegisteredCoursesForUser,
  createCourseCheckoutSession,
  getLowPurchaseCourses,
} from "../controllers/Coursecontroller.js";

const router = express.Router();
import { stripeWebhook } from "../controllers/Coursecontroller.js";

router.get("/", getAllCourses);
// Specific non-parameter routes should be declared BEFORE the "/:id" param route
// to avoid accidental matching (e.g., "/low-purchases" being treated as an :id)
// Stripe & low-purchase routes
router.post("/stripe/webhook", express.raw({ type: 'application/json' }), stripeWebhook);
router.post("/checkout-session", createCourseCheckoutSession);
router.get("/paid", getPaidCourses);
router.get("/low-purchases", getLowPurchaseCourses);

// User-specific routes
router.post("/:userId/register", registerUserToCourse);
router.get("/:userId/registered", getRegisteredCoursesForUser);

// Parameterized course route (keep last)
router.get("/:id", getCourseById);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.post("/restore/:id", restoreCourse);

export default router;
