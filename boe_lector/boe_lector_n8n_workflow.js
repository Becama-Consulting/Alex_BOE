// =============================================================================
// BOE LECTOR — Workflow n8n con nodos HTTP Request
// =============================================================================
// Flujo:
//   [Trigger] → [Code: fecha] → [HTTP Request: sumario]
//     → [Code: extrae IDs] → [Split In Batches]
//     → [HTTP Request: legislación] → [Code: busca coincidencias]
//     → [Filter: solo con matches] → [Aggregate]
// =============================================================================


// ─────────────────────────────────────────────────────────────────────────────
// NODO 1 — Code: "Genera fecha"
// Mode: Run once for all items
// ─────────────────────────────────────────────────────────────────────────────

const hoy = new Date();
const pad = (n) => String(n).padStart(2, '0');
const fecha = `${hoy.getFullYear()}${pad(hoy.getMonth() + 1)}${pad(hoy.getDate())}`;

return [{ json: { fecha } }];


// ─────────────────────────────────────────────────────────────────────────────
// NODO 2 — HTTP Request: "Sumario BOE"
// ─────────────────────────────────────────────────────────────────────────────
//   Method: GET
//   URL:    https://www.boe.es/datosabiertos/api/boe/sumario/{{ $json.fecha }}
//   Headers:
//     Accept:     application/xml
//     User-Agent: BOE-Lector/1.0
//   Response: "Text"  (importante: no JSON)


// ─────────────────────────────────────────────────────────────────────────────
// NODO 3 — Code: "Extrae identificadores"
// Mode: Run once for all items
// ─────────────────────────────────────────────────────────────────────────────

const xml = $input.first().json.data;   // el HTTP Request devuelve el body en .data
const fecha3 = $input.first().json.headers?.['x-fecha'] || '';

const bloques = xml.matchAll(/<identificador>(BOE-[A-Z]-\d{4}-\d+)<\/identificador>/g);
const vistos = new Set();
const items = [];

for (const m of bloques) {
  if (vistos.has(m[1])) continue;
  vistos.add(m[1]);

  const posInicio = xml.lastIndexOf('<item', m.index);
  const posFin = xml.indexOf('</item>', m.index) + 7;
  const bloque = xml.slice(posInicio, posFin);
  const tituloMatch = bloque.match(/<titulo[^>]*>([\s\S]*?)<\/titulo>/);
  const titulo = tituloMatch ? tituloMatch[1].replace(/<[^>]+>/g, '').trim() : '(sin título)';

  items.push({ json: { id: m[1], titulo } });
}

return items.length > 0 ? items : [{ json: { error: 'Sin ítems BOE-A-*' } }];


// ─────────────────────────────────────────────────────────────────────────────
// NODO 4 — Split In Batches
// ─────────────────────────────────────────────────────────────────────────────
//   Batch Size: 1


// ─────────────────────────────────────────────────────────────────────────────
// NODO 5 — HTTP Request: "Legislación consolidada"
// ─────────────────────────────────────────────────────────────────────────────
//   Method: GET
//   URL:    https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/{{ $json.id }}
//   Headers:
//     Accept:     application/xml
//     User-Agent: BOE-Lector/1.0
//   Response: "Text"
//   Options → "Ignore SSL Issues": off
//   Options → "Continue On Fail": ON  ← importante para los 404


// ─────────────────────────────────────────────────────────────────────────────
// NODO 6 — Code: "Busca coincidencias"
// Mode: Run once for each item
// ─────────────────────────────────────────────────────────────────────────────

const PALABRAS_CLAVE = [
  'arancel', 'notari', 'hipotec', 'vivienda protegida', 'subrogaci',
  'novaci', 'registro de la propiedad', 'VPO', 'DANA', 'reducci',
  'bonificaci', 'exenci', 'minuta', 'escritura', 'protocolo electr',
  'jurisdicci voluntaria', 'emprendedor', 'sociedad limitada',
  'copia autorizada', 'fe p', 'seguridad jur',
];
const PALABRAS_MONETARIAS = ['inferior', 'superior', 'igual', 'euros', '€'];

const xmlLeg = $json.data || '';
const identificador = $json.id || '';
const titulo = $json.titulo || '';

if (!xmlLeg || $json.error) return [];   // 404 u otros errores

const texto = xmlLeg.replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

const frases = texto.split(/[.;:\n]+\s*/);
const coincidencias = [];

for (const frase of frases) {
  if (frase.length < 10) continue;
  const fraseL = frase.toLowerCase();

  const palabraClave = PALABRAS_CLAVE.find(p => fraseL.includes(p.toLowerCase()));
  if (!palabraClave) continue;

  const palabraMonetaria = PALABRAS_MONETARIAS.find(p => fraseL.includes(p.toLowerCase()));
  if (!palabraMonetaria) continue;

  coincidencias.push({
    json: {
      identificador,
      titulo,
      palabraClave,
      palabraMonetaria,
      frase: frase.trim(),
      url_boe: `https://www.boe.es/buscar/act.php?id=${identificador}`,
    },
  });
}

return coincidencias;


// ─────────────────────────────────────────────────────────────────────────────
// NODO 7 — Filter: "Solo con coincidencias"
// ─────────────────────────────────────────────────────────────────────────────
//   Condición: {{ $json.identificador }} is not empty


// ─────────────────────────────────────────────────────────────────────────────
// NODO 8 — Aggregate (opcional): "Agrupa todos los resultados"
// ─────────────────────────────────────────────────────────────────────────────
//   Aggregate: All Item Data (into a single list)
