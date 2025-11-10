const http = require('http');

const data = JSON.stringify({ email: 'inspector@example.com', password: 'x' });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/users/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
  timeout: 5000,
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    try {
      const parsed = JSON.parse(body);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log('Non-JSON response:');
      console.log(body);
    }
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('Request error:', err && err.message ? err.message : err);
  process.exit(2);
});

req.write(data);
req.end();
