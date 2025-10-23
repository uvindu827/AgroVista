import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

// Load .env before loading the rest of the application so imported modules can read process.env
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });

console.log('Loaded environment from', path.join(path.dirname(fileURLToPath(import.meta.url)), '.env'));

// Dynamically import app.js after env is loaded
import('./app.js')
  .then(() => {
    console.log('Application module loaded');
  })
  .catch((err) => {
    console.error('Failed to load application module:', err);
    process.exit(1);
  });
