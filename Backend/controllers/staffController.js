import staff from "../models/staffModel.js"
import mongoose from "mongoose"
import { calculateNetSalary, employeeEPF, employerEPF, employerETF, roundToTwoDecimals } from "../utils/salaryCalculation.js";

export const addStaffMember = async(req, res) => {
    
    try{
        const {firstName, lastName, email, phoneNumber, address, jobTitle, basicSalary} = req.body;

        if(!firstName || !lastName || !email || !phoneNumber || !address || !jobTitle || !basicSalary)
            return res.status(404).json({message:"Missing required fields"});

        const newStafffMember = new staff({
            firstName, 
            lastName,
            email,
            phoneNumber,
            address,
            jobTitle,
            basicSalary
        })

        await newStafffMember.save();

        res.status(200).json({
            data:{
                id:newStafffMember._id,
                firstName:newStafffMember.firstName,
                lastName:newStafffMember.lastName,
                email:newStafffMember.email,
                phoneNumber:newStafffMember.phoneNumber,
                address:newStafffMember.address,
                jobTitle:newStafffMember.jobTitle,
                basicSalary:newStafffMember.basicSalary
            }
        });
    }catch(error){
        console.error("Staff member creation error", error);
        res.status(500).json({error:"Server Error"});
    }

};

export const getStaff = async(req, res) => {
    try{
        const staffMembers = await staff.find({});

        res.status(200).json({
            staff:staffMembers.map(members =>({
                id:members._id,
                firstName:members.firstName,
                lastName:members.lastName,
                email:members.email,
                phoneNumber:members.phoneNumber,
                address:members.address,
                jobTitle:members.jobTitle,
                basicSalary:members.basicSalary
            }))
        })

    }catch(error){
        console.error("Error fetching staff data:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateStaffMemberDetails = async(req, res) => {
    try{

        const memberID = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(memberID))
            return res.status(400).json({message:"Invalid staff memberID!!"});
        

        const existingMember = await staff.findById(memberID);

        if(!existingMember)
            return res.status(400).json({message:"Staff member not found!!"});

        const {firstName,lastName,email,phoneNumber,address,jobTitle,basicSalary} = req.body;

        if( firstName !== undefined)
            existingMember.firstName = firstName;
        
        if( lastName !== undefined)
            existingMember.lastName = lastName;
        
        if( email !== undefined)
            existingMember.email = email;
        
        if( phoneNumber !== undefined)
            existingMember.phoneNumber = phoneNumber;
        
        if( address !== undefined)
            existingMember.address = address;
        
        if( jobTitle !== undefined)
            existingMember.jobTitle = jobTitle;
        
        if( basicSalary !== undefined)
            existingMember.basicSalary = basicSalary;

        await existingMember.save();

        res.status(200).json({
            data:{
                id:existingMember._id,
                firstName:existingMember.firstName,
                lastName:existingMember.lastName,
                email:existingMember.email,
                phoneNumber:existingMember.phoneNumber,
                address:existingMember.address,
                jobTitle:existingMember.jobTitle,
                basicSalary:existingMember.basicSalary
            }   
        })

    }catch(error){
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error("Update staff member error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteStaffMember = async(req, res) => {
    try{
        const memberID = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(memberID))
            return res.status(400).json({message:"Invalid staff member ID!!"})

        const deletedMember = await staff.findByIdAndDelete(memberID);

        if(!memberID)
            return res.status(400).json({message:"Member not found!!!"})

        return res.status(200).json({
            message:"Staff member deleted successfully!!",
            data:{
                id:deletedMember._id,
                firstName:deletedMember.firstName,
                lastName:deletedMember.lastName,
                email:deletedMember.email,
                phoneNumber:deletedMember.phoneNumber,
                address:deletedMember.address,
                jobTitle:deletedMember.jobTitle,
                basicSalary:deletedMember.basicSalary
            }
        })

    }catch(error){
        console.error("Delete staff memeber error!", error);
        res.status(500).json({error:"Server error"});
    }
};

export const findStaffMemberById = async(req, res) => {
    try{
        const memberId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(memberId))
            return res.status(400).json({message:"Invalid member Id!"})

        const foundMember = await staff.findById(memberId);

        if(!foundMember)
            return res.status(400).json({message:"Staff member not found!"})

        const basicSalary = foundMember.basicSalary;

        const epfEmployee = employeeEPF(basicSalary);
        const epfEmployer = employerEPF(basicSalary);
        const etf = employerETF(basicSalary)
        const netSalary = calculateNetSalary(basicSalary, epfEmployee);

        const formatCurrency = (value) => roundToTwoDecimals(value);

        res.status(200).json({
            data:{
                id:foundMember._id,
                firstName:foundMember.firstName,
                lastName:foundMember.lastName,
                email:foundMember.email,
                phoneNumber:foundMember.phoneNumber,
                address:foundMember.address,
                jobTitle:foundMember.jobTitle,
                basicSalary: formatCurrency(basicSalary),
                epf_Employee_Contribution: formatCurrency(epfEmployee),
                epf_Employer_Contribution: formatCurrency(epfEmployer),
                etf: formatCurrency(etf),
                netSalary: formatCurrency(netSalary)

            }
        });

    }catch(error){
        console.error("Error fetching staff member data:", error);
        res.status(500).json({ error: "Server error" });
    }
};

