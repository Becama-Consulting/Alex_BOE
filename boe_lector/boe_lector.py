#!/usr/bin/env python3
"""
BOE Lector - Analizador de disposiciones del Boletín Oficial del Estado
Busca términos relacionados con notaría, hipotecas, vivienda, etc.

Uso normal:
    python boe_lector.py [YYYYMMDD]

Uso desde n8n (Execute Command node):
    python boe_lector.py --n8n [YYYYMMDD]
    También acepta la fecha via variable de entorno: BOE_FECHA=YYYYMMDD
    En modo n8n los logs van a stderr y el resultado JSON va a stdout.
"""

import sys
import os
import re
import json
import argparse
import smtplib
import requests
import xml.etree.ElementTree as ET
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, date
from pathlib import Path
from io import StringIO

# Modo n8n: se activa con --n8n; los logs van a stderr, JSON a stdout
N8N_MODE = False


# ─── Configuración ────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "datos"
RESULTADOS_DIR = BASE_DIR / "resultados"

API_SUMARIO = "https://www.boe.es/datosabiertos/api/boe/sumario/{date}"
API_LEGISLACION = "https://www.boe.es/datosabiertos/api/legislacion-consolidada/id/{id}"

HEADERS = {
    "Accept": "application/xml",
    "User-Agent": "BOE-Lector/1.0"
}

PALABRAS_CLAVE = [
    'arancel', 'notari', 'hipotec', 'vivienda protegida', 'subrogaci',
    'novaci', 'registro de la propiedad', 'VPO', 'DANA', 'reducci',
    'bonificaci', 'exenci', 'minuta', 'escritura', 'protocolo electr',
    'jurisdicci voluntaria', 'emprendedor', 'sociedad limitada',
    'copia autorizada', 'fe p', 'seguridad jur'
]

PALABRAS_MONETARIAS = [
    'inferior', 'superior', 'igual', 'euros', '€'
]

TIMEOUT = 30

# ─── Configuración de email (via variables de entorno) ────────────────────────
# Configura estas variables en tu entorno o en un fichero .env:
#   BOE_SMTP_HOST     servidor SMTP        (p.ej. smtp.gmail.com)
#   BOE_SMTP_PORT     puerto               (por defecto 587)
#   BOE_SMTP_USER     usuario/email origen
#   BOE_SMTP_PASS     contraseña o app-password
#   BOE_EMAIL_DEST    email destinatario

SMTP_HOST  = os.environ.get("BOE_SMTP_HOST", "")
SMTP_PORT  = int(os.environ.get("BOE_SMTP_PORT", "587"))
SMTP_USER  = os.environ.get("BOE_SMTP_USER", "")
SMTP_PASS  = os.environ.get("BOE_SMTP_PASS", "")
EMAIL_DEST = os.environ.get("BOE_EMAIL_DEST", "")


# ─── Colores ANSI para log visual ─────────────────────────────────────────────

class C:
    RESET   = "\033[0m"
    BOLD    = "\033[1m"
    DIM     = "\033[2m"
    GREEN   = "\033[92m"
    YELLOW  = "\033[93m"
    CYAN    = "\033[96m"
    RED     = "\033[91m"
    MAGENTA = "\033[95m"
    BLUE    = "\033[94m"
    WHITE   = "\033[97m"


def log(nivel: str, mensaje: str, extra: str = ""):
    # En modo n8n los colores solo se usan si el destino es un terminal
    use_color = not N8N_MODE or sys.stderr.isatty()
    R = C if use_color else type('NoColor', (), {k: '' for k in vars(C) if not k.startswith('_')})()

    ahora = datetime.now().strftime("%H:%M:%S")
    iconos = {
        "INFO":    f"{R.CYAN}ℹ{R.RESET}",
        "OK":      f"{R.GREEN}✓{R.RESET}",
        "WARN":    f"{R.YELLOW}⚠{R.RESET}",
        "ERROR":   f"{R.RED}✗{R.RESET}",
        "BUSCA":   f"{R.MAGENTA}⟳{R.RESET}",
        "MATCH":   f"{R.GREEN}{R.BOLD}★{R.RESET}",
        "TITULO":  f"{R.BLUE}▶{R.RESET}",
        "GUARDA":  f"{R.YELLOW}💾{R.RESET}",
        "SEPARA":  "",
    }
    icono = iconos.get(nivel, " ")
    ts = f"{R.DIM}{ahora}{R.RESET}"
    out = sys.stderr if N8N_MODE else sys.stdout

    if nivel == "SEPARA":
        print(f"\n{R.DIM}{'─' * 70}{R.RESET}\n", file=out)
        return
    if nivel == "TITULO":
        print(f"\n{R.BLUE}{R.BOLD}{'═' * 70}{R.RESET}", file=out)
        print(f"  {icono} {R.BOLD}{mensaje}{R.RESET}", file=out)
        print(f"{R.BLUE}{R.BOLD}{'═' * 70}{R.RESET}\n", file=out)
        return

    linea = f"  {ts} {icono}  {mensaje}"
    if extra:
        linea += f"  {R.DIM}{extra}{R.RESET}"
    print(linea, file=out)


