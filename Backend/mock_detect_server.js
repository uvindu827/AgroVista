import express from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());

app.post('/api/detect-crop-disease', upload.single('image'), (req, res) => {
  const lat = req.body.lat || null;
  const lon = req.body.lon || req.body.lng || null;

  // Return a simple mock response similar to the fallback in cropDiseaseRoutes
  const fallback = {
    success: true,
    disease: 'MockDisease - Mock server',
    confidence: 0.88,
    suggestions: [
      'This is a mock detection server used for local testing. Replace with real ML service.',
    ],
    location: { lat: lat || null, lon: lon || null },
  };

  console.log('Mock server received file:', !!req.file, 'lat:', lat, 'lon:', lon);
  res.json(fallback);
});

const PORT = process.env.MOCK_DETECT_PORT || 5001;
app.listen(PORT, () => console.log(`Mock detect server listening on ${PORT}`));
