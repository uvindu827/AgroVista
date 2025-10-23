import React, { useState } from "react";
import axios from "axios";

const theme = {
  primary: "#4CAF50",
  secondary: "#388E3C",
  accent: "#FFEB3B",
  background: "#F5FFF5",
  card: "#FFFFFF",
  brown: "#8D6E63",
  blue: "#81D4FA"
};

function CropDiseaseDetection() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: "", lon: "" });
  const [weather, setWeather] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Geolocation
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => setError("Unable to retrieve location")
      );
    } else {
      setError("Geolocation not supported");
    }
  };

  // Weather API (OpenWeatherMap demo)
  const fetchWeather = async (lat, lon) => {
    try {
      const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const res = await axios.get(url);
      setWeather(res.data);
    } catch (err) {
      setError("Weather fetch failed");
    }
  };

  // Image upload handler
  const handleImage = e => {
    setImage(e.target.files[0]);
  };

  // Submit for detection
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("lat", location.lat);
      formData.append("lon", location.lon);
      formData.append("weather", JSON.stringify(weather));
      const res = await axios.post("/api/detect-crop-disease", formData);
      setResult(res.data);
    } catch (err) {
      setError("Detection failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: theme.background, minHeight: "100vh", padding: "2rem" }}>
      <div style={{ maxWidth: 500, margin: "auto", background: theme.card, borderRadius: 16, boxShadow: "0 2px 8px #8D6E6322", padding: "2rem" }}>
        <h2 style={{ color: theme.primary, marginBottom: 8 }}>Crop Disease Detection</h2>
        <p style={{ color: theme.secondary }}>Upload a crop image, get location & weather, and detect disease.</p>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleImage} style={{ margin: "1rem 0" }} />
          <button type="button" onClick={getLocation} style={{ background: theme.primary, color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1rem", marginBottom: 8 }}>Detect Location</button>
          <div style={{ marginBottom: 8 }}>
            <input type="text" placeholder="Latitude" value={location.lat} onChange={e => setLocation({ ...location, lat: e.target.value })} style={{ marginRight: 8 }} />
            <input type="text" placeholder="Longitude" value={location.lon} onChange={e => setLocation({ ...location, lon: e.target.value })} />
          </div>
          {weather && (
            <div style={{ background: theme.blue, color: theme.secondary, borderRadius: 8, padding: 8, marginBottom: 8 }}>
              <strong>Weather:</strong> {weather.weather[0].main}, {weather.main.temp}°C, Humidity: {weather.main.humidity}%
            </div>
          )}
          <button type="submit" style={{ background: theme.secondary, color: "#fff", border: "none", borderRadius: 8, padding: "0.5rem 1rem", width: "100%" }} disabled={loading || !image}>Detect Disease</button>
        </form>
        {loading && <div style={{ color: theme.primary, marginTop: 16 }}>Detecting...</div>}
        {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
        {result && (
          <div style={{ background: theme.accent, color: theme.brown, borderRadius: 8, padding: 16, marginTop: 16 }}>
            <h3>Disease: {result.disease}</h3>
            <p>Suggestion: {result.suggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CropDiseaseDetection;
