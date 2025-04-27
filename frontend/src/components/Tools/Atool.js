import React, { useState } from "react";
import axios from "axios";

function Atool() {
  const [toolData, setToolData] = useState({
    tname: "",
    tquantity: "",
    tprice: "",
    tbrand: "",
    tdescription: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only alphabets for tool name
    if (name === "tname" && !/^[a-zA-Z ]*$/.test(value)) return;

    // Ensure quantity and price are only digits (and optional decimals for price)
    if ((name === "tquantity" || name === "tprice") && !/^\d*(\.\d{0,2})?$/.test(value)) return;

    setToolData({ ...toolData, [name]: value });
  };

  // Handle image file change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(toolData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.post("http://localhost:3000/api/tools/addTools", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Tool Added Successfully!");
      setToolData({
        tname: "",
        tquantity: "",
        tprice: "",
        tbrand: "",
        tdescription: "",
      });
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Insert error:", err);
      alert("Failed to add tool. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-100">
      {/* Header */}
      <header className="bg-green-200 text-green-900 py-6 text-center shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 font-montserrat">AgroVista Tools</h1>
          <p className="text-green-700 text-lg font-light italic">
            Cultivating Efficiency with Modern Solutions
          </p>
        </div>
      </header>

      {/* Form Section */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full bg-white bg-opacity-50 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-4xl font-bold text-green-900 mb-8 text-center font-montserrat">
            Add New Tool
            <span className="block mt-2 w-20 h-1 bg-blue-500 mx-auto rounded-full"></span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Inputs */}
              <div className="relative group">
                <input
                  type="text"
                  name="tname"
                  value={toolData.tname}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white bg-opacity-70 border border-green-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-green-900 placeholder-transparent peer"
                  placeholder=" "
                />
                <label className="absolute left-4 -top-2.5 px-1 bg-white text-sm text-green-800 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-green-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
                  Tool Name
                </label>
              </div>

              <div className="relative group">
                <input
                  type="number"
                  name="tquantity"
                  value={toolData.tquantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white bg-opacity-70 border border-green-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-green-900 placeholder-transparent peer"
                  placeholder=" "
                  min="0"
                />
                <label className="absolute left-4 -top-2.5 px-1 bg-white text-sm text-green-800 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-green-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
                  Quantity
                </label>
              </div>

              <div className="relative group">
                <input
                  type="number"
                  name="tprice"
                  value={toolData.tprice}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white bg-opacity-70 border border-green-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-green-900 placeholder-transparent peer"
                  placeholder=" "
                  min="0"
                  step="0.01" // Allows two decimal places
                />
                <label className="absolute left-4 -top-2.5 px-1 bg-white text-sm text-green-800 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-green-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
                  Price ($)
                </label>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  name="tbrand"
                  value={toolData.tbrand}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white bg-opacity-70 border border-green-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-green-900 placeholder-transparent peer"
                  placeholder=" "
                />
                <label className="absolute left-4 -top-2.5 px-1 bg-white text-sm text-green-800 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-green-500 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm">
                  Brand
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="relative group">
              <textarea
                name="tdescription"
                value={toolData.tdescription}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white bg-opacity-70 border border-green-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-green-900 placeholder-transparent peer resize-none"
                rows={4}
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 px-1 bg-white text-sm text-green-800 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-green-500 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-sm">
                Description
              </label>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-xl hover:border-blue-400 transition-colors cursor-pointer bg-white bg-opacity-60">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-green-700">Click to upload image</p>
                  </div>
                </div>
                {preview && (
                  <div className="mt-4 text-center">
                    <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold text-lg rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              Add Tool
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Atool;
