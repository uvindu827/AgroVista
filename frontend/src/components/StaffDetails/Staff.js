import React, { useEffect, useState } from "react";
import axios from "axios";
import StaffMember from "../StaffMember/StaffMember";

const URL = "http://localhost:3000/api/staff/getStaff";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Staff Details
          </h1>
        </div>
      </div>
      
      <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  First Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Last Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Job Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Salary
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {staff.map((member, i) => (
                <StaffMember key={i} StaffMember={member} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Staff;