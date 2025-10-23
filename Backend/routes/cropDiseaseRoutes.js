
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

    // Debug logging: show that we received a request and whether a file arrived.
    console.info('[detect-crop-disease] request received');
    if (req.file) {
      console.info('[detect-crop-disease] file received:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
    } else {
      console.warn('[detect-crop-disease] no file attached in request');
    }

    // Prepare form-data for ML API
    const formData = new FormData();
    if (imageBuffer) {
      try {
        formData.append('image', imageBuffer, {
          filename: req.file && req.file.originalname ? req.file.originalname : 'image.jpg',
          contentType: req.file ? req.file.mimetype : 'application/octet-stream',
        });
      } catch (appendErr) {
        console.error('[detect-crop-disease] failed to append image buffer to FormData:', appendErr);
        throw appendErr;
      }
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
      console.info('[detect-crop-disease] forwarding to ML URL:', mlUrl);
      const mlResp = await tryForward(mlUrl);
      console.info('[detect-crop-disease] received response from ML URL');
      return res.json(mlResp);
    } catch (err1) {
      console.warn('[detect-crop-disease] ML service at', mlUrl, 'unreachable:', err1 && err1.message ? err1.message : err1);
      if (err1 && err1.response) {
        console.warn('[detect-crop-disease] ML response status/data:', err1.response.status, err1.response.data);
      }
      // Try mock
      try {
        console.info('[detect-crop-disease] forwarding to mock URL:', mockUrl);
        const mockResp = await tryForward(mockUrl);
        console.info('[detect-crop-disease] received response from mock URL');
        return res.json(mockResp);
      } catch (err2) {
        console.warn('[detect-crop-disease] Mock ML service at', mockUrl, 'also unreachable:', err2 && err2.message ? err2.message : err2);
        if (err2 && err2.response) console.warn('[detect-crop-disease] mock response status/data:', err2.response.status, err2.response.data);
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
