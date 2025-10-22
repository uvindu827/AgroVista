import axios from "axios";
import FormData from "form-data";

// Example: Use Azure Custom Vision or similar cloud API
export const detectDisease = async (req, res) => {
  try {
    const image = req.file;
    if (!image) return res.status(400).json({ error: "No image uploaded" });

    // Replace with your cloud AI API endpoint and key
    // Example: Azure Custom Vision
    // const endpoint = "<YOUR_CUSTOM_VISION_ENDPOINT>";
    // const predictionKey = "<YOUR_PREDICTION_KEY>";
    // const projectId = "<YOUR_PROJECT_ID>";
    // const publishedName = "<YOUR_PUBLISHED_NAME>";

    // For demo, return a mock result
    // You should send the image to your AI API and parse the response
    return res.json({
      disease: "Leaf Blight",
      confidence: "97%",
      advice: "Remove affected leaves and apply recommended fungicide."
    });
  } catch (err) {
    res.status(500).json({ error: "Detection failed." });
  }
};
