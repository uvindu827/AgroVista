import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminInquiryResponsePage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseTexts, setResponseTexts] = useState({});
  const [submitting, setSubmitting] = useState({});

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/inquiries/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInquiries(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load inquiries.");
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleResponseChange = (inquiryId, value) => {
    setResponseTexts((prev) => ({ ...prev, [inquiryId]: value }));
  };

  const handleSubmitResponse = async (inquiryId) => {
    if (!responseTexts[inquiryId] || responseTexts[inquiryId].trim() === "") return;

    setSubmitting((prev) => ({ ...prev, [inquiryId]: true }));
    setError(null);

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3000/api/inquiries/${inquiryId}/response`,
        { response: responseTexts[inquiryId] }, // ✅ FIXED HERE
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update inquiries list with the new response
      setInquiries((prev) =>
        prev.map((inquiry) =>
          inquiry.id === inquiryId
            ? { ...inquiry, adminResponse: responseTexts[inquiryId] }
            : inquiry
        )
      );

      setResponseTexts((prev) => ({ ...prev, [inquiryId]: "" }));
    } catch (err) {
      console.error(err);
      setError("Failed to submit response.");
    } finally {
      setSubmitting((prev) => ({ ...prev, [inquiryId]: false }));
    }
  };

  if (loading) return <div>Loading inquiries...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  if (inquiries.length === 0) {
    return <div>No inquiries found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Farmer Inquiries Management</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300 text-left">
              Farmer Message
            </th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">
              Admin Response
            </th>
            <th className="py-2 px-4 border-b border-gray-300 text-left">
              Respond
            </th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b border-gray-300">{inquiry.message}</td>
              <td className="py-2 px-4 border-b border-gray-300">
                {inquiry.adminResponse || "No response yet"}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                <textarea
                  rows={2}
                  value={responseTexts[inquiry.id] || ""}
                  onChange={(e) => handleResponseChange(inquiry.id, e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded mb-1"
                  placeholder="Type your response here..."
                />
                <button
                  onClick={() => handleSubmitResponse(inquiry.id)}
                  disabled={submitting[inquiry.id]}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-300"
                >
                  {submitting[inquiry.id] ? "Submitting..." : "Submit"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