# ─── Utilidades de disco ───────────────────────────────────────────────────────

def crear_directorios(fecha_str: str):
    """Crea los directorios necesarios organizados por fecha."""
    carpeta_fecha = DATA_DIR / fecha_str
    carpeta_fecha.mkdir(parents=True, exist_ok=True)
    RESULTADOS_DIR.mkdir(parents=True, exist_ok=True)
    return carpeta_fecha


def guardar_xml(contenido: bytes, ruta: Path):
    ruta.write_bytes(contenido)
    log("GUARDA", f"XML guardado", str(ruta.relative_to(BASE_DIR)))


def guardar_json(datos: dict, ruta: Path):
    ruta.write_text(json.dumps(datos, ensure_ascii=False, indent=2), encoding="utf-8")
    log("GUARDA", f"JSON guardado", str(ruta.relative_to(BASE_DIR)))


# ─── Peticiones HTTP ──────────────────────────────────────────────────────────

def fetch_xml(url: str) -> bytes | None:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
        resp.raise_for_status()
        return resp.content
    except requests.HTTPError:
        return None
    except requests.RequestException as e:
        log("ERROR", f"Error de red: {e}")
        return None


# ─── Parseo del sumario ────────────────────────────────────────────────────────

def extraer_identificadores(xml_bytes: bytes) -> list[dict]:
    """
    Recorre data->sumario->seccion->departamento->epograde->item->identificador
    y devuelve una lista de dicts con id, titulo y url_xml.
    """
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError as e:
        log("ERROR", f"XML inválido: {e}")
        return []

    # El sumario puede venir envuelto en <data><sumario>...</sumario></data>
    # o directamente como <sumario>
    encontrado = root.find(".//sumario")
    sumario = encontrado if encontrado is not None else root

    items = []
    patron_boe = re.compile(r'^BOE-[A-Z]-\d{4}-\d+$')

    for item in sumario.iter("item"):
        identificador_el = item.find("identificador")
        titulo_el = item.find("titulo")
        url_xml_el = item.find("url_xml")

        if identificador_el is None or not identificador_el.text:
            continue

        id_texto = identificador_el.text.strip()
        if not patron_boe.match(id_texto):
            continue

        items.append({
            "id":      id_texto,
            "titulo":  titulo_el.text.strip() if titulo_el is not None and titulo_el.text else "(sin título)",
            "url_xml": url_xml_el.text.strip() if url_xml_el is not None and url_xml_el.text else "",
        })

    return items


# ─── Extracción de texto del XML de legislación ───────────────────────────────

def xml_a_texto(xml_bytes: bytes) -> str:
    """Extrae todo el texto visible del XML de legislación consolidada."""
    try:
        root = ET.fromstring(xml_bytes)
    except ET.ParseError:
        return ""

    partes = []
    for elem in root.iter():
        if elem.text and elem.text.strip():
            partes.append(elem.text.strip())
        if elem.tail and elem.tail.strip():
            partes.append(elem.tail.strip())

    return " ".join(partes)


# ─── Análisis de coincidencias ────────────────────────────────────────────────

