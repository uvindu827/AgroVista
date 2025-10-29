import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Resolve paths relative to this file (works regardless of current working dir)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Backend/.env so the test can default to the same PORT/DETECT_URL the
// backend will use during local development. This lets you run the test
// without manually exporting DETECT_URL when you start the server with
// PORT=3001 or similar.
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Prefer a raster image (PNG/JPG). Use frontend/public/logo192.png by default
// because the ML scaffold (Pillow) can't parse SVG files. This makes the
// integration test deterministic for local dev.
const fallbackPng = path.resolve(__dirname, '..','frontend','public','logo192.png');
const localPng = path.resolve(__dirname, 'uploads', 'sample-field-bg.png');
let srcPath;
if (fs.existsSync(localPng)) {
  srcPath = localPng;
} else if (fs.existsSync(fallbackPng)) {
  srcPath = fallbackPng;
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

  // Force IPv4 localhost by default to avoid ::1/IPv6 connection issues on some
  // developer machines. You can override with DETECT_URL. If DETECT_URL isn't
  // provided, default to the backend PORT defined in Backend/.env (or 3000).
  const defaultPort = process.env.PORT || '3000';
  const detectUrl = process.env.DETECT_URL || `http://127.0.0.1:${defaultPort}/api/detect-crop-disease`;
  console.log('Posting to', detectUrl, 'using file:', srcPath);

  // Retry loop for transient startup ordering/connectivity issues so the
  // test is more forgiving when services are still coming up.
  const maxAttempts = 5;
  const delayMs = 1500;
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      attempt += 1;
      const res = await axios.post(detectUrl, form, {
        headers: {
          ...form.getHeaders(),
        },
        timeout: 15000,
      });

      console.log('Response status:', res.status);
      console.log('Response data:', JSON.stringify(res.data, null, 2));
      break;
    } catch (err) {
      // If this was a connection refused / ECONNREFUSED, wait and retry.
      const isConnRefused = err && err.code === 'ECONNREFUSED';
      const isTimeout = err && err.code === 'ECONNABORTED';
      console.error(`Attempt ${attempt} failed:`, err && err.message ? err.message : err);
      if (attempt >= maxAttempts || (!isConnRefused && !isTimeout)) {
        // Print details and exit with failure.
        if (err.response) {
          console.error('Status:', err.response.status);
          console.error('Data:', err.response.data);
        }
        if (err.stack) console.error('Stack:', err.stack);
        process.exitCode = 1;
        break;
      }
      // wait and retry
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
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
