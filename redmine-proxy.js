#!/usr/bin/env node
/**
 * Easy Tracker — Redmine CORS Proxy + Controller
 * Runs on http://localhost:3001
 * Forwards to http://svn.aps1aws.lumiq.int
 *
 * Control endpoints (called by the browser via fetch — no Chrome tab):
 *   GET /__status   → { enabled: true|false }
 *   GET /__enable   → turns forwarding ON
 *   GET /__disable  → turns forwarding OFF
 *
 * No npm install needed — built-in Node.js only.
 * Start:  node redmine-proxy.js   (or double-click StartRedmineProxy.command)
 */

const http = require('http');

const PROXY_PORT   = 3001;
const REDMINE_HOST = 'svn.aps1aws.lumiq.int';
const REDMINE_PORT = 80;

let enabled = true; // forwarding ON by default when proxy starts

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Redmine-API-Key, Authorization',
  'Access-Control-Max-Age': '86400',
};

const server = http.createServer((req, res) => {

  // ── Preflight ──────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  // ── Control endpoints (browser calls these via fetch) ───
  if (req.url === '/__status' || req.url === '/__enable' || req.url === '/__disable') {
    if (req.url === '/__enable')  { enabled = true;  console.log('  ✅ Forwarding ENABLED'); }
    if (req.url === '/__disable') { enabled = false; console.log('  🛑 Forwarding DISABLED'); }
    res.writeHead(200, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ enabled }));
    return;
  }

  // ── If disabled, reject forwarding ──────────────────────
  if (!enabled) {
    res.writeHead(503, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy is OFF — turn it ON in Easy Tracker header' }));
    return;
  }

  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

  let body = [];
  req.on('data', chunk => body.push(chunk));
  req.on('end', () => {
    body = Buffer.concat(body);

    const headers = {
      'host':              REDMINE_HOST,
      'content-type':      req.headers['content-type'] || 'application/json',
      'x-redmine-api-key': req.headers['x-redmine-api-key'] || '',
    };
    if (body.length > 0) headers['content-length'] = body.length;

    const options = { hostname: REDMINE_HOST, port: REDMINE_PORT, path: req.url, method: req.method, headers };

    const proxyReq = http.request(options, proxyRes => {
      console.log(`  → Redmine: ${proxyRes.statusCode}`);
      const responseHeaders = { ...proxyRes.headers, ...CORS_HEADERS };
      delete responseHeaders['transfer-encoding'];
      res.writeHead(proxyRes.statusCode, responseHeaders);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', err => {
      console.error('  ✗ Error:', err.message);
      res.writeHead(502, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });

    if (body.length > 0) proxyReq.write(body);
    proxyReq.end();
  });
});

server.listen(PROXY_PORT, '127.0.0.1', () => {
  console.log('');
  console.log('  ⚡ Easy Tracker — Redmine Proxy + Controller');
  console.log('  ────────────────────────────────────────────');
  console.log(`  Proxy   : http://localhost:${PROXY_PORT}`);
  console.log(`  Redmine : http://${REDMINE_HOST}`);
  console.log(`  Status  : Forwarding ${enabled ? 'ENABLED' : 'DISABLED'}`);
  console.log('');
  console.log('  Toggle ON/OFF from the Easy Tracker header — no need to touch this window.');
  console.log('  Press Ctrl+C to fully stop.');
  console.log('');
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  ✗ Port ${PROXY_PORT} already in use.\n  Run: lsof -ti:${PROXY_PORT} | xargs kill -9\n`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
