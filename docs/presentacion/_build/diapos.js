// Genera docs/presentacion/Presentacion-Reto4-Linkerd.pptx
// Uso: PPTX_SKILL=<carpeta del skill pptx> node diapos.js
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");

const DOCS = path.resolve(__dirname, "..", "..");
const DG = (f) => path.join(DOCS, "presentacion", "diagramas", f);
const RC = (f) => path.join(DOCS, "presentacion", "recortes", f);
const CAP = (f) => path.join(DOCS, "capturas", f);
const OUT = path.join(DOCS, "presentacion", "Presentacion-Reto4-Linkerd.pptx");

const THEME = {
  name: "Service Mesh Linkerd",
  headFontFace: "Arial",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1F2A37", lt1: "FFFFFF", dk2: "2B3A4B", lt2: "F3F5F8",
    accent1: "0B8A8F", accent2: "2563EB", accent3: "F26B1D", accent4: "7C3AED",
    accent5: "326CE5", accent6: "D4A72C", hlink: "2563EB", folHlink: "6B7280",
  },
};
// Colores en hex para opciones que no aceptan colores del tema
const HEX = { dark: "1F2A37", teal: "0B8A8F", tint: "DDF3F3", light: "F3F5F8", muted: "5B6675", code: "17202B", v1: "2563EB", v2: "F26B1D", red: "9B2C2C" };
const CHIP = { Kubernetes: "326CE5", Linkerd: "0B8A8F", "Gateway API": "7C3AED", kind: "5B6675" };

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Enrutamiento inteligente con Service Mesh (Linkerd)";
const C = pres.SchemeColor;

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "PORTADA",
  background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.2, w: 8.8, h: 1.9, fontSize: 34, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 3.3, w: 8.8, h: 0.8, fontSize: 16, color: "7FE3D9", valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENIDO",
  background: { color: C.background1 },
  slideNumber: { x: 9.2, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: "8A94A3" },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.25, w: 9.0, h: 0.75, fontSize: 28, bold: true, color: C.text1, valign: "middle", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CIERRE",
  background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.5, y: 0.35, w: 9.0, h: 0.8, fontSize: 32, bold: true, color: C.background1, valign: "middle", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.5, y: 1.4, w: 9.0, h: 3.7, fontSize: 18, color: C.background1, valign: "top" }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "SECCION",
  background: { color: C.accent1 },
  slideNumber: { x: 9.2, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: "FFFFFF" },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 1.9, w: 8.8, h: 1.1, fontSize: 40, bold: true, color: C.background1, valign: "middle", align: "left", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "body", type: "body", x: 0.6, y: 3.0, w: 8.8, h: 0.8, fontSize: 18, color: C.background1, valign: "top", margin: 0 }, text: "" } },
  ],
});

// ---------- helpers ----------
let sec = "";
function slide(master, title, section) {
  if (section && section !== sec) { pres.addSection({ title: section }); sec = section; }
  const s = pres.addSlide({ masterName: master, sectionTitle: sec });
  if (title) s.addText(title, { placeholder: "title" });
  return s;
}
function text(s, t, o) { s.addText(t, { isTextBox: true, fontSize: 14, color: C.text1, valign: "top", ...o }); }
function bullets(s, items, o) {
  s.addText(items.map((it, i) => {
    const runs = typeof it === "string" ? { text: it, options: {} } : it;
    return { text: runs.text, options: { bullet: { indent: 14 }, breakLine: i < items.length - 1, ...runs.options } };
  }), { isTextBox: true, fontSize: 14, color: C.text1, valign: "top", paraSpaceAfter: 6, ...o });
}
function code(s, src, o) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: o.x, y: o.y, w: o.w, h: o.h, fill: { color: HEX.code }, line: { type: "none" }, rectRadius: 0.08, objectName: "fondo-codigo" });
  if (o.label) text(s, o.label, { x: o.x + 0.15, y: o.y + 0.08, w: o.w - 0.3, h: 0.25, fontSize: 10, color: "7FE3D9", bold: true, margin: 0 });
  const top = o.label ? 0.35 : 0.12;
  s.addText(src, { isTextBox: true, x: o.x + 0.15, y: o.y + top, w: o.w - 0.3, h: o.h - top - 0.1, fontFace: "Consolas", fontSize: o.fs || 10, color: "E6EDF3", valign: "top", margin: 0, objectName: "codigo" });
}
function card(s, x, y, w, h, fill, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, fill: { color: fill }, line: opts.line ? { color: opts.line, width: 1 } : { type: "none" }, rectRadius: 0.1,
    shadow: opts.shadow ? { type: "outer", color: "000000", opacity: 0.12, blur: 6, offset: 2, angle: 90 } : undefined, objectName: opts.name || "tarjeta" });
}
function badge(s, x, y, n, color = C.accent1) {
  s.addShape(pres.shapes.OVAL, { x, y, w: 0.42, h: 0.42, fill: { color }, line: { type: "none" }, objectName: "numero" });
  s.addText(String(n), { isTextBox: true, x, y, w: 0.42, h: 0.42, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0 });
}
function img(s, file, x, y, maxW, maxH, pxW, pxH, alt) {
  const r = Math.min(maxW / pxW, maxH / pxH);
  const w = pxW * r, h = pxH * r;
  s.addImage({ path: file, x: x + (maxW - w) / 2, y: y + (maxH - h) / 2, w, h, altText: alt });
}
function caption(s, t, x, y, w) { text(s, t, { x, y, w, h: 0.3, fontSize: 10, color: HEX.muted, italic: true, align: "center", margin: 0 }); }
const H = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: HEX.dark } } });

