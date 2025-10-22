import React, { useState } from "react";
import API from "../pages/api/api";

export default function CropDiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [locError, setLocError] = useState("");

  // Get geolocation on mount
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          setLocError("Location access denied or unavailable.");
        }
      );
    } else {
      setLocError("Geolocation not supported.");
    }
  }, []);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);
    try {
      const { data } = await API.post("/disease-detection", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data);
    } catch (err) {
      setResult({ error: "Detection failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">Crop Disease Detection</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
        <input type="file" accept="image/*" onChange={handleImageChange} className="mb-2" />
        {preview && <img src={preview} alt="Preview" className="w-64 h-48 object-cover rounded-lg border mb-2" />}
        <div className="mb-2 text-center">
          {location.lat && location.lng ? (
            <span className="text-green-700 text-sm">Location: {location.lat}, {location.lng}</span>
          ) : (
            <span className="text-red-600 text-sm">{locError}</span>
          )}
        </div>
        <button type="submit" disabled={!image || loading} className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition">
          {loading ? "Detecting..." : "Detect Disease"}
        </button>
      </form>
      {result && (
        <div className="mt-6 text-center">
          {result.error ? (
            <p className="text-red-600 font-bold">{result.error}</p>
          ) : (
            <>
              <h3 className="text-xl font-bold text-green-800 mb-2">Disease: {result.disease}</h3>
              <p className="text-lg text-gray-700 mb-1">Confidence: {result.confidence}</p>
              <p className="text-md text-green-700">Advice: {result.advice}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
