import express from "express";
import { addStaffMember, deleteStaffMember, findStaffMemberById, getStaff, updateStaffMemberDetails } from "../controllers/staffController.js";
import staff from "../models/staffModel.js";

const staffRouter = express.Router();

staffRouter.post("/addStaff", addStaffMember);
staffRouter.get("/getStaff", getStaff);
staffRouter.put("/:id/updateStaffMember", updateStaffMemberDetails);
staffRouter.delete("/:id/deleteStaffMember", deleteStaffMember);
staffRouter.get("/:id/getMemberById", findStaffMemberById);

export default staffRouter;