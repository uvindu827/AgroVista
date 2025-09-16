import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";  // Import back icon from react-icons
import StaffMember from "../StaffMember/StaffMember";

const URL = "http://localhost:3000/api/staff/getStaff";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHandler();
        setStaff(data.staff || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddEmployee = () => {
    navigate("/add-employee");
  };

  const handleEdit = (employeeId) => {
    navigate(`/update_employee/${employeeId}`);
  };

  const handleDelete = async (employeeId) => {
    // Find the employee name to include in the confirmation message
    const employeeToDelete = staff.find(member => member.id === employeeId);
    const employeeName = employeeToDelete ? 
      `${employeeToDelete.firstName} ${employeeToDelete.lastName}` : 
      'this employee';

    if (!window.confirm(`Are you sure you want to delete ${employeeName}?`)) {
      toast.dismiss();
      toast('Deletion cancelled', {
        icon: '❌',
        duration: 2000
      });
      return;
    }

    // Show loading toast
    const loadingToastId = toast.loading(`Deleting ${employeeName}...`);

    try {
      await axios.delete(
        `http://localhost:3000/api/staff/${employeeId}/deleteStaffMember`
      );
      
      // Update local state to remove the deleted employee
      setStaff((prev) => prev.filter((member) => member.id !== employeeId));
      
      // Show success toast
      toast.success(`${employeeName} has been deleted successfully`, {
        id: loadingToastId,
        duration: 3000
      });
    } catch (err) {
      console.error("Delete failed:", err);
      
      // Show error toast with more specific message if available
      toast.error(err.response?.data?.message || `Failed to delete ${employeeName}`, {
        id: loadingToastId,
        duration: 4000
      });
      
      setError("Failed to delete employee");
    }
  };

  const handleDownloadPayslip = async (employeeId) => {
    const date = new Date();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentMonth = monthNames[date.getMonth()];
    const currentYear = date.getFullYear();
    const payPeriod = `${currentMonth}-${currentYear}`;
  
    try {
      const generateResponse = await axios.post(
        `http://localhost:3000/api/staff/${employeeId}/payslip`,
        { payPeriod }
      );
      
      const downloadUrl = `http://localhost:3000${generateResponse.data.data.downloadPath}`;
            
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generateResponse.data.data.employeeName + '_' + payPeriod + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    
    } catch (error) {
      console.error("Download error:", error);
      alert(error.response?.data?.error || "Failed to download payslip");
    }
  };

  const handleBack = () => {
    navigate("/users_management"); 
  };

  if (loading) return <div className="p-4 text-green-600">Loading...</div>;
  if (error) return <div className="p-4 text-yellow-700">Error: {error}</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-green-50 min-h-screen">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-green-800 border-b-4 border-yellow-400 pb-2">
            Staff Details
          </h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={handleAddEmployee}
            className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Add Employee
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center text-green-600 hover:text-green-800"
        >
          <IoArrowBack className="mr-2" />
          Back
        </button>
      </div>

      <div className="mt-8 overflow-hidden shadow-lg ring-2 ring-green-200 rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider"
                >
                  First Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider"
                >
                  Last Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider"
                >
                  Job Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider"
                >
                  Salary
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-sm font-semibold text-green-800 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
              {staff.map((member) => (
                <StaffMember
                  key={member.id}
                  StaffMember={member}
                  onEdit={() => handleEdit(member.id)}
                  onDelete={() => handleDelete(member.id)}
                  onDownload={() => handleDownloadPayslip(member.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Staff;