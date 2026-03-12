var tipos_inmobiliario_conNfincas =["COMP","PRES","NOSU","ARRA","EDCO","OPCO"];

function convertir(num)
{
	var t = num.toString();
	t = strReplace(t,'.',',');

	var nf = new NumberFormat(t);
	nf.setPlaces(2);
	nf.setCurrency(false);
	nf.setSeparators(true,nf.PERIOD,nf.COMMA);
	return nf.toFormatted();
}

function strReplace(s, r, w)
{
	return s.split(r).join(w);
}

function in_array(needle, haystack) {
	var length = haystack.length;
	for(var i = 0; i < length; i++) {
		if(haystack[i] == needle) return true;
	}
	return false;
}

function formatear_cifras_porcent(parametro) {
	result='';
	if (parametro!= '') {
		monto =parametro.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
		console.log(monto);
		monto =parametro.replace(',','.');
		monto = Math.floor(monto*100) / 100 /100;
		monto = new Intl.NumberFormat("es-ES", {style: "percent",minimumFractionDigits: 2,maximumFractionDigits: 2}).format(monto);
		result = monto;
	}
	return result;
}

$(document).ready( function(){
	// ================onChange del select tipo Inmobiliario=====================
	$("#tipo_inmobiliario").on("change",function(e)
	{ 
		var inmo=$("#tipo_inmobiliario").val();

		inicializar_view_inmobiliario();
		switch (inmo) {
			case 'COMP': //Compraventa
					$("#body_inmo,#box_importe_inmo,#box_numero_fincas_inmo,#box_medio_pago_inmo,#inmo_copias_adicionales,#box_comprador_inmo,#box_vendedor_inmo").show();
					$("#texto_importe_inmo").text("Importe total de la compraventa");
					$("#texto_numero_fincas").html("Indicar número inmuebles comprados");
					$("#n_folios_medios_d_pago").val(1);
					$('#div_n_d_pago, #alert_n_pago').hide();
					$('#box_folios_medios_de_pago, #div_n_folios_medios_d_pago').show();
					text_n_copias_presupuetadas_por_defecto(3, 1, 1);// c. simples, c autorizadas, c. electronica
				break;
			case 'PRES': //Préstamo
					$("#comprador_inmo_text").html('¿El solicitante del prestamo es una empresa?');
					$("#body_inmo,#box_importe_inmo,#box_numero_fincas_inmo,#box_inmo_es_cp_pres,#box_responsabilidad_inmo,#box_inmo_fianza,#box_inmo_pigno").show();
					$("#inmo_copias_adicionales,#box_comprador_inmo, #box_inmo_es_vivienda").show();
					$("#texto_importe_inmo").html("Importe del capital concedido");
					$("#texto_numero_fincas").html("Indicar el número de fincas");
					//inicializar los radios buttons
					$('#inmo_es_vivienda_1').prop("checked", true).trigger('change');				
					$('#inmo_es_cp_pres_2').prop("checked", true).trigger('change');
					$('#inmo_fianza2').prop("checked", true).trigger('change');
					$('#inmo_pigno2').prop("checked", true).trigger('change');
					text_n_copias_presupuetadas_por_defecto(1, 1, 1);// c. simples, c autorizadas, c. electronica
				break;
			case 'NOSU': //Novación / Subrogación
					$("#comprador_inmo_text").html('¿El solicitante del novación/subrogación es una empresa?');
					$("#body_inmo,#box_importe_inmo,#box_numero_fincas_inmo").show();
					$("#inmo_copias_adicionales,#box_comprador_inmo").show();
					$("#texto_importe_inmo").html("Importe subrogado/novado");
					$("#texto_numero_fincas").html("Indicar el número de fincas");
					text_n_copias_presupuetadas_por_defecto(1, 1, 1);// c. simples, c autorizadas, c. electronica
				break;
			case 'ARRA': //Arras
					$("#body_inmo,#box_importe_inmo,#box_numero_fincas_inmo,#box_medio_pago_inmo,#inmo_copias_adicionales,#box_comprador_inmo,#box_vendedor_inmo").show();
					$("#texto_importe_inmo").text("Importe de las arras");
					$("#texto_numero_fincas").html("Indicar número de fincas");
					$("#n_folios_medios_d_pago").val(1);
					$('#div_n_d_pago, #alert_n_pago').hide();
					$('#box_folios_medios_de_pago, #div_n_folios_medios_d_pago').show();
					text_n_copias_presupuetadas_por_defecto(2, 1, 1);// c. simples, c autorizadas, c. electronica
				break;
			case 'EDCO': //Extinción de condominio
					$("#body_inmo,#box_importe_inmo,#box_numero_fincas_inmo,#box_medio_pago_inmo,#inmo_copias_adicionales").show();
					$("#texto_importe_inmo").text("Importe del inmueble(s) sobre el cual se extingue el condominio");
					$("#texto_numero_fincas").html("Indicar número de fincas");
					$("#n_folios_medios_d_pago").val(1);
					$('#div_n_d_pago, #alert_n_pago').hide();
					$('#box_folios_medios_de_pago, #div_n_folios_medios_d_pago').show();
					text_n_copias_presupuetadas_por_defecto(3, 1, 1);// c. simples, c autorizadas, c. electronica
				break;
			case 'OPCO': //Opción de Compra
					$("#body_inmo,#box_importe_inmo,#box_numero_fincas_inmo,#box_medio_pago_inmo,#inmo_copias_adicionales,#box_comprador_inmo,#box_vendedor_inmo").show();
					$("#texto_importe_inmo").text("Importe de la opción de compra");
					$("#texto_numero_fincas").html("Indicar número de fincas");
					$("#n_folios_medios_d_pago").val(1);
					$('#div_n_d_pago, #alert_n_pago').hide();
					$('#box_folios_medios_de_pago, #div_n_folios_medios_d_pago').show();
					text_n_copias_presupuetadas_por_defecto(2, 1, 1);// c. simples, c autorizadas, c. electronica
				break; 
			case 'OBNU': //Obra Nueva 
					$("#comprador_inmo_text").html('¿Quien declara la obra nueva es una empresa?');
					$("#body_inmo,#box_importe_inmo,#box_numero_fincas_inmo").show();
					$('#box_numero_fincas_inmo').hide();
					$("#texto_importe_inmo").html("Valor de la obra nueva");
					$("#texto_numero_fincas").html("Número de fincas");
					$("#numero_fincas_inmo").val(1).prop('disabled', true);
					$("#inmo_indicar_folios_1,#inmo_indicar_folios_2,#inmo_indicar_folios_3,#inmo_copias_adicionales,#box_comprador_inmo").show();
					//folios opcionales
					$('#inmo_indicar_folios_opcional_0, #inmo_indicar_folios_opcional_1, #inmo_indicar_folios_opcional_2, #inmo_indicar_folios_opcional_3, #inmo_indicar_folios_opcional_4, #inmo_indicar_folios_opcional_5').show();
					$("#inmo_texto_folios_opcionales_0").html("Nota Simple Registral");
					$("#inmo_folios_opcionales_0").attr('min', '3').val(3);					
					$("#inmo_texto_folios_opcionales_1").html("Informe Ayuntamiento");
					$("#inmo_folios_opcionales_1").attr('min', '4').val(4);
					
					$("#inmo_texto_folios_1").html("Acreditación del seguro decenal");
					$("#inmo_folios_1").attr('min', '2').val(2);
					$("#inmo_texto_folios_2").html("Libro del Edificio");
					$("#inmo_folios_2").attr('min', '10').val(10);
					$("#inmo_texto_folios_3").html("Certificado de coordenadas georreferenciadas");
					$("#inmo_folios_3").attr('min', '5').val(5);
					text_n_copias_presupuetadas_por_defecto(1, 1, 1);// c. simples, c autorizadas, c. electronica
				break;
			case 'DIHO': //División Horizontal
					$("#comprador_inmo_text").html('¿Quien declara la división horizontal es una empresa?');
					$("#body_inmo,#box_importe_inmo").show();
					$('#box_numero_fincas_inmo').hide();
					$("#texto_importe_inmo").html("Valor de la división");
					$("#inmo_indicar_folios_0,#inmo_indicar_folios_1,#inmo_indicar_folios_2,#inmo_indicar_folios_3,#inmo_copias_adicionales,#box_comprador_inmo").show();
					$("#inmo_texto_folios_0").html("Certificado del arquitecto");
					$("#inmo_folios_0").attr('min', '1').val(1);
					$("#inmo_texto_folios_1").html("Plano descriptivo del inmueble");
					$("#inmo_texto_folios_2").html("Licencia administrativa correspondiente");
					$("#inmo_texto_folios_3").html("Estatutos de la comunidad");
					$("#inmo_folios_1,#inmo_folios_2,#inmo_folios_3").val(1);
					text_n_copias_presupuetadas_por_defecto(1, 1, 1);// c. simples, c autorizadas, c. electronica
				break;
			case 'AFSA': //Acta de Fijación de Saldo
					$("#body_inmo").show();
					$("#comprador_inmo_text").html('¿El solicitante del acta de fijación de saldo es una empresa?');
					$('#box_numero_fincas_inmo').hide();
					$("#inmo_indicar_folios_0,#inmo_indicar_folios_1,#inmo_indicar_folios_2,#inmo_indicar_folios_3,#inmo_copias_adicionales,#box_comprador_inmo").show();
					$("#inmo_texto_folios_0").html("Requerimiento del acreedor al Notario");
					$("#inmo_folios_0").attr('min', '1').val(1);
					$("#inmo_texto_folios_1").html("Certificado de saldo deudor expedido por el acreedor");
					$("#inmo_folios_1").val(1);
					$("#inmo_texto_folios_2").html("Extracto contable que datalla los calculos de la cantidad debida");
					$("#inmo_folios_2").attr('min', '2').val(2);
					$("#inmo_texto_folios_3").html("Certificado de tipos de interes");
					$("#inmo_folios_3").val(0);
					$("#importe_inmo").val('36.06')
					$('#inmo_folios_3').val(1);
					text_n_copias_presupuetadas_por_defecto(1, 1, 0);// c. simples, c autorizadas, c. electronica
				break; 
		}
	});

	// ================Validacion minimos de copias simples autorizadas electrónicas=====================
	$("#cs_inmo_add,#au_inmo_add,#el_inmo_add").on("change",function(e){
		val= parseInt($(this).val());
		tipo_inmo=$("#tipo_inmobiliario").val();
		tc= $(this).data('tc');// cs = copias simples , //ca = autorizadas , // ce copilas electrónicas
		
		//Compraventa, Extinción de condominio
		if (tipo_inmo=='COMP' || tipo_inmo=='EDCO') {
			if (val < 3 && tc == 'cs')
				error_input($(this), 3);
			if (val < 1 && tc == 'ca')
				error_input($(this), 1);
			if (val < 1 && tc == 'ce')
				error_input($(this), 1);
		}
		//Préstamo,  Novación / Subrogación, Obra Nueva, División Horizontal
		if (tipo_inmo=='PRES' || tipo_inmo=='NOSU' || tipo_inmo=='OBNU' || tipo_inmo=='DIHO') {
			if (val < 1 && tc == 'cs')
				error_input($(this), 1);
			if (val < 1 && tc == 'ca')
				error_input($(this), 1);
			if (val < 1 && tc == 'ce')
				error_input($(this), 1);
		}

		//Arras, Opción de Compra
		if (tipo_inmo=='ARRA' || tipo_inmo=='OPCO') {
			if (val < 2 && tc == 'cs')
				error_input($(this), 2);
			if (val < 1 && tc == 'ca')
				error_input($(this), 1);
			if (val < 1 && tc == 'ce')
				error_input($(this), 1);
		}

		//Acta de Fijación de Saldo
		if (tipo_inmo=='AFSA') {
			if (val < 2 && tc == 'cs')
				error_input($(this), 1);
			if (val < 1 && tc == 'ca')
				error_input($(this), 1);
			if (val < 0 && tc == 'ce')
				error_input($(this), 0);
		}
	});

	// ================Validacion de cifras moneda=====================
	$("#importe_inmo,#importe_costas_inmo,#inmo_importe_distribucion,#inmo_importe_fianza,#inmo_importe_pigno, #importe_costas_inmo").on("change",function(e){
		e.preventDefault();
		inmo_importe = parseFloat($(this).val().replace(/\./g,'').replace(',','.'));
		if (isNaN(inmo_importe))
			error_input($(this));
		else
			$(this).val(formatear_cifras_moneda(inmo_importe));
	});
	
	// ================Validacion de cifras porcentaje=====================
	$("#inmo_int_ordinario,#inmo_int_demora").on("change",function(e){
		e.preventDefault();
		inmo_percent= formatear_cifras_porcent($(this).val());
		$(this).val(inmo_percent);
	});

	// =====================================
	$("input[name='inmo_fianza']").on("change",function(e){
		e.preventDefault();
		is1=$("input[name='inmo_fianza']:checked").val();
		$('#importe_fianza').val('');
		console.log('salida: '+is1);
		if (is1=='SI'){
			$("#box_importe_fianza").show('slow');
			$("#box_fiadores").show('slow');
			$("#n_fiadores").attr('min', '1').val(1);
			$("#box_fiador_inmo").show('slow');
		}else{
			$("#box_importe_fianza").hide('slow');
			$("#box_fiadores").hide('slow');
			$("#n_fiadores").val(1);
			$("#box_fiador_inmo").hide('slow');
		}
	});

	// =====================================
	$("input[name='inmo_pigno']").on("change",function(e){
		e.preventDefault();
		is2=$("input[name='inmo_pigno']:checked").val();
		$('#importe_pigno').val('');
		console.log('salida: '+is2);
		if (is2=='SI'){
			$("#box_importe_pigno").show('slow');
			$("#box_folios_pigno").show('slow');
			$("#n_folios_pigno").attr('min', '5').val(5);
			$("#box_pigno_inmo").show('slow');
		}else{
			$("#box_importe_pigno").hide('slow');
			$("#box_folios_pigno").hide('slow');
			$("#n_folios_pigno").val(5);
			$("#box_pigno_inmo").hide('slow');
		}
	});

	// =====================================
	$("input[name='inmo_distribucion']").on("change",function(e){
		e.preventDefault();
		is3=$("input[name='inmo_distribucion']:checked").val();
		$('#importe_distribucion').val('');
		console.log('salida: '+is3);
		if (is3=='SI'){
			$("#box_importe_distribucion").show('slow');
		}else{
			$("#box_importe_distribucion").hide('slow');
		}
	});

	// =====================================
	$("#numero_fincas_inmo").on("change",function(e){
		e.preventDefault();
		$("#box_querys_fincas").html('');
		var n_querys =parseInt($('#numero_fincas_inmo').val().replace(/\./g,'').replace(',','.'));
		if (n_querys < 20) {
			switch($("#tipo_inmobiliario").val()) {
				case 'COMP': // Compraventa
					for (z=1;z<=n_querys;z++)
						$("#box_querys_fincas").append(add_question_es_una_finca(z));
					break;

				case 'EDCO': // Extinción de condominio
					for (z=1;z<=n_querys;z++){
						$("#box_querys_fincas").append("<div class='group_docs border border-1 rounded mx-1 my-0 row' style='background-color: #eee;'> \
															<div class='icon-box col-sm-12 col-md-7 my-auto' data-aos='zoom-in' data-aos-delay='150' style='padding-left: 6px;'>\
																<i class='bi bi-question-lg'></i>\
																<h4 class='pt-2'>Finca "+z+"</h4> \
															</div>\
															<div data-aos='zoom-in' data-aos-delay='150' class='col-12 aos-init aos-animate p-0'>\
																"+questions_for_finca(z)+"\
															</div>\
														</div>");
						$("#box_deudas_comunidad_"+z).show();
						$("#box_justificante_ibi_"+z).show();
						$("#box_hipo_pte_"+z).show();
						$("#box_otros_docs_"+z).show();
						//inicializar los radios buttons
						$('#deudas_comunidad_1'+z).prop("checked", true).trigger('change');
						$('#justificante_ibi_1'+z).prop("checked", true).trigger('change');	
						$('#hipo_pte_1'+z).prop("checked", true).trigger('change');	
						$('#otros_docs_2'+z).prop("checked", true).trigger('change');	
					}

					break;

				case 'PRES':
				case 'NOSU':
					if ($(this).val()>1)
						$("#box_inmo_distribucion").show();
					else
						$("#box_inmo_distribucion").hide();
						
					for (z=1;z<=n_querys;z++){
						$("#box_querys_fincas").append("<div class='group_docs border border-1 rounded mx-1 my-0 row' style='background-color: #eee;'> \
															<div class='icon-box col-sm-12 col-md-7 my-auto' data-aos='zoom-in' data-aos-delay='150' style='padding-left: 6px;'>\
																<i class='bi bi-question-lg'></i>\
																<h4 class='pt-2'>Finca "+z+"</h4> \
															</div>\
															<div data-aos='zoom-in' data-aos-delay='150' class='col-12 aos-init aos-animate p-0'>\
																"+questions_for_finca(z)+"\
															</div>\
														</div>");
						$("#box_tasacion_"+z).show();
						$("#box_nota_simple_"+z).show();
						//inicializar los radios buttons
						$('#nota_simple_1'+z).prop("checked", true).trigger('change');
						$('#tasacion_1'+z).prop("checked", true).trigger('change');	
					}
					$('#inmo_inmo_distribucion_2').prop("checked", true);						
					break;

				case 'ARRA':
					for (z=1;z<=n_querys;z++)
					{
						$("#box_querys_fincas").append(add_question_es_una_finca(z));
					}
				break;

				case 'OPCO':
					for (z=1;z<=n_querys;z++)
					{
						$("#box_querys_fincas").append(add_question_es_una_finca(z));
					}
				break;


			}
		}else
		error_input($(this));
	});

	// ==================la finca es una vivienda o no ?==================
	$(document).on('change','[name^=inmo_es_vivienda_]',function(e) {
		e.preventDefault();
		var identificador_a=$(this).attr("name").split("_");
		var id_finca_a=identificador_a[3];
		var inmo=$("#tipo_inmobiliario").val();
		$('#div_radio_is_vivienda_'+id_finca_a).removeClass('alert-danger')
		
		// siempre otros documentos va ser 'NO';
		$('#otros_docs_2'+id_finca_a).prop("checked", true).trigger('change');								

		if ($(this).val()=='SI')
		{
			if (inmo=='COMP')
			{
				$("#box_deudas_comunidad_"+id_finca_a).show();
				$("#box_justificante_ibi_"+id_finca_a).show();
				$("#box_otros_docs_"+id_finca_a).show();
				$("#box_aptitud_edif_"+id_finca_a).show();
				$("#box_hipo_pte_"+id_finca_a).show();
				//inicializar los radios buttons
				$('#deudas_comunidad_1'+id_finca_a).prop("checked", true).trigger('change');
				$('#aptitud_edif_2'+id_finca_a).prop("checked", true).trigger('change');
				$('#justificante_ibi_1'+id_finca_a).prop("checked", true).trigger('change');
				$('#hipo_pte_2'+id_finca_a).prop("checked", true).trigger('change');	
			}
			else if (inmo=='OPCO')
			{
				$("#box_nota_simple_"+id_finca_a).show();
				$("#box_cedula_"+id_finca_a).show();
				$("#box_certificado_e_"+id_finca_a).show();
				$("#box_alquiler_"+id_finca_a).show();
				$("#box_justificante_ibi_"+id_finca_a).show();
				$("#box_deudas_ibi_"+id_finca_a).show();
				$("#box_otros_docs_"+id_finca_a).show();
				//inicializar los radios buttons
				$('#nota_simple_1'+id_finca_a).prop("checked", true).trigger('change');
				$('#cedula_1'+id_finca_a).prop("checked", true).trigger('change');
				$('#certificado_e_1'+id_finca_a).prop("checked", true).trigger('change');
				$('#alquiler_1'+id_finca_a).prop("checked", true).trigger('change');	
				$('#justificante_ibi_1'+id_finca_a).prop("checked", true).trigger('change');	
				$('#deudas_ibi_1'+id_finca_a).prop("checked", true).trigger('change');	
			}
			else if (inmo=='ARRA')
			{
				$("#box_cedula_"+id_finca_a).show();
				$("#box_certificado_e_"+id_finca_a).show();
				$("#box_justificante_ibi_"+id_finca_a).show();
				$("#box_otros_docs_"+id_finca_a).show();
				//inicializar los radios buttons
				$('#cedula_1'+id_finca_a).prop("checked", true).trigger('change');
				$('#certificado_e_1'+id_finca_a).prop("checked", true).trigger('change');
				$('#justificante_ibi_1'+id_finca_a).prop("checked", true).trigger('change');
			}
		}
		else
		{
			if (inmo=='COMP')
			{
				$("#box_deudas_comunidad_"+id_finca_a).show();
				$("#box_justificante_ibi_"+id_finca_a).show();
				$("#box_otros_docs_"+id_finca_a).show();
				$("#box_aptitud_edif_"+id_finca_a).hide();
				$("#box_hipo_pte_"+id_finca_a).hide();
				//inicializar los radios buttons
				$('#deudas_comunidad_1'+id_finca_a).prop("checked", true).trigger('change');
				$('#justificante_ibi_1'+id_finca_a).prop("checked", true).trigger('change');
			}
			else if (inmo=='OPCO')
			{
				$("#box_nota_simple_"+id_finca_a).show();
				$("#box_cedula_"+id_finca_a).hide();
				$("#box_certificado_e_"+id_finca_a).hide();
				$("#box_alquiler_"+id_finca_a).hide();
				$("#box_justificante_ibi_"+id_finca_a).show();
				$("#box_deudas_ibi_"+id_finca_a).show();
				$("#box_otros_docs_"+id_finca_a).show();
				//inicializar los radios buttons
				$('#nota_simple_1'+id_finca_a).prop("checked", true).trigger('change');
				$('#justificante_ibi_1'+id_finca_a).prop("checked", true).trigger('change');	
				$('#deudas_ibi_1'+id_finca_a).prop("checked", true).trigger('change');			
			}
			else if (inmo=='ARRA')
			{
				$("#box_cedula_"+id_finca_a).hide();
				$("#box_certificado_e_"+id_finca_a).hide();
				$("#box_justificante_ibi_"+id_finca_a).show();
				$("#box_otros_docs_"+id_finca_a).show();
				//inicializar los radios buttons
				$('#justificante_ibi_1'+id_finca_a).prop("checked", true).trigger('change');
			}
		}
	});

	// =====================================
	$(document).on('change','[name^=deudas_comunidad_]',function(e) {
		e.preventDefault();
		var identificador_b=$(this).attr("name").split("_");
		var id_finca_b=identificador_b[2];
		if ($(this).val()=='SI')
		{
			$("#box_folios_deudas_comunidad_"+id_finca_b).show();
			$("#n_folios_deudas_comunidad_"+id_finca_b).val(1);
		}
		else
		{
			$("#box_folios_deudas_comunidad_"+id_finca_b).hide();
			$("#n_folios_deudas_comunidad_"+id_finca_b).val(0);
		}
	});

	// =====================================
	$(document).on('change','[name^=aptitud_edif_]',function(e) {
		e.preventDefault();
		var identificador_c=$(this).attr("name").split("_");
		var id_finca_c=identificador_c[2];
		if ($(this).val()=='SI')
		{
			$("#box_folios_aptitud_edif_"+id_finca_c).show();
			$("#n_folios_aptitud_edif_"+id_finca_c).val(1);
		}
		else
		{
			$("#box_folios_aptitud_edif_"+id_finca_c).hide();
			$("#n_folios_aptitud_edif_"+id_finca_c).val(0);
		}
	});

	// =====================================
	$(document).on('change','[name^=justificante_ibi_]',function(e) {
		e.preventDefault();
		var identificador_d=$(this).attr("name").split("_");
		var id_finca_d=identificador_d[2];
		if ($(this).val()=='SI')
		{
			$("#box_folios_justificante_ibi_"+id_finca_d).show();
			$("#n_folios_justificante_ibi_"+id_finca_d).val(1);
		}
		else
		{
			$("#box_folios_justificante_ibi_"+id_finca_d).hide();
			$("#n_folios_justificante_ibi_"+id_finca_d).val(0);
		}
	});

	// =====================================
	$(document).on('change','[name^=nota_simple_]',function(e) {
		e.preventDefault();
		var identificador_z=$(this).attr("name").split("_");
		var id_finca_z=identificador_z[2];
		if ($(this).val()=='SI')
		{
			$("#box_folios_nota_simple_"+id_finca_z).show();
			$("#n_folios_nota_simple_"+id_finca_z).val(3);
		}
		else
		{
			$("#box_folios_nota_simple_"+id_finca_z).hide();
			$("#n_folios_nota_simple_"+id_finca_z).val(0);
		}
	});

	// =====================================
	$(document).on('change','[name^=cedula_]',function(e) {
		e.preventDefault();
		var identificador_x=$(this).attr("name").split("_");
		var id_finca_x=identificador_x[1];
		if ($(this).val()=='SI')
		{
			$("#box_folios_cedula_"+id_finca_x).show();
			$("#n_folios_cedula_"+id_finca_x).val(1);
		}
		else
		{
			$("#box_folios_cedula_"+id_finca_x).hide();
			$("#n_folios_cedula_"+id_finca_x).val(0);
		}
	});

	// =====================================
	$(document).on('change','[name^=certificado_e_]',function(e) {
		e.preventDefault();
		var identificador_w=$(this).attr("name").split("_");
		var id_finca_w=identificador_w[2];
		if ($(this).val()=='SI')
		{
			$("#box_folios_certificado_e_"+id_finca_w).show();
			$("#n_folios_certificado_e_"+id_finca_w).val(1);
		}
		else
		{
			$("#box_folios_certificado_e_"+id_finca_w).hide();
			$("#n_folios_certificado_e_"+id_finca_w).val(0);
		}
	});
	
	// =====================================
	$(document).on('change','[name^=alquiler_]',function(e) {
		e.preventDefault();
		var identificador_t=$(this).attr("name").split("_");
		var id_finca_t=identificador_t[1];
		if ($(this).val()=='SI')
		{
			$("#box_folios_alquiler_"+id_finca_t).show();
			$("#n_folios_alquiler_"+id_finca_t).val(3);
		}
		else
		{
			$("#box_folios_alquiler_"+id_finca_t).hide();
			$("#n_folios_alquiler_"+id_finca_t).val(0);
		}
	});
	
	// =====================================
	$(document).on('change','[name^=deudas_ibi_]',function(e) {
		e.preventDefault();
		var identificador_s=$(this).attr("name").split("_");
		var id_finca_s=identificador_s[2];
		if ($(this).val()=='SI')
		{
			$("#box_folios_deudas_ibi_"+id_finca_s).show();
			$("#n_folios_deudas_ibi_"+id_finca_s).val(1);
		}
		else
		{
			$("#box_folios_deudas_ibi_"+id_finca_s).hide();
			$("#n_folios_deudas_ibi_"+id_finca_s).val(0);
		}
	});
	
	// =====================================
	$(document).on('change','[name^=hipo_pte_]',function(e) {
		e.preventDefault();
		var identificador_e=$(this).attr("name").split("_");
		var id_finca_e=identificador_e[2];
		if ($(this).val()=='SI')
		{
			$("#box_folios_hipo_pte_"+id_finca_e).show();
			$("#n_folios_hipo_pte_"+id_finca_e).val(1);
		}
		else
		{
			$("#box_folios_hipo_pte_"+id_finca_e).hide();
			$("#n_folios_hipo_pte_"+id_finca_e).val(0);
		}
	});
	
	// =====================================
	$(document).on('change','[name^=otros_docs_]',function(e) {
		e.preventDefault();
		var identificador_f=$(this).attr("name").split("_");
		var id_finca_f=identificador_f[2];
		if ($(this).val()=='SI')
		{
			$("#box_folios_otros_docs_"+id_finca_f).show();
			$("#n_folios_otros_docs_"+id_finca_f).val(1).trigger('change');
		}
		else
		{
			$("#box_folios_otros_docs_"+id_finca_f).hide();
			$("#n_folios_otros_docs_"+id_finca_f).val(0).trigger('change');
		}
	});
	
	// =====================================
	$(document).on('change','[name^=tasacion_]',function(e) {
		e.preventDefault();
		var identificador_g=$(this).attr("name").split("_");
		var id_finca_g=identificador_g[1];
		if ($(this).val()=='SI')
		{
			$("#box_folios_tasacion_"+id_finca_g).show();
			$("#n_folios_tasacion_"+id_finca_g).val(5);
		}
		else
		{
			$("#box_folios_tasacion_"+id_finca_g).hide();
			$("#n_folios_tasacion_"+id_finca_g).val(0);
		}
	});

	// =====================================
	// $(document).on('change','[name=poder_ex_inmo]',function(e) {
	// 	e.preventDefault();
	// 	if ($(this).val()=='SI'){	
	// 		inmo = $("#tipo_inmobiliario").val(); 
	// 		$("#box_folios_poder_ex").show();
	// 			if(inmo=='OBNU' || inmo=='DIHO' || inmo=='EDCO' || inmo=='COMP'){ val_default = 4;}
	// 			if(inmo=='OPCO' || inmo=='ARRA' || inmo=='PRES' || inmo=='NOSU' ){ val_default = 3;}
			
	// 		$("#n_folios_poder_ex").val(val_default);
	// 	}else{
	// 		$("#box_folios_poder_ex").hide();
	// 		$("#n_folios_poder_ex").val(0);
	// 	}
	// });

		// =====================================
		$(document).on('change','[name^=n_folios_otros_docs]',function(e) {
			e.preventDefault();
			var identificador_g=$(this).attr("name").split("_");
			var id_finca=identificador_g[4];
			var n_otros_docs =parseInt($(this).val().replace(/\./g,'').replace(',','.'));
			$("#box_otros_folios_by_docs_"+id_finca+"").html('');
			if (n_otros_docs < 10) {
				n='';
				for (i=1;i<=n_otros_docs;i++){
					n="<div data-aos='zoom-in' data-aos-delay='150' class='row aos-init aos-animate'>\
							<h6 class='pe-0 pt-1 pb-1 mb-0 row d-flex justify-content-between'>\
								<div class='col-md-9 my-auto'>• Documento "+i+"</div>\
								<div class='col-md-3' style='padding-left: 21px;padding-right: 2px;'>\
									<div class='form-floating'>	\
										<input type='text' class='form-control solonumeros input_n_otros_folios' value='1' id='n_otros_folios_"+z+"' name='n_otros_folios"+z+"'>\
										<label for='n_otros_folios' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Folios</label>\
									</div>\
								</div>\
							</h6>\
					</div>";
				$("#box_otros_folios_by_docs_"+id_finca+"").append(n);}
			}else
			error_input($(this));
		});

	// ================folios opcionales de recibo IBI=====================
	$(document).on('change','[name=recibo_ibi_inmo]',function(e) {
		e.preventDefault();
		if ($(this).val()=='SI')
		{
			$("#box_folios_recibo_ibi").show();
			$("#inmo_folios_opcionales_2").val(1);
		}
		else
		{
			$("#box_folios_recibo_ibi").hide();
			$("#inmo_folios_opcionales_2").val(0);
		}
	});

	// ================folios opcionales de consultad deudas=====================
	$(document).on('change','[name=consulta_deudas_inmo]',function(e) {
		e.preventDefault();
		if ($(this).val()=='SI')
		{
			$("#box_folios_consulta_deudas").show();
			$("#inmo_folios_opcionales_3").val(1);
		}
		else
		{
			$("#box_folios_consulta_deudas").hide();
			$("#inmo_folios_opcionales_3").val(0);
		}
	});

	// ================folios opcionales de consultad deudas=====================
	$(document).on('change','[name=licencia_urbanistica]',function(e) {
		e.preventDefault();
		if ($(this).val()=='SI')
		{
			$("#box_folios_licencia_urbanistica").show();
			$("#inmo_folios_opcionales_4").val(1);
		}
		else
		{
			$("#box_folios_licencia_urbanistica").hide();
			$("#inmo_folios_opcionales_4").val(0);
		}
	});

	// ================folios opcionales de consultad deudas=====================
	$(document).on('change','[name=cerificado_tecnico_competente]',function(e) {
		e.preventDefault();
		if ($(this).val()=='SI')
		{
			$("#box_folios_cerificado_tecnico_competente").show();
			$("#inmo_folios_opcionales_5").val(1);
		}
		else
		{
			$("#box_folios_cerificado_tecnico_competente").hide();
			$("#inmo_folios_opcionales_5").val(0);
		}
	});

	// ================folios opcionales de consultad deudas=====================
	$(document).on('change','[name=cerificado_final_obra]',function(e) {
		e.preventDefault();
		if ($(this).val()=='SI')
		{
			$("#box_folios_cerificado_final_obra").show();
			$("#inmo_folios_opcionales_6").val(1);
		}
		else
		{
			$("#box_folios_cerificado_final_obra").hide();
			$("#inmo_folios_opcionales_6").val(0);
		}
	});

	// ================folios opcionales de consultad deudas=====================
	$(document).on('change','[name=medio_pago_inmo]',function(e) {
		e.preventDefault();
		$('#n_folios_medios_d_pago').val(1);
		if ($(this).val()=='SI')
		{
			$('#n_d_pago').val(2);
			$('#div_n_d_pago, #alert_n_pago').show();
			$('#div_n_folios_medios_d_pago').hide()
		}
		else
		{
			$('#n_d_pago').val(1);
			$('#div_n_d_pago, #alert_n_pago').hide();
			$('#div_n_folios_medios_d_pago').show();

		}
	});
	// ===============================================================================================================
	//                                  Function calcular presupuesto inmo
	// ===============================================================================================================

	$('#btn_calcular_inmo').on('click',function(e) {
		e.preventDefault();
		error=false;
		inmo_importe 		= parseFloat($("#importe_inmo").val().replace(/\./g,'').replace(',','.'));
		tipo_inmobiliario 	= $("#tipo_inmobiliario").val();
		$('#tipo_solicitud_inmobiliario').val('INMOBILIARIO');
		if (isNaN(inmo_importe))
				error =	$("#importe_inmo");  	
		else{
			if (tipos_inmobiliario_conNfincas.includes(tipo_inmobiliario)) {
				if (! $('#numero_fincas_inmo').val())
					error =$("#numero_fincas_inmo");
			}
		}

		if (error) 
			error_input(error);
		else
			facturar(tipo_inmobiliario);
	});

    // ===========================================================================
    $(document).on('click', '#btn_email_inmobiliario', function(e){
        e.preventDefault();
        $('#btn_email_inmobiliario').hide();
        $('#div_enviar_mail_inmobiliario').show('slow');
        $('#btn_enviar_inmobiliario').show('slow');
    });
	    // ===========================================================================
		$(document).on('click', '#btn_enviar_inmobiliario', function(e){
			e.preventDefault();
			email = validarEmail($('#email_inmobiliario').val());
			$("#loading_segundascopias").hide();
			$('.terminos, .terminos_link').removeClass('text-danger');
			terminos= $(document).find("input[type='checkbox'][name='terminos']:checked");
			if (email == true) {	
				if (terminos.val() == 'OK') {
					$("#btn_enviar_inmobiliario").hide();
					$("#loading_inmobiliario").show();				
					grecaptcha.ready(function() {
						grecaptcha.execute('6LdCoVEqAAAAAHPOAqmBgukE9w8LJUHsfaXJbS6a', {action: 'submit'}).then(function(token) {
							$("#form_enviar_inmobiliario_by_mail").append("<input type='hidden' name='g-recaptcha-response' value='" + token + "' />");
							$.ajax({
								method: 'POST',
								url: "/Printer_budget/enviar_by_mail",
								data: $("#form_enviar_inmobiliario_by_mail").serialize(),
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
										}).then((result) => {
											location.reload();
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
				$('#email_inmobiliario').addClass('alert_input');
			}
	
		});
    
});


function inicializar_view_inmobiliario()
{
	$('input[type="text"]').val(''); 
	$('#body_inmo,#box_importe_inmo,#box_numero_fincas_inmo,#box_inmo_es_vivienda,#box_inmo_es_cp_pres,#box_responsabilidad_inmo,#box_inmo_distribucion,#box_vendedor_inmo').hide();
	$('#box_inmo_fianza,#box_importe_fianza, #box_importe_pigno, #resultado_inmobiliario, #box_medio_pago_inmo, #box_inmo_pigno, #box_comprador_inmo, #inmo_indicar_folios_0').hide();
	$('#box_pigno_inmo, #inmo_indicar_folios_1, #inmo_indicar_folios_2, #inmo_indicar_folios_3,#box_fiador_inmo, #div_rph').hide();
	document.querySelectorAll("input[name^='inmo']").forEach((x) => x.checked = false);
	//folios opcionales
	$('#inmo_indicar_folios_opcional_0, #inmo_indicar_folios_opcional_1, #inmo_indicar_folios_opcional_2, #inmo_indicar_folios_opcional_3, #inmo_indicar_folios_opcional_4, #inmo_indicar_folios_opcional_5').hide();
	$("#inmo_folios_opcionales_0").val('0');$("#inmo_folios_opcionales_1").val('0');$("#inmo_folios_opcionales_2").val('0');$("#inmo_folios_opcionales_3").val('0');$("#inmo_folios_opcionales_4").val('0');
	$("#inmo_folios_opcionales_5").val('0');$("#inmo_folios_opcionales_6").val('0');
	// $("#n_folios_poder_ex").val(0);
	$('#numero_fincas_inmo').val('').prop('disabled', false);
	$("#box_querys_fincas").html('');
	$('#box_numero_fincas_inmo').show();
	$('#cs_inmo_add, #au_inmo_add, #el_inmo_add').val('0');
	// inicializar radiobuttons en option NO
	$("#recibo_ibi_inmo_2, #consulta_deudas_inmo_2, #licencia_urbanistica_2, #cerificado_tecnico_competente_2,\
	 #cerificado_final_obra_2, #inmo_poder_ex_2, #inmo_comprador_2, #inmo_medio_pago_2, #inmo_vendedor_2").prop("checked", true);
	 $("#comprador_inmo_text").html('¿El comprador es una empresa?');
}

function add_question_es_una_finca(i) {
	return "<div class='group_docs border border-1 rounded mx-1 my-0 row' style='background-color: #eee;'> \
				<div class='icon-box col-sm-12 col-md-7 my-auto' data-aos='zoom-in' data-aos-delay='150' style='padding-left: 6px;'>\
					<i class='bi bi-question-lg'></i>\
					<h4 class='pt-2'>Finca "+z+"<div class='small fw-light' style='width: 200px;'>¿Es una vivienda? </div> </h4> \
				</div>\
				<div data-aos='zoom-in' data-aos-delay='150' id='div_radio_is_vivienda_"+i+"' class='col-sm-12 col-md-3 aos-init aos-animate ms-auto my-auto rounded'>\
					<div class='form-check form-check-inline'>\
						<input class='radio-audita input_radio' type='radio' name='inmo_es_vivienda_"+i+"' id='inmo_es_vivienda_"+i+"' value='SI'>\
						<label class='form-check-label' for='salida_IN1"+i+"'>Si</label>\
					</div>\
					<div class='form-check form-check-inline'>\
						<input class='radio-audita input_radio' type='radio' name='inmo_es_vivienda_"+i+"' id='inmo_es_vivienda_"+i+"' value='NO'>\
						<label class='form-check-label' for='salida_IN2"+i+"'>No</label>\
					</div>\
				</div>\
				<div data-aos='zoom-in' data-aos-delay='150' class='col-12 aos-init aos-animate p-0'>\
					"+ questions_for_finca(i) +"\
				</div>\
			</div>";
}

function questions_for_finca(z) {
	tipo = $("#tipo_inmobiliario").val(); 

	if (tipo=='COMP' || tipo=='EDCO' ){
		console.log('entro en COMP');
		return 	question_deudas_comunidad(z)+
				question_aptitud_edificio(z)+
				question_ultimo_recibo_IBI(z)+
				question_certificado_hipoteca_saldo_pendiente(z)+
				questions_otros_documentos(z);
	}
	if(tipo=='PRES' || tipo =='NOSU'){
		return 	question_nota_simple_registral(z)+
				question_tasacion(z);	
	}
	if (tipo=='ARRA'){
		console.log('entro en ARRA');
		return	question_cedula_habitabilidad(z)+
				question_certificado_eficiencia(z)+
				question_ultimo_recibo_IBI(z)+
				questions_otros_documentos(z);
  	}
	if (tipo=='OPCO') {
		console.log('entro en OPCO');
		return 	question_nota_simple_registral(z)+
				question_cedula_habitabilidad(z)+
				question_certificado_eficiencia(z)+
				question_contrato_alquiler(z)+
				question_ultimo_recibo_IBI(z)+
				question_deudas_ibi(z)+
				questions_otros_documentos(z);		
	}
}


function question_deudas_comunidad(z) {
	return "<div class='icon-box bg-white rounded pt-3 m-1' id='box_deudas_comunidad_"+z+"' data-aos='zoom-in' data-aos-delay='150' style='display:none;'>\
				<div class='row'> \
					<div class='col pe-0'>\
						<div class='mb-0 small fw-medium'>¿Certificado de deudas comunidad? </div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='deudas_comunidad_"+z+"' id='deudas_comunidad_1"+z+"' value='SI'>\
							<label for='salida_IN1' class='center-block h6'><span></span>Si</label>\
						</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='deudas_comunidad_"+z+"' id='deudas_comunidad_2"+z+"' value='NO'>\
							<label for='salida_IN2' class='center-block h6'><span></span>No</label>\
						</div>\
					</div>\
					<div class='col-md-3 col-sm-12 aos-init aos-animate ms-auto pe-3' data-aos='zoom-in' data-aos-delay='150' id='box_folios_deudas_comunidad_"+z+"'>\
						<div class='form-floating'>\
							<input type='text' class='form-control solonumeros' id='n_folios_deudas_comunidad_"+z+"' name='n_folios_deudas_comunidad_"+z+"' value='1'>\
							<label for='n_folios_deudas_comunidad' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Folios</label>\
						</div>\
					</div>\
				</div>\
			</div>";
}

function question_aptitud_edificio(z) {
	return "<div class='icon-box bg-white rounded pt-3 m-1' id='box_aptitud_edif_"+z+"' data-aos='zoom-in' data-aos-delay='150' style='display:none;'>\
				<div class='row'> \
					<div class='col pe-0'>\
						<div class='mb-0 small fw-medium'>¿Certificado de aptitud del edificio?</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='aptitud_edif_"+z+"' id='aptitud_edif_1"+z+"' value='SI'>\
							<label for='salida_IN1' class='center-block h6'><span></span>Si</label>\
						</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='aptitud_edif_"+z+"' id='aptitud_edif_2"+z+"' value='NO'>\
							<label for='salida_IN2' class='center-block h6'><span></span>No</label>\
						</div>\
					</div>\
					<div class='col-md-3 col-sm-12 aos-init aos-animate ms-auto pe-3' data-aos='zoom-in' data-aos-delay='150' id='box_folios_aptitud_edif_"+z+"' style='display:none';>\
						<div class='form-floating'>\
							<input type='text' class='form-control solonumeros' id='n_folios_aptitud_edif_"+z+"' name='n_folios_aptitud_edif_"+z+"'>\
							<label for='n_folios_aptitud_edif' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Folios</label>\
						</div>\
					</div>\
				</div>\
			</div>";
}

function question_certificado_hipoteca_saldo_pendiente(z) {
	return "<div class='icon-box bg-white rounded pt-3 m-1' id='box_hipo_pte_"+z+"' data-aos='zoom-in' data-aos-delay='150' style='display:none;'>\
				<div class='row'> \
					<div class='col pe-0'>\
						<div class='mb-0 small fw-medium'>¿Certificado hipoteca saldo pendiente si hay hipoteca? </div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='hipo_pte_"+z+"' id='hipo_pte_1"+z+"' value='SI'>\
							<label for='salida_IN1000' class='center-block h6'><span></span>Si</label>\
						</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='hipo_pte_"+z+"' id='hipo_pte_2"+z+"' value='NO'>\
							<label for='salida_IN2000' class='center-block h6'><span></span>No</label>\
						</div>\
					</div>\
					<div class='col-md-3 col-sm-12 aos-init aos-animate ms-auto pe-3' data-aos='zoom-in' data-aos-delay='150' id='box_folios_hipo_pte_"+z+"' style='display:none';>\
						<div class='form-floating'>\
							<input type='text' class='form-control solonumeros' id='n_folios_hipo_pte_"+z+"' name='n_folios_hipo_pte_"+z+"'>\
							<label for='n_folios_hipo_pte' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Folios</label>\
						</div>\
					</div>\
				</div>\
			</div>"
}

function question_tasacion(z) {
	return "<div class='icon-box bg-white rounded pt-3 m-1' id='box_tasacion_"+z+"' data-aos='zoom-in' data-aos-delay='150'  style='display:none;'>\
				<div class='row'> \
					<div class='col pe-0'>\
						<div class='mb-0 small fw-medium'>¿Tasación? </div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='tasacion_"+z+"' id='tasacion_1"+z+"' value='SI'>\
							<label for='salida_IN1' class='center-block h6'><span></span>Si</label>\
						</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='tasacion_"+z+"' id='tasacion_2"+z+"' value='NO'>\
							<label for='salida_IN2' class='center-block h6'><span></span>No</label>\
						</div>\
					</div>\
					<div class='col-md-3 col-sm-12 aos-init aos-animate ms-auto pe-3' data-aos='zoom-in' data-aos-delay='150' id='box_folios_tasacion_"+z+"' style='display:none';>\
						<div class='form-floating'>\
							<input type='text' class='form-control solonumeros' id='n_folios_tasacion_"+z+"' name='n_folios_tasacion_"+z+"'>\
							<label for='n_folios_tasacion' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Folios</label>\
						</div>\
					</div>\
				</div>\
			</div>"	
}

function questions_otros_documentos(z){
	return "<div class='icon-box bg-white rounded pt-3 m-1' id='box_otros_docs_"+z+"' data-aos='zoom-in' data-aos-delay='150' style='display:none;'>\
		<div class='row'> \
			<div class='col pe-0'>\
				<div class='mb-0 small fw-medium'>¿Otros documentos?</div>\
				<div class='text-left form-check-inline'>\
					<input class='radio-audita input_radio' type='radio' name='otros_docs_"+z+"' id='otros_docs_1"+z+"' value='SI'>\
					<label for='salida_IN1' class='center-block h6'><span></span>Si</label>\
				</div>\
				<div class='text-left form-check-inline'>\
					<input class='radio-audita input_radio' type='radio' name='otros_docs_"+z+"' id='otros_docs_2"+z+"' value='NO'>\
					<label for='salida_IN2' class='center-block h6'><span></span>No</label>\
				</div>\
			</div>\
			<div class='col-md-3 col-sm-12 aos-init aos-animate ms-auto pe-3' data-aos='zoom-in' data-aos-delay='150' id='box_folios_otros_docs_"+z+"' style='display:none';>\
				<div class='form-floating'>\
					<input type='text' class='form-control solonumeros' id='n_folios_otros_docs_"+z+"' name='n_folios_otros_docs_"+z+"'>\
					<label for='n_folios_otros_docs' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Documentos</label>\
				</div>\
			</div>\
			<div class='col-12'>\
			<div class='border rounded bg-light px-2 mx-2 mb-2' id='box_otros_folios_by_docs_"+z+"' >\
			</div>\
			</div>\
		</div>\
	</div>"	
}

function question_ultimo_recibo_IBI(z) {
	return "<div class='icon-box bg-white rounded pt-3 m-1' id='box_justificante_ibi_"+z+"' data-aos='zoom-in' data-aos-delay='150' style='display:none;'>\
				<div class='row'> \
					<div class='col pe-0'>\
						<div class='mb-0 small fw-medium'>¿Justificante de pago del ultimo recibo del IBI?</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='justificante_ibi_"+z+"' id='justificante_ibi_1"+z+"' value='SI'>\
							<label for='salida_IN1' class='center-block h6'><span></span>Si</label>\
						</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='justificante_ibi_"+z+"' id='justificante_ibi_2"+z+"' value='NO'>\
							<label for='salida_IN2' class='center-block h6'><span></span>No</label>\
						</div>\
					</div>\
					<div class='col-md-3 col-sm-12 aos-init aos-animate ms-auto pe-3' data-aos='zoom-in' data-aos-delay='150' id='box_folios_justificante_ibi_"+z+"' style='display:none';>\
						<div class='form-floating'>\
							<input type='text' class='form-control solonumeros' id='n_folios_justificante_ibi_"+z+"' name='n_folios_justificante_ibi_"+z+"'>\
							<label for='n_folios_justificante_ibi' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Folios</label>\
						</div>\
					</div>\
				</div>\
			</div>";
}

function question_nota_simple_registral(z) {
	return"<div class='icon-box bg-white rounded pt-3 m-1' id='box_nota_simple_"+z+"' data-aos='zoom-in' data-aos-delay='150' style='display:none;'>\
				<div class='row'> \
					<div class='col pe-0'>\
						<div class='mb-0 small fw-medium'>¿Nota simple registral? </div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='nota_simple_"+z+"' id='nota_simple_1"+z+"' value='SI'>\
							<label for='salida_IN1' class='center-block h6'><span></span>Si</label>\
						</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='nota_simple_"+z+"' id='nota_simple_2"+z+"' value='NO'>\
							<label for='salida_IN2' class='center-block h6'><span></span>No</label>\
						</div>\
					</div>\
					<div class='col-md-3 col-sm-12 aos-init aos-animate ms-auto pe-3' data-aos='zoom-in' data-aos-delay='150' id='box_folios_nota_simple_"+z+"' style='display:none';>\
						<div class='form-floating'>\
							<input type='text' class='form-control solonumeros' id='n_folios_nota_simple_"+z+"' name='n_folios_nota_simple_"+z+"'>\
							<label for='n_folios_nota_simple' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Folios</label>\
						</div>\
					</div>\
				</div>\
			</div>"
}

function question_cedula_habitabilidad(z) {
	return "<div class='icon-box bg-white rounded pt-3 m-1' id='box_cedula_"+z+"' data-aos='zoom-in' data-aos-delay='150' style='display:none;'>\
				<div class='row'> \
					<div class='col pe-0'>\
						<div class='mb-0 small fw-medium'>¿Cédula de habitabilidad? </div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='cedula_"+z+"' id='cedula_1"+z+"' value='SI'>\
							<label for='salida_IN1' class='center-block h6'><span></span>Si</label>\
						</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='cedula_"+z+"' id='cedula_2"+z+"' value='NO'>\
							<label for='salida_IN2' class='center-block h6'><span></span>No</label>\
						</div>\
					</div>\
					<div class='col-md-3 col-sm-12 aos-init aos-animate ms-auto pe-3' data-aos='zoom-in' data-aos-delay='150' id='box_folios_cedula_"+z+"' style='display:none';>\
						<div class='form-floating'>\
							<input type='text' class='form-control solonumeros' id='n_folios_cedula_"+z+"' name='n_folios_cedula_"+z+"'>\
							<label for='n_folios_cedula' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Folios</label>\
						</div>\
					</div>\
				</div>\
			</div>"
}

function question_certificado_eficiencia(z) {
	return "<div class='icon-box bg-white rounded pt-3 m-1' id='box_certificado_e_"+z+"' data-aos='zoom-in' data-aos-delay='150' style='display:none;'>\
				<div class='row'> \
					<div class='col pe-0'>\
						<div class='mb-0 small fw-medium'>¿Certificado de eficiencia?</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='certificado_e_"+z+"' id='certificado_e_1"+z+"' value='SI'>\
							<label for='salida_IN1' class='center-block h6'><span></span>Si</label>\
						</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='certificado_e_"+z+"' id='certificado_e_2"+z+"' value='NO'>\
							<label for='salida_IN2' class='center-block h6'><span></span>No</label>\
						</div>\
					</div>\
					<div class='col-md-3 col-sm-12 aos-init aos-animate ms-auto pe-3' data-aos='zoom-in' data-aos-delay='150' id='box_folios_certificado_e_"+z+"' style='display:none';>\
						<div class='form-floating'>\
							<input type='text' class='form-control solonumeros' id='n_folios_certificado_e_"+z+"' name='n_folios_certificado_e_"+z+"'>\
							<label for='n_folios_certificado_e' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Folios</label>\
						</div>\
					</div>\
				</div>\
			</div>"	
}

function question_contrato_alquiler(z) {
	return "<div class='icon-box bg-white rounded pt-3 m-1' id='box_alquiler_"+z+"' data-aos='zoom-in' data-aos-delay='150' style='display:none;'>\
				<div class='row'> \
					<div class='col pe-0'>\
						<div class='mb-0 small fw-medium'>¿Contrato de alquiler?</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='alquiler_"+z+"' id='alquiler_1"+z+"' value='SI'>\
							<label for='salida_IN1' class='center-block h6'><span></span>Si</label>\
						</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='alquiler_"+z+"' id='alquiler_2"+z+"' value='NO'>\
							<label for='salida_IN2' class='center-block h6'><span></span>No</label>\
						</div>\
					</div>\
					<div class='col-md-3 col-sm-12 aos-init aos-animate ms-auto pe-3' data-aos='zoom-in' data-aos-delay='150' id='box_folios_alquiler_"+z+"' style='display:none';>\
						<div class='form-floating'>\
							<input type='text' class='form-control solonumeros' id='n_folios_alquiler_"+z+"' name='n_folios_alquiler_"+z+"'>\
							<label for='n_folios_alquiler' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Folios</label>\
						</div>\
					</div>\
				</div>\
			</div>"	
}

function question_deudas_ibi(Z) {
	return "<div class='icon-box bg-white rounded pt-3 m-1' id='box_deudas_ibi_"+z+"' data-aos='zoom-in' data-aos-delay='150' style='display:none;'>\
				<div class='row'> \
					<div class='col pe-0'>\
						<div class='mb-0 small fw-medium'>¿Consulta de deudas IBI?</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='deudas_ibi_"+z+"' id='deudas_ibi_1"+z+"' value='SI'>\
							<label for='salida_IN100' class='center-block h6'><span></span>Si</label>\
						</div>\
						<div class='text-left form-check-inline'>\
							<input class='radio-audita input_radio' type='radio' name='deudas_ibi_"+z+"' id='deudas_ibi_2"+z+"' value='NO'>\
							<label for='salida_IN200' class='center-block h6'><span></span>No</label>\
						</div>\
					</div>\
					<div class='col-md-3 col-sm-12 aos-init aos-animate ms-auto pe-3' data-aos='zoom-in' data-aos-delay='150' id='box_folios_deudas_ibi_"+z+"' style='display:none';>\
						<div class='form-floating'>\
							<input type='text' class='form-control solonumeros' id='n_folios_deudas_ibi_"+z+"' name='n_folios_deudas_ibi_"+z+"'>\
							<label for='n_folios_deudas_ibi' style='padding-left: 0px !important; padding-right: 0px !important;font-size: 0.7rem !important;'>Nº Folios</label>\
						</div>\
					</div>\
				</div>\
			</div>"		
}

function error_input(input, folios_copias) {
	input.addClass('bg_danger');
	$('#btn_calcular_inmo').prop('disabled', true);
	$('#resultado_inmobiliario').hide();
	if (folios_copias)
		document.getElementById("error_folios_copias").click();	
	else
		document.getElementById("error_inmo").click();
	setTimeout(() => {
		input.removeClass('bg_danger').val(folios_copias ? folios_copias : '');
		$('#btn_calcular_inmo').prop('disabled', false);
	}, 1500);
} 

function text_n_copias_presupuetadas_por_defecto(cs, ca, ce) {
	$('#cs_inmo_add').val(cs);
	$('#au_inmo_add').val(ca);
	$('#el_inmo_add').val(ce);
	$('#nota_cs_inmo').html('Por defecto se presupuestan '+cs+' Copias Simples, si desea mas indiquelas');
	$('#nota_au_inmo').html('Por defecto se presupuestan '+ca+' Copia Autorizada, si desea mas indiquelas');
	$('#nota_el_inmo').html('Por defecto se presupuestan '+ce+' Copia Electrónica, si desea mas indiquelas');
}

function facturar(tipo_inmobiliario) {
	// ===================================== Fijar valores a 0, minimos ==========================================================================
	error_radio_es_vivienda= false; 
	inmo_n_fincas = 0;
	inmo_honor = inmo_folios_matriz = inmo_total_folios = 0;
	inmo_folios_0 = inmo_folios_1 = 0;
	f_por_finca = 0;
	f_poder = f_comunicado_aj = f_presentacion_reg = f_asiento_reg = f_pago_transferencia = f_otros_medios_pagos = 0;
	inmo_copia_simple = inmo_copia_aut = inmo_copia_ele = simple_inmo = autorizada_inmo = electronica_inmo = 0;
	inmo_reg_mercantil_compra = inmo_reg_mercantil_venta = inmo_reg_mercantil_fiador = inmo_reg_mercantil_pigno = coste_inmo_diligencias = inmo_diligencias = valor_inmo_folio_matriz = coste_inmo_testimonios = 0;
	inmo_subtotal = inmo_iva = inmo_irpf = inmo_folios_papel = 0;
	$('#inmo_text').html($('#tipo_inmobiliario').find('option:selected').text());
	$('#pdf_inmo_text').val($('#tipo_inmobiliario').find('option:selected').text());
	$('#monto_cuantia').html($("#importe_inmo").val());
	$('#reduccion_base').html('5%');
	es_una_vivienda = "NO";
	inmo_n_fincas = parseInt($('#numero_fincas_inmo').val().replace(/\./g, '').replace(',', '.'));
	$('#div_honorarios_cuantia').show();
	$('#div_honorarios_fianza, #div_honorarios_pigno, #div_honorarios_distribuido').hide();
	//validacion solo para 
	if (tipo_inmobiliario == 'COMP' || tipo_inmobiliario == 'ARRA' || tipo_inmobiliario == 'OPCO' || tipo_inmobiliario == 'OPCO') {
		for (i = 1; i <= inmo_n_fincas; i++) {
			vivienda = $("input[name='inmo_es_vivienda_" + i + "']:checked").val();
			if (vivienda === undefined) {
				$('#div_radio_is_vivienda_' + i).addClass('alert-danger');
				error_radio_es_vivienda = true;
			} else
			if (vivienda == 'SI' && es_una_vivienda == 'NO')
				es_una_vivienda = 'SI';
		}
		if (error_radio_es_vivienda) {
			document.getElementById("error_inmo").click();
			return false;
		}
	}
	if (tipo_inmobiliario == 'PRES') 
		es_una_vivienda = $("input[name='inmo_es_vivienda']:checked").val();

	if (tipo_inmobiliario == 'NOSU') 
		es_una_vivienda = 'SI';


	//--------folios
	// tipo inmobiliario
	
	switch (tipo_inmobiliario) {
		case 'COMP': // ---------compraventa
			//honor
			var inmo_per_descuento = es_una_vivienda == "SI" ? 28.75 : 5;
			$('#reduccion_base').html(inmo_per_descuento+'%')
			inmo_honor = calcular_CEHONORARIOS(parseFloat($("#importe_inmo").val().replace(/\./g, '').replace(',', '.')));
			inmo_honor = inmo_honor - (inmo_honor * inmo_per_descuento / 100);
			//catastro
			f_por_finca += 2 * inmo_n_fincas;
			//Nota Simple
			f_por_finca += 4 * inmo_n_fincas;
			//consulta IBI
			f_por_finca += 1 * inmo_n_fincas;
			if (es_una_vivienda == 'SI') {
				//Cedula de Habitabilidad
				f_por_finca += 1 * inmo_n_fincas;
				//Certificado de Eficiencia
				f_por_finca += 1 * inmo_n_fincas;
			}
			for (v = 1; v <= inmo_n_fincas; v++) {
				if ($("input[name='deudas_comunidad_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_deudas_comunidad_" + v).val());

				if ($("input[name='aptitud_edif_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_aptitud_edif_" + v).val());

				if ($("input[name='justificante_ibi_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_justificante_ibi_" + v).val());

				if ($("input[name='hipo_pte_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_hipo_pte_" + v).val());

				if ($("input[name='otros_docs_" + v + "']:checked").val() == "SI"){
					// f_por_finca += parseFloat($("#n_folios_otros_docs_" + v).val());
					$( ".input_n_otros_folios" ).each(function() {
						val = $( this ).val();
						 if( val.length > 0 )
							f_por_finca +=parseInt(val);
					 });
				}
			}
			//eliminado si porta un documento extranjero
			// if ($("input[name='poder_ex_inmo']:checked").val() == "SI") {
			// 	f_poder = $('#n_folios_poder_ex').val();
			// 	coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_poder));
			// }
			f_comunicado_aj = f_presentacion_reg = f_asiento_reg = 0.5;
			f_pago_transferencia = 1;

			if ($("input[name='medio_pago_inmo']:checked").val() == "SI") 
 				f_otros_medios_pagos = parseInt($('#n_d_pago').val());
 			else
 				f_otros_medios_pagos =  parseInt($('#n_folios_medios_d_pago').val());
			
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_otros_medios_pagos));
			inmo_folios_matriz = Math.round(10 + (inmo_n_fincas * 8) + f_por_finca + f_poder + f_comunicado_aj + f_presentacion_reg + f_asiento_reg + f_pago_transferencia + f_otros_medios_pagos);

			//copias
			// inmo_copia_simple = 3;
			// inmo_copia_aut = inmo_copia_ele = 1;
			//Testimonios
			//Catastro
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 2));
			//Nota simple
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 4));
			//Medio Pago transferencia
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_pago_transferencia));

			//diligencias
			$("#inmo_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			inmo_diligencias = 3;
			//reg mercantil
			if ($("input[name='comprador_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_compra = 12;
			else
				inmo_reg_mercantil_compra = 0;

			if ($("input[name='vendedor_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_venta = 12;
			else
				inmo_reg_mercantil_venta = 0;
			break;
		case 'PRES': // ---------prestamo inmo_fianza
			v3 = $("input[name='inmo_es_cp_pres']:checked").val();
			if (es_una_vivienda == "SI" && v3 == "SI")
				inmo_per_descuento = 46.56;
			else if (es_una_vivienda == "NO" && v3 == "NO")
				inmo_per_descuento = 5;
			else
				inmo_per_descuento = 28.75;

				$('#reduccion_base').html(inmo_per_descuento+'%')

			inmo_imp_pres = parseFloat($("#importe_inmo").val().replace(/\./g, '').replace(',', '.'));
			inmo_int_ordinario = parseFloat($("#inmo_int_ordinario").val().replace(/\./g, '').replace(',', '.'))
			if (isNaN(inmo_int_ordinario)){
				error_input($("#inmo_int_ordinario"));
				return false;
			}
			inmo_any_ordinario = parseFloat($("#inmo_any_ordinario").val().replace(/\./g, '').replace(',', '.'))
			if (isNaN(inmo_any_ordinario)){
				error_input($("#inmo_any_ordinario"));
				return false;
			}
			inmo_int_demora = parseFloat($("#inmo_int_demora").val().replace(/\./g, '').replace(',', '.'))
			if (isNaN(inmo_int_demora)){
				error_input($("#inmo_int_demora"));
				return false;
			}
			inmo_any_demora = parseFloat($("#inmo_any_demora").val().replace(/\./g, '').replace(',', '.'))
			if (isNaN(inmo_any_demora)){
				error_input($("#inmo_any_demora"));
				return false;
			}
			importe_costas_inmo = parseFloat($("#importe_costas_inmo").val().replace(/\./g, '').replace(',', '.'))
			if (isNaN(importe_costas_inmo)){
				error_input($("#importe_costas_inmo"));
				return false;
			}

			inmo_imp_ordinario = inmo_imp_pres * inmo_int_ordinario * inmo_any_ordinario;
			inmo_imp_demora = inmo_imp_pres * inmo_int_demora * inmo_any_demora;

			result_inmo_rph = inmo_imp_pres + inmo_imp_ordinario / 100 + inmo_imp_demora / 100 + importe_costas_inmo;
			$('#result_inmo_rph').html(formatear_cifras_moneda(result_inmo_rph))
			$('#div_rph').show()
			inmo_honor = calcular_CEHONORARIOS(result_inmo_rph);
			inmo_honor = inmo_honor - (inmo_honor * inmo_per_descuento / 100);

			inmo_imp_distribucion=0;
			//distribución
			if ($("input[name='inmo_distribucion']:checked").val() == "SI") {
				console.log('distribución');
				inmo_importe_distribucion = parseFloat($("#inmo_importe_distribucion").val().replace(/\./g, '').replace(',', '.'))
				if (isNaN(inmo_importe_distribucion)){
					error_input($("#inmo_importe_distribucion"));
					return false;
				}
				inmo_imp_distribucion = calcular_CEHONORARIOS(inmo_importe_distribucion);
				inmo_honor += inmo_imp_distribucion - (inmo_imp_distribucion * 5 / 100);
				f_por_finca += 5;
				$('#div_honorarios_distribuido').show()
				$('#monto_distribuido').html($("#inmo_importe_distribucion").val());
			}
			//fianza
			if ($("input[name='inmo_fianza']:checked").val() == "SI") {
				console.log('fianza');
				inmo_importe_fianza = parseFloat($("#inmo_importe_fianza").val().replace(/\./g, '').replace(',', '.'))
				if (isNaN(inmo_importe_fianza)){
					error_input($("#inmo_importe_fianza"));
					return false;
				}
				inmo_imp_fianza = calcular_CEHONORARIOS(inmo_importe_fianza);
				inmo_honor += inmo_imp_distribucion - (inmo_imp_fianza * 5 / 100);

				f_por_finca += parseInt($('#n_fiadores').val().replace(/\./g, '').replace(',', '.'));
				$('#div_honorarios_fianza').show();
				$('#monto_fianza').html($("#inmo_importe_fianza").val());
			}
			//pignoracion
			if ($("input[name='inmo_pigno']:checked").val() == "SI") {
				console.log('pigniracion');
				inmo_imp_pigno = calcular_CEHONORARIOS(parseFloat($("#inmo_importe_pigno").val().replace(/\./g, '').replace(',', '.')));
				inmo_honor += inmo_imp_distribucion - (inmo_imp_pigno * 5 / 100);

				f_por_finca += parseInt($('#n_folios_pigno').val().replace(/\./g, '').replace(',', '.'));
				$('#div_honorarios_pigno').show();
				$('#monto_pigno').html($("#inmo_importe_pigno").val());
			}

			inmo_n_fincas = parseInt($('#numero_fincas_inmo').val().replace(/\./g, '').replace(',', '.'));
			//catastro
			f_por_finca += 2 * inmo_n_fincas;
			for (v = 1; v <= inmo_n_fincas; v++) {

				if ($("input[name='nota_simple_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_nota_simple_" + v).val());

				if ($("input[name='tasacion_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_tasacion_" + v).val());

			}
			//eliminado si porta un documento extranjero
			// if ($("input[name='poder_ex_inmo']:checked").val() == "SI") {
			// 	f_poder = $('#n_folios_poder_ex').val();
			// 	coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_poder));
			// }
			f_presentacion_reg = f_asiento_reg = 0.5;
			inmo_folios_matriz = Math.round(40 + (inmo_n_fincas * 4) + f_por_finca + f_poder + f_presentacion_reg + f_asiento_reg + f_pago_transferencia + f_otros_medios_pagos);

			//copias
			// inmo_copia_simple = 1;
			// inmo_copia_aut = inmo_copia_ele = 1;
			//Testimonios
			//Catastro
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 2));
			//Nota simple
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 4));
			//Medio Pago transferencia
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_pago_transferencia));

			//diligencias
			$("#inmo_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			inmo_diligencias = 3;
			//reg mercantil
			if ($("input[name='comprador_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_compra = 12;
			else
				inmo_reg_mercantil_compra = 0;

			if ($("input[name='fiador_e_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_fiador = 12;
			else
				inmo_reg_mercantil_fiador = 0;

			if ($("input[name='pigno_e_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_pigno = 12;
			else
				inmo_reg_mercantil_ìgno = 0;

			break;
		case 'NOSU': // ---------Novación / Subrogación
			inmo_per_descuento = 52.50;
			$('#reduccion_base').html(inmo_per_descuento+'%')
			inmo_imp_pres = parseFloat($("#importe_inmo").val().replace(/\./g, '').replace(',', '.'));

			inmo_honor = calcular_CEHONORARIOS(inmo_imp_pres);
			inmo_honor = inmo_honor - (inmo_honor * inmo_per_descuento / 100);
			//distribución
			if ($("input[name='inmo_distribucion']:checked").val() == "SI") {
				inmo_imp_distribucion = calcular_CEHONORARIOS(parseFloat($("#inmo_importe_distribucion").val().replace(/\./g, '').replace(',', '.')));
				inmo_honor += inmo_imp_distribucion - (inmo_imp_distribucion * 5 / 100);
				f_por_finca += 5;
			}
			//fianza
			if ($("input[name='inmo_fianza']:checked").val() == "SI") {
				inmo_imp_fianza = calcular_CEHONORARIOS(parseFloat($("#inmo_importe_fianza").val().replace(/\./g, '').replace(',', '.')));
				inmo_honor += inmo_imp_distribucion - (inmo_imp_fianza * 5 / 100);

				f_por_finca += parseInt($('#n_fiadores').val().replace(/\./g, '').replace(',', '.'));
			}
			//pignoracion
			if ($("input[name='inmo_pigno']:checked").val() == "SI") {
				inmo_imp_pigno = calcular_CEHONORARIOS(parseFloat($("#inmo_importe_pigno").val().replace(/\./g, '').replace(',', '.')));
				inmo_honor += inmo_imp_distribucion - (inmo_imp_pigno * 5 / 100);

				f_por_finca += parseInt($('#n_folios_pigno').val().replace(/\./g, '').replace(',', '.'));
			}

			inmo_n_fincas = parseInt($('#numero_fincas_inmo').val().replace(/\./g, '').replace(',', '.'));
			//catastro
			f_por_finca += 2 * inmo_n_fincas;
			for (v = 1; v <= inmo_n_fincas; v++) {

				if ($("input[name='nota_simple_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_nota_simple_" + v).val());

				if ($("input[name='tasacion_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_tasacion_" + v).val());

			}
			//eliminado si porta un documento extranjero
			// if ($("input[name='poder_ex_inmo']:checked").val() == "SI") {
			// 	f_poder = $('#n_folios_poder_ex').val();
			// 	coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_poder));
			// }
			f_presentacion_reg = f_asiento_reg = 0.5;
			inmo_folios_matriz = Math.round(40 + (inmo_n_fincas * 4) + f_por_finca + f_poder + f_presentacion_reg + f_asiento_reg + f_pago_transferencia + f_otros_medios_pagos);

			//copias
			// inmo_copia_simple = 1;
			// inmo_copia_aut = inmo_copia_ele = 1;
			//Testimonios
			//Catastro
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 2));
			//Nota simple
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 4));
			//Medio Pago transferencia
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_pago_transferencia));

			//diligencias
			$("#inmo_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			inmo_diligencias = 3;
			//reg mercantil
			if ($("input[name='comprador_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_compra = 12;
			else
				inmo_reg_mercantil_compra = 0;

			if ($("input[name='fiador_e_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_fiador = 12;
			else
				inmo_reg_mercantil_fiador = 0;

			if ($("input[name='pigno_e_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_pigno = 12;
			else
				inmo_reg_mercantil_ìgno = 0;

			break;
		case 'ARRA': // ---------Arras
			inmo_per_descuento = 5;
			$('#reduccion_base').html(inmo_per_descuento+'%')
			//honor
			inmo_honor = calcular_CEHONORARIOS(parseFloat($("#importe_inmo").val().replace(/\./g, '').replace(',', '.')));
			inmo_honor = inmo_honor - (inmo_honor * inmo_per_descuento / 100);

			//folios
			//lo comento porque tiene que ir por folios, aunque el excel, lo indica, pero no los cuenta
			/*f_catastro=2;
			f_nota_simple=4;
			if (v1=='SI')
				f_cedula_h=f_certificado_e=f_consulta_ibi=1;
			*/
			inmo_n_fincas = parseInt($('#numero_fincas_inmo').val().replace(/\./g, '').replace(',', '.'));
			//catastro
			f_por_finca += 2 * inmo_n_fincas;
			//registro
			f_por_finca += 3 * inmo_n_fincas;
			//deudas IBI
			f_por_finca += 0.5 * inmo_n_fincas;

			for (v = 1; v <= inmo_n_fincas; v++) {
				if ($("input[name='cedula_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_cedula_" + v).val());

				if ($("input[name='certificado_e_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_certificado_e_" + v).val());

				if ($("input[name='justificante_ibi_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_justificante_ibi_" + v).val());

				if ($("input[name='otros_docs_" + v + "']:checked").val() == "SI"){
					// f_por_finca += parseFloat($("#n_folios_otros_docs_" + v).val());
					$( ".input_n_otros_folios" ).each(function() {
						val = $( this ).val();
						 if( val.length > 0 )
							f_por_finca +=parseInt(val);
					 });
				}

			}
			//eliminado si porta un documento extranjero
			// if ($("input[name='poder_ex_inmo']:checked").val() == "SI") {
			// 	f_poder = $('#n_folios_poder_ex').val();
			// 	coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_poder));
			// }
			f_comunicado_aj = f_presentacion_reg = f_asiento_reg = 0.5;
			f_pago_transferencia = 1;
			
			if ($("input[name='medio_pago_inmo']:checked").val() == "SI") 
 				f_otros_medios_pagos = parseInt($('#n_d_pago').val());
 			else
 				f_otros_medios_pagos =  parseInt($('#n_folios_medios_d_pago').val());
			
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_otros_medios_pagos));

			inmo_folios_matriz = Math.round(10 + (inmo_n_fincas * 8) + f_por_finca + f_poder + f_comunicado_aj + f_presentacion_reg + f_asiento_reg + f_pago_transferencia + f_otros_medios_pagos);

			//copias
			// inmo_copia_simple = 2;
			// inmo_copia_aut = inmo_copia_ele = 1;
			//Testimonios
			//Catastro
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 2));
			//Medio Pago transferencia
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(2, f_pago_transferencia));
			//NotaSimple
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 3));
			//End testimonios
			//diligencias
			$("#inmo_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			inmo_diligencias = 3;
			//reg mercantil
			if ($("input[name='comprador_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_compra = 12;
			else
				inmo_reg_mercantil_compra = 0;

			if ($("input[name='vendedor_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_venta = 12;
			else
				inmo_reg_mercantil_venta = 0;
			break;
		case 'EDCO': // ---------Extinción de condominio
			//honor
			inmo_honor = calcular_CEHONORARIOS(parseFloat($("#importe_inmo").val().replace(/\./g, '').replace(',', '.')));
			inmo_honor = inmo_honor - (inmo_honor * 5 / 100);

			//folios
			//lo comento porque tiene que ir por folios, aunque el excel, lo indica, pero no los cuenta
			/*f_catastro=2;
			f_nota_simple=4;
			if (v1=='SI')
				f_cedula_h=f_certificado_e=f_consulta_ibi=1;
			*/
			inmo_n_fincas = parseInt($('#numero_fincas_inmo').val().replace(/\./g, '').replace(',', '.'));
			//catastro
			f_por_finca += 2 * inmo_n_fincas;
			//Nota Simple
			f_por_finca += 4 * inmo_n_fincas;
			//consulta IBI
			f_por_finca += 1 * inmo_n_fincas;
			for (v = 1; v <= inmo_n_fincas; v++) {

				if ($("input[name='deudas_comunidad_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_deudas_comunidad_" + v).val());

				if ($("input[name='justificante_ibi_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_justificante_ibi_" + v).val());

				if ($("input[name='hipo_pte_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_hipo_pte_" + v).val());

				if ($("input[name='otros_docs_" + v + "']:checked").val() == "SI"){
					// f_por_finca += parseFloat($("#n_folios_otros_docs_" + v).val());
					$( ".input_n_otros_folios" ).each(function() {
						val = $( this ).val();
						 if( val.length > 0 )
							f_por_finca +=parseInt(val);
					 });
				}

			}
			//eliminado si porta un documento extranjero
			// if ($("input[name='poder_ex_inmo']:checked").val() == "SI") {
			// 	f_poder = $('#n_folios_poder_ex').val();
			// 	coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_poder));
			// }
			f_comunicado_aj = f_presentacion_reg = f_asiento_reg = 0.5;
			f_pago_transferencia = 1;
			
			if ($("input[name='medio_pago_inmo']:checked").val() == "SI") 
 				f_otros_medios_pagos = parseInt($('#n_d_pago').val());
 			else
 				f_otros_medios_pagos =  parseInt($('#n_folios_medios_d_pago').val());
			
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_otros_medios_pagos));
			
			inmo_folios_matriz = Math.round(10 + (inmo_n_fincas * 8) + f_por_finca + f_poder + f_comunicado_aj + f_presentacion_reg + f_asiento_reg + f_pago_transferencia + f_otros_medios_pagos);

			//copias
			// inmo_copia_simple = 3;
			// inmo_copia_aut = inmo_copia_ele = 1;
			//Testimonios
			//Catastro
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 2));
			//Nota simple
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 4));
			//Medio Pago transferencia
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_pago_transferencia));

			//diligencias
			$("#inmo_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			inmo_diligencias = 3;
			//reg mercantil
			if ($("input[name='comprador_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_compra = 12;
			else
				inmo_reg_mercantil_compra = 0;

			if ($("input[name='vendedor_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_venta = 12;
			else
				inmo_reg_mercantil_venta = 0;
			break;
		case 'OPCO': // ---------Opción de Compra
			inmo_per_descuento =  5;
			$('#reduccion_base').html(inmo_per_descuento+'%')
			//honor
			inmo_honor = calcular_CEHONORARIOS(parseFloat($("#importe_inmo").val().replace(/\./g, '').replace(',', '.')));
			inmo_honor = inmo_honor - (inmo_honor * inmo_per_descuento / 100);
			inmo_n_fincas = parseInt($('#numero_fincas_inmo').val().replace(/\./g, '').replace(',', '.'));
			//catastro
			f_por_finca += 2 * inmo_n_fincas;
			for (v = 1; v <= inmo_n_fincas; v++) {
				if ($("input[name='nota_simple_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_nota_simple_" + v).val());

				if ($("input[name='cedula_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_cedula_" + v).val());

				if ($("input[name='certificado_e_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_certificado_e_" + v).val());

				if ($("input[name='alquiler_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_alquiler_" + v).val());

				if ($("input[name='justificante_ibi_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_justificante_ibi_" + v).val());

				if ($("input[name='deudas_ibi_" + v + "']:checked").val() == "SI")
					f_por_finca += parseFloat($("#n_folios_deudas_ibi_" + v).val());

				if ($("input[name='otros_docs_" + v + "']:checked").val() == "SI"){
					// f_por_finca += parseFloat($("#n_folios_otros_docs_" + v).val());
					$( ".input_n_otros_folios" ).each(function() {
						val = $( this ).val();
						 if( val.length > 0 )
							f_por_finca +=parseInt(val);
					 });    
					}

			}
			//eliminado si porta un documento extranjero
			// if ($("input[name='poder_ex_inmo']:checked").val() == "SI") {
			// 	f_poder =$('#n_folios_poder_ex').val();
			// 	coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_poder));
			// }
			f_comunicado_aj = f_presentacion_reg = f_asiento_reg = 0.5;
			f_pago_transferencia = 1;
		
			if ($("input[name='medio_pago_inmo']:checked").val() == "SI") 
 				f_otros_medios_pagos = parseInt($('#n_d_pago').val());
 			else
 				f_otros_medios_pagos =  parseInt($('#n_folios_medios_d_pago').val());
			
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_otros_medios_pagos));

			inmo_folios_matriz = Math.round(10 + (inmo_n_fincas * 8) + f_por_finca + f_poder + f_comunicado_aj + f_presentacion_reg + f_asiento_reg + f_pago_transferencia + f_otros_medios_pagos);

			//copias
			// inmo_copia_simple = 2;
			// inmo_copia_aut = inmo_copia_ele = 1;
			//Testimonios
			//Catastro
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 2));
			//Medio Pago transferencia
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(2, f_pago_transferencia));
			//NotaSimple
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 3));
			//Alquiler
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(inmo_n_fincas, 3));
			//End testimonios
			//diligencias
			$("#inmo_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			inmo_diligencias = 3;
			//reg mercantil
			if ($("input[name='comprador_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_compra = 12;
			else
				inmo_reg_mercantil_compra = 0;

			if ($("input[name='vendedor_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_venta = 12;
			else
				inmo_reg_mercantil_venta = 0;

			break;
		case 'OBNU': // ---------Obra Nueva  
			inmo_honor = calcular_CEHONORARIOS(parseFloat($("#importe_inmo").val().replace(/\./g, '').replace(',', '.')));
			inmo_honor = inmo_honor - (inmo_honor * 5 / 100);
			inmo_folios_matriz = 8; //folios matriz fijo
			inmo_folios_matriz += 4; //folios por fina y como es fijo 1 por defecto son 4
			inmo_folios_matriz += f_catastro = 2; //folios de catastro
			inmo_folios_matriz += f_nota_simple = parseInt($('#inmo_folios_opcionales_0').val()); // folios Nota Simple Registral minimo 3
			inmo_folios_matriz += parseInt($("#inmo_folios_opcionales_1").val()); // folios Informe Ayuntamiento minimo 4

			// ================folios opcionales==============
			inmo_folios_matriz += parseInt($("#inmo_folios_opcionales_2").val()); // folios Recibo del IBI minimo 1
			inmo_folios_matriz += parseInt($("#inmo_folios_opcionales_3").val()); // folios Consulta Deudas minimo 1
			inmo_folios_matriz += parseInt($("#inmo_folios_opcionales_4").val()); // folios Licencia Urbanistica minimo 1
			inmo_folios_matriz += parseInt($("#inmo_folios_opcionales_5").val()); // folios Certificado del tecnico Competente minimo 1
			inmo_folios_matriz += parseInt($("#inmo_folios_opcionales_6").val()); // folios Certificado de final de obra minimo 1
			// inmo_folios_matriz += f_poder = parseInt($('#n_folios_poder_ex').val()); // folios poder extranjero apostillado minimo 4
			// ================folios constantes==============
			inmo_folios_matriz += parseInt($("#inmo_folios_1").val()); //folios Acreditación del seguro decenal
			inmo_folios_matriz += parseInt($("#inmo_folios_2").val()); //folios Libro del Edificio
			inmo_folios_matriz += parseInt($("#inmo_folios_3").val()); //folios de catastro
			inmo_folios_matriz += f_presentacion_reg = 0.5; //folios Entrada Registro de la Propiedad
			inmo_folios_matriz += f_asiento_reg = 0.5; //folios Asiento de Presentación

			// ================Testimonios==============
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_catastro));
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_nota_simple));
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_nota_simple < 1 ? parseInt(1) : f_nota_simple));
			coste_inmo_testimonios += f_poder >= 4 ?? parseFloat(get_CosteTestimonios(1, f_poder));

			inmo_reg_mercantil_compra = $("input[name='comprador_inmo']:checked").val() == "SI" ? 12 : 0;

			// inmo_copia_aut = 1;
			// inmo_copia_simple = 1;
			// inmo_copia_ele = 1;
			$("#inmo_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			inmo_diligencias = 3;
			break;
		case 'DIHO': // ---------División Horizontal
			inmo_honor 	= calcular_CEHONORARIOS(parseFloat($("#importe_inmo").val().replace(/\./g, '').replace(',', '.')));
			inmo_honor 	= inmo_honor - (inmo_honor * 5 / 100);
			// no lo tengo muy claro pero en División Horizontal no se piden el numero de fincas por eso lo mulitpilico po 1
			n_fincas 	= $('#numero_fincas_inmo').val() ? parseInt($('#numero_fincas_inmo').val().replace(/\./g, '').replace(',', '.')) : 1;
			inmo_folios_matriz = 8;
			inmo_folios_matriz += 4 * n_fincas;			
			// inmo_folios_matriz += 4 * ();
			console.log(inmo_folios_matriz);

			f_catastro = 2;
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_catastro));
			f_nota_simple = 3;
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_nota_simple));

			inmo_folios_matriz += f_catastro + f_nota_simple;
			inmo_folios_matriz += parseInt($("#inmo_folios_0").val()) < 1 ? parseInt(1) : parseInt($("#inmo_folios_0").val());
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, parseInt($("#inmo_folios_0").val()) < 1 ? parseInt(1) : parseInt($("#inmo_folios_0").val())));
			inmo_folios_matriz += parseInt($("#inmo_folios_1").val());
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, parseInt($("#inmo_folios_1").val())));
			inmo_folios_matriz += parseInt($("#inmo_folios_2").val());
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, parseInt($("#inmo_folios_2").val())));
			inmo_folios_matriz += parseInt($("#inmo_folios_3").val());
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, parseInt($("#inmo_folios_3").val())));
			//eliminado si porta un documento extranjero
			// if ($("input[name='poder_ex_inmo']:checked").val() == "SI") {
			// 	f_poder = $('#n_folios_poder_ex').val();
			// 	coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_poder));
			// }
			f_presentacion_reg = f_asiento_reg = 0.5;
			inmo_folios_matriz += f_poder + f_presentacion_reg + f_asiento_reg;

			if ($("input[name='comprador_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_compra = 12;
			else
				inmo_reg_mercantil_compra = 0;

			// inmo_copia_aut = 1;
			// inmo_copia_simple = 1;
			// inmo_copia_ele = 1;
			$("#inmo_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			inmo_diligencias = 3;
			break;
		case 'AFSA': // ---------Acta de Fijación de Saldo
			inmo_honor = 36.06;
			$('#div_honorarios_cuantia').hide();
			inmo_folios_matriz = 8;
			f_inmo_req = parseInt($("#inmo_folios_0").val());
			f_inmo_cert =  parseInt($("#inmo_folios_1").val());
			inmo_folios_matriz += f_inmo_req;
			inmo_folios_matriz += f_inmo_cert;
			inmo_folios_matriz += parseInt($("#inmo_folios_2").val()) < 2 ? parseInt(2) : parseInt($("#inmo_folios_2").val());
			inmo_folios_matriz += parseInt($("#inmo_folios_3").val());
			// inmo_copia_aut = 1;
			// inmo_copia_simple = 1;
			// inmo_copia_ele = 0;
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_inmo_req));
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, f_inmo_cert));
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, parseInt($("#inmo_folios_2").val()) < 2 ? parseInt(2) : parseInt($("#inmo_folios_2").val())));
			coste_inmo_testimonios += parseFloat(get_CosteTestimonios(1, parseInt($("#inmo_folios_3").val())));
			$("#inmo_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			inmo_diligencias = 3;

			if ($("input[name='comprador_inmo']:checked").val() == "SI")
				inmo_reg_mercantil_compra = 12;
			else
				inmo_reg_mercantil_compra = 0;
			break;
	}
	$('#resultado_inmobiliario').show();

	$('#div_result_inmo_honorarios').show();
	$('#result_inmo_honorarios').html(formatear_cifras_moneda(inmo_honor));
	$('#pdf_result_inmo_honorarios').val(formatear_cifras_moneda(inmo_honor));

	$('#div_result_inmo_folio_matriz').show();
	$('#n_folios_inmo').html(inmo_folios_matriz);
	valor_inmo_folio_matriz = precio_folio_matriz * (inmo_folios_matriz - 4);
	$('#result_inmo_folio_matriz').html(formatear_cifras_moneda(valor_inmo_folio_matriz));
	$('#pdf_n_folios_inmo').val(inmo_folios_matriz);
	$('#pdf_result_inmo_folio_matriz').val(formatear_cifras_moneda(valor_inmo_folio_matriz));

	//-------- End Folios
	// Copias
	//Simple
	// if (parseInt($('#cs_inmo_add').val()) > 0)
		inmo_copia_simple = (parseInt($('#cs_inmo_add').val()));

	simple_inmo = get_CosteSimple(inmo_copia_simple, inmo_folios_matriz);
	$('#div_result_inmo_copia_simple').show();
	$('#n_CP_inmo').html(inmo_copia_simple);
	$('#text_copia_simple_inmo').html(inmo_copia_simple > 1 ? 'Copias simples' : 'Copia simple')
	$('#result_inmo_copia_simple').html(formatear_cifras_moneda(simple_inmo));
	$('#pdf_n_CP_inmo').val(inmo_copia_simple);
	$('#pdf_result_inmo_copia_simple').val(formatear_cifras_moneda(simple_inmo));

	//autorizada
	// if (parseInt($('#au_inmo_add').val()) > 0)
		inmo_copia_aut += (parseInt($('#au_inmo_add').val()));

	autorizada_inmo = get_CosteAutorizada(inmo_copia_aut, inmo_folios_matriz);
	$('#div_result_inmo_copia_Autorizada').show();
	$('#n_CA_inmo').html(inmo_copia_aut);
	$('#text_copia_auto_inmo').html(inmo_copia_aut > 1 ? 'Copias autorizadas' : 'Copia autorizada ')	
	$('#result_inmo_copia_autorizada').html(formatear_cifras_moneda(autorizada_inmo));
	$('#pdf_n_CA_inmo').val(inmo_copia_aut);
	$('#pdf_result_inmo_copia_autorizada').val(formatear_cifras_moneda(autorizada_inmo));

	//electrónica
	// if (parseInt($('#el_inmo_add').val()) > 0)
		inmo_copia_ele += (parseInt($('#el_inmo_add').val()));

	if (inmo_copia_ele > 0){	
		electronica_inmo = get_CosteAutorizada(inmo_copia_ele, inmo_folios_matriz);
		$('#div_result_inmo_copia_electronica').show();
		$('#n_CE_inmo').html(inmo_copia_ele);
		$('#text_copia_elect_inmo').html(inmo_copia_ele > 1 ? 'Copias electrónicas' : 'Copia electrónica ')	
		$('#result_inmo_copia_electronica').html(formatear_cifras_moneda(electronica_inmo));
		$('#pdf_n_CE_inmo').val(inmo_copia_ele);
		$('#pdf_result_inmo_copia_electronica').val(formatear_cifras_moneda(electronica_inmo));
	}else
		$('#div_result_inmo_copia_electronica').hide();


	/////// End Copias
	/////// Testimonios
	$('#div_result_inmo_testimonios').show();
	$('#result_inmo_testimonios').html(formatear_cifras_moneda(coste_inmo_testimonios));
	$('#pdf_result_inmo_testimonios').val(formatear_cifras_moneda(coste_inmo_testimonios));
	//////// End testimonios
	/////// Diligencias
	$('#div_result_fam_diligencias').show();
	coste_inmo_diligencias = inmo_diligencias * 3.01;
	$('#result_inmo_diligencias').html(formatear_cifras_moneda(coste_inmo_diligencias));
	$('#pdf_result_inmo_diligencias').val(formatear_cifras_moneda(coste_inmo_diligencias));
	//////// End diligencias
	/////// Registro Mercantil

	if (inmo_reg_mercantil_compra + inmo_reg_mercantil_venta + inmo_reg_mercantil_fiador + inmo_reg_mercantil_pigno != 0) {
		$('#div_result_inmo_mercantil').show();
		$('#result_inmo_mercantil').html(formatear_cifras_moneda(inmo_reg_mercantil_compra + inmo_reg_mercantil_venta + inmo_reg_mercantil_fiador + inmo_reg_mercantil_pigno));
		$('#pdf_result_inmo_mercantil').val(formatear_cifras_moneda(inmo_reg_mercantil_compra + inmo_reg_mercantil_venta + inmo_reg_mercantil_fiador + inmo_reg_mercantil_pigno));
	} else
		$('#div_result_inmo_mercantil').hide();

	/////// End Mercantil

	inmo_subtotal = parseFloat(inmo_honor) +
		parseFloat(valor_inmo_folio_matriz) +
		parseFloat(simple_inmo) +
		parseFloat(autorizada_inmo) +
		parseFloat(electronica_inmo) +
		parseFloat(coste_inmo_testimonios) +
		parseFloat(coste_inmo_diligencias) +
		parseFloat(inmo_reg_mercantil_compra) + parseFloat(inmo_reg_mercantil_venta);

	$('#inmo_subtotal').html(formatear_cifras_moneda(inmo_subtotal));
	$('#pdf_inmo_subtotal').val(formatear_cifras_moneda(inmo_subtotal));

	inmo_iva = inmo_subtotal * iva / 100;
	$('#result_inmo_iva').html(formatear_cifras_moneda(inmo_iva));
	$('#pdf_result_inmo_iva').val(formatear_cifras_moneda(inmo_iva));

	if ($("input[name='comprador_inmo']:checked").val() == "SI") {
		$('#div_inmo_irpf').show();
		inmo_irpf = inmo_subtotal * irpf / 100;
		$('#result_inmo_irpf').html(formatear_cifras_moneda(inmo_irpf));
		$('#pdf_result_inmo_irpf').val(formatear_cifras_moneda(inmo_irpf));
	}

	inmo_folios_papel = inmo_folios_matriz + (inmo_copia_aut * inmo_folios_matriz) + 1;
	inmo_papel = coste_papel * inmo_folios_papel;
	$('#result_inmo_papel').html(formatear_cifras_moneda(inmo_papel));
	$('#pdf_result_inmo_papel').val(formatear_cifras_moneda(inmo_papel));

	$('#result_inmo_liquido').html(formatear_cifras_moneda(inmo_subtotal + inmo_iva - inmo_irpf + inmo_papel));
	$('#pdf_result_inmo_liquido').val(formatear_cifras_moneda(inmo_subtotal + inmo_iva - inmo_irpf + inmo_papel));
		
}