// =========================================================
// 1. Portada
let s = slide("PORTADA", "Enrutamiento inteligente\ncon Service Mesh", "Inicio");
s.addText("Ruteo por cabeceras HTTP con Linkerd sobre Kubernetes · Reto 4", { placeholder: "body" });
Object.keys(CHIP).forEach((l, i) => {
  card(s, 0.6 + i * 1.35, 4.45, 1.2, 0.4, CHIP[l], { name: "chip-tecnologia" });
  text(s, l, { x: 0.6 + i * 1.35, y: 4.45, w: 1.2, h: 0.4, fontSize: 12, bold: true, color: C.background1, align: "center", valign: "middle", margin: 0 });
});
text(s, "Principios y Prácticas de Desarrollo de Software Orientado a Objetos", { x: 0.6, y: 0.5, w: 8.8, h: 0.4, fontSize: 13, color: "AAB4C3", margin: 0 });
text(s, [
  { text: "David Esteban Suarez Lozano · 2221909", options: { breakLine: true } },
  { text: "Thomas Alejandro Perez Rojas · 2221906", options: { breakLine: true } },
  { text: "Jesus David Santodomingo Carrascal · 2221922", options: {} },
], { x: 5.6, y: 4.2, w: 3.9, h: 0.9, fontSize: 12, color: "D5DAE1", align: "right", valign: "bottom", margin: 0, objectName: "integrantes" });
s.addNotes("Presentamos el Reto 4: usar un Service Mesh, en nuestro caso Linkerd, para decidir a qué versión de una aplicación va cada petición según una cabecera HTTP, sin tocar el código de la aplicación.");

// 2. Agenda
s = slide("CONTENIDO", "Agenda", "Inicio");
[
  ["Contexto", "El problema y lo que pide el reto"],
  ["Service Mesh", "Cómo funciona Linkerd y por qué HTTPRoute"],
  ["Arquitectura", "Qué desplegamos en el clúster"],
  ["Implementación", "Scripts, app y regla de ruteo"],
  ["Pruebas", "curl con y sin cabecera"],
  ["Observabilidad", "Métricas, mTLS y experimentos"],
].forEach(([t, d], i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = 0.5 + col * 3.05, y = 1.35 + row * 1.85;
  card(s, x, y, 2.85, 1.55, HEX.light, { shadow: true });
  badge(s, x + 0.2, y + 0.22, i + 1);
  text(s, t, { x: x + 0.75, y: y + 0.2, w: 2.0, h: 0.45, fontSize: 17, bold: true, valign: "middle", margin: 0 });
  text(s, d, { x: x + 0.2, y: y + 0.8, w: 2.5, h: 0.6, fontSize: 13, color: HEX.muted, margin: 0 });
});

// =========================================================
// 3. Contexto
s = slide("SECCION", "1 · Contexto", "Contexto");
s.addText("Controlar el tráfico entre versiones de un microservicio", { placeholder: "body" });

s = slide("CONTENIDO", "El problema", "Contexto");
[["Pruebas A/B", "Mostrar una variante solo a un grupo de usuarios"],
 ["Canary", "Liberar una versión nueva a una fracción del tráfico"],
 ["Feature flags", "Activar una funcionalidad con una cabecera"],
 ["Seguridad y métricas", "mTLS y observabilidad entre servicios"]].forEach(([t, d], i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.5 + col * 2.6, y = 1.2 + row * 1.85;
  card(s, x, y, 2.4, 1.6, HEX.light, { shadow: true });
  badge(s, x + 0.2, y + 0.2, i + 1);
  text(s, t, { x: x + 0.75, y: y + 0.18, w: 1.6, h: 0.5, fontSize: 15, bold: true, valign: "middle", margin: 0 });
  text(s, d, { x: x + 0.2, y: y + 0.8, w: 2.05, h: 0.7, fontSize: 12, color: HEX.muted, margin: 0 });
});
card(s, 5.85, 1.2, 3.65, 3.45, HEX.tint);
text(s, "OBJETIVO DEL RETO", { x: 6.05, y: 1.32, w: 3.3, h: 0.3, fontSize: 11, bold: true, color: HEX.teal, margin: 0, charSpacing: 2 });
s.addTable([
  [H("Petición"), H("Versión")],
  ["X-Feature-Flag: new-version", { text: "v2", options: { bold: true, color: HEX.v2 } }],
  ["User-Agent: experimental", { text: "v2", options: { bold: true, color: HEX.v2 } }],
  ["Sin cabecera u otro valor", { text: "v1", options: { bold: true, color: HEX.v1 } }],
], { x: 6.05, y: 1.75, w: 3.25, colW: [2.45, 0.8], fontSize: 11, color: HEX.dark, fill: { color: "FFFFFF" }, border: { type: "solid", color: "D5DAE1", pt: 0.75 }, rowH: 0.36, fontFace: "Calibri" });
text(s, "…sin modificar el código de la aplicación", { x: 6.05, y: 3.45, w: 3.3, h: 0.9, fontSize: 15, bold: true, color: HEX.teal, margin: 0 });
s.addNotes("En microservicios queremos hacer pruebas A/B, canaries o feature flags. El reto pide que una cabecera HTTP decida la versión: con X-Feature-Flag new-version o User-Agent experimental se va a v2, y todo lo demás a v1. La condición clave es no tocar el código.");

