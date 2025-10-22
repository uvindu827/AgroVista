import express from "express";
import multer from "multer";
import { detectDisease } from "../controllers/diseaseDetectionController.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/", upload.single("image"), detectDisease);

export default router;
