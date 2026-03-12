// ===== Calculadora de Familia - Honorarios Notariales =====
// Requiere: aranceles.js cargado previamente

// --- Aliases locales para legibilidad ---
const redondear   = arancelRedondear;
const formatEUR   = arancelFormatEUR;

// --- Funciones de cálculo (delegan en aranceles.js) ---

function calcTestimonios(folios)              { return arancelTestimonio(folios); }
function calcHonorariosConCuantia(importe)    { return arancelConCuantia(importe); }
function calcCosteSimple(nCopias, folios)     { return arancelCopiaSimple(nCopias, folios); }
function calcCosteAutorizada(nCopias, folios) { return arancelCopiaAutorizada(nCopias, folios); }

// --- Configuración de cada tipo de acto ---

const CONFIG = {
    PDR: {
        nombre: 'Pareja de Hecho Registrada',
        foliosMatriz: 5,
        diligencias: 3,
        cs: 1, ca: 1, ce: 1,
        campos: [
            { id: 'folios_p', label: 'Nº folios certif. Padrón — Primer Miembro',  min: 1, val: 1, testimonio: true },
            { id: 'folios_0', label: 'Nº folios certif. Padrón — Segundo Miembro', min: 1, val: 1, testimonio: true },
        ],
        documentosIncorporar: [
            { id: 'doc_libro_familia',        label: 'Libro de Familia',       folios: 2 },
            { id: 'doc_sentencia_divorcio',   label: 'Sentencia de Divorcio',  folios: 2 },
            { id: 'doc_convivencia_previa',   label: 'Convivencia Previa',     folios: 2 },
            { id: 'doc_contrato_alquiler',    label: 'Contrato de Alquiler',   folios: 4 },
        ],
        foliosExtra: () => 1,   // justificante presentación
    },
    DPE: {
        nombre: 'Disolución de Pareja Estable',
        foliosMatriz: 4,
        diligencias: null,      // depende de opción
        cs: 1, ca: 1, ce: 1,
        campos: [],
        radio: {
            nombre: 'dpe_opcion',
            label: '¿Comparecen los dos miembros de la pareja?',
            opciones: [
                { value: 'SI', label: 'Sí, ambos comparecen' },
                { value: 'NO', label: 'No, se notifica' },
            ],
        },
        foliosExtra: (opcion) => opcion === 'NO' ? 2 : 1,  // 1 justificante + 1 correos si NO
    },
    MAT: {
        nombre: 'Matrimonio',
        foliosMatriz: 5,
        diligencias: 5,
        cs: 2, ca: 1, ce: 1,
        campos: [
            { id: 'folios_p', label: 'Nº folios del Auto del Registro Civil o Acta Notarial', min: 7, val: 7, testimonio: true },
        ],
        foliosExtra: () => 2,   // 1 diligencia envío + 1 presentación
    },
    FEM: {
        nombre: 'Formalización del Expediente Matrimonial',
        foliosMatriz: 15,
        diligencias: 3,
        cs: 1, ca: 1, ce: 1,
        campos: [
            { id: 'folios_p', label: 'Nº folios del Expediente Matrimonial', min: 25, val: 25, testimonio: true },
        ],
        foliosExtra: () => 0,
    },
    DIV: {
        nombre: 'Divorcio',
        foliosMatriz: 5,
        diligencias: 5,
        cs: 2, ca: 3, ce: 0,
        campos: [
            { id: 'folios_p', label: 'Nº folios Convenio Regulador',             min: 3, val: 3,  testimonio: true },
            { id: 'folios_0', label: 'Nº folios Testimonio Registro Civil',       min: 1, val: 1,  testimonio: true },
            { id: 'folios_1', label: 'Nº folios Testimonio Libro de Familia',     min: 2, val: 2,  testimonio: true },
            { id: 'folios_2', label: 'Nº folios Testimonio Certif. Padrón',       min: 2, val: 2,  testimonio: true },
            { id: 'folios_3', label: 'Nº folios Testimonio hoja inscripción', min: 1, val: 1, readonly: true, testimonio: true },
        ],
        foliosExtra: () => 1,   // diligencia inscripción
    },
    CAA: {
        nombre: 'Capitulaciones Antes del Matrimonio',
        foliosMatriz: 6,
        diligencias: 6,
        cs: 2, ca: 2, ce: 0,
        campos: [
            { id: 'folios_p', label: 'Nº folios hoja inscripción matrimonio',      min: 1, val: 1, testimonio: true },
            { id: 'folios_0', label: 'Nº folios hoja inscripción capitulaciones',  min: 1, val: 1, testimonio: true },
        ],
        foliosExtra: () => 0,
    },
    CAD: {
        nombre: 'Capitulaciones Después del Matrimonio',
        foliosMatriz: 5,
        diligencias: 5,
        cs: 2, ca: 2, ce: 0,
        campos: [
            { id: 'folios_p', label: 'Nº folios hoja inscripción matrimonio',      min: 1, val: 1, testimonio: true },
            { id: 'folios_0', label: 'Nº folios hoja inscripción capitulaciones',  min: 1, val: 1, testimonio: true },
            { id: 'folios_1', label: 'Nº folios fotocopia Libro de Familia',        min: 2, val: 2, testimonio: true },
        ],
        foliosExtra: () => 0,
    },
    EMA: {
        nombre: 'Emancipación',
        foliosMatriz: 4,
        diligencias: 5,
        cs: 1, ca: 2, ce: 0,
        campos: [
            { id: 'folios_p', label: 'Nº folios fotocopia Libro de Familia', min: 2, val: 2, testimonio: true },
        ],
        foliosExtra: () => 0,
    },
    NDT: {
        nombre: 'Nombramiento de Tutor',
        foliosMatriz: 3,
        diligencias: 5,
        cs: 1, ca: 2, ce: 0,
        campos: [
            { id: 'folios_p', label: 'Nº folios fotocopia Libro de Familia', min: 3, val: 3, testimonio: true },
        ],
        foliosExtra: () => 0,
    },
    AUC: {
        nombre: 'Autocuratela',
        foliosMatriz: 3,
        diligencias: 5,
        cs: 1, ca: 2, ce: 0,
        campos: [
            { id: 'folios_p', label: 'Nº folios inscripción en Registro Civil', min: 1, val: 1, testimonio: true },
        ],
        foliosExtra: () => 0,
    },
    CDA: {
        nombre: 'Consentimiento Divorciado Ascendientes',
        foliosMatriz: 8,
        diligencias: 5,
        cs: 1, ca: 2, ce: 0,
        campos: [],
        foliosExtra: () => 0,
    },
    CMP: {
        nombre: 'Constitución de Patrimonio Protegido',
        diligencias: 3,
        cs: 2, ca: 1, ce: 0,
        campos: [
            { id: 'folios_p', label: 'Nº folios transferencia para constituir/aportar patrimonio', min: 1, val: 1, testimonio: true },
            { id: 'folios_0', label: 'Nº folios Modelo 651',          min: 1, val: 1, readonly: true, testimonio: true },
            { id: 'folios_1', label: 'Nº folios Carta Autoliquidación', min: 1, val: 1, readonly: true, testimonio: true },
        ],
        radio: {
            nombre: 'cmp_opcion',
            label: '¿Hay aportaciones al patrimonio protegido?',
            opciones: [
                { value: 'SI', label: 'Sí' },
                { value: 'NO', label: 'No' },
            ],
        },
        importe: { id: 'importe_protegido', label: 'Importe del patrimonio protegido (€)', min: 6000, val: 6000 },
        foliosExtra: () => 0,
        foliosMatrizFn: (opcion) => opcion === 'SI' ? 7 : 3,
    },
};