s = slide("CONTENIDO", "Lo que pide el reto y cómo lo cumplimos", "Contexto");
s.addTable([
  [H("Requisito del enunciado"), H("Cómo lo resolvimos")],
  ["App desplegada en Kubernetes con un Service Mesh", "Clúster kind + Linkerd edge-26.10.1"],
  ["Reglas de ruteo con CRDs del mesh", "HTTPRoute (Gateway API) web-por-cabecera"],
  ["Cabecera → versión específica", "x-feature-flag / user-agent → web-v2"],
  ["Lo demás → versión estable", "Regla por defecto → web-v1"],
  ["Verificar con curl o Postman", "Script de 100 peticiones + colección Postman"],
  ["Explorar la observabilidad del mesh", "viz stat, stat-outbound, edges, tap, dashboard"],
  ["Discutir Service Mesh vs Ingress", "Comparación al cierre"],
], { x: 0.5, y: 1.2, w: 9.0, colW: [4.3, 4.7], fontSize: 13, color: HEX.dark, border: { type: "solid", color: "D5DAE1", pt: 0.75 }, rowH: 0.44, fontFace: "Calibri", valign: "middle" });

// =========================================================
// 4. Service Mesh
s = slide("SECCION", "2 · Service Mesh y Linkerd", "Service Mesh");
s.addText("Una capa de red transparente para la aplicación", { placeholder: "body" });

s = slide("CONTENIDO", "Cómo funciona Linkerd", "Service Mesh");
img(s, DG("sidecar.png"), 0.5, 1.05, 9.0, 2.75, 1784, 646, "Control plane de Linkerd y dos pods con su linkerd-proxy conectados por mTLS");
[["Inyección", "Anotación linkerd.io/inject: enabled → cada pod recibe linkerd-init y linkerd-proxy (sidecar nativo)"],
 ["Proxy en Rust", "Intercepta el tráfico con iptables; la app sigue hablando HTTP normal"],
 ["mTLS + métricas", "Cifra pod a pod con identidad propia y mide éxito, RPS y latencia"]].forEach(([t, d], i) => {
  const x = 0.5 + i * 3.05;
  card(s, x, 3.95, 2.85, 1.15, HEX.light);
  text(s, t, { x: x + 0.15, y: 4.02, w: 2.55, h: 0.32, fontSize: 14, bold: true, color: HEX.teal, margin: 0 });
  text(s, d, { x: x + 0.15, y: 4.35, w: 2.6, h: 0.72, fontSize: 11, color: HEX.dark, margin: 0 });
});
s.addNotes("Linkerd tiene un plano de control y un plano de datos. El proxy-injector agrega a cada pod un linkerd-proxy escrito en Rust. Ese proxy intercepta todo el tráfico: en la salida aplica las rutas que le da destination, y entre proxies todo viaja con mTLS usando los certificados de identity. La app no se entera.");

s = slide("CONTENIDO", "HTTPRoute en lugar de TrafficSplit", "Service Mesh");
[["TrafficSplit + ServiceProfile", "SMI (deprecado en Linkerd)", HEX.red, ["Solo reparte tráfico por pesos", "No puede leer cabeceras", "Especificación SMI archivada"]],
 ["HTTPRoute", "Gateway API · GAMMA (recomendado)", HEX.teal, ["matches por cabecera, ruta, método o query", "Pesos para canary en la misma regla", "Estándar de Kubernetes: sirve también en Istio"]]].forEach(([t, sub, col, items], i) => {
  const x = 0.5 + i * 4.6;
  card(s, x, 1.2, 4.4, 2.75, HEX.light, { line: col });
  text(s, t, { x: x + 0.25, y: 1.32, w: 3.9, h: 0.42, fontSize: 18, bold: true, color: col, margin: 0 });
  text(s, sub, { x: x + 0.25, y: 1.75, w: 3.9, h: 0.3, fontSize: 12, color: HEX.muted, margin: 0 });
  bullets(s, items.map((p) => ({ text: (i ? "+ " : "– ") + p, options: { bullet: false } })), { x: x + 0.25, y: 2.2, w: 3.95, h: 1.6, fontSize: 14, paraSpaceAfter: 6, margin: 0 });
});
card(s, 0.5, 4.15, 9.0, 0.85, HEX.tint);
text(s, "El enunciado menciona TrafficSplit/ServiceProfile; usamos su reemplazo oficial: el parentRef de la ruta es un Service, no un Gateway", { x: 0.7, y: 4.2, w: 8.6, h: 0.75, fontSize: 14, bold: true, color: HEX.dark, valign: "middle", margin: 0 });
s.addNotes("El enunciado menciona TrafficSplit y ServiceProfile, pero en Linkerd actual SMI está deprecado. Su reemplazo es HTTPRoute de Gateway API en modo GAMMA, donde la ruta cuelga de un Service. Además TrafficSplit solo repartía por pesos; HTTPRoute permite condiciones por cabecera, que es justo lo que pide el reto.");

