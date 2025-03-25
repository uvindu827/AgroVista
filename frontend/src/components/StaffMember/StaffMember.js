import React from "react";

function StaffMember({ StaffMember }) {
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
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{firstName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{lastName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{email}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{phoneNumber}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{address}</td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{jobTitle}</td>
      <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">${basicSalary}</td>
    </tr>
  );
}

export default StaffMember;