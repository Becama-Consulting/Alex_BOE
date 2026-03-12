function formatear_cifras_moneda(parametro) {
    result='';
    if (parametro!= '') {
    monto = Math.round(parametro* 100) / 100;
    monto = new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(monto);
    result = monto;
  }
  return result;
  }



function cifras_moneda(parametro) {
    monto = parseFloat($("#socio_"+parametro).val().replace(/\./g,'').replace(',','.'));
    if (isNaN(monto))
    {
       $("#socio_"+parametro).addClass('border border-danger alert_input');
        setTimeout(function(){$("#socio_"+parametro).removeClass('border border-danger alert_input'), $("#socio_"+parametro).val('')}, 1200);
        return false;
    }
    monto=  formatear_cifras_moneda(monto);
    $("#socio_"+parametro).val(monto);
}

$(document).ready( function(){
    
    $('#n_horas_salida').on("change",function(e){
        e.preventDefault();
        horas = parseInt($('#n_horas_salida').val());
        mercantil = $("#tipo_mercantil").val();
        if( horas < 1 || horas > 3 && mercantil == 'PJ'){
            $("#alert_n_horas_salida_mercantil").html('El número de horas debe ser entre 1 y 3').show('slow');            
            setTimeout(() => {
                $('#n_horas_salida').val(1);
                $("#alert_n_horas_salida_mercantil").html('').hide();
            }, 3000);
        }
        $('#resultado_mercantil').hide();
    });

    // ===========folios_matriz_mercantil
    $('#folios_matriz_mercantil').on("change",function(e){
        e.preventDefault();
        folios = parseInt($('#folios_matriz_mercantil').val());
        mercantil = $("#tipo_mercantil").val()
        if (folios < 15 || folios > 25 &&  mercantil == 'CDS') {
            $("#alert_folios_matriz_mercantil").html('El número de folios debe ser entre 15 y 25').show('slow');
            setTimeout(() => {
                $('#folios_matriz_mercantil').val(15);
                $("#alert_folios_matriz_mercantil").html('').hide();
            }, 3000);
        }
        if (folios < 14 || folios > 25 && mercantil == 'TDS') {
            $("#alert_folios_matriz_mercantil").html('El número de folios debe ser entre 14 y 25').show('slow');            
            setTimeout(() => {
                $('#folios_matriz_mercantil').val(14);
                $("#alert_folios_matriz_mercantil").html('').hide();
            }, 3000);
        }
        
        if( folios < 8 || folios > 25 && mercantil == 'EP'){
            $("#alert_folios_matriz_mercantil").html('El número de folios debe ser entre 8 y 25').show('slow');            
            setTimeout(() => {
                $('#folios_matriz_mercantil').val(8);
                $("#alert_folios_matriz_mercantil").html('').hide();
            }, 3000);
        }

        if( folios < 6 || folios > 25 && mercantil == 'ME'){
            $("#alert_folios_matriz_mercantil").html('El número de folios debe ser entre 6 y 25').show('slow');            
            setTimeout(() => {
                $('#folios_matriz_mercantil').val(6);
                $("#alert_folios_matriz_mercantil").html('').hide();
            }, 3000);
        }

        if( folios < 8 || folios > 25 && mercantil == 'PJ'){
            $("#alert_folios_matriz_mercantil").html('El número de folios debe ser entre 8 y 25').show('slow');            
            setTimeout(() => {
                $('#folios_matriz_mercantil').val(8);
                $("#alert_folios_matriz_mercantil").html('').hide();
            }, 3000);
        }

        $('#resultado_mercantil').hide();
    });

   // salida -----------------------------------
   $("input[name='salida_mercantil']").on("change",function(e){
    e.preventDefault();
	salida=$("input[name='salida_mercantil']:checked").val();
		console.log('salida: '+salida);
		if (salida=='SI')
		{
			$("#div_horas_salida").show('slow');
            $("#n_horas_salida").val('1');
			$("#n_horas_salida").prop('required',true);
		}
		else
		{
			$("#div_horas_salida").hide('slow');
            $("#n_horas_salida").val('');
			$("#n_horas_salida").prop('required',false);
		}
	});
    $("#n_horas_salida").on("change",function(e){
        e.preventDefault();
        horas =$("#n_horas_salida").val();
        $("#n_horas_salida").removeClass('border border-danger alert_input');
        if (horas < 1) {
            $("#n_horas_salida").addClass('border border-danger alert_input');
            $('.alert_n_horas_salida').show('slow');
            setTimeout(() => {
                $("#n_horas_salida").val('1');
                $("#n_horas_salida").removeClass('border border-danger alert_input');
                $('.alert_n_horas_salida').hide('slow');
            }, 2500);
        }
    });

    // aportacion_dianera -----------------------------------
    $("input[name='aportacion_dianera']").on("change",function(e){
        e.preventDefault();
        aportacion=$("input[name='aportacion_dianera']:checked").val();
        if (aportacion=='SI')
        {
            $("#div_hojas_div_aportacion_dianera").show('slow');
            $("#n_horas_transferencia_dianera").val('1');
            $("#n_horas_transferencia_dianera").prop('required',true);
        }
        else
        {
            $("#div_hojas_div_aportacion_dianera").hide('slow');
            $("#n_horas_transferencia_dianera").val('');
            $("#n_horas_transferencia_dianera").prop('required',false);
        }
    });
    $("#n_horas_transferencia_dianera").on("change",function(e){
        e.preventDefault();
        horas =$("#n_horas_transferencia_dianera").val();
        $("#n_horas_transferencia_dianera").removeClass('border border-danger alert_input');
        if (horas < 1 ||  horas > 100) {
            $("#n_horas_transferencia_dianera").addClass('border border-danger alert_input');
            $('.alert_horas_transferencia_aportacion_dianera').show('slow');
            setTimeout(() => {
                $("#n_horas_transferencia_dianera").val('1');
                $("#n_horas_transferencia_dianera").removeClass('border border-danger alert_input');
                $('.alert_horas_transferencia_aportacion_dianera').hide('slow');
            }, 2500);
        }
    });


    // testimonios_transferencia-----------------------------------
    $("input[name='testimonios_transferencia']").on("change",function(e){
        e.preventDefault();
        transferencia=$("input[name='testimonios_transferencia']:checked").val();
        if (transferencia=='SI')
        {
            $("#div_hojas_div_testimonios_transferencia").show('slow');
            $("#n_horas_testimonios_transferencia").val('1');
            $("#n_horas_testimonios_transferencia").prop('required',true);
        }
        else
        {
            $("#div_hojas_div_testimonios_transferencia").hide('slow');
            $("#n_horas_testimonios_transferencia").val('');
            $("#n_horas_testimonios_transferencia").prop('required',false);
        }
    });
    $("#n_horas_testimonios_transferencia").on("change",function(e){
        e.preventDefault();
        horas =$("#n_horas_testimonios_transferencia").val();
        $("#n_horas_testimonios_transferencia").removeClass('border border-danger alert_input');
        if (horas < 1 ||  horas > 10) {
            $("#n_horas_testimonios_transferencia").addClass('border border-danger alert_input');
            $('.alert_horas_testimonios_transferencia').show('slow');
            setTimeout(() => {
                $("#n_horas_testimonios_transferencia").val('1');
                $("#n_horas_testimonios_transferencia").removeClass('border border-danger alert_input');
                $('.alert_horas_testimonios_transferencia').hide('slow');
            }, 2500);
        }
    });

    // firmas_legitimadas_mercantil ----------------
    $("#firmas_legitimadas_mercantil").on("change",function(e){
        e.preventDefault();
        firmas =$("#firmas_legitimadas_mercantil").val();
        $("#firmas_legitimadas_mercantil").removeClass('border border-danger alert_input');
        if (firmas < 1 ||  firmas > 3) {
            $("#firmas_legitimadas_mercantil").addClass('border border-danger alert_input');
            $('.alert_firmas_legitimadas').show('slow');
            setTimeout(() => {
                $("#firmas_legitimadas_mercantil").val('1');
                $("#firmas_legitimadas_mercantil").removeClass('border border-danger alert_input');
                $('.alert_firmas_legitimadas').hide('slow');
            }, 2500);
        }
	});

    // firmas_legitimadas_mercantil ----------------
    $("#n_socios_liquidacion").on("change",function(e){
        e.preventDefault();
		$("#div_importe_liquidacion_socios, #div_result_doc_cuantia").html('');

        var numero=parseInt($('#n_socios_liquidacion').val().replace(/\./g,'').replace(',','.'));
       if (numero) {
           if (numero < 1 || numero > 10) {
            $('#disolucion_de_capital').hide('slow');
               $("#n_socios_liquidacion").addClass('border border-danger alert_input');
               $('.alert_n_socios_liquidacion').show('slow');
               setTimeout(() => {
                   $("#n_socios_liquidacion").val('');
                   $("#n_socios_liquidacion").removeClass('border border-danger alert_input');
                   $('.alert_n_socios_liquidacion').hide('slow');
               }, 2500);
           } else {
               $('#disolucion_de_capital').show('slow');
               for (i = 1; i <= numero; i++) {
                   var elementos = "<div class='group_docs border border-1 rounded m-1 mb-3 row' style='background-color: #eee;'> " +
                       "<div class='icon-box col-sm-12 col-md-5 my-auto' data-aos='zoom-in' data-aos-delay='150' style='padding-left: 6px;'>" +
                       "<i class='bx bx-euro'></i>" +
                       "<div class='pt-2'> • Importe Socio " + i + " </div>" +
                       "</div>" +
                       "<div data-aos='zoom-in' data-aos-delay='150' class='col-sm-12 col-md-7'>" +
                       "<h6 class='p-2 pt-1 pb-1 mb-0' style='padding-left: 21px;padding-right: 2px;'>" +
                       "<input type='text' class='form-control h6'  onchange='cifras_moneda(" + i + ")' style='text-align: center; margin-bottom: 5px; font-family: Open Sans;' id='socio_" + i + "' name='importe_socios[]'>" +
                       "</h6>" +
                       "</div>" +
                       "</div> ";
                   $("#div_importe_liquidacion_socios").append(elementos);

                   var result_cuantias = "<div class='row p-0 m-0 d-flex justify-content-between' id='div_result_doc_cuantia" + i + "'>" +
                       "<div class='col p-0'> Documento Cuantia " + i + " </div>" +
                       "<div class='col p-0 text-end' id='result_merc_import_socio_" + i + "'></div>" +
                       "</div>"
                   $("#div_result_doc_cuantia").append(result_cuantias);

               }
               $("#div_importe_liquidacion_socios").append('<div class="text-danger alert_monto_disolucion fst-italic float-end" style="display: none; font-size: small; font-weight: 500; "></div>');
           }
       }
    });

        // c_restituye_capital_mercantil-----------------------------------
        $("input[name='c_restituye_capital_mercantil']").on("change",function(e){
            e.preventDefault();
            $("#div_importe_restitucion_socios").html('');
            $("#div_result_doc_cuantia").html('');
            restituye_capital=$("input[name='c_restituye_capital_mercantil']:checked").val();
            if (restituye_capital=='SI')
                $("#div_n_socios_restitucion").show('slow');
            else{
                $("#div_n_socios_restitucion").hide('slow');
                $("#div_importe_restitucion_socios").html('').removeClass('mt-3');
                $('#n_socios_restitucion').val('');
            }
        });

        // n_socios_restitucion ----------------
        $("#n_socios_restitucion").on("change",function(e){
            e.preventDefault();
            var n_socis =parseInt($('#n_socios_restitucion').val().replace(/\./g,'').replace(',','.'));
            if (n_socis < 1 ||  n_socis > 10) 
            {
                $("#n_socios_restitucion").addClass('border border-danger alert_input');
                $('.alert_n_socios_restitucion').show('slow');
                $("#div_importe_restitucion_socios, #div_result_doc_cuantia").html('');
                setTimeout(() => {
                    $("#n_socios_restitucion").val('');
                    $("#n_socios_restitucion").removeClass('border border-danger alert_input');
                    $('.alert_n_socios_restitucion').hide('slow');
                }, 2500);
            }else{
                $("#div_importe_restitucion_socios").html('').addClass('mt-3');
                $("#div_result_doc_cuantia").html('');
              
                for (i=1;i<=n_socis;i++)
                { 
                    var elementos="<div class='group_docs d-flex d-flex justify-content-end ms-5  me-2 mb-1 row' style='background-color: transparent;'> "+
                                "<div class='icon-box col-sm-12 col-md-5 my-auto' data-aos='zoom-in' data-aos-delay='150' style='padding-left: 6px;'>"+
                                    "<i class='bx bx-euro'></i>"+
                                    "<div class='pt-2'> • Importe Socio "+i+" </div>"+
                                "</div>"+
                                "<div data-aos='zoom-in' data-aos-delay='150' class='col-sm-12 col-md-7'>"+
                                    "<h6 class='p-2 pt-1 pb-1 mb-0' style='padding-left: 21px;padding-right: 2px;'>"+
                                    "<input type='text' class='form-control h6'  onchange='cifras_moneda("+i+")' style='text-align: center; margin-bottom: 5px; font-family: Open Sans;' id='socio_"+i+"' name='importe_socios[]'>"+
                                    "</h6>"+
                                "</div>"+
                                "</div> ";
                        $("#div_importe_restitucion_socios").append(elementos);
    
                        var result_cuantias="<div class='row p-0 m-0 d-flex justify-content-between' id='div_result_doc_cuantia"+i+"'>"+
                                                "<div class='col p-0'> Documento Cuantia "+i+" </div>"+
                                                "<div class='col p-0 text-end' id='result_merc_import_socio_"+i+"'></div>"+
                                            "</div>"
                        $("#div_result_doc_cuantia").append(result_cuantias);
                }
                $("#div_importe_restitucion_socios").append('<div class="text-danger alert_monto_restitucio fst-italic float-end" style="display: none; font-size: small; font-weight: 500; "></div>');
            }
        });

    $('#folios_mercantil').on("change",function(e){
        e.preventDefault();
         value =  $('#folios_mercantil').val();
         mercantil=$("#tipo_mercantil").val();
         if (mercantil =='CPS' && value < 8) {
            $('#folios_mercantil').addClass('border border-danger alert_input');
            $('.alert_folios_mercanti').html('Nº minimo de Folios 8').show('slow');
            setTimeout(() => {
                $("#folios_mercantil").val('8');
                $("#folios_mercantil").removeClass('border border-danger alert_input');
                $('.alert_folios_mercanti').hide('slow');
            }, 2500);
         }
         if (mercantil =='ATR' && (value < 4 || value >25)) {
            $('#folios_mercantil').addClass('border border-danger alert_input');
            $('.alert_folios_mercanti').html('Nº Folios entre 4 y 25').show('slow');
            setTimeout(() => {
                $("#folios_mercantil").val('4');
                $("#folios_mercantil").removeClass('border border-danger alert_input');
                $('.alert_folios_mercanti').hide('slow');
            }, 2500);
         }
         if (mercantil =='CN' && (value < 12 || value >25)) {
            $('#folios_mercantil').addClass('border border-danger alert_input');
            $('.alert_folios_mercanti').html('Nº Folios entre 12 y 25').show('slow');
            setTimeout(() => {
                $("#folios_mercantil").val('12');
                $("#folios_mercantil").removeClass('border border-danger alert_input');
                $('.alert_folios_mercanti').hide('slow');
            }, 2500);
         }
         if (mercantil =='TDS' && (value < 14 || value >25)) {
            $('#folios_mercantil').addClass('border border-danger alert_input');
            $('.alert_folios_mercanti').html('Nº Folios entre 14 y 25').show('slow');
            setTimeout(() => {
                $("#folios_mercantil").val('14');
                $("#folios_mercantil").removeClass('border border-danger alert_input');
                $('.alert_folios_mercanti').hide('slow');
            }, 2500);
         }
         if (mercantil =='CDS' && (value < 15 || value >25)) {
            $('#folios_mercantil').addClass('border border-danger alert_input');
            $('.alert_folios_mercanti').html('Nº Folios entre 15 y 25').show('slow');
            setTimeout(() => {
                $("#folios_mercantil").val('15');
                $("#folios_mercantil").removeClass('border border-danger alert_input');
                $('.alert_folios_mercanti').hide('slow');
            }, 2500);
         }
         if (mercantil =='PJ' || mercantil =='EP' && (value < 8 || value >25)) {
            $('#folios_mercantil').addClass('border border-danger alert_input');
            $('.alert_folios_mercanti').html('Nº Folios entre 8 y 25').show('slow');
            setTimeout(() => {
                $("#folios_mercantil").val('8');
                $("#folios_mercantil").removeClass('border border-danger alert_input');
                $('.alert_folios_mercanti').hide('slow');
            }, 2500);
         }
         if (mercantil =='ME' && (value < 6 || value >25)) {
            $('#folios_mercantil').addClass('border border-danger alert_input');
            $('.alert_folios_mercanti').html('Nº Folios entre 6 y 25').show('slow');
            setTimeout(() => {
                $("#folios_mercantil").val('6');
                $("#folios_mercantil").removeClass('border border-danger alert_input');
                $('.alert_folios_mercanti').hide('slow');
            }, 2500);
         }
         
         
    });

    $('#import_sin_cuantia_mercantil, #total_s_cuantia_mercantil').on("change",function(e){
        e.preventDefault();
        total_cuatia= $('#total_s_cuantia_mercantil').val();
        importe= parseFloat($('#import_sin_cuantia_mercantil').val().replace(/\./g,'').replace(',','.'));
        valor= importe*total_cuatia;
        $('#acto_sin_cuantia_mercantil').val(formatear_cifras_moneda(valor));
    });

    // ---------- tipo mercantil -------
    $("#tipo_mercantil").on("change",function(e){
        $("#input_merc_tipo_solicitud").val('MERCANTIL');
		// inicializa los diferente div para cada tipo de registro 
        mercantil=$("#tipo_mercantil").val();
        $('#disolucion_de_capital').show();
            //ocultar por defecto 
            $('#div_capital_mercantil').hide();
            $('#div_folios_mercantil').hide();
            $('#div_empresa_mercantil').hide();
            // todo lo relacionado a las cuantias dinamicas
            $("#div_importe_restitucion_socios, #div_importe_liquidacion_socios, #div_result_doc_cuantia, #inputs_cuantia").html('');
            $('#div_ce_mercantil').hide();
            $('#div_aportacion_dianera_mercantil').hide();
            $('#div_restituye_capital_mercantil').hide();
            $('#div_testimonios_transferencia_mercantil').hide();
            $('#div_firmas_legitimadas_mercantil').hide();
            $('#div_importe_compra').hide();
            $('#div_n_socios_liquidacion').hide();
            $('#div_total_s_cuantia_mercantil').hide();
            $('#div_import_sin_cuantia_mercantil').hide();
            $('#div_acto_sin_cuantia_mercantil').hide();
            $("#div_hojas_div_aportacion_dianera").hide();
            $('#div_folios_matriz_mercantil').hide();
            $('#div_folio_cs_mercantil').hide();
            $('#div_folio_ca_mercantil').hide();
            $('#div_folio_ce_mercantil').hide();
            $('#div_n_socios_restitucion').hide();
            // valor por defecto
            $('#ca_mercantil_add, #cs_mercantil_add').val('0');
            $('#n_socios_restitucion').val('');
            $('#ca_mercantil').val('1');
            $('#cs_mercantil').val('1');
            $('#ce_mercantil').val('1');
            $('#capital_social_mercantil').val('0 €');
            $('#importe_compra_mercantil').val('0 €');
            $('#resultado_mercantil').hide();
            $('#nota_cs_mercantil').html('');
            $('#nota_ca_mercantil').html('');

        if (mercantil!='#') {
            $('#body_mercantil').show('slow');
            switch(mercantil) {
                case 'CS': // Constitución de sociedad
                    //mostrar 
                    $('#text_capital').html('Capital Social');
                    $('#div_aportacion_dianera_mercantil, #div_capital_mercantil').show();
                    $('#capital_social_mercantil').val('3.000,00 €');
                    $('#folios_mercantil').val('18').attr("readonly", true);
                    $('#folios_matriz_mercantil').val('18');
                    $('#folio_cs_mercantil').val('18');
                    $('#folio_ca_mercantil').val('18');
                    $('#folio_ce_mercantil').val('18');
                    document.querySelector('#salida_m2').checked = true;
                    document.querySelector('#aportacion_dianera_m1').checked = true;
                    $("input[name='aportacion_dianera']").trigger('change');
                    document.querySelector('#c_empresa_mercantil_1').checked = true;  
                    $('#diligencias_mercantil').val('1').attr("readonly", true);
                    $('#nota_cs_mercantil').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas')
                    $('#nota_ca_mercantil').html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas')                      
                    break;

                case 'ACS': //amplicación  de capital social
                    $('#text_capital').html('Ampliación de Capital');
                    $('#div_capital_mercantil').show();
                    $('#capital_social_mercantil').val('3.000,00 €');
                    $('#folios_mercantil').val('10').attr("readonly", false);
                    $('#folios_matriz_mercantil').val('10');
                    $('#folio_cs_mercantil').val('10');
                    $('#folio_ca_mercantil').val('10');
                    $('#folio_ce_mercantil').val('10');
                    $('#firmas_legitimadas_mercantil').val('1');
                    document.querySelector('#salida_m2').checked = true;
                    $('#div_firmas_legitimadas_mercantil').show();
                    document.querySelector('#testimonios_transferencia_m1').checked = true;
                    $("input[name='testimonios_transferencia']").trigger('change');
                    $('#div_testimonios_transferencia_mercantil').show();
                    document.querySelector('#c_empresa_mercantil_1').checked = true;  
                    $('#diligencias_mercantil').val('1').attr("readonly", true);
                    $('#nota_cs_mercantil').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas')
                    $('#nota_ca_mercantil').html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas')  
                    break;
                case 'RCS': // reducción de capìtal
                    $('#text_capital').html('Reducción de Capital');
                    $('#div_capital_mercantil').show();
                    $('#capital_social_mercantil').val('3.000,00 €').attr("readonly", false);
                    $('#folios_mercantil').val('10').attr("readonly", false);
                    $('#folios_matriz_mercantil').val('10');
                    $('#folio_cs_mercantil').val('10');
                    $('#folio_ca_mercantil').val('10');
                    $('#folio_ce_mercantil').val('10');
                    $('#firmas_legitimadas_mercantil').val('1');
                    document.querySelector('#salida_m2').checked = true;
                    $('#div_firmas_legitimadas_mercantil').show();
                    document.querySelector('#testimonios_transferencia_m1').checked = true;
                    $('#div_testimonios_transferencia_mercantil').show();
                    $("input[name='testimonios_transferencia']").trigger('change');
                    document.querySelector('#c_empresa_mercantil_1').checked = true;  
                    $('#diligencias_mercantil').val('1').attr("readonly", true);
                    $('#div_restituye_capital_mercantil').show();
                    document.querySelector('#c_restituye_capital_mercantil_2').checked = true;                    
                    $('#nota_cs_mercantil').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas')
                    $('#nota_ca_mercantil').html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas')                    
                    break;
                case 'DL':
                    $('#disolucion_de_capital').hide();
                    $('#div_capital_mercantil').hide();
                    $('#folios_mercantil').val('10').attr("readonly", false);
                    $('#folios_matriz_mercantil').val('10');
                    $('#folio_cs_mercantil').val('10');
                    $('#folio_ca_mercantil').val('10');
                    $('#folio_ce_mercantil').val('10');
                    $('#firmas_legitimadas_mercantil').val('1');
                    document.querySelector('#salida_m2').checked = true;
                    $('#div_firmas_legitimadas_mercantil').show();
                    document.querySelector('#testimonios_transferencia_m1').checked = true;
                    $('#div_testimonios_transferencia_mercantil').show();
                    $("input[name='testimonios_transferencia']").trigger('change');
                    document.querySelector('#c_empresa_mercantil_1').checked = true;  
                    $('#div_n_socios_liquidacion').show();
                    break;
                case 'CPS': //Comprovante De Participaciones Sociales
                    $('#div_capital_mercantil').hide();
                    $('#div_importe_compra').show();
                    $('#importe_compra_mercantil').val('5.000,00 €');
                    $('#folios_mercantil').val('8').attr("readonly", false);
                    $('#folios_matriz_mercantil').val('8');
                    $('#folio_cs_mercantil').val('8');
                    $('#folio_ca_mercantil').val('8');
                    $('#folio_ce_mercantil').val('8');
                    $('#div_ce_mercantil').hide();
                    document.querySelector('#salida_m2').checked = true;
                    document.querySelector('#testimonios_transferencia_m1').checked = true;
                    $('#div_testimonios_transferencia_mercantil').show();
                    $("input[name='testimonios_transferencia']").trigger('change');
                    document.querySelector('#c_empresa_mercantil_1').checked = true;  
                    $('#nota_cs_mercantil').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas')
                    $('#nota_ca_mercantil').html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas')    
                    break;
                case 'ATR': // Acta de  tribunal real
                    $('#div_capital_mercantil').hide();
                    $('#importe_compra_mercantil').val('0 €');
                    $('#div_importe_compra').hide();
                    $('#folios_mercantil').val('4').attr("readonly", false);
                    $('#folios_matriz_mercantil').val('4');
                    $('#folio_cs_mercantil').val('4');
                    $('#folio_ca_mercantil').val('4');
                    $('#folio_ce_mercantil').val('4');
                    $('#div_ce_mercantil').hide();
                    $('#div_empresa_mercantil').hide();
                    document.querySelector('#salida_m2').checked = true;
                    document.querySelector('#testimonios_transferencia_m1').checked = true;
                    $('#nota_cs_mercantil').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas')
                    $('#nota_ca_mercantil').html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas')   
                    break;
                case 'CN': //cese y nombramiento
                    $('#div_total_s_cuantia_mercantil').hide();
                    $('#total_s_cuantia_mercantil').val('2')
                    $('#div_import_sin_cuantia_mercantil').hide();
                    $('#import_sin_cuantia_mercantil').val('0 €');
                    $('#div_acto_sin_cuantia_mercantil').hide();
                    $('#div_firmas_legitimadas_mercantil').show();
                    $('#firmas_legitimadas_mercantil').val('2');
                    $('#div_capital_mercantil').hide();
                    $('#div_importe_compra').hide();
                    $('#folios_mercantil').val('12').attr("readonly", false);
                    $('#folios_matriz_mercantil').val('12');
                    $('#folio_cs_mercantil').val('12');
                    $('#folio_ca_mercantil').val('12');
                    $('#folio_ce_mercantil').val('12');
                    $('#div_ce_mercantil').hide();
                    $('#div_empresa_mercantil').hide();
                    document.querySelector('#salida_m2').checked = true;
                    document.querySelector('#testimonios_transferencia_m1').checked = true;
                    $('#import_sin_cuantia_mercantil').trigger('change');
                    $('#nota_cs_mercantil').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas')
                    $('#nota_ca_mercantil').html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas')   
                    break;
                case 'TDS': //Traslado de Domicilio Social
                    $('#div_total_s_cuantia_mercantil').hide();
                    $('#total_s_cuantia_mercantil').val('1')
                    $('#div_import_sin_cuantia_mercantil').hide();
                    $('#import_sin_cuantia_mercantil').val('0 €');
                    $('#div_acto_sin_cuantia_mercantil').hide();
                    $('#div_firmas_legitimadas_mercantil').show();
                    $('#firmas_legitimadas_mercantil').val('1');
                    $('#div_folios_matriz_mercantil').show();
                    $("#alert_folios_matriz_mercantil").html('').hide();
                    // _________________
                    $('#div_capital_mercantil').hide();
                    $('#div_importe_compra').hide();
                    $('#folios_mercantil').val('14').attr("readonly", false);
                    $('#folios_matriz_mercantil').val('14');
                    $('#folio_cs_mercantil').val('14');
                    $('#folio_ca_mercantil').val('14');
                    $('#folio_ce_mercantil').val('14');
                    $('#div_ce_mercantil').hide();
                    $('#div_empresa_mercantil').hide();
                    document.querySelector('#salida_m2').checked = true;
                    document.querySelector('#testimonios_transferencia_m1').checked = true;
                    $('#import_sin_cuantia_mercantil').trigger('change');
                    $('#nota_cs_mercantil').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas')
                    $('#nota_ca_mercantil').html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas')   
                    break;
                case 'CDS': // Cambio de Domicilio Social
                    $('#div_total_s_cuantia_mercantil').hide();
                    $('#total_s_cuantia_mercantil').val('1')
                    $('#div_import_sin_cuantia_mercantil').hide();
                    $('#import_sin_cuantia_mercantil').val('0 €');
                    $('#div_acto_sin_cuantia_mercantil').hide();
                    $('#div_firmas_legitimadas_mercantil').show();
                    $('#firmas_legitimadas_mercantil').val('1');
                    $('#div_folios_matriz_mercantil').show();
                    $("#alert_folios_matriz_mercantil").html('').hide();
                    // _________________
                    $('#div_capital_mercantil').hide();
                    $('#div_importe_compra').hide();
                    $('#folios_mercantil').val('15').attr("readonly", false);
                    $('#folios_matriz_mercantil').val('15');
                    $('#folio_cs_mercantil').val('15');
                    $('#folio_ca_mercantil').val('15');
                    $('#folio_ce_mercantil').val('15');
                    $('#div_ce_mercantil').hide();
                    $('#div_empresa_mercantil').hide();
                    document.querySelector('#salida_m2').checked = true;
                    document.querySelector('#testimonios_transferencia_m1').checked = true;
                    $('#import_sin_cuantia_mercantil').trigger('change');
                    $('#nota_cs_mercantil').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas')
                    $('#nota_ca_mercantil').html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas')   
                    break;
                case 'EP': //Elevación a Público 
                    $('#div_total_s_cuantia_mercantil').hide();
                    $('#total_s_cuantia_mercantil').val('1')
                    $('#div_import_sin_cuantia_mercantil').hide();
                    $('#import_sin_cuantia_mercantil').val('0 €');
                    $('#div_acto_sin_cuantia_mercantil').hide();
                    $('#div_firmas_legitimadas_mercantil').show();
                    $('#firmas_legitimadas_mercantil').val('1');
                    $('#div_folios_matriz_mercantil').show();
                    $("#alert_folios_matriz_mercantil").html('').hide();
                    // _________________
                    $('#div_capital_mercantil').hide();
                    $('#div_importe_compra').hide();
                    $('#folios_mercantil').val('8').attr("readonly", false);
                    $('#folios_matriz_mercantil').val('8');
                    $('#folio_cs_mercantil').val('8');
                    $('#folio_ca_mercantil').val('8');
                    $('#folio_ce_mercantil').val('8');
                    $('#div_ce_mercantil').hide();
                    $('#div_empresa_mercantil').hide();
                    document.querySelector('#salida_m2').checked = true;
                    document.querySelector('#testimonios_transferencia_m1').checked = true;
                    $('#import_sin_cuantia_mercantil').trigger('change');
                    $('#nota_cs_mercantil').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas')
                    $('#nota_ca_mercantil').html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas')   
                    break;
                case 'ME': //Modificación Estatutaria
                    $('#div_total_s_cuantia_mercantil').hide();
                    $('#total_s_cuantia_mercantil').val('1')
                    $('#div_import_sin_cuantia_mercantil').hide();
                    $('#import_sin_cuantia_mercantil').val('0 €');
                    $('#div_acto_sin_cuantia_mercantil').hide();
                    $('#div_firmas_legitimadas_mercantil').hide();
                    $('#firmas_legitimadas_mercantil').val('1');
                    $('#div_folios_matriz_mercantil').show();
                    $("#alert_folios_matriz_mercantil").html('').hide();
                    // _________________
                    $('#div_capital_mercantil').hide();
                    $('#div_importe_compra').hide();
                    $('#folios_mercantil').val('6').attr("readonly", false);
                    $('#folios_matriz_mercantil').val('6');
                    $('#folio_cs_mercantil').val('6');
                    $('#folio_ca_mercantil').val('6');
                    $('#folio_ce_mercantil').val('6');
                    $('#div_ce_mercantil').hide();
                    $('#div_empresa_mercantil').hide();
                    document.querySelector('#salida_m2').checked = true;
                    document.querySelector('#testimonios_transferencia_m1').checked = true;
                    $('#import_sin_cuantia_mercantil').trigger('change');
                    $('#nota_cs_mercantil').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas')
                    $('#nota_ca_mercantil').html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas')  
                    break;
                case 'PJ': // Presencia En Junta
                    $('#div_folios_matriz_mercantil').show();
                    $("#alert_folios_matriz_mercantil").html('').hide();
                    $('#div_capital_mercantil').hide();
                    $('#total_s_cuantia_mercantil').val('1')
                    $('#div_importe_compra').hide();
                    $('#folios_mercantil').val('8').attr("readonly", false);
                    $('#folios_matriz_mercantil').val('8');
                    $('#folio_cs_mercantil').val('8');
                    $('#folio_ca_mercantil').val('8');
                    $('#folio_ce_mercantil').val('8');
                    $('#div_ce_mercantil').hide();
                    $('#div_empresa_mercantil').hide();
                    document.querySelector('#salida_m1').checked = true;
                    $('#salida_m1').trigger('change');
                    $('#nota_cs_mercantil').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas')
                    $('#nota_ca_mercantil').html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas')  
                    break;
                        
                        
                    
            }

			// setTimeout(() => {
			// 	historico_poderes();
			// }, 10000);
		}else{
            $('#body_mercantil').hide();
        }
    });  

/////// ejecutar el calculo////////
    $("#capital_social_mercantil").on("change",function(e){
		e.preventDefault();
        console.log($('#capital_social_mercantil').val());
        var base= parseFloat($('#capital_social_mercantil').val().replace(/\./g,'').replace(',','.'));
        if (isNaN(base))
        {
          $('#capital_social_mercantil').addClass('border border-danger alert_input');
          setTimeout(function(){ $('#capital_social_mercantil').removeClass('border border-danger alert_input'),  $('#capital_social_mercantil').val('')}, 1200);
          return false;
        }
          monto= formatear_cifras_moneda(base);
          $("#capital_social_mercantil").val(monto);
    });
    $("#importe_compra_mercantil").on("change",function(e){
		e.preventDefault();
        console.log($('#importe_compra_mercantil').val());
        var base= parseFloat($('#importe_compra_mercantil').val().replace(/\./g,'').replace(',','.'));
        if (isNaN(base))
        {
          $('#importe_compra_mercantil').addClass('border border-danger alert_input');
          setTimeout(function(){ $('#importe_compra_mercantil').removeClass('border border-danger alert_input'),  $('#importe_compra_mercantil').val('')}, 1200);
          return false;
        }
          monto= formatear_cifras_moneda(base);
          $("#importe_compra_mercantil").val(monto);
    });



    // ===============================================================================================================
    //                                  calcular presupuesto mercantil                    
    // ===============================================================================================================

    $('#btn_calcular_mercatil').on('click',function(e) {
        e.preventDefault();
        ///Variables predefinidas
        costeCe_honorarios  =   calcular_CEHONORARIOS();
        console.log('costeCe_honorarios: '+costeCe_honorarios);

           
        costeFolio_matriz=6.010121;
        costeCS=0.601012;
        costeCA=3.005060;
        costePapel=0.15;
        costeDiligencia=3.01;
        coste_aut_uno= 3.005060; //los 11 primeros folios
        coste_aut_dos= 1.502530; //a partir del folio 11
        coste_iva=21;
        coste_irpf=15;
        coste_salida = 18.03;

        mercantil=$("#tipo_mercantil").val();

        $('#resultado_mercantil').show('slow');
        $('#nom_tipo_mercantil').html($('select[name="tipo_mercantil"] option:selected').text());
        $('#input_merc_tipo_mercantil').val($('select[name="tipo_mercantil"] option:selected').text());
         
        console.log('mercantil : '+ mercantil);
                    // doc_sin_cuantia
                    
        // ===========================================================
        // Formulas para calcular el presupuesto
        // ===========================================================
            if (mercantil == 'DL')
                doc_sin_cuantia = 30.05; 
            else if (mercantil == 'ATR' || mercantil == 'PJ')
                doc_sin_cuantia = 36.06;
            else if ( mercantil == 'CN' || mercantil == 'TDS' || mercantil == 'CDS' || mercantil == 'EP' || mercantil == 'ME' || mercantil == 'PJ')
                doc_sin_cuantia = 30.05 * $('#total_s_cuantia_mercantil').val(); 
            else
            doc_sin_cuantia =  0;  

            importe_socio1 = cLegitimaciones = 0;
            importe_socio2 = 0;
            importe_socio3 = 0;
            importe_folio_timbrado = 0.15;
            //calcular folios matriz 
            folios_matriz= $('#folios_matriz_mercantil').val();
            Fmatriz = get_FoliosMatriz(folios_matriz);
            if (parseInt($('#ca_mercantil_add').val()) > 0 )
                folios_matriz= (parseInt($('#ca_mercantil_add').val()) + 1) * $('#folios_matriz_mercantil').val();

            // calcular cuantia1
            cuantia1 = costeCe_honorarios*0.95;
            cuantia1 = cuantia1 ? cuantia1: 0;
            // calcular cuantia2
            if (mercantil == 'RCS'){ 
                // cuantia2 = cuantia1;
                n_socios_r = $('#n_socios_restitucion').val();
                if (n_socios_r) {   
                    total_importe = cuantia1=0;
                    console.log("n_socios_r :"+n_socios_r);
                    n_socios_r ++; total_cuatia=0;
                    for (let i = 1; i < n_socios_r; i++) {
                        importe =  parseFloat($('#socio_'+i+'').val().replace(/\./g,'').replace(',','.'));
                        console.log('importe '+i+': '+importe);
                        if (importe > 0){
                            cuantia = calcular_CEHONORARIOS(importe)*0.95;
                            cuantia = cuantia.toFixed(2);
                            // crear los inputs del formulario
                            var inputs_cuantia = "<input type='hidden' readonly id='input_merc_doc_cuantia_"+i+"' value='"+ cuantia +"'name='doc_cuantia["+i+"]'>";        
                            $("#inputs_cuantia").append(inputs_cuantia);
                            console.log('cuantia '+i+': '+cuantia);
                            // crear los div's para mostrar
                            $("#result_merc_import_socio_"+i).html(formatear_cifras_moneda(cuantia));
                            total_cuatia= parseFloat(total_cuatia)+parseFloat(cuantia); 
                            total_importe= parseFloat(total_importe)+parseFloat(importe); 
                        }else{
                            $('#socio_'+i+'').addClass('border border-danger alert_input');
                            $('.alert_monto_restitucio').html('Ingrese el Importe').show('slow');
                            $('#resultado_mercantil').hide('slow');
                            $([document.documentElement, document.body]).animate({
                                scrollTop: $("#div_capital_mercantil").offset().top - 10
                             }, 200);
                            setTimeout(() => {
                                $('#socio_'+i+'').removeClass('border border-danger alert_input');
                                $('.alert_monto_restitucio').html('').hide('slow');
                            },4500);
                        }
                    }
                    capital = parseFloat($('#capital_social_mercantil').val().replace(/\./g,'').replace(',','.'));
                    if (total_importe != capital) {
                        $('.alert_monto_restitucio').html('La suma de los importes de los socios es distita al capital a reducir').show('slow');
                        $('#resultado_mercantil').hide('slow');
                        $("#div_importe_restitucion_socios").addClass('border border danger rounded alert alert-danger')
                        $([document.documentElement, document.body]).animate({
                            scrollTop: $("#div_capital_mercantil").offset().top - 10
                         }, 200);
                        setTimeout(() => {
                            $('#socio_'+i+'').removeClass('border border-danger alert_input');
                            $('.alert_monto_restitucio').html('').hide('slow');
                            $("#div_importe_restitucion_socios").removeClass('border border danger rounded alert alert-danger')
                        },5500);
                    }
                }
            }
            
            if (mercantil == 'DL') {
                n_socios = $('#n_socios_liquidacion').val();
               $('#inputs_cuantia').html('');
                if (n_socios > 0) {
                    cuantia1=0;
                    n_socios ++; total_cuatia=0;
                    for (let i = 1; i < n_socios; i++) {
                        importe =  parseFloat($('#socio_'+i+'').val().replace(/\./g,'').replace(',','.'));
                        console.log('importe '+i+': '+importe);
                        if (importe > 0){
                            cuantia = calcular_CEHONORARIOS(importe)*0.95;
                            cuantia = cuantia.toFixed(2);
                            // crear los inputs del formulario
                            var inputs_cuantia = "<input type='hidden' readonly id='input_merc_doc_cuantia_"+i+"' value='"+ cuantia +"'name='doc_cuantia["+i+"]'>";        
                            $("#inputs_cuantia").append(inputs_cuantia);
                            console.log('cuantia '+i+': '+cuantia);
                            // crear los div's para mostrar
                            $("#result_merc_import_socio_"+i).html(formatear_cifras_moneda(cuantia));
                            total_cuatia= parseFloat(total_cuatia)+parseFloat(cuantia);
                        }                         
                    }
                    
                }
                
            }
           
            // cuantia2 = cuantia3 = 0;
            
            //calcular compia simple
            if (parseInt($('#cs_mercantil_add').val()) > 0 )
                cs_add= (parseInt($('#cs_mercantil_add').val()) + parseInt($('#cs_mercantil').val()));
            else
                cs_add= $('#cs_mercantil').val();
            simple = get_CosteSimple(cs_add, $('#folio_cs_mercantil').val());

            //calcular autorizada
            if (parseInt($('#ca_mercantil_add').val()) > 0 )
                ca_add= (parseInt($('#ca_mercantil_add').val()) + parseInt($('#ca_mercantil').val()));
            else
                ca_add= $('#ca_mercantil').val();
            autorizada = get_CosteAutorizada(ca_add,$('#folio_ce_mercantil').val());
    
            //calcular electrónica
            electronica = get_CosteAutorizada($('#ce_mercantil').val(),$('#folio_ce_mercantil').val());

            //calculcar testimonio n_horas_testimonios_transferencia
            if(mercantil == 'ACS' || mercantil=='RCS' || mercantil == 'DL')
                cTestimonio = get_CosteTestimonios(1, $('#n_horas_testimonios_transferencia').val());
            else
                cTestimonio = get_CosteTestimonios(1, $('#n_horas_transferencia_dianera').val());

           

            //calculcar testimonio
            cDiligencias = 1*costeDiligencia;

            //calculcar legitimaciones 
            if(mercantil == 'ACS' || mercantil=='RCS' || mercantil == 'DL' || mercantil == 'CN' || mercantil == 'TDS' ||  mercantil == 'CDS' ||  mercantil == 'EP')
                cLegitimaciones = get_CosteLegitimacion(1, $('#firmas_legitimadas_mercantil').val());

            salida = coste_salida*$('#n_horas_salida').val();


            // ================================ojo con este parche================================
            if (mercantil == 'CPS')
            electronica =  cTestimonio = 0;

            if (mercantil == 'ATR')
                cTestimonio = cDiligencias = electronica = Fmatriz = 0;

            if (mercantil == 'CN' || mercantil == 'TDS' || mercantil == 'CDS' || mercantil == 'EP' ||  mercantil == 'ME')
                electronica = cDiligencias = 0;
            
            if (mercantil == 'PJ') 
                electronica = 0;
            //================================ ojo con este parche================================

        

        // ===========================================================
        // Habilitar y deshabilitar los div's segun el tipo de mercatil y valor
        // ===========================================================
            $('#mercantil_text').html($('#tipo_mercantil').find('option:selected').text());
        
            // CAPITAL
            capital = parseFloat($('#capital_social_mercantil').val().replace(/\./g,'').replace(',','.'));
            if (capital>0) 
                $('#div_result_capital_social').show();
            else
                $('#div_result_capital_social').hide();
      
            //DOC_SIN_CUANTIA
            if (doc_sin_cuantia > 0)
                $('#div_result_doc_sin_cuantia').show();
            else
                $('#div_result_doc_sin_cuantia').hide();

            //cuantia1
            if (cuantia1 > 0){
                $('#div_result_doc_cuantia1').show();
                $('#result_merc_doc_cuantia_1').html(formatear_cifras_moneda(cuantia1));
                $('#input_merc_cuantia1').val(formatear_cifras_moneda(cuantia1));
            }else{
                $('#div_result_doc_cuantia1').hide();
                $('#input_merc_cuantia1').val('');
            }
            
            // //cuantia2
            // if (cuantia2 > 0 && (mercantil=='RCS' || mercantil =='DL'))
            //     $('#div_result_doc_cuantia2').show();
            // else
            //     $('#div_result_doc_cuantia2').hide();
            
            // //cuantia3
            // if (cuantia3 > 0 && (mercantil=='RCS' || mercantil =='DL'))
            //     $('#div_result_doc_cuantia3').show();
            // else
            //     $('#div_result_doc_cuantia3').hide(); 
            
            //SALIDA
            if (salida > 0)
                $('#div_result_salida').show();
            else
                $('#div_result_salida').hide();
                
            //MATRIZ
            if (Fmatriz > 0) 
                $('#div_result_folio_matriz').show();
            else
                $('#div_result_folio_matriz').hide();
                
            //LEGITIMACIONES
            if (cLegitimaciones > 0) 
                $('#div_result_legitimaciones').show();
            else
                $('#div_result_legitimaciones').hide();

            //electronica
            if (electronica > 0) 
                $('#div_result_copia_electronica_f').show();
            else
                $('#div_result_copia_electronica_f').hide();                

            //Testimonios
            if (cTestimonio > 0) 
                $('#div_result_testimonios').show();
            else
                $('#div_result_testimonios').hide();

            //Diligencias
            if (cDiligencias > 0) 
                $('#div_result_diligencias').show();
            else
                $('#div_result_diligencias').hide();
                

            //import_socio1   
            if (importe_socio1 > 0)  
                $('#div_result_import_socio1').show();
            else
                $('#div_result_import_socio1').hide();          

            //import_socio2
            if (importe_socio2 > 0)  
                $('#div_result_import_socio2').show();
            else
                $('#div_result_import_socio2').hide();           

            //import_socio3
            if (importe_socio3 > 0)  
                $('#div_result_import_socio3').show();
            else
                $('#div_result_import_socio3').hide();  

                console.log('=======================================');
                console.log('doc_sin_cuantia' +doc_sin_cuantia);
                console.log('cuantia1' +cuantia1);
                // console.log('cuantia2' +cuantia2);
                // console.log('cuantia3' +cuantia3);
                console.log('importe_socio1' +importe_socio1);
                console.log('importe_socio2' +importe_socio2);
                console.log('importe_socio3' +importe_socio3);
                console.log('Fmatriz' +Fmatriz);
                console.log('simple' +simple);
                console.log('autorizada' +autorizada);
                console.log('electronica' +electronica);
                console.log('cTestimonio' +cTestimonio);
                console.log('cDiligencias' +cDiligencias);
                console.log('cLegitimaciones' +cLegitimaciones);
                console.log('salida' +salida);

                if (mercantil != 'DL') 
                 total_cuatia = parseFloat(cuantia1);
                 
                 console.log('total_cuatiaÇ: '+total_cuatia);
            coste = 
                parseFloat(doc_sin_cuantia)+
                parseFloat(total_cuatia)+
                parseFloat(importe_socio1)+
                parseFloat(importe_socio2)+
                parseFloat(importe_socio3)+
                parseFloat(Fmatriz)+
                parseFloat(simple)+
                parseFloat(autorizada)+
                parseFloat(electronica)+
                parseFloat(cTestimonio)+
                parseFloat(cDiligencias)+
                parseFloat(cLegitimaciones)+
                parseFloat(salida)+
                parseFloat(9.03);
            iva_mercantil   =   coste*21/100;
            irpf_mercantil  =   coste*15/100;

            papel_timbrado_mercantil =(1+( parseInt(folios_matriz) +( parseInt($('#folio_ca_mercantil').val()) * parseInt($('#ca_mercantil').val()) ))) * parseFloat(importe_folio_timbrado);
            
            coste_liquido_mercantil = coste + iva_mercantil - irpf_mercantil + papel_timbrado_mercantil;
            
        // cargar los inputs del form
        $("#input_merc_tipo_solicitud").val('MERCANTIL');
        $("#input_merc_empresa").val('Es una empresa');
        $("#input_merc_capital_social").val(formatear_cifras_moneda(capital));
        $("#input_merc_sin_cuantia").val(formatear_cifras_moneda(doc_sin_cuantia));
        $("#input_merc_folio_matriz").val(formatear_cifras_moneda(Fmatriz));
        $("#input_merc_copia_simple_f").val(formatear_cifras_moneda(simple));
        $("#input_merc_copia_autorizada_f").val(formatear_cifras_moneda(autorizada));
        $("#input_merc_copia_electronica_f").val(formatear_cifras_moneda(electronica));
        $("#input_merc_salida").val(formatear_cifras_moneda(salida));
        $("#input_merc_testimonios").val(formatear_cifras_moneda(cTestimonio));
        $("#input_merc_diligencias").val(formatear_cifras_moneda(cDiligencias));
        $("#input_merc_legitimaciones").val(formatear_cifras_moneda(cLegitimaciones));
        $('#input_merc_iva').val(formatear_cifras_moneda(iva_mercantil));
        $('#input_merc_irpf').val(formatear_cifras_moneda(irpf_mercantil));
        $('#input_merc_papel').val(formatear_cifras_moneda(papel_timbrado_mercantil));
        $('#input_merc_liquido').val(formatear_cifras_moneda(coste_liquido_mercantil));
        $('#input_merc_honorarios').val(formatear_cifras_moneda(coste));
        // cargara la vista del form
        $("#result_merc_empresa").html('Es una empresa').addClass('font-italic');
        $("#result_merc_capital_social").html(formatear_cifras_moneda(capital));
        $("#result_merc_sin_cuantia").html(formatear_cifras_moneda(doc_sin_cuantia));
        $('#result_merc_folio_matriz').html(formatear_cifras_moneda(Fmatriz));
        $('#result_merc_copia_simple_f').html(formatear_cifras_moneda(simple));
        $('#result_merc_copia_autorizada_f').html(formatear_cifras_moneda(autorizada));
        $('#result_merc_copia_electronica_f').html(formatear_cifras_moneda(electronica));
        $('#result_merc_salida').html(formatear_cifras_moneda(salida));
        $('#result_merc_testimonios').html(formatear_cifras_moneda(cTestimonio));
        $('#result_merc_diligencias').html(formatear_cifras_moneda(cDiligencias));
        $('#result_merc_legitimaciones').html(formatear_cifras_moneda(cLegitimaciones));
        $('#result_merc_honorarios').html(formatear_cifras_moneda(coste));
        $('#result_merc_iva').html(formatear_cifras_moneda(iva_mercantil));
        $('#result_merc_irpf').html(formatear_cifras_moneda(irpf_mercantil));
        $('#result_merc_papel').html(formatear_cifras_moneda(papel_timbrado_mercantil));
        $('#result_merc_liquido').html(formatear_cifras_moneda(coste_liquido_mercantil));
        
    })


    // ===========================================================================
    // ===========================================================================
    $(document).on('click', '#btn_email_mercantil', function(e){
        e.preventDefault();
        $('#btn_email_mercantil').hide();
        $('#div_enviar_mail_mercantil').show('slow');
        $('#btn_enviar_mercantil').show('slow');
    });

    // ===========================================================================
    // ===========================================================================
    $(document).on('click', '#btn_enviar_mercantil', function(e){
        e.preventDefault();
        email = validarEmail($('#email_mercantil').val());
        $("#loading_segundascopias").hide();
        $('.terminos, .terminos_link').removeClass('text-danger');
        terminos= $(document).find("input[type='checkbox'][name='terminos']:checked");
        if (email == true) {	
            if (terminos.val() == 'OK') {
                $("#btn_enviar_mercantil").hide();
                $("#loading_mercantil").show();    
                grecaptcha.ready(function() {
                    grecaptcha.execute('6LdCoVEqAAAAAHPOAqmBgukE9w8LJUHsfaXJbS6a', {action: 'submit'}).then(function(token) {
                        $("#form_enviar_mercantil_by_mail").append("<input type='hidden' name='g-recaptcha-response' value='" + token + "' />");
                        $.ajax({
                            method: 'POST',
                            url: "/Printer_budget/enviar_by_mail",
                            data: $("#form_enviar_mercantil_by_mail").serialize(),
                            success: function (data) {
                                if (data.redirection) {
                                    Swal.fire({
                                        position: 'top-end',
                                        icon: 'success',
                                        title: 'Presupuesto Enviado..!',
                                        showConfirmButton: false,
                                        timer: 2500
                                        }).then((result) => {
                                            location.reload();
                                        });
                                }else {
                                    Swal.fire({
                                        icon: "error",
                                        title: "La verificación recaptcha ha fallado:  'No eres Humano'",
                                      });
                                }
                             }
                        }); 
                    });
                  });
            }else{
                $('.terminos, .terminos_link').addClass('text-danger');
            }
        }else{
            $('#email_mercantil').addClass('alert_input');
        }

    });


});  