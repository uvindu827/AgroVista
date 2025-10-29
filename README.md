# AgroVista
 The agricultural marketplace

## Local development

Backend and frontend run as separate apps during development. The frontend (React) typically runs on port 3000 and the backend (Express) on port 3000 as well when started from the `Backend` folder. To avoid CORS and port conflicts, prefer running the backend from the repository root using the provided npm script.

Start backend from repo root:

```powershell
npm --prefix Backend install   # one-time
npm run start:backend
```

Start frontend from repo root:

```powershell
npm --prefix frontend install   # one-time
npm run start:frontend
```

If your frontend dev server runs on `http://localhost:3000` (default for CRA), set the backend to allow that origin by adding the following to `Backend/.env`:

```
CLIENT_URL=http://localhost:3000
```

The backend defaults to allowing `http://localhost:3000` for CORS. If you change the frontend port, update `CLIENT_URL` accordingly.

Crop detection notes:
- The ML scaffold (`Backend/ml_stub/app.py`) expects raster images (PNG/JPG). SVG files are not supported by Pillow and will cause detection to return a fallback response.
- The frontend Crop Detection component posts to `/api/detect-crop-disease` which the backend forwards to the ML scaffold. Ensure both backend and the ML scaffold are running for detection to work.

### Start everything (dev)

You can start the ML scaffold and backend together from the repository root using the `start:all` npm script. This uses `concurrently` to run both processes in parallel.

```powershell
# one-time install to get dev tools
npm install

# start ML scaffold + backend in parallel
npm run start:all
```

Note: don't run `start:all` if you already have the backend running on port 3000 — stop the running backend first to avoid EADDRINUSE.
