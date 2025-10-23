
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
  // No longer collect latitude/longitude per user request.
  // const lat = req.body.lat;
  // const lon = req.body.lon || req.body.lng || null;
  const weather = req.body.weather ? req.body.weather : null;

    // Prepare form-data for ML API
    const formData = new FormData();
    if (imageBuffer) {
      formData.append('image', imageBuffer, {
        filename: 'image.jpg',
        contentType: req.file.mimetype
      });
    }
    // Do not append lat/lon to forwarded requests any more.
    formData.append('weather', weather);

    // Call ML API (configurable via ML_URL). If it fails, try a local mock service on port 5000/5001
    const mlUrl = process.env.ML_URL || 'http://localhost:5001/predict';
    const mockUrl = process.env.MOCK_DETECT_URL || 'http://localhost:5001/api/detect-crop-disease';

    const tryForward = async (url) => {
      const resp = await axios.post(url, formData, {
        headers: formData.getHeaders(),
        timeout: 5000,
      });
      return resp.data;
    };

    // Allow an in-process mock for CI/local deterministic runs
    if (process.env.USE_INPROCESS_MOCK === '1') {
      const mockResp = {
        success: true,
        disease: 'MockDisease (in-process)',
        confidence: 0.99,
        suggestions: ['In-process mock used for testing'],
      };
      console.info('Using in-process mock response');
      return res.json(mockResp);
    }

    // First try configured ML URL
    try {
      const mlResp = await tryForward(mlUrl);
      return res.json(mlResp);
    } catch (err1) {
      console.warn('ML service at', mlUrl, 'unreachable:', err1.message || err1);
      // Try mock
      try {
        const mockResp = await tryForward(mockUrl);
        console.info('Using mock ML service at', mockUrl);
        return res.json(mockResp);
      } catch (err2) {
        console.warn('Mock ML service at', mockUrl, 'also unreachable:', err2.message || err2);
        // Final fallback response
        const fallback = {
          success: false,
          disease: 'Unknown (model unavailable)',
          confidence: 0,
          suggestions: [
            'Server ML service unreachable. Try again later.',
          ],
        };
        return res.status(200).json(fallback);
      }
    }
  } catch (err) {
    console.error('Error in detect-crop-disease:', err);
    res.status(500).json({ error: 'Detection failed.', details: err.message });
  }
});

export default router;
