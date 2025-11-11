import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: "./.env.secrets" });

export const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text content is required for summarization",
      });
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: text,
        parameters: {
          max_length: 100,
          min_length: 30,
          do_sample: false,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
      }
    );

    if (Array.isArray(response.data) && response.data.length > 0) {
      const summaryText = response.data[0].summary_text;
      if (summaryText) {
        return res.json({ success: true, summary: summaryText });
      }
    }

    if (typeof response.data === "string") {
      return res.json({ success: true, summary: response.data });
    }

    res.json({
      success: true,
      summary: JSON.stringify(response.data).substring(0, 300),
    });
  } catch (error) {
    console.error("Summarization API error:", error.message);

    if (error.response) {
      console.error("API response error data:", error.response.data);
      console.error("API response status:", error.response.status);
    }

    res.status(500).json({
      success: false,
      error:
        "Failed to generate summary: " +
        (error.response?.data?.error || error.message),
    });
  }
};
