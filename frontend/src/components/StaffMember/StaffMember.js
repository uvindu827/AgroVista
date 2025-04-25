import React from "react";

function StaffMember({ StaffMember, onEdit, onDelete }) {
  const {
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
      {/* Existing columns */}
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{firstName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{lastName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{phoneNumber}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{address}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{jobTitle}</td>
      <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">${basicSalary}</td>
      
      {/* Action buttons */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={onEdit}
          className="text-yellow-700 hover:text-yellow-900 mr-4"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default StaffMember;