import staff from "../models/staffModel.js";
import mongoose from "mongoose";
import {
  calculateNetSalary,
  employeeEPF,
  employerEPF,
  employerETF,
  roundToTwoDecimals,
} from "../utils/salaryCalculation.js";
import path from "path";
import fs from "fs/promises";
import handlebars from "handlebars";
import puppeteer from "puppeteer";

export const addStaffMember = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      jobTitle,
      basicSalary,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !address ||
      !jobTitle ||
      !basicSalary
    )
      return res.status(404).json({ message: "Missing required fields" });

    const newStaffMember = new staff({
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      jobTitle,
      basicSalary,
    });

    await newStaffMember.save();

    res.status(200).json({
      data: {
        id: newStaffMember._id,
        employeeId: newStaffMember.employeeId, // Include the auto-incremented employeeId
        firstName: newStaffMember.firstName,
        lastName: newStaffMember.lastName,
        email: newStaffMember.email,
        phoneNumber: newStaffMember.phoneNumber,
        address: newStaffMember.address,
        jobTitle: newStaffMember.jobTitle,
        basicSalary: newStaffMember.basicSalary,
      },
    });
  } catch (error) {
    console.error("Staff member creation error", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getStaff = async (req, res) => {
  try {
    const staffMembers = await staff.find({});
    
    res.status(200).json({
      staff: staffMembers.map((members) => ({
        id: members._id,
        employeeId: members.employeeId, // Added employeeId to the response
        firstName: members.firstName,
        lastName: members.lastName,
        email: members.email,
        phoneNumber: members.phoneNumber,
        address: members.address,
        jobTitle: members.jobTitle,
        basicSalary: members.basicSalary,
      })),
    });
  } catch (error) {
    console.error("Error fetching staff data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateStaffMemberDetails = async (req, res) => {
  try {
    const memberID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(memberID))
      return res.status(400).json({ message: "Invalid staff memberID!!" });

    const existingMember = await staff.findById(memberID);

    if (!existingMember)
      return res.status(400).json({ message: "Staff member not found!!" });

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      jobTitle,
      basicSalary,
    } = req.body;

    if (firstName !== undefined) existingMember.firstName = firstName;

    if (lastName !== undefined) existingMember.lastName = lastName;

    if (email !== undefined) existingMember.email = email;

    if (phoneNumber !== undefined) existingMember.phoneNumber = phoneNumber;

    if (address !== undefined) existingMember.address = address;

    if (jobTitle !== undefined) existingMember.jobTitle = jobTitle;

    if (basicSalary !== undefined) existingMember.basicSalary = basicSalary;

    await existingMember.save();

    res.status(200).json({
      data: {
        id: existingMember._id,
        firstName: existingMember.firstName,
        lastName: existingMember.lastName,
        email: existingMember.email,
        phoneNumber: existingMember.phoneNumber,
        address: existingMember.address,
        jobTitle: existingMember.jobTitle,
        basicSalary: existingMember.basicSalary,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Update staff member error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteStaffMember = async (req, res) => {
  try {
    const memberID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(memberID))
      return res.status(400).json({ message: "Invalid staff member ID!!" });

    const deletedMember = await staff.findByIdAndDelete(memberID);

    if (!memberID)
      return res.status(400).json({ message: "Member not found!!!" });

    return res.status(200).json({
      message: "Staff member deleted successfully!!",
      data: {
        id: deletedMember._id,
        firstName: deletedMember.firstName,
        lastName: deletedMember.lastName,
        email: deletedMember.email,
        phoneNumber: deletedMember.phoneNumber,
        address: deletedMember.address,
        jobTitle: deletedMember.jobTitle,
        basicSalary: deletedMember.basicSalary,
      },
    });
  } catch (error) {
    console.error("Delete staff memeber error!", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const findStaffMemberById = async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Search by employeeId instead of _id
    const foundMember = await staff.findOne({ employeeId: employeeId });

    if (!foundMember)
      return res.status(400).json({ message: "Staff member not found!" });

    const basicSalary = foundMember.basicSalary;

    const epfEmployee = employeeEPF(basicSalary);
    const epfEmployer = employerEPF(basicSalary);
    const etf = employerETF(basicSalary);
    const netSalary = calculateNetSalary(basicSalary, epfEmployee);

    const formatCurrency = (value) => roundToTwoDecimals(value);

    res.status(200).json({
      data: {
        id: foundMember._id,
        employeeId: foundMember.employeeId,
        firstName: foundMember.firstName,
        lastName: foundMember.lastName,
        email: foundMember.email,
        phoneNumber: foundMember.phoneNumber,
        address: foundMember.address,
        jobTitle: foundMember.jobTitle,
        basicSalary: formatCurrency(basicSalary),
        epf_Employee_Contribution: formatCurrency(epfEmployee),
        epf_Employer_Contribution: formatCurrency(epfEmployer),
        etf: formatCurrency(etf),
        netSalary: formatCurrency(netSalary),
      },
    });
  } catch (error) {
    console.error("Error fetching staff member data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const generatePayslip = async (req, res) => {
    try {
      const memberId = req.params.id;
      const payPeriod = req.body.payPeriod;
  
      if (!payPeriod) {
        return res.status(400).json({ message: "Pay period is required" });
      }
  
      if (!mongoose.Types.ObjectId.isValid(memberId)) {
        return res.status(400).json({ message: "Invalid member ID" });
      }
  
      const foundMember = await staff.findById(memberId);
      if (!foundMember) {
        return res.status(400).json({ message: "Staff member not found" });
      }
  
      // Calculate salary components
      const basicSalary = foundMember.basicSalary;
      const epfEmployee = employeeEPF(basicSalary);
      const epfEmployer = employerEPF(basicSalary);
      const etf = employerETF(basicSalary);
      const netSalary = calculateNetSalary(basicSalary, epfEmployee);
      const totalEmployerContributions = epfEmployer + etf;
  
      // Format currency values
      const formatCurrency = (value) => roundToTwoDecimals(value);
  
      // Create payslip data object
      const payslipData = {
        employeeId: foundMember._id,
        employeeName: `${foundMember.firstName} ${foundMember.lastName}`,
        email: foundMember.email,
        phoneNumber: foundMember.phoneNumber,
        address: foundMember.address,
        jobTitle: foundMember.jobTitle,
        payPeriod: payPeriod,
        issueDate: new Date().toLocaleDateString(),
        basicSalary: formatCurrency(basicSalary),
        deductions: {
          epfEmployee: formatCurrency(epfEmployee),
        },
        contributions: {
          epfEmployer: formatCurrency(epfEmployer),
          etf: formatCurrency(etf),
        },
        totalEmployerContributions: formatCurrency(totalEmployerContributions),
        netSalary: formatCurrency(netSalary),
        grossSalary: formatCurrency(basicSalary),
      };
  
      // Handle company logo
      try {
        const logoPath = path.join(
          process.cwd(),
          "uploads",
          "1745552394563-agrologo.png"
        );
        
        // Verify file exists
        await fs.access(logoPath);
        
        // Read and encode image
        const logoData = await fs.readFile(logoPath, { encoding: "base64" });
        payslipData.companyLogo = `data:image/png;base64,${logoData}`;
      } catch (err) {
        console.error("Error loading logo:", err.message);
        payslipData.companyLogo = ""; // Fallback to no logo
      }
  
      // Read and compile template
      const templatePath = path.join(
        process.cwd(),
        "templates",
        "payslip-template.html"
      );
      const templateHtml = await fs.readFile(templatePath, "utf8");
      const template = handlebars.compile(templateHtml);
      const html = template(payslipData);
  
      // Ensure payslips directory exists
      const payslipsDir = path.join(process.cwd(), "payslips");
      await fs.mkdir(payslipsDir, { recursive: true });
  
      // Generate PDF
      const pdfFilename = `${foundMember.lastName}_${foundMember.firstName}_${payPeriod}.pdf`;
      const pdfPath = path.join(payslipsDir, pdfFilename);
  
      const browser = await puppeteer.launch({ headless: "new" });
      const page = await browser.newPage();
      
      await page.setContent(html, { waitUntil: "networkidle0" });
      
      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
        margin: {
          top: "5px",
          right: "15px",
          bottom: "15px",
          left: "15px",
        },
      });
  
      await browser.close();
  
      res.status(200).json({
        message: "Payslip generated successfully",
        data: {
          employeeId: foundMember._id,
          employeeName: `${foundMember.firstName} ${foundMember.lastName}`,
          payPeriod: payPeriod,
          downloadPath: `/api/staff/download-payslip/${pdfFilename}`,
        },
      });
    } catch (error) {
      console.error("Error generating payslip:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

export const downloadPayslip = async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), "payslips", filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ message: "Payslip not found" });
    }

    // Set headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    // Stream the file to the response
    const fileStream = await fs.readFile(filePath);
    res.send(fileStream);
  } catch (error) {
    console.error("Error downloading payslip:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const listEmployeePayslips = async (req, res) => {
  try {
      const memberId = req.params.id;
      
      if (!mongoose.Types.ObjectId.isValid(memberId)) {
          return res.status(400).json({ message: "Invalid member ID" });
      }

      const foundMember = await staff.findById(memberId);

      if (!foundMember) {
          return res.status(400).json({ message: "Staff member not found" });
      }
      
      const payslipsDir = path.join(process.cwd(), "payslips");
      const filePrefix = `${foundMember.lastName}_${foundMember.firstName}_`;
      
      try {
          await fs.access(payslipsDir);
      } catch (error) {
          return res.status(200).json({ payslips: [] });
      }
      
      const files = await fs.readdir(payslipsDir);
      const payslips = files
          .filter(file => file.startsWith(filePrefix) && file.endsWith('.pdf'))
          .map(file => {
              const payPeriod = file.replace(filePrefix, '').replace('.pdf', '');
              return {
                  filename: file,
                  payPeriod: payPeriod,
                  downloadPath: `/download-payslip/${file}`
              };
          });
      
      res.status(200).json({
          data: {
              employeeId: foundMember._id,
              employeeName: `${foundMember.firstName} ${foundMember.lastName}`,
              payslips: payslips
          }
      });
      
  } catch (error) {
      console.error("Error listing payslips:", error);
      res.status(500).json({ error: "Server error" });
  }
};
