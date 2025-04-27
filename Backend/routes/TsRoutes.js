import express from "express";
import { addTools, getAllTools, updateTool, deleteTool } from "../controllers/TsController.js";

const TsRoutes = express.Router();

TsRoutes.post("/addTools", addTools);
TsRoutes.get("/getTools", getAllTools);
TsRoutes.put("/updateTool/:id", updateTool);
TsRoutes.delete("/deleteTool/:id", deleteTool); 

export default TsRoutes;
