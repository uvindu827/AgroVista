import express from 'express';
import cropDiseaseRoutes from './routes/cropDiseaseRoutes.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';

(async () => {
  // Create an express app and mount the existing route
  const app = express();
  app.use('/api', cropDiseaseRoutes);

  const server = await new Promise((resolve, reject) => {
    const s = app.listen(0, () => resolve(s));
    s.on('error', reject);
  });

  const port = server.address().port;
  const url = `http://127.0.0.1:${port}/api/detect-crop-disease`;

  try {
    const filePath = path.resolve('.', 'uploads', 'sample-field-bg.svg');
    let srcPath = filePath;
    if (!fs.existsSync(srcPath)) {
      srcPath = path.resolve('..','frontend','public','assets','field-bg.svg');
    }
    if (!fs.existsSync(srcPath)) {
      console.error('No sample image found at', srcPath);
      process.exit(1);
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(srcPath));
    // Do not include lat/lon in test request per user request
    // form.append('lat', '7.8731');
    // form.append('lon', '80.7718');

    console.log('Debug Posting to', url, 'using file:', srcPath);
    // Force ML_URL to the mock server so the route forwards and we observe forwarding behavior
    process.env.ML_URL = process.env.ML_URL || 'http://localhost:5001/api/detect-crop-disease';

    const res = await axios.post(url, form, { headers: { ...form.getHeaders() }, timeout: 15000 });

    console.log('Debug Response status:', res.status);
    console.log('Debug Response data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('In-process debug request failed:');
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
})();
