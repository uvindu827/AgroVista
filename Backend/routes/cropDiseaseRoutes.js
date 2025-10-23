
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
    const lon = req.body.lon;
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

    // Call Flask API
    const flaskUrl = 'http://localhost:5001/predict';
    const flaskRes = await axios.post(flaskUrl, formData, {
      headers: formData.getHeaders(),
    });
    res.json(flaskRes.data);
  } catch (err) {
    res.status(500).json({ error: 'Detection failed.' });
  }
});

export default router;
