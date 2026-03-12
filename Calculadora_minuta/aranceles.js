// =============================================================================
// aranceles.js — Constantes del Arancel Notarial (RD 1426/1989)
// Fichero compartido por todos los módulos de cálculo.
// =============================================================================

// ── Fiscalidad ─────────────────────────────────────────────────────────────
const ARANCEL_IVA_PCT      = 21;         // IVA en porcentaje
const ARANCEL_IVA          = 0.21;       // IVA como factor
const ARANCEL_IRPF_PCT     = 15;         // IRPF en porcentaje
const ARANCEL_IRPF         = 0.15;       // IRPF como factor

// ── Factor de conversión pesetas → euros ───────────────────────────────────
// 1 pts = 1/166,386 €  (tipo fijo de conversión)
const ARANCEL_DIVISOR_PTS  = 166.386;

// ── Folios de matriz ───────────────────────────────────────────────────────
// Precio por cada folio de matriz a partir del folio 5 (1.000 pts / 166,386)
const ARANCEL_FOLIO_MATRIZ = 6.010121;   // € / folio  (= 1000 pts)
// Folios gratuitos incluidos en los honorarios base
const ARANCEL_FOLIOS_GRATIS = 4;

// ── Copias simples ─────────────────────────────────────────────────────────
// 100 pts por folio y copia
const ARANCEL_COPIA_SIMPLE_FOLIO = 0.601012;  // € / folio

// ── Copias autorizadas ─────────────────────────────────────────────────────
// Folios 1-11: 500 pts / folio;  folios >11: 250 pts / folio
const ARANCEL_COPIA_AUT_FOLIO_NORMAL   = 3.005060;  // € / folio (1..11)
const ARANCEL_COPIA_AUT_FOLIO_EXTRA    = 1.502530;  // € / folio (12 en adelante)
const ARANCEL_COPIA_AUT_LIMITE_FOLIOS  = 11;        // umbral de cambio de precio

// ── Testimonios / acuse de recibo ──────────────────────────────────────────
// 1er folio: 500 pts;  folios adicionales: 100 pts
const ARANCEL_TESTIMONIO_PRIMER_FOLIO  = 3.005060;  // € (= 500 pts)
const ARANCEL_TESTIMONIO_FOLIO_EXTRA   = 0.601012;  // € / folio adicional

// ── Diligencias ────────────────────────────────────────────────────────────
const ARANCEL_DILIGENCIA               = 3.01;      // € / diligencia (≈ 3,00506)
const ARANCEL_DILIGENCIA_EXACTO        = 3.005060;  // € / diligencia (valor exacto)

// ── Legitimaciones ─────────────────────────────────────────────────────────
// 1ª firma: 1.000 pts;  firmas adicionales: 500 pts
const ARANCEL_LEGIT_PRIMERA_FIRMA      = 6.010120;  // € (= 1.000 pts)
const ARANCEL_LEGIT_FIRMA_ADICIONAL    = 3.005060;  // € / firma adicional

// ── Protocolo electrónico ──────────────────────────────────────────────────
const ARANCEL_PROTOCOLO_ELECTRONICO    = 9.03;      // €

// ── Papel (suplido) ────────────────────────────────────────────────────────
const ARANCEL_PAPEL_FOLIO              = 0.15;      // € / folio

// ── Honorarios sin cuantía (actos de familia, poderes, etc.) ───────────────
// 5.000 pts = 30,05 €
const ARANCEL_SIN_CUANTIA              = 30.05;     // €

// ── Honorarios de actas sin cuantía ────────────────────────────────────────
const ARANCEL_ACTA_SIN_CUANTIA         = 36.06;     // €

// ── Honorarios mínimos ─────────────────────────────────────────────────────
const ARANCEL_HONOR_MINIMO_POLIZA      = 12.02;     // € (pólizas)