s = slide("CONTENIDO", "El ruteo ocurre en el proxy cliente", "Service Mesh");
img(s, DG("proxy-cliente.png"), 0.4, 1.1, 5.4, 3.9, 1454, 701, "Comparación: dentro de la malla la cabecera lleva a v2; fuera de la malla siempre a v1");
bullets(s, [
  "Linkerd aplica el HTTPRoute en el proxy de quien envía la petición",
  "Una petición que no sale por un linkerd-proxy no se enruta",
  "Por eso pusimos un gateway nginx dentro de la malla como entrada desde el PC",
  { text: "Lo comprobamos: por port-forward, 5/5 respuestas fueron v1 aun con la cabecera", options: { bold: true, color: HEX.teal } },
], { x: 6.0, y: 1.25, w: 3.5, h: 3.8, fontSize: 14 });
s.addNotes("Este fue el hallazgo más importante. En Linkerd la decisión de ruteo la toma el proxy del cliente. Si llamamos al servicio desde fuera de la malla, nadie aplica la regla y siempre responde v1. Por eso el punto de entrada es un nginx mallado.");

// =========================================================
// 5. Arquitectura
s = slide("SECCION", "3 · Arquitectura", "Arquitectura");
s.addText("Qué desplegamos en el clúster", { placeholder: "body" });

s = slide("CONTENIDO", "Arquitectura de la solución", "Arquitectura");
img(s, DG("arquitectura.png"), 0.4, 1.0, 3.9, 4.2, 1092, 1296, "Arquitectura: PC → gateway mallado → Service web → HTTPRoute → web-v1 o web-v2");
[["gateway", "nginx mallado: entrada desde el PC por localhost:8080", HEX.teal],
 ["Service web", "Nombre que usan los clientes; su selector apunta solo a v1", HEX.dark],
 ["HTTPRoute", "Decide v1 o v2 según la cabecera", "B7791F"],
 ["web-v1 / web-v2", "Misma imagen con APP_VERSION distinto (2 y 1 réplicas)", HEX.v2],
 ["client", "Pod mallado con curl para pruebas internas", HEX.muted]].forEach(([t, d, col], i) => {
  const y = 1.1 + i * 0.82;
  card(s, 4.6, y, 4.9, 0.7, HEX.light);
  badge(s, 4.75, y + 0.14, i + 1, col);
  text(s, t, { x: 5.3, y: y + 0.06, w: 4.1, h: 0.3, fontSize: 14, bold: true, margin: 0 });
  text(s, d, { x: 5.3, y: y + 0.36, w: 4.1, h: 0.3, fontSize: 12, color: HEX.muted, margin: 0 });
});
s.addNotes("Todo vive en el namespace reto4, que tiene la inyección automática activada. Desde el PC entramos por el puerto 8080 al gateway. El gateway pide el Service web y su proxy aplica el HTTPRoute: con la cabecera va a web-v2, sin ella a web-v1.");

s = slide("CONTENIDO", "Services: seguro por defecto", "Arquitectura");
code(s, `apiVersion: v1
kind: Service
metadata: { name: web, namespace: reto4 }
spec:
  selector: { app: web, version: v1 }  # solo v1
  ports: [{ port: 80, targetPort: http }]
---
# backends que referencia el HTTPRoute
kind: Service
metadata: { name: web-v1 }
spec: { selector: { app: web, version: v1 } }
---
kind: Service
metadata: { name: web-v2 }
spec: { selector: { app: web, version: v2 } }`, { x: 0.5, y: 1.2, w: 5.2, h: 3.75, fs: 11, label: "k8s/20-services.yaml (resumido)" });
[["Un nombre estable", "Los clientes siempre llaman a web; no saben que hay versiones"],
 ["Un Service por versión", "web-v1 y web-v2 son los destinos de la ruta"],
 ["Falla segura", "Si se borra el HTTPRoute, todo vuelve a v1"]].forEach(([t, d], i) => {
  const y = 1.3 + i * 1.2;
  badge(s, 6.0, y, i + 1);
  text(s, t, { x: 6.55, y: y - 0.02, w: 3.0, h: 0.35, fontSize: 14, bold: true, margin: 0 });
  text(s, d, { x: 6.55, y: y + 0.33, w: 3.0, h: 0.6, fontSize: 12, color: HEX.muted, margin: 0 });
});

