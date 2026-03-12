// =============================================================================
// constantes_formulas_generales.js
// Aliases de compatibilidad hacia aranceles.js — NO añadir valores aquí.
// Todos los valores numéricos están definidos en aranceles.js.
// =============================================================================

// ── Aliases para los módulos legacy (notaria.js, poderes.js, etc.) ─────────
const precio                          = ARANCEL_SIN_CUANTIA;
const mensajeria                      = ARANCEL_MENSAJERIA;
const salida_notario                  = ARANCEL_SALIDA_NOTARIO;
const apostilla_urgente               = ARANCEL_APOSTILLA_URGENTE;
const apostilla_normal                = ARANCEL_APOSTILLA_NORMAL;
const registro_mercantil              = ARANCEL_REGISTRO_MERCANTIL;
const folio_timbrado                  = ARANCEL_PAPEL_FOLIO;
const coste_diligencia                = ARANCEL_DILIGENCIA;
const diligencias_notificaciones_correo  = ARANCEL_DILIG_NOTIF_CORREO;
const diligencias_notificaciones_persona = ARANCEL_DILIG_NOTIF_PERSONA;
const diligencias_notificaciones_fuera   = ARANCEL_DILIG_NOTIF_FUERA;
const gastos_correo_notificaciones    = 0;
const folios_testimonio_acuse_recibo_correo = ARANCEL_FOLIOS_ACUSE_CORREO;
const folios_testimonio_notificar_persona   = ARANCEL_FOLIOS_NOTIF_PERSONA;
const importe_acta_notificar          = ARANCEL_IMPORTE_ACTA_NOTIFICAR;
const folios_matriz_notario_notificar = ARANCEL_FOLIOS_MATRIZ_NOTIFICAR;
const tramite_mercantil               = ARANCEL_TRAMITE_MERCANTIL;
const importe_por_cargos              = ARANCEL_IMPORTE_POR_CARGOS;
const gestion_poder_mercantil         = ARANCEL_GESTION_PODER_MERCANTIL;
const precio_poderdante_apoderado     = ARANCEL_FOLIO_MATRIZ;
const precio_folio_matriz             = ARANCEL_FOLIO_MATRIZ;
const precio_cs                       = ARANCEL_COPIA_SIMPLE_FOLIO;
const precio_ca                       = ARANCEL_COPIA_AUT_FOLIO_NORMAL;
const coste_papel                     = ARANCEL_PAPEL_FOLIO;
const iva                             = ARANCEL_IVA_PCT;
const irpf                            = ARANCEL_IRPF_PCT;
const protocolo_electronico           = ARANCEL_PROTOCOLO_ELECTRONICO;
const coste_firma                     = ARANCEL_LEGIT_FIRMA_ADICIONAL;
const coste_doc                       = ARANCEL_LEGIT_PRIMERA_FIRMA;
const gastos_correo                   = ARANCEL_GASTOS_CORREO;
const folios_si_es_empresa            = 1;
const acta_sin_cuantia                = ARANCEL_ACTA_SIN_CUANTIA;
const entrega_documento_domicilio     = ARANCEL_ENTREGA_DOMICILIO;

// ── Funciones de formateo ───────────────────────────────────────────────────
function convertir(num) {
    var t = num.toString();
    t = strReplace(t, '.', ',');
    var nf = new NumberFormat(t);
    nf.setPlaces(2);
    nf.setCurrency(false);
    nf.setSeparators(true, nf.PERIOD, nf.COMMA);
    return nf.toFormatted();
}

function strReplace(s, r, w) {
    return s.split(r).join(w);
}
