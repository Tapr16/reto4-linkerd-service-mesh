// Convierte la salida de terminal guardada en un .txt en una captura PNG
// con aspecto de consola, usando Chrome en modo headless.
// Uso: node tools/capturar.js <entrada.txt> <salida.png> "<título>"
//      node tools/capturar.js --url <url> <salida.png> [ancho] [alto]
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const NAVEGADOR = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function capturar(url, salida, ancho, alto, espera = 3000) {
  // Perfil aparte para no chocar con un Chrome que ya esté abierto; Chrome escribe
  // la captura en una ruta local y luego se copia (las unidades de red fallan).
  const perfil = path.join(os.tmpdir(), 'reto4-chrome-perfil');
  const tmpPng = path.join(os.tmpdir(), `captura-${Date.now()}.png`);
  execFileSync(NAVEGADOR, [
    '--headless=new',
    `--user-data-dir=${perfil}`,
    '--no-first-run',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1.5',
    `--window-size=${ancho},${alto}`,
    `--virtual-time-budget=${espera}`,
    `--screenshot=${tmpPng}`,
    url,
  ], { stdio: 'ignore' });
  fs.copyFileSync(tmpPng, salida);
  fs.unlinkSync(tmpPng);
  console.log('captura:', salida);
}

function escapar(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function colorear(linea) {
  const l = escapar(linea);
  if (/^\$ /.test(linea)) return `<span class="cmd">${l}</span>`;
  if (/^==> |^# /.test(linea)) return `<span class="titulo">${l}</span>`;
  return l
    .replace(/\bv2(?=[\s",=:]|$)/g, '<span class="v2">v2</span>')
    .replace(/\bv1(?=[\s",=:]|$)/g, '<span class="v1">v1</span>')
    .replace(/(√|100\.00%|status: &quot;True&quot;|tls=true)/g, '<span class="ok">$1</span>');
}

const [, , a1, a2, a3, a4, a5] = process.argv;

if (a1 === '--url') {
  capturar(a2, a3, Number(a4 || 1400), Number(a5 || 900), 10000);
} else {
  const texto = fs
    .readFileSync(a1, 'utf8')
    .replace(/\x1b\[[0-9;]*m/g, '')
    .replace(/\r/g, '')
    .replace(/\n+$/, '');
  const lineas = texto.split('\n');
  const ancho = Math.max(900, Math.min(1500, Math.max(...lineas.map((l) => l.length)) * 7.6 + 50));
  const alto = lineas.length * 18 + 62;
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;background:#1e1e2e;font:13.5px/18px Consolas,'Cascadia Mono',monospace;color:#cdd6f4}
    .barra{background:#313244;padding:7px 12px;color:#bac2de;font-family:Segoe UI,sans-serif;font-size:13px}
    .barra b{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:6px;vertical-align:-1px}
    pre{margin:0;padding:12px 16px;white-space:pre}
    .cmd{color:#a6e3a1;font-weight:bold}.titulo{color:#89dceb;font-weight:bold}
    .v1{color:#89b4fa;font-weight:bold}.v2{color:#fab387;font-weight:bold}.ok{color:#a6e3a1}
  </style><div class="barra"><b style="background:#f38ba8"></b><b style="background:#f9e2af"></b><b style="background:#a6e3a1"></b>&nbsp;${escapar(a3 || '')}</div>
  <pre>${lineas.map(colorear).join('\n')}</pre>`;
  const tmp = path.join(os.tmpdir(), `captura-${Date.now()}.html`);
  fs.writeFileSync(tmp, html);
  capturar('file:///' + tmp.replace(/\\/g, '/'), a2, Math.round(ancho), alto, 500);
  fs.unlinkSync(tmp);
}