// =========================================================
// 6. Implementación
s = slide("SECCION", "4 · Implementación", "Implementación");
s.addText("De cero a ruteo por cabeceras con scripts", { placeholder: "body" });

s = slide("CONTENIDO", "Entorno y herramientas", "Implementación");
s.addTable([
  [H("Componente"), H("Versión")],
  ["Docker Desktop · Windows 11", "29.9.1"],
  ["kind (nodo kindest/node)", "0.33.0 · K8s 1.37.0"],
  ["kubectl", "1.36.1"],
  ["Linkerd + viz", "edge-26.10.1"],
  ["Gateway API CRDs", "v1.2.1 standard"],
  ["Node.js / nginx / curl", "22 / 1.27 / 8.11"],
], { x: 0.5, y: 1.2, w: 3.7, colW: [2.2, 1.5], fontSize: 11.5, color: HEX.dark, border: { type: "solid", color: "D5DAE1", pt: 0.75 }, rowH: 0.42, fontFace: "Calibri", valign: "middle" });
img(s, CAP("02-linkerd-check.png"), 4.4, 1.2, 5.1, 3.3, 1350, 633, "linkerd check: todas las verificaciones en verde");
caption(s, "linkerd check: 57 verificaciones en verde", 4.4, 4.1, 5.1);

s = slide("CONTENIDO", "Paso a paso", "Implementación");
[["Clúster", "kind con el puerto 8080 publicado"],
 ["Linkerd", "Gateway API CRDs, control plane y viz"],
 ["App", "Build v1/v2, kind load y manifiestos"],
 ["Ruta", "kubectl apply del HTTPRoute"],
 ["Pruebas", "20 peticiones por caso y conteo"]].forEach(([t, d], i) => {
  const x = 0.5 + i * 1.84;
  card(s, x, 1.3, 1.66, 1.75, HEX.light, { shadow: true });
  badge(s, x + 0.62, 1.12, i + 1);
  text(s, t, { x: x + 0.1, y: 1.65, w: 1.46, h: 0.4, fontSize: 14, bold: true, align: "center", margin: 0 });
  text(s, d, { x: x + 0.12, y: 2.08, w: 1.42, h: 0.9, fontSize: 11, color: HEX.muted, align: "center", margin: 0 });
});
code(s, `scripts/01-crear-cluster.sh       scripts/04-aplicar-rutas.sh header
scripts/02-instalar-linkerd.sh    scripts/05-probar.sh 20
scripts/03-desplegar-app.sh       scripts/06-observabilidad.sh`, { x: 0.5, y: 3.35, w: 9.0, h: 1.05, fs: 12, label: "Git Bash · raíz del repositorio" });
text(s, "Todo es reproducible: scripts/99-limpiar.sh borra el clúster y se vuelve a levantar en ~10 minutos", { x: 0.5, y: 4.55, w: 9.0, h: 0.45, fontSize: 14, bold: true, color: HEX.teal, margin: 0 });
s.addNotes("Automatizamos todo con scripts bash. Primero el clúster kind, luego las CRDs de Gateway API, Linkerd y su extensión viz. Después construimos la imagen dos veces, la cargamos en kind y aplicamos los manifiestos. Finalmente aplicamos la ruta y corremos las pruebas.");

s = slide("CONTENIDO", "La aplicación: una imagen, dos versiones", "Implementación");
code(s, `const VERSION = process.env.APP_VERSION || 'v1';

http.createServer((req, res) => {
  const body = {
    version: VERSION,
    pod: os.hostname(),
    cabeceras: {
      'x-feature-flag': req.headers['x-feature-flag'] || null,
      'user-agent': req.headers['user-agent'] || null } };
  res.writeHead(200, { 'X-App-Version': VERSION });
  res.end(JSON.stringify(body, null, 2));
}).listen(8080);`, { x: 0.5, y: 1.2, w: 5.6, h: 2.85, fs: 10.5, label: "app/server.js (resumido)" });
code(s, `docker build -t reto4-app:v1 --build-arg APP_VERSION=v1 app
docker build -t reto4-app:v2 --build-arg APP_VERSION=v2 app`, { x: 0.5, y: 4.2, w: 5.6, h: 0.8, fs: 10, label: "Dockerfile con ARG APP_VERSION" });
bullets(s, [
  "Node.js sin dependencias externas",
  "Responde qué versión y qué pod atendió",
  "Devuelve las cabeceras recibidas: así vemos lo que llegó",
  { text: "La app no sabe nada de ruteo: no tiene un solo if por cabecera", options: { bold: true, color: HEX.teal } },
], { x: 6.4, y: 1.3, w: 3.1, h: 3.7, fontSize: 14 });

s = slide("CONTENIDO", "La regla: HTTPRoute por cabecera", "Implementación");
code(s, `apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata: { name: web-por-cabecera, namespace: reto4 }
spec:
  parentRefs:
    - { name: web, kind: Service, group: core, port: 80 }
  rules:
    - matches:                          # OR entre matches
        - headers: [{ name: x-feature-flag, value: new-version }]
        - headers: [{ name: user-agent,     value: experimental }]
      backendRefs: [{ name: web-v2, port: 80 }]
    - backendRefs: [{ name: web-v1, port: 80 }]   # por defecto`, { x: 0.5, y: 1.2, w: 5.9, h: 3.75, fs: 10.5, label: "linkerd/httproute-header.yaml" });
