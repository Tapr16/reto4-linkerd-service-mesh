// App de demostración del Reto 4: responde qué versión atendió la petición.
// La misma imagen se construye dos veces (v1 y v2) cambiando APP_VERSION.
const http = require('http');
const os = require('os');

const VERSION = process.env.APP_VERSION || 'v1';
const PORT = Number(process.env.PORT || 8080);
const MENSAJES = {
  v1: 'Version estable',
  v2: 'Nueva version (feature flag activo)',
};

http
  .createServer((req, res) => {
    if (req.url === '/healthz') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end('ok');
    }

    const body = {
      version: VERSION,
      mensaje: MENSAJES[VERSION] || VERSION,
      pod: os.hostname(),
      path: req.url,
      cabeceras: {
        'x-feature-flag': req.headers['x-feature-flag'] || null,
        'user-agent': req.headers['user-agent'] || null,
      },
    };

    console.log(`[${VERSION}] ${req.method} ${req.url} x-feature-flag=${body.cabeceras['x-feature-flag']}`);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'X-App-Version': VERSION,
    });
    res.end(JSON.stringify(body, null, 2) + '\n');
  })
  .listen(PORT, () => console.log(`app ${VERSION} escuchando en :${PORT}`));
