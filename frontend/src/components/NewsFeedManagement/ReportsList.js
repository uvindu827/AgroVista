import React, { useEffect, useState } from "react";
import axios from "axios";
import ReportDetails from "./ReportDetails";

const URL = "http://localhost:3000/api/newsFeed/getAllReports";

const fetchHandler = async () => {
  try {
    const response = await axios.post(URL);
    console.log("API Response Data:", response);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch reports");
  }
};

function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHandler();
        // The API returns data.data as the array of reports
        setReports(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleResolve = async(reportId) => {
    if(!window.confirm('Please confirm the report confirmation?'))
        return;
    console.log('Resolving report with ID:', reportId);
      try{
        await axios.delete(`http://localhost:3000/api/newsFeed/deleteReport/${reportId}`);
        setReports((prev) => prev.filter((report) => report.id !== reportId));
      }catch(err){
        console.error('Resolving failed:', err);
        setError('Failed to resolve post');
      }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg mx-4 my-2">
      Error: {error}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Reported Posts</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reported At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <ReportDetails 
                  key={report.id || report.postID} 
                  report={report} 
                  onResolve={() => handleResolve(report.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportsList;