import React from "react";

function StaffMember({ StaffMember, onEdit, onDelete, onDownload }) {
  const {
    employeeId,
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    jobTitle,
    basicSalary,
  } = StaffMember;

  return (
    <tr className="hover:bg-yellow-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{employeeId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{firstName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{lastName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
        {phoneNumber}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{address}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{jobTitle}</td>
      <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
        Rs.{basicSalary}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={onEdit}
          className="text-yellow-500 hover:text-yellow-900 mr-4"
        >
          Edit
        </button>
        <button onClick={onDelete} className="text-red-500 hover:text-red-900">
          Delete
        </button>
        <button
          onClick={onDownload}
          className="text-blue-500 hover:text-blue-900 ml-4"
        >
          Download Payslip
        </button>
      </td>
    </tr>
  );
}

export default StaffMember;