[["parentRef = Service web", "La regla se aplica al tráfico dirigido a web"],
 ["Regla 1 → v2", "Cualquiera de las dos cabeceras (nombre sin distinguir mayúsculas, valor exacto)"],
 ["Regla 2 → v1", "Sin matches: atrapa todo lo demás"]].forEach(([t, d], i) => {
  const y = 1.3 + i * 1.2;
  badge(s, 6.65, y, i + 1, i === 1 ? HEX.v2 : i === 2 ? HEX.v1 : C.accent1);
  text(s, t, { x: 7.2, y: y - 0.02, w: 2.35, h: 0.35, fontSize: 14, bold: true, margin: 0 });
  text(s, d, { x: 7.2, y: y + 0.33, w: 2.35, h: 0.8, fontSize: 12, color: HEX.muted, margin: 0 });
});
s.addNotes("Esta es la pieza central. La ruta cuelga del Service web. La primera regla tiene dos matches que funcionan como OR: si llega x-feature-flag new-version o user-agent experimental, va a web-v2. La segunda regla no tiene condición, así que atrapa todo lo demás y lo manda a web-v1. El policy-controller de Linkerd la aceptó con Accepted y ResolvedRefs en True.");

// =========================================================
// 7. Pruebas
s = slide("SECCION", "5 · Pruebas", "Pruebas");
s.addText("curl con y sin cabecera: 20 peticiones por caso", { placeholder: "body" });

s = slide("CONTENIDO", "Antes vs después del HTTPRoute", "Pruebas");
img(s, RC("antes.png"), 0.5, 1.05, 5.9, 1.67, 1060, 300, "Sin HTTPRoute todas las peticiones van a v1");
caption(s, "ANTES: la cabecera no cambia nada, todo va a v1", 0.5, 2.73, 5.9);
img(s, RC("despues.png"), 0.5, 3.05, 5.9, 1.67, 1060, 300, "Con HTTPRoute la cabecera decide la versión");
caption(s, "DESPUÉS: la cabecera lleva el tráfico a v2", 0.5, 4.73, 5.9);
card(s, 6.7, 1.05, 2.8, 3.95, HEX.tint);
text(s, [
  { text: "Lo que demuestra", options: { bold: true, color: HEX.teal, breakLine: true } },
  { text: "Misma app y mismas cabeceras en las dos pruebas.", options: { breakLine: true } },
  { text: " ", options: { breakLine: true, fontSize: 8 } },
  { text: "El único cambio es el HTTPRoute: el desvío lo hace Linkerd, no el código.", options: { bold: true } },
], { x: 6.9, y: 1.25, w: 2.4, h: 3.6, fontSize: 15, color: HEX.dark, valign: "middle", margin: 0 });
s.addNotes("Primero corrimos las pruebas sin la ruta: aunque mandemos la cabecera, todo va a v1. Después aplicamos el HTTPRoute y con las mismas peticiones la cabecera ya lleva el tráfico a v2.");

s = slide("CONTENIDO", "Resultados", "Pruebas");
card(s, 0.5, 1.2, 3.0, 3.75, HEX.dark);
text(s, "100/100", { x: 0.6, y: 1.65, w: 2.8, h: 1.0, fontSize: 48, bold: true, color: "7FE3D9", align: "center", margin: 0 });
text(s, "peticiones llegaron a la versión esperada", { x: 0.7, y: 2.7, w: 2.6, h: 0.7, fontSize: 15, color: C.background1, align: "center", margin: 0 });
text(s, "0 errores · desde el PC y desde el pod cliente", { x: 0.7, y: 3.6, w: 2.6, h: 0.7, fontSize: 12, color: "AAB4C3", align: "center", margin: 0 });
const ok = { text: "✓", options: { bold: true, color: "1A7F37", align: "center" } };
const vv = (t) => ({ text: t, options: { bold: true, color: t === "v2" ? HEX.v2 : HEX.v1, align: "center" } });
s.addTable([
  [H("Caso (20 peticiones c/u)"), H("Esperado"), H("v1"), H("v2"), H("")],
  ["Sin cabecera", vv("v1"), "20", "0", ok],
  ["X-Feature-Flag: new-version", vv("v2"), "0", "20", ok],
  ["X-Feature-Flag: otro-valor", vv("v1"), "20", "0", ok],
  ["User-Agent: experimental", vv("v2"), "0", "20", ok],
  ["x-feature-flag (minúsculas)", vv("v2"), "0", "20", ok],
], { x: 3.8, y: 1.2, w: 5.7, colW: [2.75, 0.95, 0.65, 0.65, 0.7], fontSize: 13, color: HEX.dark, border: { type: "solid", color: "D5DAE1", pt: 0.75 }, rowH: 0.52, fontFace: "Calibri", valign: "middle" });
text(s, "También probamos casos negativos: otro valor de la cabecera sigue yendo a v1", { x: 3.8, y: 4.45, w: 5.7, h: 0.5, fontSize: 13, color: HEX.muted, italic: true, margin: 0 });

