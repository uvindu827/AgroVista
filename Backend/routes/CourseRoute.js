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
router.get("/:id", getCourseById);
router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.post("/restore/:id", restoreCourse);
router.get("/paid", getPaidCourses);
router.post("/:userId/register", registerUserToCourse);
router.get("/:userId/registered", getRegisteredCoursesForUser);

// Stripe & low-purchase routes
router.post("/stripe/webhook", express.raw({ type: 'application/json' }), stripeWebhook);
router.post("/checkout-session", createCourseCheckoutSession);
router.get("/low-purchases", getLowPurchaseCourses);

export default router;