def buscar_coincidencias(texto: str, identificador: str, titulo: str) -> list[dict]:
    """
    Busca frases que contengan una palabra clave Y una palabra monetaria.
    Divide el texto en frases (por punto, punto y coma o salto de línea).
    """
    coincidencias = []

    # Normalizar espacios
    texto_norm = re.sub(r'\s+', ' ', texto)

    # Dividir en frases aproximadas
    frases = re.split(r'(?<=[.;:\n])\s+', texto_norm)
    # También dividimos por \n por si acaso
    frases_final = []
    for f in frases:
        frases_final.extend(f.split('\n'))

    texto_lower = texto_norm.lower()

    for frase in frases_final:
        frase_lower = frase.lower()
        if len(frase_lower) < 5:
            continue

        palabra_encontrada = None
        for palabra in PALABRAS_CLAVE:
            if palabra.lower() in frase_lower:
                palabra_encontrada = palabra
                break

        if not palabra_encontrada:
            continue

        palabra_monetaria = None
        for monetaria in PALABRAS_MONETARIAS:
            if monetaria.lower() in frase_lower:
                palabra_monetaria = monetaria
                break

        if not palabra_monetaria:
            continue

        coincidencias.append({
            "identificador":    identificador,
            "titulo":           titulo,
            "palabra_clave":    palabra_encontrada,
            "palabra_monetaria": palabra_monetaria,
            "frase":            frase.strip(),
        })

    return coincidencias


def mostrar_coincidencia(c: dict, numero: int):
    out = sys.stderr if N8N_MODE else sys.stdout
    print(f"\n  {C.GREEN}{C.BOLD}[MATCH #{numero}]{C.RESET}", file=out)
    print(f"  {C.CYAN}ID:{C.RESET}      {c['identificador']}", file=out)
    print(f"  {C.CYAN}Título:{C.RESET}  {c['titulo'][:90]}{'...' if len(c['titulo']) > 90 else ''}", file=out)
    print(f"  {C.CYAN}Palabra:{C.RESET} {C.YELLOW}{c['palabra_clave']}{C.RESET}  +  {C.YELLOW}{c['palabra_monetaria']}{C.RESET}", file=out)
    frase = c['frase']
    for p in [c['palabra_clave'], c['palabra_monetaria']]:
        frase = re.sub(re.escape(p), f"{C.BOLD}{C.GREEN}{p}{C.RESET}", frase, flags=re.IGNORECASE)
    print(f"  {C.CYAN}Frase:{C.RESET}   {frase}", file=out)
    print(f"  {C.CYAN}URL:{C.RESET}     https://www.boe.es/buscar/act.php?id={c['identificador']}", file=out)


# ─── TeeStream: escribe en terminal Y captura en buffer ──────────────────────

ANSI_RE = re.compile(r'\x1b\[[0-9;]*m')

def strip_ansi(texto: str) -> str:
    return ANSI_RE.sub('', texto)


class TeeStream:
    """Escribe en el stream original y además captura en un StringIO."""
    def __init__(self, original):
        self._orig   = original
        self._buf    = StringIO()

    def write(self, data):
        self._orig.write(data)
        self._buf.write(strip_ansi(data))

    def flush(self):
        self._orig.flush()

    def captura(self) -> str:
        return self._buf.getvalue()

    def isatty(self):
        return self._orig.isatty()


# ─── Email ────────────────────────────────────────────────────────────────────

def enviar_email(asunto: str, cuerpo_txt: str, cuerpo_html: str):
    if not all([SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_DEST]):
        log("WARN", "Email no configurado (revisa variables BOE_SMTP_* y BOE_EMAIL_DEST)")
        return
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = asunto
        msg["From"]    = SMTP_USER
        msg["To"]      = EMAIL_DEST
        msg.attach(MIMEText(cuerpo_txt,  "plain", "utf-8"))
        msg.attach(MIMEText(cuerpo_html, "html",  "utf-8"))
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as srv:
            srv.ehlo()
            srv.starttls()
            srv.login(SMTP_USER, SMTP_PASS)
            srv.sendmail(SMTP_USER, EMAIL_DEST, msg.as_string())
        log("OK", f"Email enviado a {EMAIL_DEST}")
    except Exception as e:
        log("ERROR", f"No se pudo enviar el email: {e}")


# ─── Guardar resultados ────────────────────────────────────────────────────────

