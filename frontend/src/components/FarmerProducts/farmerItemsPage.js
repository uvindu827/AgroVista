import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaFileDownload } from "react-icons/fa";

export default function FarmerItemsPage() {
  const [items, setItems] = useState([]);
  const [itemsLoaded, setItemsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!itemsLoaded) {
      const token = localStorage.getItem("token");
      axios
        .get("http://localhost:3000/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setItems(res.data);
          setItemsLoaded(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [itemsLoaded]);

  const handleDelete = (key) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.key !== key));
      const token = localStorage.getItem("token");
      axios
        .delete(`http://localhost:3000/api/products/${key}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => setItemsLoaded(false))
        .catch((err) => console.error(err));
    }
  };

  const filteredItems = items.filter((item) =>
    `${item.name} ${item.category} ${item.key}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const generateReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        ["Key", "Name", "Price", "Category", "Dimensions", "Availability"],
        ...items.map((i) => [
          i.key,
          i.name,
          i.price,
          i.category,
          i.dimensions,
          i.availability ? "Available" : "Not Available",
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "product_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full p-4 relative flex items-center flex-col">
      {/* Search and Report Controls */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, key, or category..."
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-[60%] shadow-sm focus:ring-2 focus:ring-blue-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={generateReport}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md transition"
        >
          <FaFileDownload /> Generate Report
        </button>
      </div>

      {/* Loading Spinner */}
      {!itemsLoaded && (
        <div className="border-4 my-4 border-b-green-500 rounded-full animate-spin bg-0 w-[100px] h-[100px] "></div>
      )}

      {/* Table */}
      {itemsLoaded && (
        <div className="overflow-x-auto w-full max-w-6xl">
          <table className="w-full border border-gray-300 rounded-lg shadow-md bg-white">
            <thead className="bg-gray-100 text-left text-gray-700">
              <tr>
                <th className="p-3 border">Key</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Dimensions</th>
                <th className="p-3 border">Availability</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((product, index) => (
                <tr
                  key={product.key}
                  className={`border ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-200 transition-all`}
                >
                  <td className="p-3 border">{product.key}</td>
                  <td className="p-3 border">{product.name}</td>
                  <td className="p-3 border">LKR.{product.price.toFixed(2)}</td>
                  <td className="p-3 border">{product.category}</td>
                  <td className="p-3 border">{product.dimensions}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        product.availability
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.availability ? "Available" : "Not Available"}
                    </span>
                  </td>
                  <td className="p-3 border flex justify-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/farmer/items/edit`, { state: product })
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      <FaEdit className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.key)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      <FaTrashAlt className="inline mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No matching items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Button */}
      <Link to="/farmer/items/add" className="fixed bottom-6 right-6">
        <CiCirclePlus className="text-[70px] text-blue-600 hover:text-red-900 transition duration-200 cursor-pointer" />
      </Link>
    </div>
  );
}
