import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateEmployee() {
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    jobTitle: "",
    basicSalary: "",
  });

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/staff/${id}/getMemberById`);
        setInputs(res.data); 
        console.log("API Response:", res.data);
        setInputs(res.data.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    try {
      await axios.put(`http://localhost:3000/api/staff/${id}/updateStaffMember`, {
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        email: inputs.email,
        phoneNumber: inputs.phoneNumber,
        address: inputs.address,
        jobTitle: inputs.jobTitle,
        basicSalary: Number(inputs.basicSalary),
      });
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
  

    if (['firstName', 'lastName', 'jobTitle'].includes(name)) {
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }
  

    if (name === "basicSalary") {
      sanitizedValue = value === "" ? "" : Math.max(1, Number(value));
    }
  
    setInputs((prevState) => ({
      ...prevState,
      [name]: sanitizedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendRequest();
    navigate("/");
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-yellow-400 mb-2">Update Employee</h2>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={inputs.firstName || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={inputs.lastName || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={inputs.email || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">Phone</label>
            <input
              type="tel"
              name="phoneNumber"
              value={inputs.phoneNumber || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-green-800 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={inputs.address || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              value={inputs.jobTitle || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">Salary</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">$</span>
              <input
                type="number"
                name="basicSalary"
                value={inputs.basicSalary || ""}
                onChange={handleChange}
                className="w-full pl-8 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-green-600"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-yellow-400 text-yellow-700 rounded-lg hover:bg-yellow-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Update Employee
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateEmployee;
