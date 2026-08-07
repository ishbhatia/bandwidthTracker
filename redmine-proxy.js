#!/usr/bin/env node
/**
 * Easy Tracker — Redmine CORS Proxy
 * Runs on http://localhost:3001
 * Forwards to http://svn.aps1aws.lumiq.int
 * No npm install needed — built-in Node.js only
 */

const http = require('http');

const PROXY_PORT   = 3001;
const REDMINE_HOST = 'svn.aps1aws.lumiq.int';
const REDMINE_PORT = 80;

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

  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

  let body = [];
  req.on('data', chunk => body.push(chunk));
  req.on('end', () => {
    body = Buffer.concat(body);

    // Build clean headers — only pass what Redmine needs
    const headers = {
      'host':               REDMINE_HOST,
      'content-type':       req.headers['content-type'] || 'application/json',
      'x-redmine-api-key':  req.headers['x-redmine-api-key'] || '',
    };
    if (body.length > 0) headers['content-length'] = body.length;

    const options = {
      hostname: REDMINE_HOST,
      port:     REDMINE_PORT,
      path:     req.url,
      method:   req.method,
      headers,
    };

    const proxyReq = http.request(options, proxyRes => {
      const status = proxyRes.statusCode;
      console.log(`  → Redmine: ${status}`);

      const responseHeaders = { ...proxyRes.headers, ...CORS_HEADERS };
      // Remove transfer-encoding to avoid issues
      delete responseHeaders['transfer-encoding'];

      res.writeHead(status, responseHeaders);
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
  console.log('  ⚡ Easy Tracker — Redmine CORS Proxy');
  console.log('  ─────────────────────────────────────');
  console.log(`  Proxy   : http://localhost:${PROXY_PORT}`);
  console.log(`  Redmine : http://${REDMINE_HOST}`);
  console.log('');
  console.log('  Keep this terminal open while using Easy Tracker.');
  console.log('  Press Ctrl+C to stop.');
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
