// Servidor local mínimo (só para visualizar o site). Uso: node servidor.js [porta]
const http = require('http');
const fs = require('fs');
const path = require('path');

const porta = Number(process.argv[2]) || 8000;
const raiz = __dirname;
const tipos = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.json': 'application/json', '.ico': 'image/x-icon',
};

http.createServer(function (req, res) {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const arquivo = path.join(raiz, path.normalize(rel));
  if (!arquivo.startsWith(raiz)) { res.writeHead(403); return res.end(); }
  fs.readFile(arquivo, function (err, dados) {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Não encontrado'); }
    res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(dados);
  });
}).listen(porta, function () { console.log('Site no ar em http://localhost:' + porta + '  (Ctrl+C para parar)'); });
