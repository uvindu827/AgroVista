import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('.', 'uploads', 'sample-field-bg.svg');
// If the uploads/sample-field-bg.svg doesn't exist, fallback to frontend svg
let srcPath = filePath;
if (!fs.existsSync(srcPath)) {
  srcPath = path.resolve('..','frontend','public','assets','field-bg.svg');
}

(async () => {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(srcPath));
    form.append('lat', '7.8731');
    form.append('lon', '80.7718');

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