// ── Servicios y mensajería ─────────────────────────────────────────────────
const ARANCEL_MENSAJERIA               = 18.00;     // €
const ARANCEL_SALIDA_NOTARIO           = 18.03;     // €
const ARANCEL_APOSTILLA_URGENTE        = 47.00;     // €
const ARANCEL_APOSTILLA_NORMAL         = 39.00;     // €
const ARANCEL_REGISTRO_MERCANTIL       = 12.00;     // €
const ARANCEL_TRAMITE_MERCANTIL        = 150.00;    // €
const ARANCEL_GESTION_PODER_MERCANTIL  = 75.00;     // €
const ARANCEL_IMPORTE_POR_CARGOS       = 24.04;     // €
const ARANCEL_GASTOS_CORREO            = 18.00;     // €
const ARANCEL_ENTREGA_DOMICILIO        = 25.00;     // €

// ── Notificaciones ─────────────────────────────────────────────────────────
const ARANCEL_DILIG_NOTIF_CORREO       = 0;         // diligencias notif. por correo
const ARANCEL_DILIG_NOTIF_PERSONA      = 1;         // diligencias notif. en persona
const ARANCEL_DILIG_NOTIF_FUERA        = 3;         // diligencias notif. fuera localidad
const ARANCEL_FOLIOS_ACUSE_CORREO      = 2;         // folios testimonio acuse recibo correo
const ARANCEL_FOLIOS_NOTIF_PERSONA     = 1;         // folios testimonio notificación en persona
const ARANCEL_IMPORTE_ACTA_NOTIFICAR   = 36.06;     // €
const ARANCEL_FOLIOS_MATRIZ_NOTIFICAR  = 7;         // folios matriz acta notificación

// ── Escala arancelaria con cuantía ─────────────────────────────────────────
// Usada en: mercantil, inmobiliario, sucesiones (donaciones, herencias...), familia (CMP)
// Forma: calcularConCuantia(importe) → honorarios en €
const ARANCEL_ESCALA_CUANTIA = [
    { hasta: 6010.12,    fijo: 90.15,   marginal: 0        },
    { hasta: 30050.61,   fijo: 90.15,   marginal: 0.0045   },
    { hasta: 60101.21,   fijo: 198.33,  marginal: 0.0015   },
    { hasta: 150253.03,  fijo: 243.41,  marginal: 0.001    },
    { hasta: 601012.10,  fijo: 333.56,  marginal: 0.0005   },
    { hasta: Infinity,   fijo: 558.94,  marginal: 0.0003   },
];

// ── Escala de pólizas: vencimiento ≤ 6 meses, SIN garantes ────────────────
const ARANCEL_ESCALA_POLIZA_CORTO_SG = [
    { hasta: 240404.84,  fijo: 0,       marginal: 0.002    },
    { hasta: 300506.05,  fijo: 480.81,  marginal: 0.001    },
    { hasta: Infinity,   fijo: 540.91,  marginal: 0.00025  },
];

// ── Escala de pólizas: con garantes (también = >6m sin garantes) ──────────
const ARANCEL_ESCALA_POLIZA_CON_GARANTE = [
    { hasta: 90151.81,   fijo: 0,       marginal: 0.003    },
    { hasta: 150253.03,  fijo: 270.46,  marginal: 0.002    },
    { hasta: 300506.05,  fijo: 390.56,  marginal: 0.001    },
    { hasta: Infinity,   fijo: 540.56,  marginal: 0.00025  },
];

// ── Escala de pólizas: >6 meses CON garantes (tramos iniciales distintos) ──
const ARANCEL_ESCALA_POLIZA_LARGO_CG = [
    { hasta: 48080.97,   fijo: 0,       marginal: 0.0045   },
    { hasta: 90151.81,   fijo: 216.36,  marginal: 0.0015   },
    // a partir de 90.151,82 → igual que ARANCEL_ESCALA_POLIZA_CON_GARANTE
];

// =============================================================================
// Funciones de cálculo reutilizables
// =============================================================================

/**
 * Aplica una escala arancelaria progresiva al importe dado.
 * @param {number} importe
 * @param {Array}  escala  - Array de {hasta, fijo, marginal}
 * @returns {number} honorarios en €
 */