// --- Generación de HTML dinámico ---

function buildCampos(tipo) {
    const cfg = CONFIG[tipo];
    if (!cfg) return;

    document.getElementById('campos_titulo').textContent = cfg.nombre;
    let html = '';

    // Radio button específico (DPE, CMP)
    if (cfg.radio) {
        html += `<div class="form-group">
            <span class="radio-group-label">${cfg.radio.label}</span>
            <div class="radio-group">`;
        cfg.radio.opciones.forEach(op => {
            html += `<div class="radio-option">
                <input type="radio" name="${cfg.radio.nombre}" id="${cfg.radio.nombre}_${op.value}" value="${op.value}">
                <label for="${cfg.radio.nombre}_${op.value}">${op.label}</label>
            </div>`;
        });
        html += `</div></div>`;
    }

    // Importe (solo CMP)
    if (cfg.importe) {
        html += `<div class="form-group">
            <label for="${cfg.importe.id}">${cfg.importe.label}</label>
            <input type="number" id="${cfg.importe.id}" min="${cfg.importe.min}" step="0.01" value="${cfg.importe.val}" placeholder="Mín. ${cfg.importe.min}€">
        </div>`;
    }

    // Campos de folios
    cfg.campos.forEach(c => {
        const readonly = c.readonly ? 'readonly style="background:#f5f5f7;"' : '';
        html += `<div class="form-group">
            <label for="${c.id}">${c.label}</label>
            <input type="number" id="${c.id}" min="${c.min}" value="${c.val}" ${readonly}>
        </div>`;
    });

    // Documentos a incorporar (solo PDR)
    if (cfg.documentosIncorporar && cfg.documentosIncorporar.length > 0) {
        html += `<div class="form-group">
            <span class="radio-group-label">Documentos a incorporar (opcional)</span>
            <div class="checkbox-group">`;
        cfg.documentosIncorporar.forEach(doc => {
            html += `<label class="checkbox-item">
                <input type="checkbox" id="${doc.id}" data-folios="${doc.folios}">
                <label for="${doc.id}">${doc.label}</label>
                <span class="folios-hint">${doc.folios} folio${doc.folios > 1 ? 's' : ''}</span>
            </label>`;
        });
        html += `</div></div>`;
    }

    document.getElementById('campos_contenido').innerHTML = html;

    // Copias por defecto
    document.getElementById('cs_add').value = cfg.cs;
    document.getElementById('ca_add').value = cfg.ca;
    document.getElementById('ce_add').value = cfg.ce;

    // Mostrar secciones
    document.querySelectorAll('.campos-dinamicos').forEach(el => el.classList.add('visible'));
}