s = slide("CONTENIDO", "Una petición por dentro", "Pruebas");
code(s, `$ curl -i -H "X-Feature-Flag: new-version" http://localhost:8080/
HTTP/1.1 200 OK
x-app-version: v2

{
  "version": "v2",
  "mensaje": "Nueva version (feature flag activo)",
  "pod": "web-v2-5bcff59747-gnzbz",
  "cabeceras": { "x-feature-flag": "new-version",
                 "user-agent": "curl/8.16.0" }
}`, { x: 0.5, y: 1.2, w: 5.6, h: 3.75, fs: 11, label: "Terminal" });
[["x-app-version", "Cabecera de respuesta con la versión que atendió"], ["pod", "Nombre real del pod: web-v2-…"], ["Postman", "Las mismas 4 peticiones en docs/reto4.postman_collection.json"]].forEach(([t, d], i) => {
  const y = 1.25 + i * 1.25;
  card(s, 6.4, y, 3.1, 1.05, HEX.light, { shadow: true });
  text(s, t, { x: 6.6, y: y + 0.1, w: 2.8, h: 0.35, fontSize: 15, bold: true, margin: 0 });
  text(s, d, { x: 6.6, y: y + 0.48, w: 2.8, h: 0.5, fontSize: 12, color: HEX.muted, margin: 0 });
});
s.addNotes("Aquí podemos hacer la demo en vivo. La respuesta trae la cabecera x-app-version y el JSON dice qué pod respondió, así se ve claramente que fue v2.");

// =========================================================
// 8. Observabilidad
s = slide("SECCION", "6 · Observabilidad", "Observabilidad");
s.addText("Linkerd viz: métricas sin instrumentar la aplicación", { placeholder: "body" });

s = slide("CONTENIDO", "Métricas por ruta, mTLS y tráfico en vivo", "Observabilidad");
img(s, CAP("09-outbound-tap.png"), 0.5, 1.05, 5.8, 1.7, 1569, 444, "stat-outbound: la ruta web-por-cabecera reparte entre web-v1 y web-v2; tap muestra peticiones a v2 con tls=true");
caption(s, "stat-outbound: la ruta reparte 1,55 RPS a cada versión · tap: tls=true", 0.5, 2.8, 5.8);
img(s, CAP("08-stat-edges.png"), 0.5, 3.15, 5.8, 1.6, 1350, 498, "linkerd viz stat y edges: 100% de éxito y conexiones SECURED");
caption(s, "stat: 100 % de éxito · edges: gateway → v1/v2 con SECURED √", 0.5, 4.8, 5.8);
bullets(s, [
  "stat-outbound ve el tráfico desde el cliente: ruta y backend",
  "tap: llegan a v2 peticiones dirigidas a web.reto4.svc",
  "edges: todas las conexiones con mTLS automático",
  "Latencia p99 de 1–2 ms: el proxy agrega muy poco",
], { x: 6.55, y: 1.15, w: 2.95, h: 3.8, fontSize: 13 });
s.addNotes("Con tráfico mezclado mitad con cabecera y mitad sin ella, stat-outbound muestra la ruta web-por-cabecera repartiendo 50/50 entre v1 y v2. Tap confirma que a v2 llegan peticiones dirigidas al servicio web, todas con TLS. Y edges confirma que todas las conexiones están aseguradas con mTLS.");

s = slide("CONTENIDO", "Dashboard de Linkerd viz", "Observabilidad");
img(s, CAP("13-dashboard-namespace.png"), 0.5, 1.1, 4.4, 3.4, 2160, 1500, "Dashboard del namespace reto4 con grafo y métricas");
img(s, CAP("14-dashboard-gateway.png"), 5.1, 1.1, 4.4, 3.4, 2160, 990, "Topología del gateway hacia web-v1 y web-v2");
caption(s, "Namespace reto4: grafo de tráfico y métricas por deployment", 0.5, 4.6, 4.4);
caption(s, "deployment/gateway: el tráfico sale hacia web-v1 y web-v2", 5.1, 4.6, 4.4);

