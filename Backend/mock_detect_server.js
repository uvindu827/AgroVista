import express from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
app.use(cors());

app.post('/api/detect-crop-disease', upload.single('image'), (req, res) => {
  // Return a simple mock response similar to the fallback in cropDiseaseRoutes
  console.log('Mock server received file:', !!req.file);
  const fallback = {
    success: true,
    disease: 'MockDisease - Mock server',
    confidence: 0.88,
    suggestions: [
      'This is a mock detection server used for local testing. Replace with real ML service.',
    ],
  };

  res.json(fallback);
});

const PORT = process.env.MOCK_DETECT_PORT || 5001;
app.listen(PORT, () => console.log(`Mock detect server listening on ${PORT}`));
