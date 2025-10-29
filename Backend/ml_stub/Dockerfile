FROM python:3.10-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libjpeg-dev \
        zlib1g-dev \
        libpng-dev \
        wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy ML app
COPY . /app

EXPOSE 5001

# Run the Flask app. The app listens on 127.0.0.1:5001 by default in dev,
# but when running in container we want it reachable on 0.0.0.0.
ENV FLASK_RUN_HOST=0.0.0.0

CMD ["python", "app.py"]
