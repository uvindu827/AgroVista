import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoSearch, IoClose } from "react-icons/io5";
import StaffMember from "../StaffMember/StaffMember";

const URL = "http://localhost:3000/api/staff/getStaff";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Staff() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHandler();
        setStaff(data.staff || []);
        setFilteredStaff(data.staff || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter staff based on search term
  useEffect(() => {
    if (searchEmployeeId.trim() === "") {
      setFilteredStaff(staff);
    } else {
      setFilteredStaff(
        staff.filter(member => 
          member.employeeId && 
          member.employeeId.toString().includes(searchEmployeeId.trim())
        )
      );
    }
  }, [searchEmployeeId, staff]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchEmployeeId.trim()) {
      toast.error("Please enter an Employee ID");
      return;
    }
    
    setSearching(true);
    
    try {
      const response = await axios.get(
        `http://localhost:3000/api/staff/employeeId/${searchEmployeeId}/getMemberByEmployeeId`
      );
      
      if (response.data && response.data.data) {
        // If found specific employee, set as the only one in filtered list
        setFilteredStaff([
          {
            id: response.data.data.id,
            employeeId: response.data.data.employeeId,
            firstName: response.data.data.firstName,
            lastName: response.data.data.lastName,
            email: response.data.data.email,
            phoneNumber: response.data.data.phoneNumber,
            address: response.data.data.address,
            jobTitle: response.data.data.jobTitle,
            basicSalary: response.data.data.basicSalary,
          }
        ]);
        
        toast.success("Employee found!");
      } else {
        setFilteredStaff([]);
        toast.error("No employee found with that ID");
      }
    } catch (err) {
      console.error("Search error:", err);
      toast.error(err.response?.data?.message || "Error searching for employee");
      // Keep the filtered list as is or reset to show all
      setFilteredStaff(staff);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchEmployeeId("");
    setFilteredStaff(staff);
  };

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
      const updatedStaff = staff.filter((member) => member.id !== employeeId);
      setStaff(updatedStaff);
      setFilteredStaff(updatedStaff);
      
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
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 bg-green-50 min-h-screen">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800 border-b-4 border-yellow-400 pb-2">
            Staff Details
          </h1>
        </div>
        
        {/* Search Bar moved to right */}
        <div className="mt-4 sm:mt-0 flex items-center">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={searchEmployeeId}
              onChange={(e) => setSearchEmployeeId(e.target.value)}
              className="focus:ring-green-500 focus:border-green-500 block w-64 sm:text-sm border-gray-300 rounded-md py-2 pr-20 pl-3"
              placeholder="Search by Employee ID"
            />
            <div className="absolute right-0 flex items-center pr-2 space-x-1">
              {/* Clear button as icon */}
              {searchEmployeeId && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                  title="Clear search"
                >
                  <IoClose className="h-5 w-5" />
                </button>
              )}
              
              {/* Search button as icon */}
              <button
                type="submit"
                disabled={searching}
                className={`p-1 ${searching ? 'text-gray-400' : 'text-green-600 hover:text-green-800'} focus:outline-none`}
                title="Search"
              >
                <IoSearch className="h-5 w-5" />
              </button>
            </div>
          </form>
          
          {/* Add Employee Button */}
          <button
            onClick={handleAddEmployee}
            className="ml-4 inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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

      {/* Results summary */}
      <div className="mb-4 text-sm text-gray-600">
        {filteredStaff.length === 0 ? (
          <p>No employees found</p>
        ) : filteredStaff.length === 1 ? (
          <p>1 employee found</p>
        ) : searchEmployeeId.trim() !== "" ? (
          <p>{filteredStaff.length} employees found matching ID "{searchEmployeeId}"</p>
        ) : (
          <p>Showing all {filteredStaff.length} employees</p>
        )}
      </div>

      <div className="mt-4 overflow-hidden shadow-lg ring-2 ring-green-200 rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider"
                >
                  Employee ID
                </th>
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
              {filteredStaff.length > 0 ? (
                filteredStaff.map((member) => (
                  <StaffMember
                    key={member.id}
                    StaffMember={{
                      ...member,
                      // Make sure employeeId is included for displaying in the table
                      employeeId: member.employeeId
                    }}
                    onEdit={() => handleEdit(member.id)}
                    onDelete={() => handleDelete(member.id)}
                    onDownload={() => handleDownloadPayslip(member.id)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    No employees found matching the search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Staff;