import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3000/api/staff/${employeeId}/deleteStaffMember`
      );
      setStaff((prev) => prev.filter((member) => member.id !== employeeId));
    } catch (err) {
      console.error("Delete failed:", err);
      setError("Failed to delete employee");
    }
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

      <div className="mt-8 overflow-hidden shadow-lg ring-2 ring-green-200 rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-100">
              <tr>
                {/* Existing headers */}
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
