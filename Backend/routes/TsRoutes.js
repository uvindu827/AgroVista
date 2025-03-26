import express from "express";
import { addTools } from "../controllers/TsController.js";

const TsRoutes = express.Router();

TsRoutes.post("/addTools", addTools);

export default TsRoutes;
