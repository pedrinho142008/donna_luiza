'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

function safeFilePath(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split('?')[0]);
  } catch {
    return null;
  }
  if (pathname === '/') pathname = '/index.html';
  const resolved = path.resolve(PUBLIC_DIR, `.${pathname}`);
  if (resolved !== PUBLIC_DIR && !resolved.startsWith(PUBLIC_DIR + path.sep)) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', 'Allow': 'GET, HEAD' });
    return res.end('Método não permitido.');
  }

  const filePath = safeFilePath(req.url || '/');
  if (!filePath) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Endereço inválido.');
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Página ou arquivo não encontrado.');
    }

    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[extension] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=3600'
    });

    if (req.method === 'HEAD') return res.end();
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) res.writeHead(500);
      res.end('Não foi possível ler o arquivo.');
    });
    stream.pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log('\n  DONNA LUIZA · SITE LOCAL');
  console.log(`  Abra no navegador: http://127.0.0.1:${PORT}`);
  console.log(`  Escutando em: ${HOST}:${PORT}`);
  console.log('  Para encerrar: Ctrl + C\n');
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 1500).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
