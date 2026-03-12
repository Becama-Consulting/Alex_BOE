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
///////////////////////////////////////////////////////////////////////////////
    // =================================================================
    //            FUNCTION CHANGE select tipo_sucesiones  
    // =================================================================      
        $("#tipo_sucesiones").on("change",function(e){
            // inicializa los diferente div para cada tipo de registro 
            sucesiones=$("#tipo_sucesiones").val();
            $('#input_sucesiones_tipo_solicitud').val('SUCESIONES');
            $('#resultado_sucesiones').hide();
            $('#div_numero_folios').hide(); 
            $('#div_cs_sucesiones').hide();
            $('#div_salida_sucesiones').hide();
            $('#div_ca_sucesiones').hide();
            $('#div_ce_sucesiones').hide();
            $('#div_ultima_volutandes').hide();
            $('#div_libro_familia').hide();
            $('#docs_confirmados_sucesiones').hide();
            $('#confirmar_docs_sucesiones').hide();
            $('#div_incorporar_docuemnto_sucesiones').hide();
            $('#div_folios_por_documentos').hide();
            $('#div_valor_cuantia').hide();
            $('#docs_derechos_hereditarios').hide();
            $('#div_finca_sucesiones,#div_finca-bienes, #div_importe_fincas, #div_donar-dinero, #div_monto_dinero').hide();
            $('#div_numero_fincas, #div_n_fincas_heredadas, #div_n_cuentas_heredadas, #div_n_muebles_heredadas').hide();
            $('#nota_folios_sucesiones').html('');
            $('#div_confirmado_1, #div_confirmado_2, #div_confirmado_3, #div_confirmado_4, #div_confirmado_5, #docs_unidos').hide();
            $('#div_n_herederos, #div_herederan_fincas-inmuebles, #div_herederan_cuentas-fondos, #div_herederan_otro-bien').hide();
            $("#folios_agregados_por_documentos, #div_importes_por_herederos, #div_res_doc_con_cuantia_herederos, #input_doc_con_cuantia_herederos").html('');                                    
            // inicializar los inputs
            $('#ca_sucesiones, #ce_sucesiones, #ca_sucesiones_add, #cs_sucesiones_add').val(0)
            $('#docs_confirmado_1, #docs_confirmado_2,#docs_confirmado_3,#docs_confirmado_4,#docs_confirmado_5, #n_folios_por_documentos').val(0);
            $('#n_herederos').val('');

            if (sucesiones!='#') {
                console.log(sucesiones);
                $('#body_sucesiones').show('slow');
                switch(sucesiones) {
                    case 'TE': // Testamento
                        // div's a mosrar
                        $('#div_numero_folios').show();
                        $('#div_cs_sucesiones').show();
                        $('#div_salida_sucesiones').show();
                        // inicializar los inputs
                        $('#n_folios_sucusiones').val(3);
                        $('#cs_sucesiones').val(1);
                        $('#cs_sucesiones_add').val('0'); 
                        document.querySelector('#salida_Sucesiones2').checked = true;

                        // alertas predeterminadas                        
                        $('#nota_folios_sucesiones').html('Por defecto se presupuestan 3 Folios, Si el testamento es más extenso en cuanto al detalle y la complejidad del mismo, indicar el nº de folios adicionales que cree que ocupara ese detalle.')
                        break;   
                    
                    case 'DH': //Declaracion de Herederos
                        // div's a mosrar
                        $('#div_numero_folios').show();
                        $('#div_cs_sucesiones').show();
                        $('#div_ca_sucesiones').show();
                        $('#div_ce_sucesiones').show();
                        $('#div_salida_sucesiones').show();
                        $('#confirmar_docs_sucesiones').show();
                        $('#div_ultima_volutandes').show();
                        $('#div_libro_familia').show();
                        $('#docs_confirmados_sucesiones').show();
                        $('#div_confirmado_1, #div_confirmado_2, #div_confirmado_3').show();
                        $('.text_confirmado_1').html('• Certificado defunción');
                        $('.text_confirmado_2').html('• Ultimas Voluntades');
                        $('.text_confirmado_3').html('• Libro de Familia');
                        $('.text_confirmado_4').html('• DNI causante');
                        $('#div_incorporar_docuemnto_sucesiones').show();
                        document.querySelector('#salida_Sucesiones2').checked = true;
                        document.querySelector('#incorporar_docuemnto2').checked = true;
                         // inicializar los inputs
                         $('#n_folios_sucusiones').val(8);
                         $('#cs_sucesiones_add').val(0); 
                         $('#cs_sucesiones').val(1);
                         $('#ca_sucesiones').val(1);
                         $('#docs_confirmado_1').val(1);
                         $('#docs_confirmado_2').val(2);
                         $('#docs_confirmado_3').val(4);
                         $('#docs_confirmado_4').val(1);
                        break;  
                        
                    case 'RH': //Renuncia de herencia
                        $('#div_numero_folios').show();
                        $('#div_cs_sucesiones').show();
                        $('#div_ca_sucesiones').show();
                        $('#div_ce_sucesiones').show();
                        $('#div_salida_sucesiones').show();
                        $('#confirmar_docs_sucesiones').show();
                        $('#docs_confirmados_sucesiones').show();
                        $('#div_incorporar_docuemnto_sucesiones').show();
                        $('#div_confirmado_1').show();
                        $('.text_confirmado_1').html('• Certificado defunción')


                         // inicializar los inputs
                         $('#n_folios_sucusiones').val(3);
                         $('#cs_sucesiones').val(1);
                         $('#ca_sucesiones').val(1);
                         $('#ce_sucesiones').val(0);
                         $('#cs_sucesiones_add').val(0); 
                         document.querySelector('#salida_Sucesiones2').checked = true;
                         document.querySelector('#incorporar_docuemnto2').checked = true;
                         $('#docs_confirmado_1').val(1);
                        break; 
                        
                    case 'UV': //Ultimas voluntades o testamento vital
                        $('#div_numero_folios').show();
                        $('#div_cs_sucesiones').show();
                        $('#div_ca_sucesiones').show();
                        $('#div_ce_sucesiones').show();
                        $('#div_salida_sucesiones').show();
                        $('#div_incorporar_docuemnto_sucesiones').show();
                        
                        // inicializar los inputs
                        $('#n_folios_sucusiones').val(4);
                        $('#cs_sucesiones').val(1);
                        $('#ca_sucesiones').val(1);
                        $('#ce_sucesiones').val(0);
                        $('#cs_sucesiones_add').val(0);
                        document.querySelector('#salida_Sucesiones2').checked = true;
                        document.querySelector('#incorporar_docuemnto2').checked = true; 
                        break;
                    
                    case 'ACS': //Acta de certificado sucesorio europeo
                        $('#div_numero_folios').show();
                        $('#div_cs_sucesiones').show();
                        $('#div_ca_sucesiones').show();
                        $('#div_ce_sucesiones').show();
                        $('#div_salida_sucesiones').show();
                        $('#div_confirmado_1').show();
                        $('.text_confirmado_1').html('• Documentos Unidos');
                        // $('.text_confirmado_2').html('• Documento2-pendiente concretar');
                        // $('.text_confirmado_3').html('•Documento3-pendiente concretar');
                        $('#confirmar_docs_sucesiones').show();
                        $('#docs_confirmados_sucesiones').show();
                        $('#div_incorporar_docuemnto_sucesiones').show();

                        // inicializar los inputs
                        $('#n_folios_sucusiones').val(11);
                        $('#cs_sucesiones').val(1);
                        $('#ca_sucesiones').val(1);
                        $('#ce_sucesiones').val(0);
                        document.querySelector('#salida_Sucesiones2').checked = true;
                        document.querySelector('#incorporar_docuemnto2').checked = true; 
                        $('#docs_confirmado_1').val(6);
                        // $('#docs_confirmado_2').val(1);
                        // $('#docs_confirmado_3').val(1);
                        break;

                    case 'ELD': //Entrega de legitima dineraria
                        $('#div_valor_cuantia').show();
                        $('#div_numero_folios').show();
                        $('#div_cs_sucesiones').show();
                        $('#div_ca_sucesiones').show();
                        $('#div_ce_sucesiones').show();
                        $('#div_salida_sucesiones').show();
                        $('#div_confirmado_1').show();
                        $('.text_confirmado_1').html('• Hoja de la transferencia');
                        $('#confirmar_docs_sucesiones').show();
                        $('#docs_confirmados_sucesiones').show();
                        $('#div_incorporar_docuemnto_sucesiones').show();

                        // inicializar los inputs
                        $('#valor_cuantia_sucesiones').val('6.000,00 €')
                        $('#n_folios_sucusiones').val(11);
                        $('#cs_sucesiones').val(1);
                        $('#ca_sucesiones').val(1);
                        $('#ce_sucesiones').val(0);
                        $('#cs_sucesiones_add').val(0);
                        document.querySelector('#salida_Sucesiones2').checked = true;
                        document.querySelector('#incorporar_docuemnto2').checked = true; 
                        $('#docs_confirmado_1').val(1);

                        break;   

                    case 'ELB': //Entrega de legitima dineraria
                        $('#div_finca_sucesiones').show();
                        $('#div_numero_folios').show();
                        $('#div_cs_sucesiones').show();
                        $('#div_ca_sucesiones').show();
                        $('#div_ce_sucesiones').show();
                        $('#div_salida_sucesiones').show();
                        $('#div_confirmado_1, #div_confirmado_2, #div_confirmado_3').show();
                        $('#div_numero_fincas').show();
                        $('#docs_confirmado_1').val(3);
                        $('#docs_confirmado_2').val(1);
                        $('#docs_confirmado_3').val(3);
                        $('#docs_confirmado_4').val(2);
                        $('#docs_confirmado_5').val(1);
                        $('.text-fincas').html('Valor de las Fincas entregadas');
                        $('.text_confirmado_1').html('• Nota Simple de la finca');
                        $('.text_confirmado_2').html('• Certificado de Deudas Comunidad');
                        $('.text_confirmado_3').html('• Certificado Energético');
                        $('#confirmar_docs_sucesiones').show();
                        $('#docs_confirmados_sucesiones').show();
                        $('#div_incorporar_docuemnto_sucesiones').show();
                        $('#div_numero_fincas').removeClass('mt-3').addClass('mt-5');

                        // inicializar los inputs
                        $('#valor_fincas_sucesiones').val('100.000,00 €')
                        $('#n_folios_sucusiones').val(11);
                        $('#n_fincas_sucusiones').val(1);
                        $('#cs_sucesiones').val(1);
                        $('#ca_sucesiones').val(1);
                        $('#ce_sucesiones').val(0);
                        $('#cs_sucesiones_add').val(0);
                        document.querySelector('#salida_Sucesiones2').checked = true;
                        document.querySelector('#incorporar_docuemnto2').checked = true; 
                        break;  
                        
                                     //Venta de derechos hereditarios ¿? Dinerarios ¿? O no inmuebles
                    case 'VDH':  //Venta de derechos hereditarios (bienes inmuebles)
                        $('#div_finca_sucesiones, #div_finca-bienes').show();
                        $('#div_numero_fincas').addClass('mt-3').removeClass('mt-5');
                        $('#div_numero_folios').show();
                        $('#div_cs_sucesiones').show();
                        $('#div_ca_sucesiones').show();
                        $('#div_ce_sucesiones').show();
                        $('#div_salida_sucesiones').show();
                        $('#docs_derechos_hereditarios').show();
                        $('#div_numero_fincas').show();
                        $('#div_confirmado_1, #div_confirmado_2, #div_confirmado_3').show();
                        $('.text-fincas').html('Valor de las Fincas entregadas/Derecho heriditario');
                        $('.text-vendemos-donamos').html('¿Vendemos fincas o bienes muebles/dinerarios?')
                        $('.text_confirmado_1').html('• Nota Simple de la finca');
                        $('.text_confirmado_2').html('• Certificado de Deudas Comunidad');
                        $('.text_confirmado_3').html('• Certificado Energético');
                        $('.text_confirmado_4').html('• Catastro');
                        $('.text_confirmado_5').html('• Consulta Deudas IBI');
                        $('#confirmar_docs_sucesiones').show();
                        $('#docs_confirmados_sucesiones').show();
                        $('#div_incorporar_docuemnto_sucesiones').show();
                        document.querySelector('#fincas-bienes_inmuebles1').checked = true; 
                        document.querySelector('#salida_Sucesiones2').checked = true;
                        document.querySelector('#incorporar_docuemnto2').checked = true; 
                        $('#valor_fincas_sucesiones').val('100.000,00 €');
                        $('#n_fincas_sucusiones').val(1);
                        $('#n_folios_sucusiones').val(11);
                        $('#cs_sucesiones_add').val(0); 
                        $('#cs_sucesiones').val(1);
                        $('#ca_sucesiones').val(1);
                        $('#ce_sucesiones').val(0);
                        $('#docs_confirmado_1').val(3);
                        $('#docs_confirmado_2').val(1);
                        $('#docs_confirmado_3').val(3);
                        $('#docs_confirmado_4').val(2);
                        $('#docs_confirmado_5').val(1);
                        $('#docs_derechos_h_1').val(1);
                        $('#docs_derechos_h_2').val(1);
                        $('#docs_derechos_h_3').val(1);
                        $('#docs_derechos_h_4').val(2);
                        $('#docs_derechos_h_5').val(1);
                        $('#docs_derechos_h_6').val(1);
                        break;

                    case 'DO':  //Donación
                        $('#div_finca-bienes, #div_numero_fincas, #div_importe_fincas').show();
                        $('#div_donar-dinero').show();
                        $('#div_cs_sucesiones').show();
                        $('#div_ca_sucesiones').show();
                        $('#div_ce_sucesiones').show();
                        $('#div_salida_sucesiones, #div_incorporar_docuemnto_sucesiones').show();
                        $('#confirmar_docs_sucesiones, #docs_confirmados_sucesiones').show();
                        $('#div_confirmado_1, #div_confirmado_2, #div_confirmado_3').show();
                        $('.text-vendemos-donamos').html('¿Donamos fincas o inmuebles?');
                        $('.text_confirmado_1').html('• Nota Simple de la finca');
                        $('.text_confirmado_2').html('• Certificado de Deudas Comunidad');
                        $('.text_confirmado_3').html('• Certificado Energético');
                        $('.text_confirmado_4').html('• Catastro');
                        $('.text_confirmado_5').html('• Consulta Deudas IBI');
                        $('#n_fincas_sucusiones').val(1);
                        $('#importe_dinero, #importe_finca').val('');
                        $('#cs_sucesiones').val(1);
                        $('#ca_sucesiones').val(1);
                        $('#ce_sucesiones').val(0);
                        $('#cs_sucesiones_add').val(0); 
                        $('#docs_confirmado_1').val(3);
                        $('#docs_confirmado_2').val(1);
                        $('#docs_confirmado_3').val(3);
                        $('#docs_confirmado_4').val(2);
                        $('#docs_confirmado_5').val(1);
                        document.querySelector('#fincas-bienes_inmuebles1').checked = true; 
                        document.querySelector('#salida_Sucesiones2').checked = true;
                        document.querySelector('#donar_dinero2').checked = true; 
                        document.querySelector('#incorporar_docuemnto2').checked = true; 
                        break;

                    case 'AH':
                    case 'HE':
                        $('#div_n_herederos').show();
                        $('#div_herederan_fincas-inmuebles').show();
                        $('#div_herederan_cuentas-fondos').show();
                        $('#div_herederan_otro-bien').show();
                        $('#div_cs_sucesiones').show();
                        $('#div_ca_sucesiones').show();
                        $('#div_n_fincas_heredadas, #div_n_cuentas_heredadas').show();
                        $('#div_confirmado_1, #confirmar_docs_sucesiones, #docs_confirmados_sucesiones, #docs_unidos').show();
                        $('#div_salida_sucesiones').show();
                        $('#div_importes_por_herederos').html('');
                        $('.text_confirmado_1').html('• Nota Simple de la finca');
                        $('#cs_sucesiones').val(1);
                        $('#ca_sucesiones').val(1);
                        $('#ce_sucesiones').val(0);
                        $('#docs_confirmado_1').val(3);
                        $('#docs_confirmado_2').val(2);
                        $('#doc_unidos_1,#doc_unidos_2,#doc_unidos_4').val(1);
                        $('#doc_unidos_3').val(3);
                        $('#n_fincas_heredadas').val(2);
                        $('#n_cuentas_heredadas').val(3);
                        document.querySelector('#h_fincas-inmuebles1').checked = true;
                        document.querySelector('#h_cuentas-fondos1').checked = true;
                        document.querySelector('#h_otro-bien_mueble2').checked = true;
                        document.querySelector('#salida_Sucesiones2').checked = true;

                        break;
                }
            }else{
                $('#body_sucesiones').hide();
            }
        });  

    // ===============================================================================================================
    //                                 change div_valor_cuantia
    // ===============================================================================================================
        $("#valor_cuantia_sucesiones").on("change",function(e){
            e.preventDefault();
            console.log($('#valor_cuantia_sucesiones').val());
            var base= parseFloat($('#valor_cuantia_sucesiones').val().replace(/\./g,'').replace(',','.'));
            if (isNaN(base))
            {
            $('#valor_cuantia_sucesiones').addClass('border border-danger alert_input');
                tipo_sucesion = $("#tipo_sucesiones").val(); 
                monto_base = tipo_sucesion == 'ELD' ? "6.000,00 €" : '';
            setTimeout(function(){ $('#valor_cuantia_sucesiones').removeClass('border border-danger alert_input'),  $('#valor_cuantia_sucesiones').val(monto_base)}, 1200);
            return false;
            }
            monto= formatear_cifras_moneda(base);
            $("#valor_cuantia_sucesiones").val(monto);
        });


    // ===============================================================================================================
    //                                 change valor_fincas_sucesiones
    // ===============================================================================================================
    $("#valor_fincas_sucesiones").on("change",function(e){
        e.preventDefault();
        console.log($('#valor_fincas_sucesiones').val());
        var base= parseFloat($('#valor_fincas_sucesiones').val().replace(/\./g,'').replace(',','.'));
        if (isNaN(base))
        {
        $('#valor_fincas_sucesiones').addClass('border border-danger alert_input');
            tipo_sucesion = $("#tipo_sucesiones").val(); 
            monto_base = tipo_sucesion == 'ELB' ? "100.000,00 €" : '';
        setTimeout(function(){ $('#valor_fincas_sucesiones').removeClass('border border-danger alert_input'),  $('#valor_fincas_sucesiones').val(monto_base)}, 1200);
        return false;
        }
        monto= formatear_cifras_moneda(base);
        $("#valor_fincas_sucesiones").val(monto);
    });

       // ===============================================================================================================
    //                                  validar el numero de folios segun tipo de sucesión
    // ===============================================================================================================
    $(".docs_confirmado").on("change",function(e){
        doc_confirmado = $(this).prop("id"); 
        valor = $(this).val();
        tipo_sucesion =$("#tipo_sucesiones").val();

        switch(doc_confirmado) {
         case 'docs_confirmado_1':
            if (tipo_sucesion =='VDH' && valor < 2) {
                $(this).addClass("border border-danger bg-danger bg-opacity-25");
                $('.text_confirmado_1').append("<div class='nota ps-3 text_confirmado'> Número mínimo 2</div>");
                setTimeout(() => {
                    $(this).removeClass("border border-danger bg-danger bg-opacity-25").val(3);
                    $('.text_confirmado').remove();
                }, 2000);
            }
            if (tipo_sucesion =='ACS' && valor < 6) {
                $(this).addClass("border border-danger bg-danger bg-opacity-25");
                $('.text_confirmado_1').append("<div class='nota ps-3 text_confirmado'> Número mínimo 6</div>");
                setTimeout(() => {
                    $(this).removeClass("border border-danger bg-danger bg-opacity-25").val(6);
                    $('.text_confirmado').remove();
                }, 2000);
            }
         break
         case 'docs_confirmado_2':
            if (tipo_sucesion =='VDH' && valor < 1) {
                $(this).addClass("border border-danger bg-danger bg-opacity-25");
                $('.text_confirmado_1').append("<div class='nota ps-3 text_confirmado'> Número mínimo 1</div>");
                setTimeout(() => {
                    $(this).removeClass("border border-danger bg-danger bg-opacity-25").val(1);
                    $('.text_confirmado').remove();
                }, 2000);
            }
         break
         case 'docs_confirmado_3':
            if (tipo_sucesion =='VDH' && valor < 3) {
                $(this).addClass("border border-danger bg-danger bg-opacity-25");
                $('.text_confirmado_1').append("<div class='nota ps-3 text_confirmado'> Número mínimo 3</div>");
                setTimeout(() => {
                    $(this).removeClass("border border-danger bg-danger bg-opacity-25").val(3);
                    $('.text_confirmado').remove();
                }, 2000);
            }
         break
         case 'docs_confirmado_4':
             alert(4)
         break
         case 'docs_confirmado_5':
             alert(5)
         break
        };


    });


    // ===============================================================================================================
    //                                  validar el numero de folios segun tipo de sucesión
    // ===============================================================================================================
        $("#n_folios_sucusiones").on("change",function(e){
            e.preventDefault();
            value  = $(this).val(); 
            sucesiones=$("#tipo_sucesiones").val();
            // Testamento
            $("#n_folios_sucusiones").val(value < 3 && sucesiones== 'TE'? 3 : value);
            
            // Declaracion de Herederos
            if (value < 8 && sucesiones== 'DH') {
                $('#nota_folios_sucesiones').html('El número mínimo de folios es 8');
                $("#n_folios_sucusiones").addClass("border border-danger bg-danger bg-opacity-25");
                setTimeout(() => {
                    $("#n_folios_sucusiones").removeClass("border border-danger bg-danger bg-opacity-25").val(8);
                    $('#nota_folios_sucesiones').html('');
                }, 2000);
            }

            //Renuncia de herencia
            if (value < 3 && sucesiones== 'RH') {
                $('#nota_folios_sucesiones').html('El número mínimo de folios es 3');
                $("#n_folios_sucusiones").addClass("border border-danger bg-danger bg-opacity-25");
                setTimeout(() => {
                    $("#n_folios_sucusiones").removeClass("border border-danger bg-danger bg-opacity-25").val(3);
                    $('#nota_folios_sucesiones').html('');
                }, 2000);
            }

            //Ultimas voluntades o testamento vital
            if (value < 3 && sucesiones== 'UV') {
                $('#nota_folios_sucesiones').html('El número mínimo de folios es 4');
                $("#n_folios_sucusiones").addClass("border border-danger bg-danger bg-opacity-25");
                setTimeout(() => {
                    $("#n_folios_sucusiones").removeClass("border border-danger bg-danger bg-opacity-25").val(4);
                    $('#nota_folios_sucesiones').html('');
                }, 2000);
            }

            //Acta de certificado sucesorio europeo
            if (value < 11 && sucesiones== 'ACS' || sucesiones== 'ELD' || sucesiones== 'ELB' || sucesiones == 'VDH') {
                $('#nota_folios_sucesiones').html('El número mínimo de folios es 11');
                $("#n_folios_sucusiones").addClass("border border-danger bg-danger bg-opacity-25");
                setTimeout(() => {
                    $("#n_folios_sucusiones").removeClass("border border-danger bg-danger bg-opacity-25").val(11);
                    $('#nota_folios_sucesiones').html('');
                }, 2000);
            }
        });

    // ===============================================================================================================
    //                                  validar el numero de Unidos Derechos Hereditarios
    // ===============================================================================================================
    $("#docs_derechos_h_3, #docs_derechos_h_5, #docs_derechos_h_6").on("change",function(e){
        e.preventDefault();
        value  = parseInt($(this).val().replace(/\./g,'').replace(',','.')); 
        console.log(value);
        $(this).val(value < 1 ? 1 : value);
    });
    $("#docs_derechos_h_4").on("change",function(e){
        e.preventDefault();
        value  = parseInt($(this).val().replace(/\./g,'').replace(',','.')); 
        console.log(value);
        $(this).val(value < 2 ? 1 : value);
    });
        

    // ===============================================================================================================
    //                                 numero de folios adicionales por documuento
    // ===============================================================================================================
        $("#n_folios_por_documentos").on("change",function(e){
            e.preventDefault();
            $("#folios_agregados_por_documentos").html('');
            $("#body_table_docs_agregados").html('');
            $("#tdbody_legitimaciones").html('');
            $("#resultado_legitimacion").hide();
            var numero=parseFloat($('#n_folios_por_documentos').val().replace(/\./g,'').replace(',','.'));
            for (i=1;i<=numero;i++)
            { 
                var elementos="<div class='group_docs border border-1 rounded m-1 mb-3 row' style='background-color: #eee;'> "+
                                "<div class='icon-box col-sm-12 col-md-6 my-auto' data-aos='zoom-in' data-aos-delay='150' style='padding-left: 6px;'>"+
                                    "<i class='bx bx-file'></i>"+
                                    "<h4 class='pt-2'>Documento "+i+"<div class='small fw-light'>Indique el Nº de hojas: </div> </h4> "+
                                "</div>"+
                                "<div data-aos='zoom-in' data-aos-delay='150' class='col-sm-12 col-md-5'>"+
                                    "<h6 class='p-2 pt-1 pb-1 mb-0 row'>"+
                                    "<div class='col-sm-12 col-md-6 my-auto'>"+
                                        ""+
                                    "</div>"+
                                    "<div class='col-sm-12 col-md-6 ps-4 py-auto' style='padding-left: 21px;padding-right: 2px;'>"+
                                    "<input type='text' class='form-control h6 solonumeros' style='text-align: center; margin-bottom: 5px; font-family: Open Sans;'  id='docs_folio"+i+"' name='docs_folio[]'>"+
                                    "</div>"+
                                    "</h6>"+
                                "</div>"+
                                "</div> ";
                        $("#folios_agregados_por_documentos").append(elementos);
    
                        var registro="<tr><td class='td_iten'>Documento "+i+"</td>"+
                                        "<td class='td_right' id='b_l"+i+"'>0</td>"+
                                        "<td class='td_right' id='e_l"+i+"'>0</td></tr>";
                        $("#body_table_docs_agregados").append(registro);
            }
          
    
        });

          // ===============================================================================================================
    //                                 numero de folios adicionales por documuento
    // ===============================================================================================================
    $("#n_herederos").on("change",function(e){
        e.preventDefault();
        $("#div_importes_por_herederos").html('');
        $("#body_table_herederos").html('');
        var numero=parseInt($('#n_herederos').val());
        console.log(numero);
        for (i=1;i<=numero;i++)
        { 

            var elementos= " <div class='icon-box mt-2 border rounded'  data-aos='zoom-in' data-aos-delay='150' style='background-color: #eee;'>\
                                <i class='bx bx-euro pt-2'></i>\
                                <h4 class='row d-flex'>\
                                <div class='col-md-8 col-sm-12 my-auto p-md-0' style='padding-left: 0px;'>\
                                        Importe Heredero "+i+"\
                                    <div class='nota pe-1' id='nota_folios_sucesiones'></div>\
                                </div>\
                                <div class='col-md-4 col-sm-12 ms-auto' style='padding-right: 6.5%;'>\
                                    <input type='text' class='form-control h6 my-input mb-0 importe_heredero' id='importe_heredero_"+i+"' name='importe_heredero[]'>\
                                </div>\
                                </h4>\
                            </div>";



            // var elementos= "<div class='icon-box col-sm-12 col-md-9 my-auto' data-aos='zoom-in' data-aos-delay='150' style='background-color: #eee;'>"+
            //                     "<i class='bx bx-euro'></i>"+
            //                     "<h4 class='pt-2'>Importe Heredero "+i+"</h4> "+
            //                 "</div>"+
            //                 "<div data-aos='zoom-in' data-aos-delay='150' class='col-sm-12 col-md-3'>"+
            //                     "<input type='text' class='form-control h6' style='text-align: center; margin-bottom: 5px; font-family: Open Sans;'  id='importe_heredero_"+i+"' name='docs_folio[]'>"+
            //                 "</div>";
                    $("#div_importes_por_herederos").append(elementos);

                    var registro="<tr><td class='td_iten'>Documento "+i+"</td>"+
                                    "<td class='td_right' id='b_l"+i+"'>0</td>"+
                                    "<td class='td_right' id='e_l"+i+"'>0</td></tr>";
                    $("#body_table_herederos").append(registro);
        }
      

    });

    // ===============================================================================================================
    //                                 numero de folios adicionales por documuento
    // ===============================================================================================================
    $("input[name='incorporar_docuemnto']").on("change",function(e){
        e.preventDefault();
        salida=$("input[name='incorporar_docuemnto']:checked").val();
        $('#n_folios_por_documentos').val('');
        $("#folios_agregados_por_documentos").html('');
        console.log('salida: '+salida);
            if (salida=='SI'){
                $('#resultado_sucesiones').hide();
                $("#div_folios_por_documentos").show('slow');
            }else{
                $("#div_folios_por_documentos").hide('slow');
                setTimeout(() => {
                    $('#btn_calcular_sucesiones').trigger('click');
                }, 150);
            }
    });

    // ===============================================================================================================
    //                                 change div_valor_cuantia
    // ===============================================================================================================
    $(document).on('change', '.importe_heredero', function(e){
        e.preventDefault();
        var base= parseFloat($(this).val().replace(/\./g,'').replace(',','.'));
        console.log(base);
        if (isNaN(base))
        {
        $(this).addClass('border border-danger alert_input');
            setTimeout(() => {
                $(this).removeClass('border border-danger alert_input');
                $(this).val('');
                return false
            }, 1000);
        }
        monto= formatear_cifras_moneda(base);
        $(this).val(monto);
    });

    // ===============================================================================================================
    //                                 change div_valor_cuantia
    // ===============================================================================================================
    $("#importe_finca").on("change",function(e){
        e.preventDefault();
        var base= parseFloat($('#importe_finca').val().replace(/\./g,'').replace(',','.'));
        console.log(base);
        if (isNaN(base))
        {
        $('#importe_finca').addClass('border border-danger alert_input');
            setTimeout(function(){ $('#importe_finca').removeClass('border border-danger alert_input'),  $('#importe_finca').val('')}, 800);
            return false;
        }
        monto= formatear_cifras_moneda(base);
        $("#importe_finca").val(monto);
    });
    // ===============================================================================================================
    //                                 change valor_fincas_sucesiones
    // ===============================================================================================================
    $("#importe_dinero").on("change",function(e){
        e.preventDefault();
        console.log($('#importe_dinero').val());
        var base= parseFloat($('#importe_dinero').val().replace(/\./g,'').replace(',','.'));
        if (isNaN(base))
        {
        $('#importe_dinero').addClass('border border-danger alert_input');
        setTimeout(function(){ $('#importe_dinero').removeClass('border border-danger alert_input'),  $('#importe_dinero').val('')}, 800);
        return false;
        }
        monto= formatear_cifras_moneda(base);
        $("#importe_dinero").val(monto);
    });
     // ===============================================================================================================
     $(document).on('click', ".importe_heredero,#importe_dinero, #importe_finca, #n_herederos" ,function(e){
          $(this).removeClass('border border-danger alert_input');
    });
        // ===============================================================================================================
    //                                 numero de folios adicionales por documuento
    // ===============================================================================================================
    $("input[name='fincas-bienes_inmuebles']").on("change",function(e){
        e.preventDefault();
        inmueble=$("input[name='fincas-bienes_inmuebles']:checked").val();
        sucesiones=$("#tipo_sucesiones").val();
            if (inmueble=='Si'){
                $("#div_numero_fincas").show('slow');
                $("#n_fincas_sucusiones").val(1);
                $('#div_numero_folios').removeClass('mt-3').addClass('mt-5');
                if (sucesiones=='VDH' || sucesiones == 'DO') {
                    $('#docs_confirmados_sucesiones').show();
                    $('#div_confirmado_1, #div_confirmado_2, #div_confirmado_3, #confirmar_docs_sucesiones').show();
                    $('#docs_confirmado_1').val(3);
                    $('#docs_confirmado_2').val(1);
                    $('#docs_confirmado_3').val(3);
                    $('#docs_confirmado_4').val(2);
                    $('#docs_confirmado_5').val(1);
                }
            }else{
                $("#div_numero_fincas").hide('slow');
                $("#n_fincas_sucusiones").val(0);
                $('#div_numero_folios').removeClass('mt-5').addClass('mt-3');
                if (sucesiones=='VDH') {
                    $('#docs_confirmados_sucesiones').hide();
                    $('#docs_confirmado_1').val(0);
                    $('#docs_confirmado_2').val(0);
                    $('#docs_confirmado_3').val(0);
                    $('#docs_confirmado_4').val(0);
                    $('#docs_confirmado_5').val(0);
                }
                if (sucesiones =='DO'){ 
                $('#docs_confirmado_2, #docs_confirmado_3, #docs_confirmado_4, #docs_confirmado_5').val(0);
                $('#docs_confirmado_1').val(1);
                $('#div_confirmado_1, #div_confirmado_2, #div_confirmado_3,  #confirmar_docs_sucesiones').hide();
            }
            }

            if (sucesiones=='VDH') {
                setTimeout(() => {
                    $('#btn_calcular_sucesiones').trigger('click');
                }, 150);
            }else
                document.getElementById("importe_finca").focus();

    });
    // ===============================================================================================================
    //                                 monto del donar_dinero
    // ===============================================================================================================
    $("input[name='donar_dinero']").on("change",function(e){
        e.preventDefault();
        donar_dinero=$("input[name='donar_dinero']:checked").val();
        $('#n_folios_por_documentos').val('');
        $("#folios_agregados_por_documentos").html('');
            console.log('donar_dinero: '+donar_dinero);
               
            if (donar_dinero=='Si'){
                $("#div_monto_dinero").show('slow');
            }else{
                $("#div_monto_dinero").hide('slow');
            }
            if ($("input[name='fincas-bienes_inmuebles']:checked").val()=='Si') {
                $('#div_confirmado_1, #div_confirmado_2, #div_confirmado_3, #confirmar_docs_sucesiones').show();
                $('#docs_confirmado_1').val(3);
                $('#docs_confirmado_2').val(1);
                $('#docs_confirmado_3').val(3);
                $('#docs_confirmado_4').val(2);
                $('#docs_confirmado_5').val(1);
            }
    });

        // ===============================================================================================================
    //                                 Fincas heredadas
    // ===============================================================================================================
    $("input[name='h_fincas-inmuebles']").on("change",function(e){
        e.preventDefault();
        fincas_inmuebles=$("input[name='h_fincas-inmuebles']:checked").val();
            if (fincas_inmuebles=='Si'){
                $("#div_n_fincas_heredadas").show('slow');
                $('#n_fincas_heredadas').val(2)
            }else{
                $("#div_n_fincas_heredadas").hide('slow');
                $('#n_fincas_heredadas').val('')
            }
    });
    // ===============================================================================================================
    //                                 cuentas heredadas
    // ===============================================================================================================
    $("input[name='h_cuentas-fondos']").on("change",function(e){
        e.preventDefault();
        fincas_inmuebles=$("input[name='h_cuentas-fondos']:checked").val();
            if (fincas_inmuebles=='Si'){
                $("#div_n_cuentas_heredadas").show('slow');
                $('#n_cuentas_heredadas').val(3)
            }else{
                $("#div_n_cuentas_heredadas").hide('slow');
                $('#n_cuentas_heredadas').val('')
            }
    });
    // ===============================================================================================================
    //                                 otros bienes heredadas
    // ===============================================================================================================
    $("input[name='h_otro-bien_mueble']").on("change",function(e){
        e.preventDefault();
        fincas_inmuebles=$("input[name='h_otro-bien_mueble']:checked").val();
            if (fincas_inmuebles=='Si'){
                $("#div_n_muebles_heredadas").show('slow');
                $('#n_muebles_heredadas').val(1)
            }else{
                $("#div_n_muebles_heredadas").hide('slow');
                $('#n_muebles_heredadas').val('')
            }
    });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
    // ===============================================================================================================
    //                                  Function calcular presupuesto sucesiones                    
    // ===============================================================================================================

    $('#btn_calcular_sucesiones').on('click',function(e) {
        e.preventDefault();
        sucesiones=$("#tipo_sucesiones").val();
        $('.inputs_pdf').val('');
        // inicializar los div de resultado 
        $('#resultado_sucesiones').show();
        $('#div_result_sucesiones_doc_sin_cuantia,#div_result_sucesiones_doc_con_cuantia').hide();
        $('#div_result_sucesiones_copia_simple').hide();
        $('#div_result_sucesiones_folio_matriz').hide();
        $('#div_result_sucesiones_copia_Autorizada').hide();
        $('#div_result_sucesiones_copia_electronica').hide();
        $('#div_result_sucesiones_testimonios').hide();
        $('#div_result_sucesiones_salida').hide();
        $('#tr_cauntia_herederos').hide();
        $('#div_total_apertura, #tr_segundo_subtitle, #tr_primer_subtitle').hide();
        $('.primer_subtitle, .segundo_subtitle, #div_res_doc_con_cuantia_herederos, #input_doc_con_cuantia_herederos').html('');
        //cierre de acta
        $('#div_total_cierre, #div_result_sucesiones_cierre_doc_sin_cuantia, #div_result_sucesiones_cierre_N_folios, #div_result_sucesiones_cierre_N_CA, #div_result_sucesiones_cierre_N_CS').hide();
        $('#sucesiones_text').html($('#tipo_sucesiones').find('option:selected').text());
        $('#input_tipo_sucesiones').val($('#tipo_sucesiones').find('option:selected').text());        
        $('#input_value_tipo_sucesiones').val($("#tipo_sucesiones").val());        
        importeFolioTimbrado = 0.15;
        poder = 30.05; 
        importeActaNotificar = 36.06;
        // inicializar todas las variables
            res_testimonios = res_CopiaElectrica = res_CopiaAutorizada = res_sin_cuantia = res_simple = res_salida = total_honorarios = res_folioMatriz = 0;
            valor_f_x_docs = n_folios = copias_simples = copias_simplies_add = salida_sucesiones = tot_folios_por_docs = total_cierre_acta = 0;
            res_con_cuantia = tot_folios_cierre = folios_unido_h = res_con_cuantia_H = 0;
        switch(sucesiones) {
            case 'TE': // Testamento
                res_sin_cuantia = 1*poder;
                break
            case 'DH': //Declaracion de Herederos
                $('.primer_subtitle').html('APERTURA DEL ACTA');
                $('.segundo_subtitle').html('CIERRE DEL ACTA');
                $('#tr_segundo_subtitle, #tr_primer_subtitle').show();
                res_sin_cuantia = 1*importeActaNotificar;

                // valor de los numeros confimados
                    valor_libro_flia = get_CosteTestimonios(1,$('#docs_confirmado_3').val());
                    valor_ult_volutad = get_CosteTestimonios(1,$('#docs_confirmado_2').val());
                    valor_cert_difucion = get_CosteTestimonios(1,$('#docs_confirmado_1').val());
                    valor_dni = get_CosteTestimonios(1,$('#docs_confirmado_4').val());
                // res_testimonios esa la sumatoira valor de los folios confirmados
                res_testimonios = parseFloat(valor_dni)+parseFloat(valor_libro_flia)+parseFloat(valor_ult_volutad)+parseFloat(valor_cert_difucion)+parseFloat(valor_f_x_docs);
                break;

                case 'RH': // Testamento
                    res_sin_cuantia = 1*poder;
                    res_testimonios = get_CosteTestimonios(1,$('#docs_confirmado_1').val());
                break

                case 'UV': // Testamento
                    res_sin_cuantia = 1*poder;
                    res_testimonios = get_CosteTestimonios(1,$('#docs_confirmado_1').val());
                break
                case 'ACS':
                    res_sin_cuantia = 1*importeActaNotificar;
                    // valor de los numeros confimados
                    docs_confirmado_3 = get_CosteTestimonios(1,$('#docs_confirmado_3').val());
                    docs_confirmado_2 = get_CosteTestimonios(1,$('#docs_confirmado_2').val());
                    docs_confirmado_1 = get_CosteTestimonios(1,$('#docs_confirmado_1').val());
                    res_testimonios = parseFloat(docs_confirmado_3)+parseFloat(docs_confirmado_2)+parseFloat(docs_confirmado_1)+parseFloat(valor_f_x_docs);
                    break;

                case 'ELD': 
                    $('#div_result_sucesiones_doc_con_cuantia').show();
                    importe = parseFloat($('#valor_cuantia_sucesiones').val().replace(/\./g,'').replace(',','.'));
                    res_con_cuantia = calcular_CEHONORARIOS(importe)*0.95;
                    res_testimonios = get_CosteTestimonios(1,$('#docs_confirmado_1').val());
                    break

                case 'ELB':
                    importe = parseFloat($('#valor_fincas_sucesiones').val().replace(/\./g,'').replace(',','.')); 
                    res_con_cuantia = calcular_CEHONORARIOS(importe)*0.95; 
                    docs_confirmado_3 = get_CosteTestimonios(1,$('#docs_confirmado_3').val());
                    docs_confirmado_2 = get_CosteTestimonios(1,$('#docs_confirmado_2').val());
                    docs_confirmado_1 = get_CosteTestimonios(1,$('#docs_confirmado_1').val());
                    res_testimonios = parseFloat(docs_confirmado_3)+parseFloat(docs_confirmado_2)+parseFloat(docs_confirmado_1)+parseFloat(valor_f_x_docs);                  
                    break;

                case 'VDH':
                    importe = parseFloat($('#valor_fincas_sucesiones').val().replace(/\./g,'').replace(',','.')); 
                    res_con_cuantia = calcular_CEHONORARIOS(importe)*0.95; 
                    docs_confirmado_3 = get_CosteTestimonios(1,$('#docs_confirmado_3').val());
                    docs_confirmado_2 = get_CosteTestimonios(1,$('#docs_confirmado_2').val());
                    docs_confirmado_1 = get_CosteTestimonios(1,$('#docs_confirmado_1').val());
                    docs_derechos_h_1 = get_CosteTestimonios(1,$('#docs_derechos_h_1').val());
                    docs_derechos_h_2 = get_CosteTestimonios(1,$('#docs_derechos_h_2').val());
                    docs_derechos_h_3 = get_CosteTestimonios(1,$('#docs_derechos_h_3').val());
                    docs_derechos_h_4 = get_CosteTestimonios(1,$('#docs_derechos_h_4').val());
                    docs_derechos_h_5 = get_CosteTestimonios(1,$('#docs_derechos_h_5').val());
                    docs_derechos_h_6 = get_CosteTestimonios(1,$('#docs_derechos_h_6').val());
                    res_testimonios = parseFloat(docs_derechos_h_1)+parseFloat(docs_derechos_h_2)+parseFloat(docs_derechos_h_3)+parseFloat(docs_derechos_h_4)+parseFloat(docs_derechos_h_5)
                                    +parseFloat(docs_derechos_h_6)+parseFloat(docs_confirmado_3)+parseFloat(docs_confirmado_2)+parseFloat(docs_confirmado_1)+parseFloat(valor_f_x_docs);                  
                    folios_unido_h =  parseInt( $('#docs_derechos_h_1').val()) + parseInt( $('#docs_derechos_h_2').val()) + parseInt( $('#docs_derechos_h_3').val()) + parseInt( $('#docs_derechos_h_4').val()) + parseInt( $('#docs_derechos_h_5').val()) + parseInt( $('#docs_derechos_h_6').val());
                    break;
                
                case 'DO':
                    importe_finca    = parseFloat($('#importe_finca').val().replace(/\./g,'').replace(',','.')); 
                    importe_finca    = (isNaN(importe_finca) ? 0 : importe_finca)
                    importe_donacion = parseFloat($('#importe_dinero').val().replace(/\./g,'').replace(',','.')); 
                    importe_donacion = (isNaN(importe_donacion) ? 0 : importe_donacion);

                    tot_importe = parseFloat(importe_finca)+ parseFloat(importe_donacion);
                    if (tot_importe < 1){
                        $('#importe_finca, #importe_dinero').addClass('border border-danger alert_input');
                        document.getElementById("tipo_sucesiones").focus();
                        $('#resultado_sucesiones').hide();
                        return false;
                    }else{
                        res_con_cuantia = calcular_CEHONORARIOS(tot_importe)*0.95; 
                        docs_confirmado_3 = get_CosteTestimonios(1,$('#docs_confirmado_3').val());
                        docs_confirmado_2 = get_CosteTestimonios(1,$('#docs_confirmado_2').val());
                        docs_confirmado_1 = get_CosteTestimonios(1,$('#docs_confirmado_1').val());
                        res_testimonios = parseFloat(docs_confirmado_3)+parseFloat(docs_confirmado_2)+parseFloat(docs_confirmado_1)+parseFloat(valor_f_x_docs);                  
                    }
                    break;
                
                case 'AH':
                case 'HE':
                    console.log('====================================');
                    var numero=parseInt($('#n_herederos').val());
                    console.log('numero: '+numero);
                    if (numero < 1|| isNaN(numero)){
                        $('#n_herederos').addClass('border border-danger alert_input');
                        document.getElementById("tipo_sucesiones").focus();
                        $('#resultado_sucesiones').hide();
                        return false;
                    }else{
                        $('#tr_cauntia_herederos').show();
                        for (i=1;i<=numero;i++)
                        { 
                            importe = parseFloat($(document).find("#importe_heredero_"+i).val().replace(/\./g,'').replace(',','.'));
                            if (importe < 1|| isNaN(importe)) {
                                $(document).find("#importe_heredero_"+i).addClass('border border-danger alert_input');
                                document.getElementById("tipo_sucesiones").focus();
                                $('#resultado_sucesiones').hide();
                                return false;
                            }else{
                                monto = calcular_CEHONORARIOS(importe)*0.95;               
                                res_con_cuantia_H = parseFloat(res_con_cuantia_H) + parseFloat(monto); 
                                monto = formatear_cifras_moneda(monto);
                                var registro = "<tr>\
                                                    <td> Documento Con Cuantia Heredero "+i+"</td>\
                                                    <td> <span class='res_monto'>"+monto+"</span></td>\
                                                </tr>";

                                inputs = "<input type='hidden' name='input_cuantia_herederos[]' value='"+monto+"'>";

                                $("#input_doc_con_cuantia_herederos").append(inputs);
                                $("#div_res_doc_con_cuantia_herederos").append(registro);
                            }
                        }
                    }
                    folios_unido_h =  parseInt( $('#doc_unidos_1').val()) + parseInt( $('#doc_unidos_2').val()) + parseInt( $('#doc_unidos_3').val()) + parseInt( $('#doc_unidos_4').val()) ;
                    break;
            }
        // ===========================================================  
        if (sucesiones == 'DO') {
            if ($("input[name='fincas-bienes_inmuebles']:checked").val()== 'Si') 
                n_folios = 15;                
            else{
                if ($("input[name='donar_dinero']:checked").val() == 'Si') 
                    n_folios = 4;
                else
                    n_folios = 6;
            }                   
        }else if (sucesiones == 'AH' || sucesiones == 'HE') {
            folios_Herencia = 10 ;
            n_folios_fincas = Folios_Testi_Fincas = Folios_Testi_Dinero = Folios_Testi_Bienes = Folios_Testi_Unidos = folios_xCuentas = folios_xMuebles = folios_xFincas = docXcuentas = docXmuebles = folios_matriz_H = Folios_Testi_Fincas = Folios_Testi_Dinero = 0;

            foliosU1 = get_CosteTestimonios(1, $('#doc_unidos_1').val());
            foliosU2 = get_CosteTestimonios(1, $('#doc_unidos_2').val());
            foliosU4 = get_CosteTestimonios(1, $('#doc_unidos_4').val());
            // Folios por Finca
            if ($("input[name='h_fincas-inmuebles']:checked").val()== 'Si') {
                n_folios_fincas = parseInt($('#n_fincas_heredadas').val()) * 2; 
                folios_xFincas = parseInt($('#n_fincas_heredadas').val()) * parseInt( parseInt( $('#docs_confirmado_1').val() )   + parseInt($('#docs_confirmado_2').val()) );
            }
            // Folios por Cuentas
            if ($("input[name='h_cuentas-fondos']:checked").val() == 'Si'){ 
                nF = parseFloat($('#n_cuentas_heredadas').val()/25);
                if (nF < 1) nF = 1;  
                else  nF = parseInt(nF);
                folios_xCuentas = nF;
                docXcuentas = 1;
                Folios_Testi_Dinero = get_CosteTestimonios(1, 1);
                Folios_Testi_Bienes = parseFloat(foliosU1) + parseFloat(foliosU2) + parseFloat(foliosU4);
            }
            // Folios por muebles
            if ($("input[name='h_otro-bien_mueble']:checked").val()== 'Si'){ 
                nM = parseFloat($('#n_muebles_heredadas').val()/25);
                if (nM < 1) nM = 1;  
                else  nM = parseInt(nM);
                folios_xMuebles = nM;
                docXmuebles = 1;
            }
            folios_matriz_H =  parseInt(folios_Herencia) + parseInt(n_folios_fincas) + parseInt(folios_xCuentas) + parseInt(folios_xMuebles);
            folios_test_F   = folios_xFincas;
            folios_test_D   = folios_xCuentas;
            folios_test_M   = folios_xMuebles; 
            
            n_folios = parseInt(folios_matriz_H) + parseInt(folios_test_F)+parseInt(folios_test_D)+parseInt(folios_test_M) ;
            
            Folios_Testi_Unidos = parseFloat(foliosU1) + parseFloat(foliosU2) + parseFloat(foliosU4);
            Folios_Testi_Fincas = get_CosteTestimonios(1, $('#docs_confirmado_1').val()) * $('#n_fincas_heredadas').val();
            res_testimonios = parseFloat(Folios_Testi_Fincas)+parseFloat(Folios_Testi_Dinero)+parseFloat(Folios_Testi_Unidos)+parseFloat(Folios_Testi_Bienes);

        }else{
            n_folios = $('#n_folios_sucusiones').val();
        }
            // folios de documentos incorporados
                if ($("input[name='incorporar_docuemnto']:checked").val() == 'SI') {
                    var numero=parseFloat($('#n_folios_por_documentos').val().replace(/\./g,'').replace(',','.'));
                    for (h=1;h<=numero;h++)
                    {
                        var n_doc=$('#docs_folio'+h).val();
                        tot_folios_por_docs = parseInt(tot_folios_por_docs)+parseInt(n_doc);
                        valor_f = get_CosteTestimonios(1,n_doc);
                        valor_f_x_docs = parseFloat(valor_f_x_docs)+parseFloat(valor_f);
                        // $('#b_l'+h).html(t);
                        // if (t==1)
                        // 	var honor=coste_doc;
                        // else
                        // 	var honor=coste_doc+(coste_firma*(t-1));
        
                        // honor= Math.round(honor * 100)/100;
        
                        // $('#e_l'+h).html(convertir(honor)+' €');
        
                        // n_t_firmas+=parseFloat(t);
                        // console.log(n_t_firmas);
                        // total_coste+=honor;
    
                        // inputs_tables="	 <input type='hidden' class='col-3' id='td_firmas_"+h+"' name='td_firmas[]' value='"+t+"'>"+
                        // 			 	"<input type='hidden' class='col-3' id='td_inport_"+h+"' name='td_import[]' value='"+honor+"'>";
                        // 			$("#tdbody_legitimaciones").append(inputs_tables);
                    }
                }
        // folios_testimonios es la sumatoria de todos los documentos confirmados
            folios_testimonios= parseInt( $('#docs_confirmado_1').val()) + parseInt( $('#docs_confirmado_2').val()) + parseInt( $('#docs_confirmado_3').val()) + parseInt( $('#docs_confirmado_4').val()) + parseInt( $('#docs_confirmado_5').val());
        // todos los folios
        if (sucesiones == 'AH' || sucesiones == 'HE')
            tot_folios = parseInt(n_folios)+parseInt(tot_folios_por_docs)+ parseInt(folios_unido_h);
        else
        tot_folios = parseInt(n_folios)+parseInt(folios_testimonios)+parseInt(tot_folios_por_docs)+ parseInt(folios_unido_h);
        res_folioMatriz = get_FoliosMatriz(tot_folios);
        console.log('tot_folios: '+tot_folios);

        // ===========================================================  
        //calcular compia simple
            copias_simples = $('#cs_sucesiones').val();
            copias_simplies_add = $("#cs_sucesiones_add").val();
            cs_add = parseInt(copias_simplies_add) > 0 ? parseInt(copias_simplies_add) + parseInt(copias_simples) : copias_simples;
        res_simple = get_CosteSimple(cs_add, tot_folios);

        // ===========================================================  
        //calcular autorizada
            ca_sucesiones = $("#ca_sucesiones").val(); //copias autorizadas
            ca_sucesiones_add = $("#ca_sucesiones_add").val();//copias autorizadas adicionales
            ca_add= parseInt(ca_sucesiones_add) > 0 ? parseInt(ca_sucesiones_add) + parseInt(ca_sucesiones) : parseInt(ca_sucesiones);
        res_CopiaAutorizada = get_CosteAutorizada(ca_add,tot_folios);

        // ===========================================================  
        //calcular electronincas
        ce_sucesiones = $('#ce_sucesiones').val();    // copias electronicas    
        res_CopiaElectrica = get_CosteAutorizada(parseInt(ce_sucesiones),parseInt(tot_folios));

        // salida del notario
        res_salida = $("input[name=salida_sucesiones]:checked").val() == 'SI' ? salida_notario : 0;

       

// ciere de acta
        if (sucesiones == 'DH') {
            n_actas = ca = cs = 1;
            n_folios_m = 3;
            ca_add_cierre = 0;
            folios_matriz = parseInt(tot_folios)+3
            folios_auto_aper  = parseInt(tot_folios) * parseInt(ca_add);
            folios_auto_cier  = parseInt(n_folios_m) * (parseInt(ca)+parseInt(ca_add_cierre));
            tot_folios_cierre = parseInt(folios_matriz)+parseInt(folios_auto_aper)+parseInt(folios_auto_cier);
            copias_simplies_add = 0;
            $('#div_total_cierre, #div_total_apertura').show();
            $('#total_apertura').html(formatear_cifras_moneda(parseFloat(res_sin_cuantia)+parseFloat(res_simple)+parseFloat(res_salida)+parseFloat(res_folioMatriz)+ parseFloat(res_CopiaAutorizada)+ parseFloat(res_testimonios)));
            $('#input_total_apertura').val(formatear_cifras_moneda(parseFloat(res_sin_cuantia)+parseFloat(res_simple)+parseFloat(res_salida)+parseFloat(res_folioMatriz)+ parseFloat(res_CopiaAutorizada)+ parseFloat(res_testimonios)));
            $('#div_result_sucesiones_cierre_doc_sin_cuantia, #div_result_sucesiones_cierre_N_CA, #div_result_sucesiones_cierre_N_CS').show();
            console.log('ca_sucesiones_add :'+ca_sucesiones_add);
            //  Documento sin cuantia siempre es fijo   
            cierre_SC = n_actas*importeActaNotificar;
            $('#result_sucesiones_cierre_sin_cuantia').html(formatear_cifras_moneda(cierre_SC));
            $('#input_sucesiones_cierre_sin_cuantia').val(formatear_cifras_moneda(cierre_SC));
            // Folios de Matriz siempre es fijo  
            cierre_folios =  get_FoliosMatriz(n_folios_m,importeActaNotificar); 
            $('#result_sucesiones_cierre_N_folios').html(formatear_cifras_moneda(cierre_folios));
            $('#input_sucesiones_cierre_N_folios').val(formatear_cifras_moneda(cierre_folios));
            console.log('copias_simplies_add:' + copias_simplies_add);
            // Coste Simple
            cierre_cs = get_CosteSimple((parseFloat(cs)*parseFloat(n_folios_m)),(parseFloat(cs)+parseFloat(copias_simplies_add)));
            $('#result_sucesiones_cierre_N_CS').html(formatear_cifras_moneda(cierre_cs));
            $('#input_sucesiones_cierre_N_CS').val(formatear_cifras_moneda(cierre_cs));
            // Coste Autorizada
            cierre_ca = parseFloat(get_CosteAutorizada(ca,n_folios_m ))+parseFloat(get_CosteAutorizada(ca,ca_sucesiones_add));
            console.log('cierre_ca : '+cierre_ca);
            $('#result_sucesiones_cierre_N_CA').html(formatear_cifras_moneda(cierre_ca));
            $('#input_sucesiones_cierre_N_CA').val(formatear_cifras_moneda(cierre_ca));
            total_cierre_acta = parseFloat(cierre_cs)+ parseFloat(cierre_ca)+ parseFloat(cierre_folios)+ parseFloat(cierre_SC);
            $('#total_cierre').html(formatear_cifras_moneda(total_cierre_acta));
            $('#input_cierre').val(formatear_cifras_moneda(total_cierre_acta));
        }
        if (sucesiones == 'RH' || sucesiones == 'UV' || sucesiones == 'ACS' || sucesiones == 'ELD' || sucesiones == 'ELB' || sucesiones == 'VDH' || sucesiones == 'DO' || sucesiones == 'AH' || sucesiones == 'HE') {
            folios_matriz = tot_folios;
            folios_auto_cier = tot_folios * ca_add;
            tot_folios_cierre = parseInt(folios_matriz)+parseInt(folios_auto_cier);
        }

        tot_folios = parseInt(tot_folios_cierre) > 0 ?  parseInt(tot_folios_cierre) : parseInt(tot_folios);
        tot_testimonios = parseFloat(valor_f_x_docs) > 0 ?  parseFloat(valor_f_x_docs)+ parseFloat(res_testimonios) : parseFloat(res_testimonios);

        total_honorarios =   parseFloat(res_con_cuantia_H) + parseFloat(res_con_cuantia) + parseFloat(res_sin_cuantia)+parseFloat(res_simple)+parseFloat(res_salida)+parseFloat(res_folioMatriz)+ parseFloat(res_CopiaAutorizada)+ parseFloat(tot_testimonios)+ parseFloat(total_cierre_acta)+parseFloat(9.03   );
        iva_sucesiones   =   total_honorarios*21/100;
        papeltimbrado    =   parseFloat(tot_folios * importeFolioTimbrado);            
        total_a_pagar    =   parseFloat(total_honorarios)+parseFloat(iva_sucesiones)+parseFloat(papeltimbrado);

        console.log("========================================");
        console.log("totalizando: ");
        console.log("tot_folios_cierre: "+ tot_folios);
        console.log('res_con_cuantia: '+res_con_cuantia);
        console.log('res_sin_cuantia: '+res_sin_cuantia);
        console.log('res_folioMatriz: '+res_folioMatriz);
        console.log('res_simple: '+res_simple);
        console.log('res_CopiaAutorizada: ' + res_CopiaAutorizada);
        console.log('res_salida: '+res_salida);
        console.log('res_testimonios: '+ tot_testimonios);
        // console.log('res_cierre_sin_cuantia: '+res_cierre_sin_cuantia);
        // ===========================================================        
        if(res_con_cuantia>0){
            $('#div_result_sucesiones_doc_con_cuantia').show();
            $('#result_sucesiones_con_cuantia').html(formatear_cifras_moneda(res_con_cuantia))
            $('#input_sucesiones_con_cuantia').val(formatear_cifras_moneda(res_con_cuantia))
        }
        if(res_sin_cuantia>0){
            $('#div_result_sucesiones_doc_sin_cuantia').show();
            $('#result_sucesiones_sin_cuantia').html(formatear_cifras_moneda(res_sin_cuantia))
            $('#input_sucesiones_sin_cuantia').val(formatear_cifras_moneda(res_sin_cuantia))
        }

        if (res_simple>0) {
            $('#div_result_sucesiones_copia_simple').show();
            $('#result_sucesiones_copia_simple').html(formatear_cifras_moneda(res_simple))
            $('#input_sucesiones_copia_simple').val(formatear_cifras_moneda(res_simple))
        }

        if ($("input[name=salida_sucesiones]:checked").val() == 'SI') {
            $('#div_result_sucesiones_salida').show();
            $('#result_suceciones_salida').html(formatear_cifras_moneda(res_salida))
            $('#input_suceciones_salida').val(formatear_cifras_moneda(res_salida))
        }

        if (res_folioMatriz > 0) {
            $('#div_result_sucesiones_folio_matriz').show();
            $('#result_sucesiones_folio_matriz').html(formatear_cifras_moneda(res_folioMatriz))
            $('#input_sucesiones_folio_matriz').val(formatear_cifras_moneda(res_folioMatriz))
        }

        if (res_CopiaAutorizada > 0) {
            $('#div_result_sucesiones_copia_Autorizada').show();
            $('#result_sucesiones_copia_autorizada').html(formatear_cifras_moneda(res_CopiaAutorizada))
            $('#input_sucesiones_copia_autorizada').val(formatear_cifras_moneda(res_CopiaAutorizada))
        }

        if (res_CopiaElectrica > 0) {
            $('#div_result_sucesiones_copia_electronica').show();
            $('#result_sucesiones_copia_electronica').html(formatear_cifras_moneda(res_CopiaElectrica))
            $('#input_sucesiones_copia_electronica').val(formatear_cifras_moneda(res_CopiaElectrica))
        }

        if (tot_testimonios > 0) {
            $('#div_result_sucesiones_testimonios').show();
            $('#result_sucesiones_testimonios').html(formatear_cifras_moneda(tot_testimonios))
            $('#input_sucesiones_testimonios').val(formatear_cifras_moneda(tot_testimonios))
        }



        
        $('#result_sucesiones_honorarios').html(formatear_cifras_moneda(total_honorarios));
        $('#result_sucesiones_iva').html(formatear_cifras_moneda(iva_sucesiones));
        $('#result_sucesiones_papel').html(formatear_cifras_moneda(papeltimbrado));
        $('#result_sucesiones_liquido').html(formatear_cifras_moneda(total_a_pagar));

        $('#input_sucesiones_honorarios').val(formatear_cifras_moneda(total_honorarios));
        $('#input_sucesiones_iva').val(formatear_cifras_moneda(iva_sucesiones));
        $('#input_sucesiones_papel').val(formatear_cifras_moneda(papeltimbrado));
        $('#input_sucesiones_liquido').val(formatear_cifras_moneda(total_a_pagar));
    });

    // ===========================================================================
    // ===========================================================================
    $(document).on('click', '#btn_email_sucesiones', function(e){
        e.preventDefault();
        $('#btn_email_sucesiones').hide();
        $('#div_enviar_mail_sucesiones').show('slow');
        $('#btn_enviar_sucesiones').show('slow');
    });
   // ===========================================================================
    // ===========================================================================
    $(document).on('click', '#btn_enviar_sucesiones', function(e){
        e.preventDefault();
        $('#input_sucesiones_tipo_solicitud').val('SUCESIONES');
        email = validarEmail($('#email_sucesiones').val());
        $("#loading_segundascopias").hide();
        $('.terminos, .terminos_link').removeClass('text-danger');
        terminos= $(document).find("input[type='checkbox'][name='terminos']:checked");
        if (email == true) { 
            if (terminos.val() == 'OK') {
                $("#btn_enviar_poderes").hide();
                $("#loading_poderes").show();	
                $.ajax({
                    method: 'POST',
                    url: "/Printer_budget/enviar_by_mail",
                    data: $("#form_enviar_sucesiones_by_mail").serialize(),
                    success: function (data) {
                        console.log(data);
                           Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Presupuesto Enviado..!',
                            showConfirmButton: false,
                            timer: 2500
                            }).then((result) => {
                                // location.reload();
                            });
                     }
                }); 

            }else{
                $('.terminos, .terminos_link').addClass('text-danger');
            }
        }else{
            $('#email_sucesiones').addClass('alert_input');
        }

    });

});  