import express from "express";
import { addStaffMember, deleteStaffMember, findStaffMemberById, getStaff, updateStaffMemberDetails, generatePayslip, downloadPayslip } from "../controllers/staffController.js";


const staffRouter = express.Router();

staffRouter.post("/addStaff", addStaffMember);
staffRouter.get("/getStaff", getStaff);
staffRouter.put("/:id/updateStaffMember", updateStaffMemberDetails);
staffRouter.delete("/:id/deleteStaffMember", deleteStaffMember);
staffRouter.get("/:id/getMemberById", findStaffMemberById);
staffRouter.post("/:id/payslip", generatePayslip);
staffRouter.get("/download-payslip/:filename", downloadPayslip);

export default staffRouter;