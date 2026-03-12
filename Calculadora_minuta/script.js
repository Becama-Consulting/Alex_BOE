// ===== Timer =====
let timerInterval = null;
let elapsedSeconds = 0;
let isRunning = false;

const timerDisplay = document.getElementById('timerDisplay');
const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');
const btnReset = document.getElementById('btnReset');

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(elapsedSeconds);
}

btnStart.addEventListener('click', function () {
    if (isRunning) return;
    isRunning = true;
    timerDisplay.className = 'timer-display running';
    btnStart.disabled = true;
    btnPause.disabled = false;
    btnReset.disabled = false;

    timerInterval = setInterval(function () {
        elapsedSeconds++;
        updateTimerDisplay();
    }, 1000);
});

btnPause.addEventListener('click', function () {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    timerDisplay.className = 'timer-display paused';
    btnStart.disabled = false;
    btnPause.disabled = true;
});

btnReset.addEventListener('click', function () {
    isRunning = false;
    clearInterval(timerInterval);
    elapsedSeconds = 0;
    updateTimerDisplay();
    timerDisplay.className = 'timer-display';
    btnStart.disabled = false;
    btnPause.disabled = true;
    btnReset.disabled = true;
});

// ===== Concepto personalizado =====
const conceptSelect = document.getElementById('concept');
const customConceptGroup = document.getElementById('customConceptGroup');

conceptSelect.addEventListener('change', function () {
    customConceptGroup.style.display = this.value === 'otro' ? 'block' : 'none';
});

// ===== Conceptos adicionales (extras) =====
const extrasList = document.getElementById('extrasList');
const btnAddExtra = document.getElementById('btnAddExtra');
let extraCount = 0;

btnAddExtra.addEventListener('click', function () {
    extraCount++;
    const item = document.createElement('div');
    item.className = 'extra-item';
    item.dataset.id = extraCount;
    item.innerHTML =
        '<div class="form-group">' +
            '<label>Descripción</label>' +
            '<input type="text" placeholder="Ej: Desplazamiento" class="extra-desc">' +
        '</div>' +
        '<div class="form-group">' +
            '<label>Importe (€)</label>' +
            '<input type="number" placeholder="0.00" min="0" step="0.01" class="extra-amount">' +
        '</div>' +
        '<button class="btn-remove" title="Eliminar">&times;</button>';

    item.querySelector('.btn-remove').addEventListener('click', function () {
        item.remove();
    });

    extrasList.appendChild(item);
});

// ===== Cálculo de la minuta =====
const IVA_RATE = 0.21;

const btnCalculate = document.getElementById('btnCalculate');
const resultBreakdown = document.getElementById('resultBreakdown');

const conceptLabels = {
    consulta: 'Consulta general',
    redaccion: 'Redacción de documentos',
    revision: 'Revisión de contratos',
    asesoria: 'Asesoría especializada',
    gestion: 'Gestión administrativa',
    otro: 'Otro'
};

btnCalculate.addEventListener('click', function () {
    const ratePerHour = parseFloat(document.getElementById('ratePerHour').value) || 0;
    const conceptValue = conceptSelect.value;
    const customConcept = document.getElementById('customConcept').value;

    // Tiempo en horas (decimal)
    const hoursDecimal = elapsedSeconds / 3600;

    // Subtotal por tiempo
    const subtotalTime = ratePerHour * hoursDecimal;

    // Concepto principal
    let conceptText = '--';
    if (conceptValue === 'otro' && customConcept.trim()) {
        conceptText = customConcept.trim();
    } else if (conceptValue && conceptLabels[conceptValue]) {
        conceptText = conceptLabels[conceptValue];
    }

    // Extras
    const extraItems = document.querySelectorAll('.extra-item');
    let totalExtras = 0;
    let extrasHTML = '';

    extraItems.forEach(function (item) {
        const desc = item.querySelector('.extra-desc').value.trim() || 'Concepto adicional';
        const amount = parseFloat(item.querySelector('.extra-amount').value) || 0;
        totalExtras += amount;
        extrasHTML +=
            '<div class="result-line">' +
                '<span>' + desc + '</span>' +
                '<span>' + formatCurrency(amount) + '</span>' +
            '</div>';
    });

    // Base imponible
    const baseImponible = subtotalTime + totalExtras;

    // IVA
    const iva = baseImponible * IVA_RATE;

    // Total
    const total = baseImponible + iva;

    // Formatear tiempo legible
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    let timeText = '';
    if (hours > 0) timeText += hours + 'h ';
    if (minutes > 0) timeText += minutes + 'min ';
    if (hours === 0 && minutes === 0) timeText = 'Menos de 1 min';
    timeText = timeText.trim();

    // Mostrar resultados
    document.getElementById('resultTime').textContent = timeText;
    document.getElementById('resultRate').textContent = formatCurrency(ratePerHour) + '/h';
    document.getElementById('resultConcept').textContent = conceptText;
    document.getElementById('resultSubtotalTime').textContent = formatCurrency(subtotalTime);
    document.getElementById('resultExtras').innerHTML = extrasHTML;
    document.getElementById('resultBase').textContent = formatCurrency(baseImponible);
    document.getElementById('resultIVA').textContent = formatCurrency(iva);
    document.getElementById('resultTotal').textContent = formatCurrency(total);

    resultBreakdown.style.display = 'block';
});

function formatCurrency(value) {
    return value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    });
}
