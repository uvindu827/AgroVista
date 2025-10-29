import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';

async function run() {
  try {
    const imagePath = path.resolve('..', 'frontend', 'public', 'assets', 'field-bg.svg');
    if (!fs.existsSync(imagePath)) {
      console.error('Test image not found at', imagePath);
      process.exit(1);
    }

    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    form.append('lat', '7.8731');
    form.append('lon', '80.7718');
    form.append('weather', JSON.stringify({ main: 'Clear', temp: 28 }));

    const url = 'http://localhost:3000/api/detect-crop-disease';
    console.log('Posting to', url, 'with image', imagePath);

    const res = await axios.post(url, form, {
      headers: form.getHeaders(),
      timeout: 10000,
    });

    console.log('Response status:', res.status);
    console.log('Response data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('Server responded with status', err.response.status);
      console.error('Body:', err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
    process.exit(1);
  }
}

run();
