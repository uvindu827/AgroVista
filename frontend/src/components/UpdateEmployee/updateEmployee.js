import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    jobTitle: "",
    basicSalary: "",
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/staff/${id}/getMemberById`
        );
        setFormData(response.data.data);
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/staff/${id}/updateStaffMember`,
        formData
      );
      navigate("/");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-green-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 p-6 text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2">
            Update Employee Details
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-green-800 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-1">
                Salary
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">
                  $
                </span>
                <input
                  type="number"
                  name="basicSalary"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Update Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
