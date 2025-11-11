import express from "express";
import Inquiry from "../models/inquiry.js";
import {
  addInquiry,
  getInquiries,
  deleteInquiry,
  updateInquiry,
} from "../controllers/inquiryController.js";

const router = express.Router();

router.get("/", getInquiries);
router.post("/", addInquiry);
router.delete("/:id", deleteInquiry);
router.put("/:id", updateInquiry);
router.put("/:id/response", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({ message: "response is required" });
    }

    const inquiry = await Inquiry.findOne({ id: id });
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    inquiry.response = response;
    await inquiry.save();

    res.json({ message: "Admin response updated successfully" });
  } catch (error) {
    console.error("Error updating admin response:", error);
    res.status(500).json({ message: "Failed to update admin response" });
  }
});

export default router;
