#!/usr/bin/env node
/**
 * Easy Tracker — Redmine CORS Proxy
 * Runs on http://localhost:3001
 * Forwards requests to http://svn.aps1aws.lumiq.int
 * No npm install needed — uses built-in Node.js modules only
 *
 * Usage:  node redmine-proxy.js
 * Stop:   Ctrl+C
 */

const http  = require('http');
const https = require('https');

const PROXY_PORT    = 3001;
const REDMINE_HOST  = 'svn.aps1aws.lumiq.int';
const REDMINE_PORT  = 80;
const REDMINE_PROTO = 'http';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Redmine-API-Key, Authorization',
};

const server = http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // Log incoming request
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

  // Collect request body
  let body = [];
  req.on('data', chunk => body.push(chunk));
  req.on('end', () => {
    body = Buffer.concat(body);

    const options = {
      hostname: REDMINE_HOST,
      port:     REDMINE_PORT,
      path:     req.url,
      method:   req.method,
      headers:  { ...req.headers, host: REDMINE_HOST },
    };

    // Remove browser-only headers Redmine doesn't need
    delete options.headers['origin'];
    delete options.headers['referer'];

    const transport = REDMINE_PROTO === 'https' ? https : http;

    const proxyReq = transport.request(options, proxyRes => {
      const responseHeaders = { ...proxyRes.headers, ...CORS_HEADERS };
      res.writeHead(proxyRes.statusCode, responseHeaders);
      proxyRes.pipe(res, { end: true });
      console.log(`  → Redmine: ${proxyRes.statusCode}`);
    });

    proxyReq.on('error', err => {
      console.error('  ✗ Proxy error:', err.message);
      res.writeHead(502, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy error: ' + err.message }));
    });

    if (body.length > 0) proxyReq.write(body);
    proxyReq.end();
  });
});

server.listen(PROXY_PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  ⚡ Easy Tracker — Redmine CORS Proxy');
  console.log('  ─────────────────────────────────────');
  console.log(`  Proxy   : http://localhost:${PROXY_PORT}`);
  console.log(`  Redmine : ${REDMINE_PROTO}://${REDMINE_HOST}`);
  console.log('');
  console.log('  Keep this terminal open while using Easy Tracker.');
  console.log('  Press Ctrl+C to stop.');
  console.log('');
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  ✗ Port ${PROXY_PORT} already in use. Stop it or change PROXY_PORT.\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
