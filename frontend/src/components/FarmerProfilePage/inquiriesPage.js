import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * InquiriesPage - Displays a list of inquiries for the farmer and allows submitting new inquiries
 */
export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch inquiries on component mount
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
      } catch (err) {
        setError("Failed to load inquiries.");
      }
    };
    fetchInquiries();
  }, []);

  // Handle form submit to add new inquiry
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/inquiries/",
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("");
      // Refresh inquiries list
      const response = await axios.get("http://localhost:3000/api/inquiries/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInquiries(response.data);
    } catch (err) {
      setError("Failed to submit inquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Inquiries</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <label htmlFor="message" className="block mb-2 font-medium">
          Your Inquiry
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          placeholder="Type your inquiry here..."
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300"
        >
          {loading ? "Submitting..." : "Submit Inquiry"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
<h3 className="text-xl font-semibold mb-2">Your Inquiries and Admin Responses</h3>
      {inquiries.length === 0 ? (
        <p>No inquiries found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Message</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Admin Response</th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b border-gray-300">{inquiry.message}</td>
                <td className="py-2 px-4 border-b border-gray-300">{inquiry.response || "No response yet"}</td>
                <td className="py-2 px-4 border-b border-gray-300">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
