// ─────────────────────────────────────────────────────────────────────────────
// BOE Lector — Nodo Code de n8n
// Pega este código en un nodo "Code" (modo: "Run once for all items")
// ─────────────────────────────────────────────────────────────────────────────

const PALABRAS_CLAVE = [
  'arancel', 'notari', 'hipotec', 'vivienda protegida', 'subrogaci',
  'novaci', 'registro de la propiedad', 'VPO', 'DANA', 'reducci',
  'bonificaci', 'exenci', 'minuta', 'escritura', 'protocolo electr',
  'jurisdicci voluntaria', 'emprendedor', 'sociedad limitada',
  'copia autorizada', 'fe p', 'seguridad jur',
];

const PALABRAS_MONETARIAS = ['inferior', 'superior', 'igual', 'euros', '€'];

const HEADERS = {
  Accept: 'application/xml',
  'User-Agent': 'BOE-Lector/1.0',
};

// ── Fecha: usa la de hoy o la que llegue en el input como $json.fecha (YYYYMMDD)
const inputFecha = $input.first()?.json?.fecha;
const hoy = new Date();
const pad = (n) => String(n).padStart(2, '0');
const fechaStr = inputFecha
  ? String(inputFecha)
  : `${hoy.getFullYear()}${pad(hoy.getMonth() + 1)}${pad(hoy.getDate())}`;

// ── HTTP helper ───────────────────────────────────────────────────────────────
// Requiere N8N_RUNNERS_ENABLED=false en las variables de entorno de n8n

async function httpGet(url) {
  const resp = await fetch(url, { headers: HEADERS });
  const body = await resp.text();
  return { ok: resp.ok, status: resp.status, body };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function xmlToText(xml) {
  return xml.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function extraerIdentificadores(xml) {
  const patron = /BOE-[A-Z]-\d{4}-\d+/g;
  const items = [];
  const vistos = new Set();

  // Buscar dentro de <identificador>...</identificador>
  const bloques = xml.matchAll(/<identificador>(BOE-[A-Z]-\d{4}-\d+)<\/identificador>/g);
  for (const m of bloques) {
    if (vistos.has(m[1])) continue;
    vistos.add(m[1]);

    // Extraer título del bloque <item> que contiene este identificador
    const posInicio = xml.lastIndexOf('<item', m.index);
    const posFin = xml.indexOf('</item>', m.index) + 7;
    const bloque = xml.slice(posInicio, posFin);
    const tituloMatch = bloque.match(/<titulo[^>]*>([\s\S]*?)<\/titulo>/);
    const titulo = tituloMatch
      ? tituloMatch[1].replace(/<[^>]+>/g, '').trim()
      : '(sin título)';

    items.push({ id: m[1], titulo });
  }
  return items;
}

function buscarCoincidencias(texto, identificador, titulo) {
  const textoNorm = texto.replace(/\s+/g, ' ');
  // Dividir en frases por punto, punto y coma, dos puntos o salto de línea
  const frases = textoNorm.split(/[.;:\n]+\s*/);
  const coincidencias = [];

  for (const frase of frases) {
    if (frase.length < 10) continue;
    const fraseL = frase.toLowerCase();

    const palabraClave = PALABRAS_CLAVE.find((p) => fraseL.includes(p.toLowerCase()));
    if (!palabraClave) continue;

    const palabraMonetaria = PALABRAS_MONETARIAS.find((p) => fraseL.includes(p.toLowerCase()));
    if (!palabraMonetaria) continue;

    coincidencias.push({
      identificador,
      titulo,
      palabraClave,
      palabraMonetaria,
      frase: frase.trim(),
      url_boe: `https://www.boe.es/buscar/act.php?id=${identificador}`,
    });
  }
  return coincidencias;
}

// ── Paso 1: Sumario ───────────────────────────────────────────────────────────

const urlSumario = `https://www.boe.es/datosabiertos/api/boe/sumario/${fechaStr}`;
const respSumario = await httpGet(urlSumario);

if (!respSumario.ok) {
  return [{ json: { ok: false, fecha: fechaStr, error: `HTTP ${respSumario.status} al obtener sumario` } }];
}

const xmlSumario = respSumario.body;
const items = extraerIdentificadores(xmlSumario);

if (items.length === 0) {
  return [{ json: { ok: false, fecha: fechaStr, error: 'No se encontraron ítems BOE-A-* en el sumario' } }];
}

// ── Paso 2: Legislación consolidada y búsqueda ────────────────────────────────

const todasCoincidencias = [];
const log = [];

for (const item of items) {
  const urlLeg = `https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/${item.id}`;
  let respLeg;

  try {
    respLeg = await httpGet(urlLeg);
  } catch (e) {
    log.push(`SKIP ${item.id}: ${e.message}`);
    continue;
  }

  if (!respLeg.ok) {
    log.push(`SKIP ${item.id}: HTTP ${respLeg.status}`);
    continue;
  }

  const xmlLeg = respLeg.body;
  const texto = xmlToText(xmlLeg);
  const coincidencias = buscarCoincidencias(texto, item.id, item.titulo);

  if (coincidencias.length > 0) {
    log.push(`MATCH ${item.id}: ${coincidencias.length} coincidencia(s)`);
    todasCoincidencias.push(...coincidencias);
  }
}

// ── Resultado ─────────────────────────────────────────────────────────────────

if (todasCoincidencias.length === 0) {
  return [{
    json: {
      ok: true,
      fecha: fechaStr,
      items_procesados: items.length,
      total_coincidencias: 0,
      mensaje: 'No se encontraron coincidencias',
      log,
    },
  }];
}

// Devuelve una fila por coincidencia para facilitar el procesado en nodos siguientes
return todasCoincidencias.map((c) => ({
  json: {
    ok: true,
    fecha: fechaStr,
    ...c,
  },
}));
