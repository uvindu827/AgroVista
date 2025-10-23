from flask import Flask, request, jsonify
from flask_cors import CORS

import tempfile
import os
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import os
import logging
import traceback

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200


@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': "Missing 'image' file in the request."}), 400

        image_file = request.files['image']
        if image_file.filename == '':
            return jsonify({'error': 'Empty filename for uploaded image.'}), 400

        # Optional form fields
        lat = request.form.get('lat')
        lon = request.form.get('lon')
        weather = request.form.get('weather')

        # Try to parse lat/lon if provided
        try:
            lat_f = float(lat) if lat is not None else None
        except Exception:
            lat_f = None
        try:
            lon_f = float(lon) if lon is not None else None
        except Exception:
            lon_f = None

        # Save uploaded file to a temporary location for downstream model code
        suffix = os.path.splitext(image_file.filename)[1] or '.jpg'
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp_path = tmp.name
            image_bytes = image_file.read()
            tmp.write(image_bytes)

        logger.info("Saved uploaded image to %s", tmp_path)

        # TODO: Load your ML model and run prediction on tmp_path
        # For now return a dummy response so the endpoint is testable.
        result = {
            'success': True,
            'disease': 'Leaf Scorch',
            'confidence': 0.87,
            'suggestions': [
                'Increase irrigation and monitor for heat stress.',
                'Inspect for secondary pests or nutrient deficiencies.'
            ],
            'location': {
                'lat': lat_f,
                'lon': lon_f
            },
            'weather': weather
        }

        # Clean up temp file
        try:
            os.remove(tmp_path)
        except Exception:
            logger.warning('Could not remove temporary file %s', tmp_path)

        return jsonify(result), 200

    except Exception as e:
        logger.error('Error in /predict: %s', traceback.format_exc())
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500


if __name__ == '__main__':
    # Bind to 0.0.0.0 so it is reachable from other containers or machines if needed
    app.run(host='0.0.0.0', port=5001, debug=False)
