import React, { useState, useEffect } from "react";
import API from "../pages/api/api";

// NOTE: To use a custom background photo, add an image to `public/assets/field-bg.jpg`
// or replace the provided SVG at `public/assets/field-bg.svg`.
const BG_IMAGE = "/assets/field-bg.svg";

export default function CropDiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [locError, setLocError] = useState("");

  // Get geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocError("Location access denied or unavailable."),
        { timeout: 5000 }
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
    // backend expects 'lon' naming
    formData.append("lon", location.lng || location.lon);
    formData.append("lng", location.lng); // Keep this line if you still need 'lng' for other purposes
    try {
      // POST to backend crop disease endpoint
      const { data } = await API.post("/api/detect-crop-disease", formData, {
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
    <div className="min-h-screen w-full flex items-center justify-center" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.25)), url('${BG_IMAGE}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    }}>

      <div className="max-w-4xl w-full mx-4 p-8 rounded-2xl bg-white/60 backdrop-blur-sm shadow-2xl flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-extrabold text-green-900 mb-2">Crop Disease Detection</h2>
          <p className="text-sm text-green-800/80 mb-4 text-center">Upload a photo of the affected crop. We'll analyze the image and return probable disease and recommendations.</p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            <label className="w-64 h-40 border-2 border-dashed border-white/40 rounded-lg flex items-center justify-center overflow-hidden bg-white/30 cursor-pointer">
              {preview ? (
                <img src={preview} alt="Preview" className="object-cover w-full h-full" />
              ) : (
                <div className="text-center px-4">
                  <div className="text-lg font-semibold text-white/90">Choose an image</div>
                  <div className="text-xs text-white/70 mt-1">photo of leaf, stem or fruit</div>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            <div className="w-full text-center text-sm text-green-900/80">
              {location.lat && location.lng ? (
                <span>Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              ) : (
                <span className="text-red-700">{locError || 'Locating...'}</span>
              )}
            </div>

            <button type="submit" disabled={!image || loading} className="bg-green-700 disabled:opacity-60 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-800 transition">
              {loading ? 'Detecting...' : 'Detect Disease'}
            </button>
          </form>
        </div>

        <div className="w-80 md:w-96 flex-none bg-white rounded-xl p-4 shadow-inner">
          <h3 className="text-lg font-bold text-green-800 mb-2">Result</h3>
          {!result && <p className="text-sm text-gray-600">No result yet — upload an image and run detection.</p>}
          {result && result.error && <p className="text-sm text-red-600">{result.error}</p>}
          {result && !result.error && (
            <div className="space-y-3">
              <div className="text-sm text-gray-700"><strong>Disease:</strong> <span className="text-green-800">{result.disease}</span></div>
              <div className="text-sm text-gray-700"><strong>Confidence:</strong> {Math.round((result.confidence || 0) * 100)}%</div>
              {result.suggestions && (
                <div>
                  <strong className="text-sm text-gray-700">Suggestions:</strong>
                  <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
                    {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 text-xs text-gray-500">
            Tip: For best results, take a close, well-lit photo of the symptomatic area (leaf, stem, fruit).
          </div>
        </div>
      </div>
    </div>
  );
}
