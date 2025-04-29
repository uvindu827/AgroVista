import React from "react";

function ReportDetails({ report, onResolve }) {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : 'N/A';
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {report.postID}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
        {report.reason}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(report.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button
          onClick={onResolve}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          Mark Resolved
        </button>
      </td>
    </tr>
  );
}

export default ReportDetails;