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

  if (loading) return <div className="p-4 text-green-600">Loading...</div>;
  if (error) return <div className="p-4 text-yellow-700">Error: {error}</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-green-800 border-b-4 border-yellow-400 pb-2">
            Staff Details
          </h1>
        </div>
      </div>
      
      <div className="mt-8 overflow-hidden shadow-lg ring-2 ring-green-200 rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider">
                  First Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider">
                  Last Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider">
                  Job Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-green-800 uppercase tracking-wider">
                  Salary
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-200">
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