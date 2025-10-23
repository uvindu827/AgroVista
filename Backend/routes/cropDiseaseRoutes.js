
import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
const router = express.Router();

// Multer setup for image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/detect-crop-disease
router.post('/detect-crop-disease', upload.single('image'), async (req, res) => {
  try {
    const imageBuffer = req.file ? req.file.buffer : null;
    const lat = req.body.lat;
    // accept either 'lon' or older 'lng'
    const lon = req.body.lon || req.body.lng || null;
    const weather = req.body.weather ? req.body.weather : null;

    // Prepare form-data for Flask API
    const formData = new FormData();
    if (imageBuffer) {
      formData.append('image', imageBuffer, {
        filename: 'image.jpg',
        contentType: req.file.mimetype
      });
    }
    formData.append('lat', lat);
    formData.append('lon', lon);
    formData.append('weather', weather);

    // Call Flask API (if available). If Flask is down, return a fallback dummy response
    try {
      const flaskUrl = 'http://localhost:5001/predict';
      const flaskRes = await axios.post(flaskUrl, formData, {
        headers: formData.getHeaders(),
        timeout: 5000,
      });
      return res.json(flaskRes.data);
    } catch (forwardErr) {
      console.warn('Flask service unavailable, returning local fallback result:', forwardErr.message);
      // Fallback dummy response so frontend can still show a result while the ML service is offline
      const fallback = {
        success: false,
        disease: 'Unknown (model unavailable)',
        confidence: 0,
        suggestions: [
          'Server ML service unreachable. Try again later.',
        ],
        location: { lat: lat || null, lon: lon || null },
      };
      return res.status(200).json(fallback);
    }
  } catch (err) {
    console.error('Error in detect-crop-disease:', err);
    res.status(500).json({ error: 'Detection failed.', details: err.message });
  }
});

export default router;
