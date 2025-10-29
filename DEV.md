Development — run ML scaffold + backend locally (Windows PowerShell)
===============================================================

This repository includes a small Flask-based ML scaffold (`Backend/ml_stub/app.py`) and an Express backend (`Backend`). The `dev:all` script runs both services concurrently for local development.

Prerequisites
- Python 3.10+ with required packages (see `Backend/ml_stub/requirements.txt`).
- Node.js (for the backend) and `npm`.
- `concurrently` is used by the root `package.json` scripts — it's already a devDependency.

Quick start (PowerShell)
1. Optionally set a model path and API key (recommended if you have an external model):

```powershell
$env:MODEL_PATH='D:\path\to\your\model.pt'    # optional
$env:ML_API_KEY='your-secret-dev-key'            # optional, for ML auth
```

2. Start both ML and backend together (from repo root):

```powershell
npm run dev:all
```

This runs the ML scaffold (Python) and the backend. The ML scaffold listens on port `5001` by default and the backend picks its `PORT` from `Backend/.env` or `process.env.PORT`.

If the frontend dev server (React) is running on port 3000/3001 it may intercept API calls. Stop the frontend or run the backend on a different port.

Testing the flow
- Direct ML check (include the X-API-KEY header if you set ML_API_KEY):

```powershell
curl -H "X-API-KEY: your-secret-dev-key" -F "image=@frontend\public\logo192.png" http://127.0.0.1:5001/predict
```

- Backend + ML (integration test):

```powershell
$env:DETECT_URL='http://127.0.0.1:3001/api/detect-crop-disease'; node Backend\test_detect.mjs
```

Notes
- Do NOT commit real keys to git. Use `Backend/.env` for local development and `.env.example` for examples.
- If you prefer Docker, see `docker-compose.yml` and `Backend/ml_stub/Dockerfile`.

Auth and developer fallback (important)
------------------------------------
- The previous developer convenience flag `DEV_AUTH` (which allowed logging in with
	credentials set in environment variables) has been removed from the codebase.
- This measure prevents accidentally accepting developer credentials in non-local
	environments. If you need to test authentication locally, do one of the
	following:
	- Run a local MongoDB instance and create a test user (recommended).
	- Use a staging/test database that contains seeded test users.
	- Create a small one-off script to insert a test user into your local DB.

If you only need to test the detection pipeline (image upload -> ML -> response),
you do not need authentication: the detection endpoints are accessible without
login in development, so you can run the ML scaffold + backend and POST an image
as shown above.

If you want, I can add a small `scripts/seed-user.js` utility to insert a test
user into the local database for quicker login testing.