s = slide("CONTENIDO", "Experimentos adicionales", "Observabilidad");
[["Canary 90/10 + cabecera", HEX.teal, "181 / 19", "de 200 peticiones sin cabecera fueron a v1 / v2", "Las 20 con cabecera fueron a v2: feature flag para testers y canary gradual para el resto", "11-canary.png", 1350, 174],
 ["Fuera de la malla", HEX.red, "5 / 5", "respuestas de v1 aun enviando la cabecera", "Sin proxy cliente no se aplica la ruta: confirma dónde decide Linkerd", "12-fuera-de-malla.png", 1350, 282]].forEach(([t, col, big, lbl, d, f, pw, ph], i) => {
  const x = 0.5 + i * 4.6;
  card(s, x, 1.15, 4.4, 3.85, HEX.light, { line: col });
  text(s, t, { x: x + 0.25, y: 1.25, w: 3.9, h: 0.42, fontSize: 18, bold: true, color: col, margin: 0 });
  text(s, big, { x: x + 0.25, y: 1.72, w: 1.9, h: 0.75, fontSize: 36, bold: true, color: HEX.dark, margin: 0 });
  text(s, lbl, { x: x + 2.15, y: 1.78, w: 2.05, h: 0.7, fontSize: 12, color: HEX.muted, valign: "middle", margin: 0 });
  img(s, CAP(f), x + 0.25, 2.6, 3.9, 0.95, pw, ph, t);
  text(s, d, { x: x + 0.25, y: 3.7, w: 3.9, h: 1.2, fontSize: 13, color: HEX.dark, margin: 0 });
});
s.addNotes("Hicimos dos experimentos extra. Un canary 90/10: el tráfico sin cabecera se reparte 90 por ciento a v1 y 10 a v2, y con cabecera siempre v2. Y una prueba fuera de la malla que confirma que la regla solo se aplica en el proxy cliente.");

// =========================================================
// 9. Cierre
s = slide("CONTENIDO", "Service Mesh vs Ingress vs balanceador", "Cierre");
[["Balanceador L4", HEX.muted, ["Simple y barato", "Muy bajo overhead"], ["No entiende HTTP: sin cabeceras", "Sin mTLS ni métricas por servicio"]],
 ["Ingress (borde)", HEX.v1, ["Ruteo HTTP para tráfico externo", "TLS hacia el usuario"], ["No ve llamadas entre servicios", "TLS termina en el borde"]],
 ["Service Mesh", HEX.teal, ["Reglas en cada llamada, también este-oeste", "mTLS y métricas automáticas"], ["Un proxy por pod (CPU/RAM)", "Más componentes que operar"]]].forEach(([t, col, pros, cons], i) => {
  const x = 0.5 + i * 3.05;
  card(s, x, 1.15, 2.85, 3.85, HEX.light, { line: col });
  text(s, t, { x: x + 0.2, y: 1.25, w: 2.45, h: 0.45, fontSize: 18, bold: true, color: col, margin: 0 });
  bullets(s, pros.map((p) => ({ text: "+ " + p, options: { bullet: false } })), { x: x + 0.2, y: 1.85, w: 2.5, h: 1.6, fontSize: 14, paraSpaceAfter: 4, margin: 0 });
  bullets(s, cons.map((p) => ({ text: "– " + p, options: { bullet: false, color: HEX.red } })), { x: x + 0.2, y: 3.45, w: 2.5, h: 1.45, fontSize: 14, paraSpaceAfter: 4, margin: 0 });
});
s.addNotes("Un balanceador L4 no entiende HTTP. Un Ingress sí, pero solo en la entrada: si el servicio A llama al B, el Ingress no interviene. El Service Mesh aplica reglas en cada llamada, también entre servicios internos, con mTLS y métricas. El costo es un proxy por pod; Linkerd lo minimiza porque su proxy es muy liviano.");

s = slide("CONTENIDO", "Retos técnicos", "Cierre");
[["Herramientas fuera del PATH", "env.sh agrega Docker, kind y linkerd a cada script"],
 ["El proxy no aparecía en los pods", "Linkerd 2026 usa sidecar nativo: está en initContainers"],
 ["La cabecera no cambiaba nada", "El ruteo es del proxy cliente: gateway nginx mallado"],
 ["TrafficSplit deprecado", "Migramos al estándar: HTTPRoute de Gateway API"]].forEach(([t, d], i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 0.5 + col * 4.6, y = 1.2 + row * 1.85;
  card(s, x, y, 4.4, 1.6, HEX.light, { shadow: true });
  badge(s, x + 0.2, y + 0.2, i + 1);
  text(s, t, { x: x + 0.8, y: y + 0.18, w: 3.45, h: 0.45, fontSize: 16, bold: true, valign: "middle", margin: 0 });
  text(s, d, { x: x + 0.8, y: y + 0.7, w: 3.45, h: 0.8, fontSize: 13, color: HEX.muted, margin: 0 });
});

s = slide("CIERRE", "Conclusiones", "Cierre");
s.addText([
  { text: "Una cabecera HTTP decide la versión sin tocar el código: 100/100 peticiones correctas", options: { bullet: true, breakLine: true } },
  { text: "El diseño falla de forma segura: sin HTTPRoute todo vuelve a v1", options: { bullet: true, breakLine: true } },
  { text: "Linkerd da mTLS y métricas por ruta sin instrumentar la aplicación", options: { bullet: true, breakLine: true } },
  { text: "En Linkerd el ruteo vive en el proxy cliente: quien llama debe estar en la malla", options: { bullet: true, breakLine: true } },
  { text: "La misma ruta con pesos combina feature flags y canary con riesgo controlado", options: { bullet: true } },
], { placeholder: "body", paraSpaceAfter: 12 });

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log(OUT);
})();
