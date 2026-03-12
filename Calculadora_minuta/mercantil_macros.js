//--------------------------------------------------
// funcion para calcular en monto de los folios matriz
//--------------------------------------------------

function calcular_CEHONORARIOS(params_cuantia) {
    if (params_cuantia) {
        capital = params_cuantia;
    }else{
        // capital segun el tipo de mercantil
        if ($("#tipo_mercantil").val() == 'CPS')
            capital = parseFloat($('#importe_compra_mercantil').val().replace(/\./g,'').replace(',','.'));
        else{
            capital = parseFloat($('#capital_social_mercantil').val().replace(/\./g,'').replace(',','.'));
        }
    }
    if (capital <= 6010.12)
        return 90.15;

    if (capital >= 6010.13 && capital <= 30050.61) 
        return (90.15 + ((capital - 6010.12) * 0.0045));
    
    if (capital >= 30050.62 && capital <= 60101.21) 
        return (90.15 + 108.18 + ((capital - 30050.61) * 0.0015));
    
    if (capital >= 60101.22 && capital <= 150253.03) 
        return (90.15 + 108.18 + 45.08 + ((capital - 60101.21) * 0.001));
    
    if (capital >= 150253.04 && capital <= 601012.1) 
        return (90.15 + 108.18 + 45.08 + 90.15 + ((capital - 150253.03) * 0.0005));

    if (capital >= 601012.11) 
        return (90.15 + 108.18 + 45.08 + 90.15 + 225.38 + ((capital - 601012.1) * 0.0003));
}  
//--------------------------------------------------
// funcion para calcular en monto de los folios matriz
//--------------------------------------------------
    function get_FoliosMatriz(num_folios) 
      {
        if (num_folios > 0 && num_folios < 5) {
            return 0.00;
        }
        if (num_folios > 4){
            let foliosmatriz = (num_folios - 4) * (ARANCEL_FOLIO_MATRIZ);
            if (foliosmatriz < 0) {
                return 0.00;
            }
            return foliosmatriz.toFixed(2);
        }else{
            return 0.00;
        }
      }
//--------------------------------------------------
// funcion para calcular en monto de las copias simples
//--------------------------------------------------
    function get_CosteSimple(num_copias, folios_copia) {
        costeSimple = num_copias * folios_copia * (ARANCEL_COPIA_SIMPLE_FOLIO);
        return costeSimple.toFixed(2);
    }

//--------------------------------------------------
// funcion para calcular en monto de los folios matriz
//--------------------------------------------------
function get_CosteAutorizada(n_copias, folios_copias) {
    if (folios_copias > 0 && folios_copias < 12) {
        let coste_autorizada =  n_copias * folios_copias * (ARANCEL_COPIA_AUT_FOLIO_NORMAL);
        return coste_autorizada.toFixed(2);
    }
    if (folios_copias > 11){
        let coste_autorizada = (n_copias * 11 * (ARANCEL_COPIA_AUT_FOLIO_NORMAL)) + (n_copias * (folios_copias - 11) * (ARANCEL_COPIA_AUT_FOLIO_EXTRA));
        return coste_autorizada.toFixed(2);
    }else{
        return 0.00;
    }
}    

//--------------------------------------------------
// funcion para calcular en monto de los folios matriz
//--------------------------------------------------
function get_CosteTestimonios(numero_testimonio, folios_testimonio) {
    if (folios_testimonio == 0) 
        return calcular_coste(0);

    if (folios_testimonio == 1) {
        v = 500 * parseFloat(numero_testimonio);
        return calcular_coste(v);
    }
    if (folios_testimonio > 1) {
        v = (500 + (100 * (parseFloat(folios_testimonio) - 1))) * parseFloat(numero_testimonio);
        return calcular_coste(v);
    }else
    return calcular_coste(0);
}

//--------------------------------------------------
// funcion para calcular en monto de los folios matriz
//--------------------------------------------------

function get_CosteLegitimacion(numeroLegitimaciones, numeroFirmas){
    if (numeroFirmas == 0) 
        return calcular_coste(0);

    if (numeroFirmas == 1) {
        v = 1000 * numeroLegitimaciones;
        return calcular_coste(v);
    }
    if (numeroFirmas > 1) {
        v = (1000 + (500 * (numeroFirmas - 1))) * numeroLegitimaciones;
        return calcular_coste(v);
    }else
    return calcular_coste(0);
}


function calcular_coste(valor) {
    coste = parseFloat(valor) / ARANCEL_DIVISOR_PTS;
    return coste.toFixed(2);
}




$(document).ready( function(){
});