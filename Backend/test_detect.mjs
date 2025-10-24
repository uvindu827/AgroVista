import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

// Prefer a raster image (PNG/JPG). If the preferred sample SVG exists, fall back
// to a PNG (logo192.png) because the ML scaffold expects raster images.
const preferred = path.resolve('.', 'uploads', 'sample-field-bg.svg');
const fallbackPng = path.resolve('..','frontend','public','logo192.png');
let srcPath;
if (fs.existsSync(path.resolve('.', 'uploads', 'sample-field-bg.png'))) {
  srcPath = path.resolve('.', 'uploads', 'sample-field-bg.png');
} else if (fs.existsSync(fallbackPng)) {
  srcPath = fallbackPng;
} else if (fs.existsSync(preferred)) {
  // as last resort use the SVG, but note ML may not accept SVG
  srcPath = preferred;
} else {
  throw new Error('No sample image found. Place a PNG at uploads/sample-field-bg.png or ensure frontend/public/logo192.png exists');
}

(async () => {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(srcPath));
  // Do not send latitude/longitude per user preference
  // form.append('lat', '7.8731');
  // form.append('lon', '80.7718');

    const detectUrl = process.env.DETECT_URL || 'http://localhost:3000/api/detect-crop-disease';
    console.log('Posting to', detectUrl, 'using file:', srcPath);

    const res = await axios.post(detectUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 15000,
    });

    console.log('Response status:', res.status);
    console.log('Response data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Request failed:');
    try {
      console.error('Error object:', err);
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
      }
      if (err.stack) console.error('Stack:', err.stack);
      else if (err.message) console.error('Message:', err.message);
    } catch (innerErr) {
      console.error('Failed to print error details:', innerErr);
    }
    process.exitCode = 1;
  }
})();