def guardar_resultados(coincidencias: list[dict], fecha_str: str, ts_run: str):
    if not coincidencias:
        log("INFO", "No se encontraron coincidencias para guardar.")
        return

    nombre = RESULTADOS_DIR / f"resultados_{fecha_str}_{ts_run}.json"
    nombre_txt = RESULTADOS_DIR / f"resultados_{fecha_str}_{ts_run}.txt"

    # JSON
    guardar_json({"fecha_boe": fecha_str, "total": len(coincidencias), "coincidencias": coincidencias}, nombre)

    # TXT legible
    lineas = [
        f"BOE LECTOR — Resultados para el sumario del {fecha_str}",
        f"Generado el {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        f"Total de coincidencias: {len(coincidencias)}",
        "=" * 70,
        "",
    ]
    for i, c in enumerate(coincidencias, 1):
        lineas += [
            f"[{i}] {c['identificador']}",
            f"    Título:          {c['titulo']}",
            f"    Palabra clave:   {c['palabra_clave']}",
            f"    Palabra monetaria: {c['palabra_monetaria']}",
            f"    Frase:           {c['frase']}",
            "",
        ]

    nombre_txt.write_text("\n".join(lineas), encoding="utf-8")
    log("GUARDA", f"Resultados TXT guardados", str(nombre_txt.relative_to(BASE_DIR)))


# ─── Flujo principal ───────────────────────────────────────────────────────────