function arancelAplicarEscala(importe, escala) {
    let anteriorHasta = 0;
    for (const tramo of escala) {
        if (importe <= tramo.hasta) {
            return tramo.fijo + (importe - anteriorHasta) * tramo.marginal;
        }
        anteriorHasta = tramo.hasta;
    }
    return 0;
}

/**
 * Honorarios con cuantía (escrituras con valor económico).
 * @param {number} importe - Base en €
 * @returns {number}
 */
function arancelConCuantia(importe) {
    return arancelAplicarEscala(importe, ARANCEL_ESCALA_CUANTIA);
}

/**
 * Coste de folios de matriz (a partir del folio 5 inclusive).
 * @param {number} totalFolios
 * @returns {number}
 */
function arancelFoliosMatriz(totalFolios) {
    if (totalFolios <= ARANCEL_FOLIOS_GRATIS) return 0;
    return arancelRedondear(ARANCEL_FOLIO_MATRIZ * (totalFolios - ARANCEL_FOLIOS_GRATIS));
}

/**
 * Coste de copias simples.
 * @param {number} nCopias
 * @param {number} folios
 * @returns {number}
 */
function arancelCopiaSimple(nCopias, folios) {
    return arancelRedondear(nCopias * folios * ARANCEL_COPIA_SIMPLE_FOLIO);
}

/**
 * Coste de copias autorizadas o electrónicas.
 * Folios 1-11 a precio normal; folios >11 a precio reducido.
 * @param {number} nCopias
 * @param {number} folios
 * @returns {number}
 */
function arancelCopiaAutorizada(nCopias, folios) {
    if (folios <= 0 || nCopias <= 0) return 0;
    if (folios <= ARANCEL_COPIA_AUT_LIMITE_FOLIOS) {
        return arancelRedondear(nCopias * folios * ARANCEL_COPIA_AUT_FOLIO_NORMAL);
    }
    return arancelRedondear(
        (nCopias * ARANCEL_COPIA_AUT_LIMITE_FOLIOS * ARANCEL_COPIA_AUT_FOLIO_NORMAL) +
        (nCopias * (folios - ARANCEL_COPIA_AUT_LIMITE_FOLIOS) * ARANCEL_COPIA_AUT_FOLIO_EXTRA)
    );
}

/**
 * Coste de testimonios (acuse de recibo, etc.).
 * @param {number} folios
 * @returns {number}
 */
function arancelTestimonio(folios) {
    if (folios <= 0) return 0;
    if (folios === 1) return ARANCEL_TESTIMONIO_PRIMER_FOLIO;
    return arancelRedondear(
        ARANCEL_TESTIMONIO_PRIMER_FOLIO + ARANCEL_TESTIMONIO_FOLIO_EXTRA * (folios - 1)
    );
}

/**
 * Coste de legitimaciones de firmas.
 * 1ª firma: ARANCEL_LEGIT_PRIMERA_FIRMA; adicionales: ARANCEL_LEGIT_FIRMA_ADICIONAL.
 * @param {number} nFirmas
 * @returns {number}
 */
function arancelLegitimacion(nFirmas) {
    if (nFirmas <= 0) return 0;
    if (nFirmas === 1) return ARANCEL_LEGIT_PRIMERA_FIRMA;
    return arancelRedondear(
        ARANCEL_LEGIT_PRIMERA_FIRMA + ARANCEL_LEGIT_FIRMA_ADICIONAL * (nFirmas - 1)
    );
}

/**
 * Calcula IVA sobre una base.
 * @param {number} base
 * @returns {number}
 */
function arancelIVA(base) {
    return arancelRedondear(base * ARANCEL_IVA);
}

/**
 * Calcula IRPF sobre una base.
 * @param {number} base
 * @returns {number}
 */
function arancelIRPF(base) {
    return arancelRedondear(base * ARANCEL_IRPF);
}

/**
 * Redondea a 2 decimales.
 * @param {number} n
 * @returns {number}
 */
function arancelRedondear(n) {
    return Math.round(n * 100) / 100;
}

/**
 * Formatea un número como moneda EUR (locale es-ES).
 * @param {number} value
 * @returns {string}
 */
function arancelFormatEUR(value) {
    return value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
