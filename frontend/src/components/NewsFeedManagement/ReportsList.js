import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReportDetails from "./ReportDetails";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHandler();
        setReports(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleResolve = async (reportId) => {
    if (!window.confirm('Please confirm the report resolution?')) return;
    console.log('Resolving report with ID:', reportId);
    try {
      await axios.delete(`http://localhost:3000/api/newsFeed/deleteReport/${reportId}`);
      setReports((prev) => prev.filter((report) => report.id !== reportId));
      toast.success("Report resolved successfully!");
    } catch (err) {
      console.error('Resolving failed:', err);
      setError('Failed to resolve post');
    }
  };

  const goToNewsFeed = () => {
    navigate('/nf-management');
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-green-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 text-red-800 rounded-lg mx-4 my-2">
      Error: {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <button 
          onClick={goToNewsFeed}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to NewsFeed
        </button>
      </div>
      
      <h1 className="text-4xl font-bold text-yellow-600 mb-8 text-center">
        Reported Posts
      </h1>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-yellow-200">
          <thead className="bg-yellow-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                Post ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                Reported At
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-green-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-yellow-200">
            {reports.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-green-500">
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