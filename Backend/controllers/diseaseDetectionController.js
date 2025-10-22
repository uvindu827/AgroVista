import axios from "axios";
import FormData from "form-data";

// Example: Use Azure Custom Vision or similar cloud API
export const detectDisease = async (req, res) => {
  try {
    const image = req.file;
    const { lat, lng } = req.body;
    if (!image) return res.status(400).json({ error: "No image uploaded" });

    // For demo, return a mock result with location
    return res.json({
      disease: "Leaf Blight",
      confidence: "97%",
      advice: "Remove affected leaves and apply recommended fungicide.",
      location: lat && lng ? { lat, lng } : null
    });
  } catch (err) {
    res.status(500).json({ error: "Detection failed." });
  }
};
