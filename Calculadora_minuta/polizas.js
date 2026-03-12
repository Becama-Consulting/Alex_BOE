// ===== Calculadora de Pólizas Notariales =====
// Requiere: aranceles.js cargado previamente

/**
 * Calcula los honorarios sin aplicar el mínimo arancelario.
 * @param {number} base        - Importe del contrato en euros
 * @param {number} vencimiento - 0 = ≤6 meses, 1 = >6 meses
 * @param {number} garante     - 0 = sin garantes, 1 = con garantes
 * @returns {number} honorarios brutos en euros
 */
function calcularHonorariosBrutos(base, vencimiento, garante) {
    let honor = 0;

    if (vencimiento === 0) {
        // Vencimiento ≤ 6 meses
        if (garante === 0) {
            // Sin garantes
            if (base < 240404.85) {
                honor = (base * 2) / 1000;
            } else if (base < 300506.06) {
                const resto = base - 240404.84;
                honor = (240404.84 * 2) / 1000;
                honor += (resto * 1) / 1000;
            } else {
                const resto = base - 300506.05;
                honor = (240404.84 * 2) / 1000;
                honor += ((300506.05 - 240404.84) * 1) / 1000;
                honor += (resto * 0.25) / 1000;
            }
        } else {
            // Con garantes
            honor = calcularConGarantes(base);
        }
    } else {
        // Vencimiento > 6 meses
        if (garante === 0) {
            // Sin garantes — misma tabla que con garantes en ≤6 meses
            honor = calcularConGarantes(base);
        } else {
            // Con garantes y vencimiento largo → tabla más alta
            if (base < 48080.98) {
                honor = (base * 4.5) / 1000;
            } else if (base < 90151.82) {
                const resto = base - 48080.97;
                honor = (48080.97 * 4.5) / 1000;
                honor += (resto * 1.5) / 1000;
            } else {
                // A partir de 90.151,82€ igual que calcularConGarantes
                honor = calcularConGarantes(base);
            }
        }
    }

    return honor;
}

/**
 * Calcula los honorarios notariales aplicando el mínimo arancelario.
 */
function calcularHonorarios(base, vencimiento, garante) {
    let honor = calcularHonorariosBrutos(base, vencimiento, garante);
    if (honor < ARANCEL_HONOR_MINIMO_POLIZA) {
        honor = ARANCEL_HONOR_MINIMO_POLIZA;
    }
    return Math.round(honor * 100) / 100;
}

/**
 * Tabla de honorarios con garantes (también usada sin garantes > 6 meses).
 */
function calcularConGarantes(base) {
    let honor = 0;
    if (base < 90151.82) {
        honor = (base * 3) / 1000;
    } else if (base < 150253.04) {
        const resto = base - 90151.82;
        honor = (90151.82 * 3) / 1000;
        honor += (resto * 2) / 1000;
    } else if (base < 300506.06) {
        const resto = base - 150253.03;
        honor = (90151.82 * 3) / 1000;
        honor += ((150253.03 - 90151.82) * 2) / 1000;
        honor += (resto * 1) / 1000;
    } else {
        const resto = base - 300506.05;
        honor = (90151.82 * 3) / 1000;
        honor += ((150253.03 - 90151.82) * 2) / 1000;
        honor += ((300506.05 - 150253.03) * 1) / 1000;
        honor += (resto * 0.25) / 1000;
    }
    return honor;
}

const formatEUR = arancelFormatEUR;

// ===== Evento principal =====
document.getElementById('btnCalcular').addEventListener('click', function () {
    const importeRaw = parseFloat(document.getElementById('importe').value);
    const vencimientoEl = document.querySelector('input[name="vencimiento"]:checked');
    const garantesEl   = document.querySelector('input[name="garantes"]:checked');
    const empresaEl    = document.querySelector('input[name="empresa"]:checked');

    // Validaciones
    if (isNaN(importeRaw) || importeRaw <= 0) {
        alert('Introduce un importe válido mayor que 0.');
        document.getElementById('importe').focus();
        return;
    }
    if (!vencimientoEl) {
        alert('Selecciona el plazo de vencimiento.');
        return;
    }
    if (!garantesEl) {
        alert('Indica si existen garantes.');
        return;
    }
    if (!empresaEl) {
        alert('Indica si el titular es empresa o particular.');
        return;
    }

    const base       = importeRaw;
    const vencimiento = parseInt(vencimientoEl.value);
    const garante     = parseInt(garantesEl.value);
    const empresa     = parseInt(empresaEl.value);

    // Cálculo
    const honorariosBase = calcularHonorarios(base, vencimiento, garante);
    const ivaImporte     = arancelIVA(honorariosBase);
    const irpfImporte    = empresa === 1 ? arancelIRPF(honorariosBase) : 0;
    const total          = Math.round((honorariosBase + ivaImporte - irpfImporte) * 100) / 100;

    // Detectar si se aplicó el mínimo arancelario
    const aplicoMinimo = calcularHonorariosBrutos(base, vencimiento, garante) < ARANCEL_HONOR_MINIMO_POLIZA;

    // Mostrar resultados
    document.getElementById('resImporte').textContent     = formatEUR(base);
    document.getElementById('resVencimiento').textContent = vencimiento === 0 ? '6 meses o menos' : 'Más de 6 meses';
    document.getElementById('resGarantes').textContent    = garante === 1 ? 'Sí' : 'No';
    document.getElementById('resHonorarios').textContent  = formatEUR(honorariosBase);
    document.getElementById('resIVA').textContent         = formatEUR(ivaImporte);
    document.getElementById('resTotal').textContent       = formatEUR(total);

    // Badge "mínimo"
    document.getElementById('badgeMinimo').style.display = aplicoMinimo ? 'inline' : 'none';

    // Línea IRPF
    const irpfLine = document.getElementById('irpfLine');
    if (empresa === 1) {
        document.getElementById('resIRPF').textContent = '− ' + formatEUR(irpfImporte);
        irpfLine.style.display = 'flex';
    } else {
        irpfLine.style.display = 'none';
    }

    // Mostrar bloque con animación
    const breakdown = document.getElementById('resultBreakdown');
    breakdown.style.display = 'block';
    breakdown.style.animation = 'none';
    void breakdown.offsetWidth; // reflow para reiniciar animación
    breakdown.style.animation = 'fadeIn 0.3s ease';
});
