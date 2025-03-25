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
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">{firstName}</td>
      <td className="px-6 py-4 whitespace-nowrap">{lastName}</td>
      <td className="px-6 py-4 whitespace-nowrap">{email}</td>
      <td className="px-6 py-4 whitespace-nowrap">{phoneNumber}</td>
      <td className="px-6 py-4 whitespace-nowrap">{address}</td>
      <td className="px-6 py-4 whitespace-nowrap">{jobTitle}</td>
      <td className="px-6 py-4 whitespace-nowrap">${basicSalary}</td>
    </tr>
  );
}

export default StaffMember;