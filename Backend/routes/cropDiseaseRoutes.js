
import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import Jimp from 'jimp';

const router = express.Router();

// Multer setup for image upload (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: normalize hostnames to 127.0.0.1 where appropriate to avoid
// IPv6/localhost binding issues on some Windows setups.
const normalizeHost = (u) => {
  if (!u) return u;
  try {
    const parsed = new URL(u);
    if (parsed.hostname === 'localhost') parsed.hostname = '127.0.0.1';
    return parsed.toString();
  } catch (_) {
    return u.replace('localhost', '127.0.0.1');
  }
};

// POST /detect-crop-disease (also accept '/api/detect-crop-disease')
router.post(['/detect-crop-disease', '/api/detect-crop-disease'], upload.single('image'), async (req, res) => {
  try {
    console.info('[detect-crop-disease] incoming url:', req.originalUrl);

    const imageBuffer = req.file ? req.file.buffer : null;
    const lat = req.body && req.body.lat ? req.body.lat : null;
    const lon = req.body && (req.body.lon || req.body.lng) ? (req.body.lon || req.body.lng) : null;
    const weather = req.body && req.body.weather ? req.body.weather : null;

    console.info('[detect-crop-disease] file present:', !!req.file);

    // Prepare a FormData instance for forwarding
    const forwardForm = new FormData();
    if (imageBuffer) {
      forwardForm.append('image', imageBuffer, {
        filename: req.file && req.file.originalname ? req.file.originalname : 'image.jpg',
        contentType: req.file && req.file.mimetype ? req.file.mimetype : 'application/octet-stream',
      });
    }
    if (lat) forwardForm.append('lat', String(lat));
    if (lon) forwardForm.append('lon', String(lon));
    if (weather) forwardForm.append('weather', typeof weather === 'string' ? weather : JSON.stringify(weather));

    // In-process mock for CI / deterministic local runs
    if (process.env.USE_INPROCESS_MOCK === '1') {
      console.info('[detect-crop-disease] returning in-process mock');
      return res.json({ success: true, disease: 'MockDisease (in-process)', confidence: 0.99, suggestions: ['In-process mock used for testing'] });
    }

    const mlUrl = normalizeHost(process.env.ML_URL || 'http://127.0.0.1:5001/predict');
    const mockUrl = normalizeHost(process.env.MOCK_DETECT_URL || 'http://127.0.0.1:5001/api/detect-crop-disease');

    // Helper to POST form-data to an endpoint and return response data
    const postTo = async (url) => {
      const headers = forwardForm.getHeaders();
      if (process.env.ML_API_KEY) headers['X-API-KEY'] = process.env.ML_API_KEY;
      // Try to compute length for more reliable requests
      try {
        const len = await new Promise((resolve, reject) => forwardForm.getLength((err, l) => (err ? reject(err) : resolve(l))));
        headers['Content-Length'] = len;
      } catch (lenErr) {
        console.warn('[detect-crop-disease] could not compute form-data length, proceeding without it:', lenErr && lenErr.message ? lenErr.message : lenErr);
      }

      const resp = await axios.post(url, forwardForm, { headers, timeout: 15000 });
      return resp.data;
    };

    // Try the real ML service first, then a mock endpoint if configured
    try {
      console.info('[detect-crop-disease] forwarding to ML service:', mlUrl);
      const mlResp = await postTo(mlUrl);
      console.info('[detect-crop-disease] ML service returned');
      return res.json(mlResp);
    } catch (mlErr) {
      console.warn('[detect-crop-disease] ML service unreachable or error:', mlErr && mlErr.message ? mlErr.message : mlErr);
      if (mlErr && mlErr.response) console.warn('[detect-crop-disease] ML response:', mlErr.response.status, mlErr.response.data);
    }

    // Try configured mock endpoint
    try {
      console.info('[detect-crop-disease] forwarding to mock service:', mockUrl);
      const mockResp = await postTo(mockUrl);
      console.info('[detect-crop-disease] Mock service returned');
      return res.json(mockResp);
    } catch (mockErr) {
      console.warn('[detect-crop-disease] Mock service unreachable or error:', mockErr && mockErr.message ? mockErr.message : mockErr);
      if (mockErr && mockErr.response) console.warn('[detect-crop-disease] Mock response:', mockErr.response.status, mockErr.response.data);
    }

    // As a final fallback, if we have an image, try a tiny local heuristic (fast, not ML-grade)
    if (imageBuffer) {
      try {
        const img = await Jimp.read(imageBuffer);
        img.resize(128, Jimp.AUTO);

        let brownish = 0;
        let total = 0;
        img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
          const r = this.bitmap.data[idx + 0];
          const g = this.bitmap.data[idx + 1];
          // const b = this.bitmap.data[idx + 2];
          total++;
          if (r > 100 && g < 120 && r - g > 20) brownish++;
        });

        const ratio = total > 0 ? brownish / total : 0;
        const confidence = Math.min(0.95, Math.max(0.05, ratio * 1.5));
        const disease = ratio > 0.03 ? 'Leaf Scorch / Spotting (heuristic)' : 'Healthy / No obvious disease (heuristic)';
        const suggestions = ratio > 0.03 ? ['Inspect affected plants closely for pests or fungal infections.', 'Consider targeted fungicide or improved irrigation as appropriate.'] : ['No obvious disease detected. Monitor regularly and submit clearer close-up photos if symptoms appear.'];

        return res.json({ success: true, disease, confidence, suggestions, location: { lat, lon } });
      } catch (heurErr) {
        console.error('[detect-crop-disease] local heuristic failed:', heurErr && heurErr.message ? heurErr.message : heurErr);
      }
    }

    // Final safe fallback
    return res.status(200).json({ success: false, disease: 'Unknown (model unavailable)', confidence: 0, suggestions: ['Server ML service unreachable. Try again later.'] });
  } catch (err) {
    console.error('[detect-crop-disease] fatal error:', err && err.message ? err.message : err);
    return res.status(500).json({ error: 'Detection failed.', details: err && err.message ? err.message : String(err) });
  }
});

export default router;
