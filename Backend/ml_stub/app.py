from flask import Flask, request, jsonify
import os
import io
from PIL import Image


app = Flask(__name__)

# Lazy-loaded model and label map
MODEL = None
LABELS = None
SOURCE = None
LABELS_SOURCE = None

def load_imagenet_labels(path='Backend/ml_stub/imagenet_classes.txt'):
    global LABELS
    if LABELS is not None:
        return LABELS
    # Try local file first, otherwise download from pytorch/hub
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            LABELS = [l.strip() for l in f.readlines()]
        return LABELS
    try:
        import requests
        url = 'https://raw.githubusercontent.com/pytorch/hub/master/imagenet_classes.txt'
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        LABELS = [l.strip() for l in r.text.splitlines()]
        # save for future
        try:
            with open(path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(LABELS))
        except Exception:
            pass
        return LABELS
    except Exception:
        LABELS = []
        return LABELS


def load_custom_labels():
    """Try to load a label map from the local ml_stub folder.
    Supports JSON (array or dict), newline-delimited txt, or categories.json.
    """
    global LABELS, LABELS_SOURCE
    if LABELS is not None and LABELS_SOURCE == 'custom':
        return LABELS
    base = os.path.dirname(__file__)
    candidates = [
        os.path.join(base, 'labels.json'),
        os.path.join(base, 'categories.json'),
        os.path.join(base, 'labels.txt'),
        os.path.join(base, 'categories.txt'),
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                if p.endswith('.json'):
                    import json
                    with open(p, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    # data might be dict or list
                    if isinstance(data, dict):
                        # try to extract values or keys
                        if 'labels' in data and isinstance(data['labels'], list):
                            LABELS = data['labels']
                        else:
                            # fall back to values
                            LABELS = list(data.values())
                    elif isinstance(data, list):
                        LABELS = data
                    else:
                        LABELS = []
                else:
                    # txt file, one label per line
                    with open(p, 'r', encoding='utf-8') as f:
                        LABELS = [l.strip() for l in f.readlines() if l.strip()]
                LABELS_SOURCE = 'custom'
                return LABELS
            except Exception:
                continue
    return None

def load_model():
    global MODEL, SOURCE
    if MODEL is not None:
        return MODEL
    # Prefer user-provided PyTorch model
    model_path = os.environ.get('MODEL_PATH')
    # If no env var, check common local filenames in this directory
    if not model_path:
        base = os.path.dirname(__file__)
        for fname in ('real_model.pt', 'model.pt'):
            candidate = os.path.join(base, fname)
            if os.path.exists(candidate):
                model_path = candidate
                break
    if model_path and os.path.exists(model_path):
        try:
            import torch
            print('Loading user model from', model_path)
            obj = torch.load(model_path, map_location='cpu')
            # If a state_dict was saved, create a resnet50 and load
            if isinstance(obj, dict) and ('state_dict' in obj or any(k.startswith('layer') for k in obj.keys())):
                from torchvision import models
                model = models.resnet50(pretrained=False)
                # handle nested state_dict
                sd = obj.get('state_dict', obj)
                # try to load directly
                try:
                    model.load_state_dict(sd)
                except Exception:
                    # try removing module. prefix
                    new_sd = {k.replace('module.', ''): v for k, v in sd.items()}
                    model.load_state_dict(new_sd)
                model.eval()
                MODEL = model
                SOURCE = 'user-pytorch-file'
                # Try to load a custom label map alongside the model
                try:
                    load_custom_labels()
                except Exception:
                    pass
                return MODEL
            else:
                # assume full torch.nn.Module was saved
                mdl = obj
                mdl.eval()
                MODEL = mdl
                SOURCE = 'user-pytorch-file'
                try:
                    load_custom_labels()
                except Exception:
                    pass
                return MODEL
        except Exception as e:
            print('Failed to load user model:', e)
    # Fall back to torchvision ResNet50 pretrained on ImageNet
    try:
        import torch
        from torchvision import models
        print('Loading torchvision ResNet50 pretrained (ImageNet)')
        model = models.resnet50(pretrained=True)
        model.eval()
        MODEL = model
        SOURCE = 'resnet50-imagenet'
        # ensure we have imagenet labels available when using the fallback
        if LABELS is None:
            load_imagenet_labels()
        return MODEL
    except Exception as e:
        print('Failed to load torchvision model:', e)
        MODEL = None
        SOURCE = 'none'
        return None

def preprocess_image(file_bytes):
    from torchvision import transforms
    img = Image.open(io.BytesIO(file_bytes)).convert('RGB')
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])
    return preprocess(img).unsqueeze(0)

@app.route('/predict', methods=['POST'])
def predict():
    model = load_model()
    if model is None:
        return jsonify({
            'success': False,
            'error': 'No model available',
        }), 500

    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image field provided'}), 400
    f = request.files['image']
    img_bytes = f.read()
    try:
        import torch
        tensor = preprocess_image(img_bytes)
        with torch.no_grad():
            out = model(tensor)
            probs = torch.nn.functional.softmax(out[0], dim=0)
            top_prob, top_catid = torch.topk(probs, 1)
            labels = load_imagenet_labels()
            label = labels[top_catid.item()] if labels and len(labels) > top_catid.item() else str(top_catid.item())
            return jsonify({
                'success': True,
                'disease': label,
                'confidence': float(top_prob.item()),
                'source': SOURCE,
            })
    except Exception as e:
        print('Prediction error:', e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/detect-crop-disease', methods=['POST'])
def legacy_detect():
    # same behavior as /predict but kept for compatibility
    return predict()

if __name__ == '__main__':
    # Helpful startup log and environment-aware binding so the service can
    # be run inside containers or on hosts where 0.0.0.0 is required.
    host = os.environ.get('ML_HOST', os.environ.get('HOST', '0.0.0.0'))
    port = int(os.environ.get('ML_PORT', os.environ.get('PORT', '5001')))
    api_key = os.environ.get('ML_API_KEY')

    # If an API key is set, enforce it on incoming requests to prevent abuse.
    if api_key:
        @app.before_request
        def check_api_key():
            # Allow health checks without API key
            if request.path == '/health':
                return None
            header = request.headers.get('X-API-KEY') or request.headers.get('x-api-key')
            if not header or header != api_key:
                return jsonify({'success': False, 'error': 'Unauthorized (invalid API key)'}), 401

    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({'status': 'ok', 'model_loaded': MODEL is not None, 'source': SOURCE, 'time': __import__('datetime').datetime.utcnow().isoformat()})

    print(f'Starting ML scaffold on http://{host}:{port} (MODEL_PATH={os.environ.get("MODEL_PATH")})')
    load_model()
    app.run(host=host, port=port)