// --- Cálculo principal ---

function calcular() {
    const tipo = document.getElementById('tipo_familia').value;
    const cfg = CONFIG[tipo];
    if (!cfg) return;

    // --- Leer opción de radio si existe ---
    let opcionRadio = null;
    if (cfg.radio) {
        const radioEl = document.querySelector(`input[name="${cfg.radio.nombre}"]:checked`);
        if (!radioEl) {
            alert(`Selecciona una opción: "${cfg.radio.label}"`);
            return;
        }
        opcionRadio = radioEl.value;
    }

    // --- Folios de la escritura matriz ---
    let foliosMatriz = cfg.foliosMatriz !== undefined
        ? cfg.foliosMatriz
        : cfg.foliosMatrizFn(opcionRadio);

    // --- Folios extra (justificante, etc.) ---
    let totalFolios = foliosMatriz;
    if (cfg.foliosExtra) {
        totalFolios += typeof cfg.foliosExtra === 'function'
            ? cfg.foliosExtra(opcionRadio)
            : cfg.foliosExtra;
    }

    // --- Leer campos de folios ---
    let costeTestimonios = 0;
    cfg.campos.forEach(c => {
        const el = document.getElementById(c.id);
        if (!el) return;
        let val = parseInt(el.value) || c.min;
        if (val < c.min) val = c.min;
        totalFolios += val;
        if (c.testimonio) costeTestimonios += calcTestimonios(val);
    });

    // --- Documentos incorporados (PDR) ---
    if (cfg.documentosIncorporar) {
        cfg.documentosIncorporar.forEach(doc => {
            const el = document.getElementById(doc.id);
            if (el && el.checked) {
                totalFolios += doc.folios;
                costeTestimonios += calcTestimonios(doc.folios);
            }
        });
    }

    // --- Honorarios por tipo ---
    let honorarios = 0;
    let labelHonorarios = 'Honorarios documento';
    if (tipo === 'CMP') {
        let importe = parseFloat(document.getElementById('importe_protegido').value) || 6000;
        if (importe < 6000) importe = 6000;
        honorarios = redondear(calcHonorariosConCuantia(importe) * 0.95);
        labelHonorarios = 'Honorarios con cuantía';
    } else {
        honorarios = ARANCEL_SIN_CUANTIA;
    }

    // --- Folios de matriz adicionales (> 4) ---
    let costeFilosMatriz = arancelFoliosMatriz(totalFolios);

    // --- Copias ---
    const nCS = parseInt(document.getElementById('cs_add').value) || 0;
    const nCA = parseInt(document.getElementById('ca_add').value) || 0;
    const nCE = parseInt(document.getElementById('ce_add').value) || 0;

    const costeCS = redondear(calcCosteSimple(nCS, totalFolios));
    const costeCA = redondear(calcCosteAutorizada(nCA, totalFolios));
    const costeCE = redondear(calcCosteAutorizada(nCE, totalFolios));

    // --- Diligencias ---
    let numDiligencias = cfg.diligencias;
    if (tipo === 'DPE') numDiligencias = opcionRadio === 'SI' ? 3 : 4;

    const costeDiligencias = redondear(numDiligencias * ARANCEL_DILIGENCIA);

    // --- Papel ---
    const foliosPapel = totalFolios + (nCA * totalFolios) + 1;
    const costePapel = redondear(foliosPapel * ARANCEL_PAPEL_FOLIO);

    // --- Subtotal, IVA, Total ---
    costeTestimonios = redondear(costeTestimonios);
    const subtotal = redondear(honorarios + costeFilosMatriz + costeCS + costeCA + costeCE + costeTestimonios + costeDiligencias);
    const iva = arancelIVA(subtotal);
    const total = redondear(subtotal + iva + costePapel);

    // --- Mostrar resultado ---
    document.getElementById('lbl_honorarios_tipo').textContent = labelHonorarios;
    document.getElementById('res_honorarios').textContent = formatEUR(honorarios);

    const rowFolioMatriz = document.getElementById('row_folio_matriz');
    if (costeFilosMatriz > 0) {
        document.getElementById('lbl_folio_matriz').textContent = `${totalFolios} Folios de Matriz`;
        document.getElementById('res_folio_matriz').textContent = formatEUR(costeFilosMatriz);
        rowFolioMatriz.style.display = 'flex';
    } else {
        rowFolioMatriz.style.display = 'none';
    }

    document.getElementById('lbl_copias_simples').textContent = `${nCS} Copia${nCS !== 1 ? 's' : ''} Simple${nCS !== 1 ? 's' : ''}`;
    document.getElementById('res_copias_simples').textContent = formatEUR(costeCS);

    document.getElementById('lbl_copias_aut').textContent = `${nCA} Copia${nCA !== 1 ? 's' : ''} Autorizada${nCA !== 1 ? 's' : ''}`;
    document.getElementById('res_copias_aut').textContent = formatEUR(costeCA);

    const rowCE = document.getElementById('row_copias_ele');
    if (costeCE > 0) {
        document.getElementById('lbl_copias_ele').textContent = `${nCE} Copia${nCE !== 1 ? 's' : ''} Electrónica${nCE !== 1 ? 's' : ''}`;
        document.getElementById('res_copias_ele').textContent = formatEUR(costeCE);
        rowCE.style.display = 'flex';
    } else {
        rowCE.style.display = 'none';
    }

    const rowTesti = document.getElementById('row_testimonios');
    if (costeTestimonios > 0) {
        document.getElementById('res_testimonios').textContent = formatEUR(costeTestimonios);
        rowTesti.style.display = 'flex';
    } else {
        rowTesti.style.display = 'none';
    }

    document.getElementById('lbl_diligencias').textContent = `${numDiligencias} Diligencia${numDiligencias !== 1 ? 's' : ''}`;
    document.getElementById('res_diligencias').textContent = formatEUR(costeDiligencias);

    document.getElementById('res_papel').textContent = formatEUR(costePapel);
    document.getElementById('res_subtotal').textContent = formatEUR(subtotal);
    document.getElementById('res_iva').textContent = formatEUR(iva);
    document.getElementById('res_total').textContent = formatEUR(total);

    // --- Bloque extra FEM: Acta Final del Matrimonio ---
    const bloqueFEM = document.getElementById('bloque_fem');
    if (tipo === 'FEM') {
        const matFoliosTotales = 5 + 2;    // 5 matriz + 1 envío + 1 presentación
        const matFoliosMatriz  = arancelFoliosMatriz(matFoliosTotales);
        const matCS   = redondear(calcCosteSimple(2, matFoliosTotales));
        const matCA   = redondear(calcCosteAutorizada(1, matFoliosTotales));
        const matCE   = redondear(calcCosteAutorizada(1, matFoliosTotales));
        const matDili = redondear(5 * ARANCEL_DILIGENCIA);
        const matPapel = redondear((matFoliosTotales + (1 * matFoliosTotales) + 1) * ARANCEL_PAPEL_FOLIO);
        const matSub   = redondear(ARANCEL_SIN_CUANTIA + matFoliosMatriz + matCS + matCA + matCE + matDili);
        const matIva   = arancelIVA(matSub);
        const matTotal = redondear(matSub + matIva + matPapel);

        document.getElementById('fem_res_honorarios').textContent  = formatEUR(ARANCEL_SIN_CUANTIA);
        document.getElementById('fem_res_folio_matriz').textContent = formatEUR(matFoliosMatriz);
        document.getElementById('fem_res_copias').textContent      = formatEUR(matCS + matCA + matCE);
        document.getElementById('fem_res_diligencias').textContent = formatEUR(matDili);
        document.getElementById('fem_res_papel').textContent       = formatEUR(matPapel);
        document.getElementById('fem_res_iva').textContent         = formatEUR(matIva);
        document.getElementById('fem_res_total').textContent       = formatEUR(matTotal);
        document.getElementById('fem_res_total_completo').textContent = formatEUR(total + matTotal);

        bloqueFEM.style.display = 'block';
    } else {
        bloqueFEM.style.display = 'none';
    }

    // Mostrar con animación
    const breakdown = document.getElementById('result_breakdown');
    breakdown.style.display = 'block';
    breakdown.style.animation = 'none';
    void breakdown.offsetWidth;
    breakdown.style.animation = 'fadeIn 0.3s ease';
}

// --- Eventos ---

document.getElementById('tipo_familia').addEventListener('change', function () {
    const tipo = this.value;
    if (!tipo) {
        document.querySelectorAll('.campos-dinamicos').forEach(el => el.classList.remove('visible'));
        document.getElementById('result_breakdown').style.display = 'none';
        return;
    }
    buildCampos(tipo);
    document.getElementById('result_breakdown').style.display = 'none';
});

document.getElementById('btn_calcular').addEventListener('click', calcular);