def main():
    global N8N_MODE

    parser = argparse.ArgumentParser(
        description="BOE Lector — Analiza el sumario del BOE en busca de términos notariales/hipotecarios"
    )
    parser.add_argument(
        "fecha",
        nargs="?",
        help="Fecha en formato YYYYMMDD (por defecto: hoy o variable de entorno BOE_FECHA)"
    )
    parser.add_argument(
        "--n8n",
        action="store_true",
        help="Modo n8n: logs a stderr, resultado JSON a stdout"
    )
    args = parser.parse_args()

    N8N_MODE = args.n8n

    # Activar captura de consola (TeeStream)
    tee = TeeStream(sys.stderr if N8N_MODE else sys.stdout)
    if N8N_MODE:
        sys.stderr = tee
    else:
        sys.stdout = tee

    # Resolver fecha: argumento > variable de entorno > hoy
    fecha_raw = args.fecha or os.environ.get("BOE_FECHA")
    if fecha_raw:
        try:
            fecha_dt = datetime.strptime(fecha_raw, "%Y%m%d").date()
        except ValueError:
            msg = f"Error: la fecha debe tener el formato YYYYMMDD (ej: 20240310)"
            if N8N_MODE:
                print(json.dumps({"ok": False, "error": msg}))
            else:
                print(f"{C.RED}{msg}{C.RESET}")
            sys.exit(1)
    else:
        fecha_dt = date.today()

    fecha_str = fecha_dt.strftime("%Y%m%d")
    ts_run    = datetime.now().strftime("%H%M%S")

    log("TITULO", f"BOE LECTOR  —  Sumario del {fecha_dt.strftime('%d/%m/%Y')}")

    # Crear directorios
    carpeta_fecha = crear_directorios(fecha_str)
    log("INFO", f"Carpeta de datos: {carpeta_fecha.relative_to(BASE_DIR)}")

    # ── 1. Descargar sumario ──────────────────────────────────────────────────
    log("SEPARA", "")
    url_sumario = API_SUMARIO.format(date=fecha_str)
    log("INFO", f"Paso 1/3 — Descargando sumario del BOE: https://www.boe.es/boe/dias/{fecha_dt.strftime('%Y/%m/%d')}/")
    xml_sumario = fetch_xml(url_sumario)

    if not xml_sumario:
        log("ERROR", "No se pudo obtener el sumario. Abortando.")
        if N8N_MODE:
            print(json.dumps({"ok": False, "error": "No se pudo obtener el sumario del BOE", "fecha": fecha_str}))
        sys.exit(1)

    # Guardar sumario
    ruta_sumario = carpeta_fecha / f"sumario_{fecha_str}_{ts_run}.xml"
    guardar_xml(xml_sumario, ruta_sumario)

    # ── 2. Extraer identificadores ────────────────────────────────────────────
    items = extraer_identificadores(xml_sumario)
    log("OK", f"Encontrados {len(items)} ítems en el sumario")

    if not items:
        log("WARN", "No se encontraron ítems con identificador BOE-A-*. Revisa el XML.")
        sys.exit(0)

    # ── 3. Procesar cada ítem ─────────────────────────────────────────────────
    log("SEPARA", "")
    log("INFO", f"Paso 3/3 — Consultando legislación y buscando coincidencias")

    todas_coincidencias: list[dict] = []
    total_items = len(items)

    for idx, item in enumerate(items, 1):
        id_boe  = item["id"]
        titulo  = item["titulo"]
        progreso = f"[{idx}/{total_items}]"

        url_leg = API_LEGISLACION.format(id=id_boe)
        xml_leg = fetch_xml(url_leg)

        if not xml_leg:
            continue

        # Extraer texto y buscar
        texto = xml_a_texto(xml_leg)
        if not texto:
            continue

        coincidencias = buscar_coincidencias(texto, id_boe, titulo)

        if coincidencias:
            # Guardar XML solo si hay coincidencias
            ruta_leg = carpeta_fecha / f"{id_boe}.xml"
            guardar_xml(xml_leg, ruta_leg)
            log("MATCH", f"{progreso} {C.GREEN}{len(coincidencias)} coincidencias{C.RESET} en {id_boe}")
            for c in coincidencias:
                mostrar_coincidencia(c, len(todas_coincidencias) + 1)
                todas_coincidencias.append(c)

    # ── Resumen final ─────────────────────────────────────────────────────────
    log("SEPARA", "")
    log("TITULO", f"RESUMEN FINAL")

    log("OK", f"Ítems procesados: {total_items}")
    log("OK" if todas_coincidencias else "INFO",
        f"Coincidencias encontradas: {C.BOLD}{len(todas_coincidencias)}{C.RESET}")

    guardar_resultados(todas_coincidencias, fecha_str, ts_run)

    log("OK", f"Proceso completado.")

    # ── Guardar log de consola ─────────────────────────────────────────────────
    log_consola = tee.captura()
    ruta_log = RESULTADOS_DIR / f"log_{fecha_str}_{ts_run}.txt"
    ruta_log.write_text(log_consola, encoding="utf-8")

    # ── Enviar email ───────────────────────────────────────────────────────────
    n = len(todas_coincidencias)
    asunto = f"BOE Lector {fecha_dt.strftime('%d/%m/%Y')} — {n} coincidencia{'s' if n != 1 else ''}"

    if todas_coincidencias:
        filas = "".join(
            f"""<tr style="vertical-align:top">
                <td style="padding:6px;border-bottom:1px solid #eee;white-space:nowrap">{c['identificador']}</td>
                <td style="padding:6px;border-bottom:1px solid #eee">{c['titulo']}</td>
                <td style="padding:6px;border-bottom:1px solid #eee;color:#d97706">{c['palabra_clave']}</td>
                <td style="padding:6px;border-bottom:1px solid #eee">{c['frase']}</td>
                <td style="padding:6px;border-bottom:1px solid #eee">
                  <a href="https://www.boe.es/buscar/act.php?id={c['identificador']}">Ver BOE</a>
                </td>
              </tr>"""
            for c in todas_coincidencias
        )
        tabla = f"""<table style="border-collapse:collapse;width:100%;font-size:13px">
          <thead><tr style="background:#1e40af;color:#fff">
            <th style="padding:8px">ID</th><th style="padding:8px">Título</th>
            <th style="padding:8px">Palabra clave</th><th style="padding:8px">Frase</th>
            <th style="padding:8px">Enlace</th>
          </tr></thead><tbody>{filas}</tbody></table>"""
    else:
        tabla = "<p>No se encontraron coincidencias para esta fecha.</p>"

    cuerpo_html = f"""<html><body style="font-family:sans-serif;color:#111">
      <h2 style="color:#1e40af">BOE Lector — {fecha_dt.strftime('%d/%m/%Y')}</h2>
      <p><strong>{n}</strong> coincidencia{'s' if n != 1 else ''} encontrada{'s' if n != 1 else ''}.</p>
      {tabla}
      <hr/><pre style="font-size:11px;color:#666;background:#f5f5f5;padding:12px">{log_consola}</pre>
    </body></html>"""

    enviar_email(asunto, log_consola, cuerpo_html)

    # ── Salida JSON para n8n ───────────────────────────────────────────────────
    if N8N_MODE:
        resultado_n8n = {
            "ok": True,
            "fecha": fecha_str,
            "items_procesados": total_items,
            "total_coincidencias": len(todas_coincidencias),
            "coincidencias": todas_coincidencias,
        }
        print(json.dumps(resultado_n8n, ensure_ascii=False))


if __name__ == "__main__":
    main()
