# ─────────────────────────────────────────────────────────────────────────────
# BOE Lector — Nodo Code de n8n (Python)
# Pega este código en un nodo "Code" con lenguaje Python
# Mode: "Run once for all items"
# ─────────────────────────────────────────────────────────────────────────────

import re
import requests
import xml.etree.ElementTree as ET
from datetime import date

PALABRAS_CLAVE = [
    'arancel', 'notari', 'hipotec', 'vivienda protegida', 'subrogaci',
    'novaci', 'registro de la propiedad', 'VPO', 'DANA', 'reducci',
    'bonificaci', 'exenci', 'minuta', 'escritura', 'protocolo electr',
    'jurisdicci voluntaria', 'emprendedor', 'sociedad limitada',
    'copia autorizada', 'fe p', 'seguridad jur',
]

PALABRAS_MONETARIAS = ['inferior', 'superior', 'igual', 'euros', '€']

HEADERS = {'Accept': 'application/xml', 'User-Agent': 'BOE-Lector/1.0'}

API_SUMARIO     = 'https://www.boe.es/datosabiertos/api/boe/sumario/{date}'
API_LEGISLACION = 'https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/{id}'


# ── Fecha: usa la que llegue del nodo anterior como fecha o la de hoy ─────────
primer_item = _input.first()
fecha_str = primer_item.json.get('fecha') if primer_item else None
if not fecha_str:
    hoy = date.today()
    fecha_str = hoy.strftime('%Y%m%d')


# ── Helpers ───────────────────────────────────────────────────────────────────

def fetch_xml(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
        r.raise_for_status()
        return r.content
    except Exception:
        return None


def extraer_identificadores(xml_bytes):
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return []

    patron = re.compile(r'^BOE-[A-Z]-\d{4}-\d+$')
    items = []
    for item in root.iter('item'):
        id_el    = item.find('identificador')
        titulo_el = item.find('titulo')
        if id_el is None or not id_el.text:
            continue
        id_texto = id_el.text.strip()
        if not patron.match(id_texto):
            continue
        items.append({
            'id':     id_texto,
            'titulo': titulo_el.text.strip() if titulo_el is not None and titulo_el.text else '(sin título)',
        })
    return items


def xml_a_texto(xml_bytes):
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return ''
    partes = []
    for elem in root.iter():
        if elem.text and elem.text.strip():
            partes.append(elem.text.strip())
        if elem.tail and elem.tail.strip():
            partes.append(elem.tail.strip())
    return ' '.join(partes)


def buscar_coincidencias(texto, identificador, titulo):
    texto_norm = re.sub(r'\s+', ' ', texto)
    frases = re.split(r'[.;:\n]+\s*', texto_norm)
    coincidencias = []
    for frase in frases:
        if len(frase) < 10:
            continue
        frase_lower = frase.lower()
        palabra_clave = next((p for p in PALABRAS_CLAVE if p.lower() in frase_lower), None)
        if not palabra_clave:
            continue
        palabra_monetaria = next((p for p in PALABRAS_MONETARIAS if p.lower() in frase_lower), None)
        if not palabra_monetaria:
            continue
        coincidencias.append({
            'fecha':            fecha_str,
            'identificador':    identificador,
            'titulo':           titulo,
            'palabra_clave':    palabra_clave,
            'palabra_monetaria': palabra_monetaria,
            'frase':            frase.strip(),
            'url_boe':          f'https://www.boe.es/buscar/act.php?id={identificador}',
        })
    return coincidencias


# ── Paso 1: Sumario ───────────────────────────────────────────────────────────

xml_sumario = fetch_xml(API_SUMARIO.format(date=fecha_str))
if not xml_sumario:
    return [{'json': {'ok': False, 'fecha': fecha_str, 'error': 'No se pudo obtener el sumario del BOE'}}]

items = extraer_identificadores(xml_sumario)
if not items:
    return [{'json': {'ok': False, 'fecha': fecha_str, 'error': 'No se encontraron ítems BOE-A-* en el sumario'}}]


# ── Paso 2: Legislación consolidada y búsqueda ────────────────────────────────

todas_coincidencias = []

for item in items:
    xml_leg = fetch_xml(API_LEGISLACION.format(id=item['id']))
    if not xml_leg:
        continue
    texto = xml_a_texto(xml_leg)
    if not texto:
        continue
    coincidencias = buscar_coincidencias(texto, item['id'], item['titulo'])
    todas_coincidencias.extend(coincidencias)


# ── Resultado: una fila por coincidencia ──────────────────────────────────────

if not todas_coincidencias:
    return [{'json': {'ok': True, 'fecha': fecha_str, 'total_coincidencias': 0, 'mensaje': 'Sin coincidencias'}}]

return [{'json': c} for c in todas_coincidencias]
