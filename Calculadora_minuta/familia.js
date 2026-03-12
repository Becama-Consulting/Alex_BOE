
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

$(document).ready( function(){

	$("#tipo_familia").on("change",function(e)
	{
		var familia=$("#tipo_familia").val();
		if (familia!='#') {
			setTimeout(() => {
			//	historico_familia();
			}, 10000);
		}
		inicializar_familia();
		if (familia=='PDR')
		{
			$("#fam_indicar_folios").show();
			$("#fam_pregunta_folios").html("Nº de folios del certificado de Padrón <br> de cada miembro de la pareja");
			$("#fam_box_folios_p,#fam_box_folios_0").show();
			$("#fam_texto_folios_p").html("• Primer Miembro")
			$("#fam_texto_folios_0").html("• Segundo Miembro");
			$("#fam_folios_p,#fam_folios_0").val(1);

			$("#div_incorporar_documento_familia").show();

			$("#div_pdr_fam").show();


			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 1 Copia Autorizada, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 1 Copia Electrónica, si desea mas indiquelas');
		}
		else if (familia=='DPE')
		{
			$("#fam_indicar_folios").show();
			$("#fam_pregunta_folios").html("¿Comparecen los dos miembros de la pareja estable?");
			$("#box_dpe_fam").show();

			$("#div_incorporar_documento_familia").show();
			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 1 Copia Autorizada, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 1 Copia Electrónica, si desea mas indiquelas');
		}
		else if (familia=='MAT')
		{
			$("#fam_indicar_folios").show();
			$("#fam_pregunta_folios").html("Indicar el nº de folios del Auto del Registro <br> Civil o Acta Notarial");
			$("#fam_box_folios_p").show();
			$("#fam_texto_folios_p").html("Número de folios")
			$("#fam_folios_p").attr('min', '7').val(7);

			$("#div_incorporar_documento_familia").show();
			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 2 Copias Simples, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 1 Copia Autorizada, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 1 Copia Electrónica, si desea mas indiquelas');
		}
		else if (familia=='FEM')
		{
			$("#fam_indicar_folios").show();
			$("#fam_pregunta_folios").html("Indicar el nº de folios del expediente <br> matrimonial al formalizarlo");
			$("#fam_box_folios_p").show();
			$("#fam_texto_folios_p").html("Expediente Matrimonial")
			$("#fam_folios_p").attr('min', '25').val(25);

			$("#div_incorporar_documento_familia").show();
			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 1 Copia Autorizada, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 1 Copia Electrónica, si desea mas indiquelas');

			$('#acta_final_mat,#hon_acta_final_mat,#tot_acta_final_mat,#tottot__acta_final_mat').show();
		}
		else if (familia=='DIV')
		{
			$("#fam_indicar_folios").show();
			$("#fam_pregunta_folios").html("Indicar el nº de folios:");
			$("#fam_box_folios_p,#fam_box_folios_0,#fam_box_folios_1,#fam_box_folios_2").show();
			$("#fam_texto_folios_p").html("• Convenio Regulador");
			$("#fam_texto_folios_0").html("• Testimonio del Registro Civil");
			$("#fam_texto_folios_1").html("• Testimonio del Libro de Familia");
			$("#fam_texto_folios_2").html("• Testimonio del Certificado de Padrón");
			$("#fam_texto_folios_3").html("• Testimonio del la hoja de inscripción");
			$("#fam_folios_p").attr('min', '3').val(3);
			$("#fam_folios_0").attr('min', '1').val(1);
			$("#fam_folios_3").val(1).attr('readonly', true);
			$("#fam_folios_1,#fam_folios_2").attr('min', '2').val(2);

			$("#div_incorporar_documento_familia").show();
			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 3 Copias Simples, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 2 Copias Autorizadas, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 0 Copia Electrónica, si desea mas indiquelas');
		}
		else if (familia=='CAA')
		{
			$("#fam_indicar_folios").show();
			$("#fam_pregunta_folios").html("Indicar el nº de folios de:");
			$("#fam_box_folios_p,#fam_box_folios_0").show();
			$("#fam_texto_folios_p").html("• Hoja de inscripción del matrimonio")
			$("#fam_texto_folios_0").html("• Hoja de inscripción de las capitulaciones");
			$("#fam_folios_p,#fam_folios_0").attr('min', '1').val(1);

			$("#div_incorporar_documento_familia").show();
			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 2 Copias Simples, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 2 Copias Autorizadas, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 0 Copia Electrónica, si desea mas indiquelas');
		}
		else if (familia=='CAD')
		{
			$("#fam_indicar_folios").show();
			$("#fam_pregunta_folios").html("Indicar el nº de folios de:");
			$("#fam_box_folios_p,#fam_box_folios_0,#fam_box_folios_1").show();
			$("#fam_texto_folios_p").html("• Hoja de inscripción del matrimonio")
			$("#fam_texto_folios_0").html("• Hoja de inscripción de las capitulaciones");
			$("#fam_texto_folios_1").html("• Fotocopia del libro de familia");
			$("#fam_folios_p,#fam_folios_0").attr('min', '1').val(1);
			$("#fam_folios_1").attr('min', '2').val(2);

			$("#div_incorporar_documento_familia").show();
			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 2 Copias Simples, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 2 Copias Autorizadas, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 0 Copia Electrónica, si desea mas indiquelas');
		}
		else if (familia=='EMA')
		{
			$("#fam_indicar_folios").show();
			$("#fam_pregunta_folios").html("Indicar el nº de folios de:");
			$("#fam_box_folios_p").show();
			$("#fam_texto_folios_p").html("Fotocopia del libro de familia")
			$("#fam_folios_p").attr('min', '2').val(2);

			$("#div_incorporar_documento_familia").show();
			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 2 Copias Autorizadas, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 0 Copia Electrónica, si desea mas indiquelas');
		}
		else if (familia=='NDT')
		{
			$("#fam_indicar_folios").show();
			$("#fam_pregunta_folios").html("Indicar el nº de folios de:");
			$("#fam_box_folios_p").show();
			$("#fam_texto_folios_p").html("Fotocopia del libro de familia")
			$("#fam_folios_p").attr('min', '3').val(3);

			$("#div_incorporar_documento_familia").show();
			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 2 Copias Autorizadas, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 0 Copia Electrónica, si desea mas indiquelas');
		}
		else if (familia=='AUC')
		{
			$("#fam_indicar_folios").show();
			$("#fam_pregunta_folios").html("Indicar el nº de folios de:");
			$("#fam_box_folios_p").show();
			$("#fam_texto_folios_p").html("• Inscripción en Registro Civil")
			$("#fam_folios_p").attr('min', '1').val(1);

			$("#div_incorporar_documento_familia").show();
			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 2 Copias Autorizadas, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 0 Copia Electrónica, si desea mas indiquelas');
		}
		else if (familia=='CDA')
		{
			$("#div_incorporar_documento_familia").show();
			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 1 Copia Simple, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 2 Copias Autorizadas, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 0 Copia Electrónica, si desea mas indiquelas');
		}
		else if (familia=='CMP')
		{
			$("#fam_indicar_folios").show();
			$("#fam_pregunta_folios").html("Indicar el nº de folios de:");
			$("#fam_box_folios_p").show();
			$("#fam_texto_folios_p").html("Transferencia para constituir/aportar el patrimonio (dinerario)")
			$("#fam_texto_folios_0").html("Modelo 651");
			$("#fam_texto_folios_1").html("Carta Autoliquidación");
			$("#fam_folios_p").attr('min', '1').val(1);
			$("#fam_folios_0,#fam_folios_1").val(1).attr('readonly', true);

			$("#div_cmp_fam,#div_cmp_importe_fam").show();
			$('#importe_protegido').val('6.000,00 €');

			$("#div_incorporar_documento_familia").show();
			$("#fam_copias_adicionales").show();
			$('#nota_cs_fam').html('Por defecto se presupuestan 2 Copias Simples, si desea mas indiquelas');
			$('#nota_au_fam').html('Por defecto se presupuestan 1 Copia Autorizada, si desea mas indiquelas');
			$('#nota_el_fam').html('Por defecto se presupuestan 0 Copia Electrónica, si desea mas indiquelas');
		}


	});
	$("#importe_protegido").on("change",function(e){
		e.preventDefault();
		// validacion no menor de 6000
		fam_importe = parseFloat($(this).val().replace(/\./g,'').replace(',','.'));
		console.log(fam_importe);
		if (fam_importe < 6000)
			printa_error($(this), '6.000,00 €')

		fam_importe= formatear_cifras_moneda($(this).val());
		$("#importe_protegido").val(fam_importe);
	});


	// ===============================================================================================================
	//						Incorporar Libro de Familia o Partida de Nacimiento de los hijos
	// ===============================================================================================================
	$("input[name='incorporar_libro_familia']").on("change",function(e){
		e.preventDefault();
		s1=$("input[name='incorporar_libro_familia']:checked").val();
		$('#n_folios_incorporar_libro_familia').val('');
		console.log('salida: '+s1);
		if (s1=='SI'){
			$("#div_incorporar_libro_familia").show('slow');
			$("#n_folios_incorporar_libro_familia").attr('min', '1').val(1);
		}else{
			$("#div_incorporar_libro_familia").hide('slow');
		/*	setTimeout(() => {
				$('#btn_calcular_sucesiones').trigger('click');
			}, 150);*/
		}
	});
	// ===============================================================================================================
	//						Incorporar Sentencia de Divorcio
	// ===============================================================================================================
	$("input[name='incorporar_sentencia_divorcio']").on("change",function(e){
		e.preventDefault();
		s2=$("input[name='incorporar_sentencia_divorcio']:checked").val();
		$('#n_folios_incorporar_sentencia_divorcio').val('');
		console.log('salida: '+s2);
		if (s2=='SI'){
			$("#div_incorporar_sentencia_divorcio").show('slow');
			$("#n_folios_incorporar_sentencia_divorcio").attr('min', '2').val(2);
		}else{
			$("#div_incorporar_sentencia_divorcio").hide('slow');
		/*	setTimeout(() => {
				$('#btn_calcular_sucesiones').trigger('click');
			}, 150);*/
		}
	});
	// ===============================================================================================================
	//						Incorporar Documento de Convivencia Previa
	// ===============================================================================================================
	$("input[name='incorporar_convivencia_previa']").on("change",function(e){
		e.preventDefault();
		s3=$("input[name='incorporar_convivencia_previa']:checked").val();
		$('#n_folios_incorporar_convivencia_previa').val('');
		console.log('salida: '+s3);
		if (s3=='SI'){
			$("#div_incorporar_convivencia_previa").show('slow');
			$("#n_folios_incorporar_convivencia_previa").attr('min', '2').val(2);
		}else{
			$("#div_incorporar_convivencia_previa").hide('slow');
		/*	setTimeout(() => {
				$('#btn_calcular_sucesiones').trigger('click');
			}, 150);*/
		}
	});
	// ===============================================================================================================
	//						Incorporar Contrato de Alquiler de su Vivienda Habitual
	// ===============================================================================================================
	$("input[name='incorporar_contrato_alquiler']").on("change",function(e){
		e.preventDefault();
		s4=$("input[name='incorporar_contrato_alquiler']:checked").val();
		$('#n_folios_incorporar_contrato_alquiler').val('');
		console.log('salida: '+s4);
		if (s4=='SI'){
			$("#div_incorporar_contrato_alquiler").show('slow');
			$("#n_folios_incorporar_contrato_alquiler").attr('min', '4').val(4);
		}else{
			$("#div_incorporar_contrato_alquiler").hide('slow');
		/*	setTimeout(() => {
				$('#btn_calcular_sucesiones').trigger('click');
			}, 150);*/
		}
	});

	// ===============================================================================================================
	//								numero de folios adicionales por documuento
	// ===============================================================================================================
	$("input[name='incorporar_documento_fam']").on("change",function(e){
		e.preventDefault();
		salida=$("input[name='incorporar_documento_fam']:checked").val();
		$('#n_folios_por_documentos_fam').val('');
		$("#folios_agregados_por_documentos_fam").html('');
		console.log('salida: '+salida);
		if (salida=='SI'){
		//	$('#resultado_sucesiones').hide();
			$("#div_folios_por_documentos_fam").show('slow');
		}else{
			$("#div_folios_por_documentos_fam").hide('slow');
		/*	setTimeout(() => {
				$('#btn_calcular_sucesiones').trigger('click');
			}, 150);*/
		}
	});

	// ===============================================================================================================
	//											numero de folios adicionales por documento
	//===============================================================================================================
	$("#n_folios_por_documentos_fam").on("change",function(e){
		e.preventDefault();
		$("#folios_agregados_por_documentos_fam").html('');
		$("#body_table_docs_agregados_fam").html('');
		//$("#tdbody_legitimaciones").html('');
		//$("#resultado_legitimacion").hide();
		var numero=parseFloat($('#n_folios_por_documentos_fam').val().replace(/\./g,'').replace(',','.'));
		for (i=1;i<=numero;i++)
		{ 
			var elementos_fam="<div class='group_docs border border-1 rounded m-1 mb-3 row' style='background-color: #eee;'> "+
					"<div class='icon-box col-sm-12 col-md-7 my-auto' data-aos='zoom-in' data-aos-delay='150' style='padding-left: 6px;'>"+
					"<i class='bx bx-file'></i>"+	
					"<h4 class='pt-2'>Documento "+i+"<div class='small fw-light' style='width: 200px;'>Indique el Nº de hojas: </div> </h4> "+
					"</div>"+
					"<div data-aos='zoom-in' data-aos-delay='150' class='col-sm-12 col-md-3 aos-init aos-animate ms-auto ps-4 pe-2 my-auto'>\
          <input type='text' class='form-control h6 solonumeros input_familia' value='1' id='docs_folio_fam"+i+"' name='docs_folio_fam[]'>\
          </div>"+
					"</div> ";
			$("#folios_agregados_por_documentos_fam").append(elementos_fam);
			var registro_fam="<tr><td class='td_iten'>Documento "+i+"</td>"+
				"<td class='td_right' id='b_l"+i+"'>0</td>"+
				"<td class='td_right' id='e_l"+i+"'>0</td></tr>";
			$("#body_table_docs_agregados_fam").append(registro_fam);
		}
	});

	// ===============================================================================================================
	//                                  Function calcular presupuesto familia
	// ===============================================================================================================

	$('#btn_calcular_fam').on('click',function(e) {
		e.preventDefault();
		$('#tipo_solicitud_familia').val('FAMILIA');
		$('.inputs_pdf').val('');
		// inicializar los div de resultado 
		$('#resultado_fam').show();
	//	$('#div_result_fam_doc_sin_cuantia,#div_result_fam_doc_con_cuantia,#div_result_fam_folio_matriz,#div_result_fam_copia_simple,#div_result_fam_copia_Autorizada').hide();
	//	$('#div_result_fam_copia_electronica,#div_result_fam_testimonios,#div_result_fam_diligencias,#notif_correo_fam,#mensajeria_fam').hide();
		fam_sin_cuantia=fam_con_cuantia=fam_folio_matriz=total_folios=0;


		$('#fam_text').html($('#tipo_familia').find('option:selected').text());
		$('#pdf_fam_text').val($('#tipo_familia').find('option:selected').text());
		var familia=$("#tipo_familia").val();
		if (familia=='CMP')
		{
			//fam_con_cuantia=;
			$('#div_result_fam_doc_con_cuantia').show();
		}
		else
		{
			fam_sin_cuantia=precio;
			$('#div_result_fam_doc_sin_cuantia').show();
			$('#result_fam_sin_cuantia').html(formatear_cifras_moneda(fam_sin_cuantia));
			$('#pdf_result_fam_sin_cuantia').val(formatear_cifras_moneda(fam_sin_cuantia));
		}

//////// Folios
		// ===============================================================================================================
		//                   Fijar valores a 0, minimos y total_folios según select
		// ===============================================================================================================
		fam_folios_p=fam_folios_0=fam_folios_1=fam_folios_2=fam_folios_3=n_folios_incorporar_libro_familia=n_folios_incorporar_sentencia_divorcio=n_folios_incorporar_convivencia_previa=n_folios_incorporar_contrato_alquiler=0;
		fam_folios_escritura_matriz=fam_folios_justificante_presentacion=0;
		simple_fam=autorizada_fam=electronica_fam=fam_folio_matriz=i_fam=coste_fam_testimonios=coste_fam_diligencias=fam_diligencias=fam_subtotal=fam_iva=fam_papel=fam_total=fam_folios_papel=0;

		if (familia=='PDR')
		{
			fam_folios_escritura_matriz=5;
			fam_folios_justificante_presentacion=1;

			fam_folios_p=fam_folios_0=n_folios_incorporar_libro_familia=1;
			n_folios_incorporar_sentencia_divorcio=n_folios_incorporar_convivencia_previa=2;
			n_folios_incorporar_contrato_alquiler=4;
			total_folios+=parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val()));

			total_folios+=parseInt($("#fam_folios_0").val())<fam_folios_0?fam_folios_0:parseInt($("#fam_folios_0").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_0").val())<fam_folios_0?fam_folios_0:parseInt($("#fam_folios_0").val()));

			s11=$("input[name='incorporar_libro_familia']:checked").val();
			if (s11=='SI')
			{
				total_folios+=parseInt($("#n_folios_incorporar_libro_familia").val())<n_folios_incorporar_libro_familia?n_folios_incorporar_libro_familia:parseInt($("#n_folios_incorporar_libro_familia").val());
				coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#n_folios_incorporar_libro_familia").val())<n_folios_incorporar_libro_familia?n_folios_incorporar_libro_familia:parseInt($("#n_folios_incorporar_libro_familia").val()));
			}
			s12=$("input[name='incorporar_sentencia_divorcio']:checked").val();
			if (s12=='SI')
			{
				total_folios+=parseInt($("#n_folios_incorporar_sentencia_divorcio").val())<n_folios_incorporar_sentencia_divorcio?n_folios_incorporar_sentencia_divorcio:parseInt($("#n_folios_incorporar_sentencia_divorcio").val());
				coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#n_folios_incorporar_sentencia_divorcio").val())<n_folios_incorporar_sentencia_divorcio?n_folios_incorporar_sentencia_divorcio:parseInt($("#n_folios_incorporar_sentencia_divorcio").val()));
			}
			s13=$("input[name='incorporar_convivencia_previa']:checked").val();
			if (s13=='SI')
			{
				total_folios+=parseInt($("#n_folios_incorporar_convivencia_previa").val())<n_folios_incorporar_convivencia_previa?n_folios_incorporar_convivencia_previa:parseInt($("#n_folios_incorporar_convivencia_previa").val());
				coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#n_folios_incorporar_convivencia_previa").val())<n_folios_incorporar_convivencia_previa?n_folios_incorporar_convivencia_previa:parseInt($("#n_folios_incorporar_convivencia_previa").val()));
			}
			s14=$("input[name='incorporar_contrato_alquiler']:checked").val();
			if (s14=='SI')
			{
				total_folios+=parseInt($("#n_folios_incorporar_contrato_alquiler").val())<n_folios_incorporar_contrato_alquiler?n_folios_incorporar_contrato_alquiler:parseInt($("#n_folios_incorporar_contrato_alquiler").val());
				coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#n_folios_incorporar_contrato_alquiler").val())<n_folios_incorporar_contrato_alquiler?n_folios_incorporar_contrato_alquiler:parseInt($("#n_folios_incorporar_contrato_alquiler").val()));
			}
			total_folios+=fam_folios_escritura_matriz;
			total_folios+=fam_folios_justificante_presentacion;

			copia_aut=copia_sin=copia_ele=1;
			$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			fam_diligencias=3;
		}
		else if (familia=='DPE')
		{
			fam_folios_escritura_matriz=4;
			fam_folios_justificante_presentacion=1;
			s15=$("input[name='dpe_opcion_fam']:checked").val();
			if (s15=='SI')
			{
				fam_folios_justificante_correos=0;
				$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
				fam_diligencias=3;
			}
			else
			{
				fam_folios_justificante_correos=1;
				$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito, Diligencia notificación)");
				fam_diligencias=4;
			}

			total_folios+=fam_folios_justificante_correos;

			coste_fam_testimonios+=calculo_testimonios_fam(fam_folios_justificante_correos);

			total_folios+=fam_folios_escritura_matriz;
			total_folios+=fam_folios_justificante_presentacion;

			copia_aut=copia_sin=copia_ele=1;
		}
		else if (familia=='MAT')
		{
			fam_folios_p=7;
			fam_folios_escritura_matriz=5;
			fam_dili_envio=fam_dili_presentacion=fam_testimonios=1;
			total_folios+=parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val());

			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val()));

			total_folios+=fam_folios_escritura_matriz+fam_dili_envio+fam_dili_presentacion+fam_testimonios;

			copia_aut=copia_ele=1;
			copia_sin=2;
			$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito, Envio e Inscripción)");
			fam_diligencias=5;
		}
		else if (familia=='FEM')
		{
			fam_folios_p=25;
			fam_folios_escritura_matriz=15;
			total_folios+=parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val());

			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val()));

			total_folios+=fam_folios_escritura_matriz;

			copia_aut=copia_sin=copia_ele=1;
			$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			fam_diligencias=3;
			$("#mat_result_fam_sin_cuantia").html(formatear_cifras_moneda(fam_sin_cuantia));
			$("#pdf_mat_result_fam_sin_cuantia").val(formatear_cifras_moneda(fam_sin_cuantia));
			mat_esp_matriz=precio_folio_matriz*(5-4);
			$('#mat_result_fam_folio_matriz').html(formatear_cifras_moneda(mat_esp_matriz));
			$('#pdf_mat_result_fam_folio_matriz').val(formatear_cifras_moneda(mat_esp_matriz));
			mat_simple_fam = get_CosteSimple(1, 5);
			$('#mat_result_fam_copia_simple').html(formatear_cifras_moneda(mat_simple_fam));
			$('#pdf_mat_result_fam_copia_simple').val(formatear_cifras_moneda(mat_simple_fam));
			mat_autorizada_fam = get_CosteAutorizada(1, 5);
			$('#mat_result_fam_copia_autorizada').html(formatear_cifras_moneda(mat_autorizada_fam));
			$('#pdf_mat_result_fam_copia_autorizada').val(formatear_cifras_moneda(mat_autorizada_fam));
			$("#mat_fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			mat_coste_fam_diligencias=3*3.01;
			$('#mat_result_fam_diligencias').html(formatear_cifras_moneda(mat_coste_fam_diligencias));
			$('#pdf_mat_result_fam_diligencias').val(formatear_cifras_moneda(mat_coste_fam_diligencias));
			mat_fam_subtotal=fam_sin_cuantia+mat_esp_matriz+parseFloat(mat_simple_fam)+parseFloat(mat_autorizada_fam)+mat_coste_fam_diligencias;
			$('#mat_fam_subtotal').html(formatear_cifras_moneda(mat_fam_subtotal));
			$('#pdf_mat_fam_subtotal').val(formatear_cifras_moneda(mat_fam_subtotal));

			mat_fam_iva=mat_fam_subtotal*iva/100;
			$('#mat_fam_iva').html(formatear_cifras_moneda(mat_fam_iva));
			$('#pdf_mat_fam_iva').val(formatear_cifras_moneda(mat_fam_iva));
			mat_fam_folios_papel=10;
			mat_fam_papel=coste_papel*mat_fam_folios_papel;
			$('#mat_fam_papel').html(formatear_cifras_moneda(mat_fam_papel));
			$('#pdf_mat_fam_papel').val(formatear_cifras_moneda(mat_fam_papel));			
			mat_total_acta_final=mat_fam_subtotal+mat_fam_iva+mat_fam_papel;
			$('#mat_fam_total').html(formatear_cifras_moneda(mat_total_acta_final));
			$('#pdf_mat_fam_total').val(formatear_cifras_moneda(mat_total_acta_final));

		}
		else if (familia=='DIV')
		{
			fam_folios_p=3;
			fam_folios_0=1;
			fam_folios_1=fam_folios_2=2;
			fam_folios_3=1;
			fam_folios_escritura_matriz=5;
			fam_dili_inscripcion=1;
			total_folios+=parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val()));
			total_folios+=parseInt($("#fam_folios_0").val())<fam_folios_0?parseInt(fam_folios_0):parseInt($("#fam_folios_0").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_0").val())<fam_folios_0?parseInt(fam_folios_0):parseInt($("#fam_folios_0").val()));
			total_folios+=parseInt($("#fam_folios_1").val())<fam_folios_1?parseInt(fam_folios_1):parseInt($("#fam_folios_1").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_1").val())<fam_folios_1?parseInt(fam_folios_1):parseInt($("#fam_folios_1").val()));
			total_folios+=parseInt($("#fam_folios_2").val())<fam_folios_2?parseInt(fam_folios_2):parseInt($("#fam_folios_2").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_2").val())<fam_folios_2?parseInt(fam_folios_2):parseInt($("#fam_folios_2").val()));
			coste_fam_testimonios+=calculo_testimonios_fam(fam_folios_3);

			total_folios+=fam_folios_escritura_matriz+fam_folios_3+fam_dili_inscripcion;

			copia_aut=3;
			copia_sin=2;
			copia_ele=0;

			$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito, Envio e Inscripción)");
			fam_diligencias=5;
		}
		else if (familia=='CAA')
		{
			fam_folios_p=fam_folios_0=1;
			fam_folios_escritura_matriz=6;
			total_folios+=parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val()));
			total_folios+=parseInt($("#fam_folios_0").val())<fam_folios_0?parseInt(fam_folios_0):parseInt($("#fam_folios_0").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_0").val())<fam_folios_0?parseInt(fam_folios_p):parseInt($("#fam_folios_0").val()));

			total_folios+=fam_folios_escritura_matriz;

			copia_aut=2;
			copia_sin=2;
			copia_ele=0;
			$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito, Envio, Inscripción, Incorporación)");
			fam_diligencias=6;
		}
		else if (familia=='CAD')
		{
			fam_folios_p=fam_folios_0=1;
			fam_folios_1=2;
			fam_folios_escritura_matriz=5;
			total_folios+=parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val()));
			total_folios+=parseInt($("#fam_folios_0").val())<fam_folios_0?parseInt(fam_folios_0):parseInt($("#fam_folios_0").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_0").val())<fam_folios_0?parseInt(fam_folios_0):parseInt($("#fam_folios_0").val()));
			total_folios+=parseInt($("#fam_folios_1").val())<fam_folios_1?parseInt(fam_folios_1):parseInt($("#fam_folios_1").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_1").val())<fam_folios_1?parseInt(fam_folios_1):parseInt($("#fam_folios_1").val()));

			total_folios+=fam_folios_escritura_matriz;

			copia_aut=2;
			copia_sin=2;
			copia_ele=0;
			$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito, Envio, Recepción)");
			fam_diligencias=5;
		}
		else if (familia=='EMA')
		{
			fam_folios_p=2;
			fam_folios_escritura_matriz=4;
			total_folios+=parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val()));
			total_folios+=fam_folios_escritura_matriz;

			copia_aut=2;
			copia_sin=1;
			copia_ele=0;
			$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito, Envio, Recepción)");
			fam_diligencias=5;
		}
		else if (familia=='NDT')
		{
			fam_folios_p=3;
			fam_folios_escritura_matriz=3;
			total_folios+=parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val()));

			total_folios+=fam_folios_escritura_matriz;

			copia_aut=2;
			copia_sin=1;
			copia_ele=0;
			$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito, Envio, Recepción)");
			fam_diligencias=5;
		}
		else if (familia=='AUC')
		{
			fam_folios_p=1;
			fam_folios_escritura_matriz=3;
			total_folios+=parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val()));

			copia_aut=2;
			copia_sin=1;
			copia_ele=0;
			$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito, Envio, Recepción)");
			fam_diligencias=5;
		}
		else if (familia=='CDA')
		{
			fam_folios_escritura_matriz=8;
			total_folios+=fam_folios_escritura_matriz;

			copia_aut=2;
			copia_sin=1;
			copia_ele=0;
			$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito, Envio, Recepción)");
			fam_diligencias=5;
		}
		else if (familia=='CMP')
		{
			fam_folios_p=fam_folios_0=fam_folios_1=1;
			s16=$("input[name='cmp_opcion_fam']:checked").val();
			if (s16=='SI')
				fam_folios_escritura_matriz=7;
			else
				fam_folios_escritura_matriz=3;

			total_folios+=parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#fam_folios_p").val())<fam_folios_p?parseInt(fam_folios_p):parseInt($("#fam_folios_p").val()));

			total_folios+=fam_folios_0+fam_folios_1;
			coste_fam_testimonios+=calculo_testimonios_fam(fam_folios_0);
			coste_fam_testimonios+=calculo_testimonios_fam(fam_folios_1);

			total_folios+=fam_folios_escritura_matriz;

			i_fam = parseFloat($("#importe_protegido").val().replace(/\./g,'').replace(',','.'));
			if (isNaN(i_fam))
				i_fam=6000;

			if (i_fam<6000) 
				i_fam=6000;

			$('#result_fam_con_cuantia').html(formatear_cifras_moneda(calculo_honorarios_fam(i_fam)*0.95));
			$('#pdf_result_fam_con_cuantia').val(formatear_cifras_moneda(calculo_honorarios_fam(i_fam)*0.95));
			fam_con_cuantia = calculo_honorarios_fam(i_fam);

			copia_aut=1;
			copia_sin=2;
			copia_ele=0;

			$("#fam_diligencias_texto").html("(Incorporación, Cotejo, Depósito)");
			fam_diligencias=3;
		}

		//Documentos adicionales
		var docs_adic=parseInt($('#n_folios_por_documentos_fam').val().replace(/\./g,'').replace(',','.'));
		for (i=1;i<=docs_adic;i++)
		{
			total_folios+=parseInt($("#docs_folio_fam"+i).val())<1?1:parseInt($("#docs_folio_fam"+i).val());
			coste_fam_testimonios+=calculo_testimonios_fam(parseInt($("#docs_folio_fam"+i).val())<1?1:parseInt($("#docs_folio_fam"+i).val()));
		}

		if (total_folios>4)
			fam_folio_matriz=precio_folio_matriz*(total_folios-4);

		if (fam_folio_matriz > 0 ) 			
			$('#div_result_fam_folio_matriz').show();
		else
			$('#div_result_fam_folio_matriz').hide();

		text_total_folios = total_folios > 1 ? total_folios+' Folio Matriz' : total_folios+' Folios Matriz';
		$("#n_f_matriz_fam").html(text_total_folios);
		$('#pdf_n_f_matriz_fam').val(total_folios);
		$('#result_fam_folio_matriz').html(formatear_cifras_moneda(fam_folio_matriz));
		$('#pdf_result_fam_folio_matriz').val(formatear_cifras_moneda(fam_folio_matriz));

/////// End Folios
/////// Copias
		//Simple
		if (parseInt($('#cs_fam_add').val()) > 0 )
			copia_sin+= (parseInt($('#cs_fam_add').val() ));

		simple_fam = get_CosteSimple(copia_sin, total_folios);
		$('#div_result_fam_copia_simple').show();
		text_copias_simples = copia_sin > 1 ? copia_sin+' Copias Simples' : copia_sin+' Copia Simple';
		$("#n_copia_simp_fam").html(text_copias_simples); 
		$("#pdf_n_copia_simp_fam").val(copia_sin);
		$('#result_fam_copia_simple').html(formatear_cifras_moneda(simple_fam));
		$('#pdf_result_fam_copia_simple').val(formatear_cifras_moneda(simple_fam));

		//autorizada
		if (parseInt($('#au_fam_add').val()) > 0 )
			copia_aut+= (parseInt($('#au_fam_add').val() ));

		autorizada_fam = get_CosteAutorizada(copia_aut, total_folios);
		text_copia_aut = copia_aut > 1 ? copia_aut+' Copias Autorizadas' : copia_aut+' Copia Autorizada';
		$("#n_copia_aut_fam").html(text_copia_aut);
		$("#pdf_n_copia_aut_fam").val(copia_aut);
		$('#div_result_fam_copia_Autorizada').show();
		$('#result_fam_copia_autorizada').html(formatear_cifras_moneda(autorizada_fam));
		$('#pdf_result_fam_copia_autorizada').val(formatear_cifras_moneda(autorizada_fam));

		//electrónica
		if (parseInt($('#el_fam_add').val()) > 0 )
			copia_ele+= (parseInt($('#el_fam_add').val() ));

		electronica_fam = get_CosteAutorizada(copia_ele, total_folios);
		electronica_fam > 0 ? $('#div_result_fam_copia_electronica').show() : $('#div_result_fam_copia_electronica').hide();
		text_copia_ele = copia_ele > 1 ? copia_ele+' Copias Electrónicas' : copia_ele+' Copia Electrónica';
		$("#n_copia_elect_fam").html(text_copia_ele);
		$("#pdf_n_copia_elect_fam").val(copia_ele);
		$('#result_fam_copia_electronica').html(formatear_cifras_moneda(electronica_fam));
		$('#pdf_result_fam_copia_electronica').val(formatear_cifras_moneda(electronica_fam));

/////// End Copias
/////// Testimonios
		if (coste_fam_testimonios) {
			$('#div_result_fam_testimonios').show();
			$('#result_fam_testimonios').html(formatear_cifras_moneda(coste_fam_testimonios));
			$('#pdf_result_fam_testimonios').val(formatear_cifras_moneda(coste_fam_testimonios));
		}
//////// End testimonios
/////// Diligencias
		$('#div_result_fam_diligencias').show();
		coste_fam_diligencias=parseFloat(fam_diligencias*3.01);
// alert(fam_diligencias);
// alert(coste_fam_diligencias);

		$('#result_fam_diligencias').html(formatear_cifras_moneda(coste_fam_diligencias));
		$('#pdf_result_fam_diligencias').val(formatear_cifras_moneda(coste_fam_diligencias));
//////// End diligencias
		fam_subtotal=	fam_con_cuantia +
						fam_sin_cuantia+
						fam_folio_matriz+
						parseFloat(simple_fam)+
						parseFloat(autorizada_fam)+
						parseFloat(electronica_fam)+
						coste_fam_testimonios+
						coste_fam_diligencias;
		$('#fam_subtotal').html(formatear_cifras_moneda(fam_subtotal));
		$('#pdf_fam_subtotal').val(formatear_cifras_moneda(fam_subtotal));

		fam_iva=fam_subtotal*iva/100;
		$('#fam_iva').html(formatear_cifras_moneda(fam_iva));
		$('#pdf_fam_iva').val(formatear_cifras_moneda(fam_iva));

		fam_folios_papel=total_folios+(copia_aut*total_folios)+1;
		fam_papel=coste_papel*fam_folios_papel;
		$('#fam_papel').html(formatear_cifras_moneda(fam_papel));
		$('#pdf_fam_papel').val(formatear_cifras_moneda(fam_papel));

		$('#fam_total').html(formatear_cifras_moneda(fam_subtotal+fam_iva+fam_papel));
		$('#pdf_fam_total').val(formatear_cifras_moneda(fam_subtotal+fam_iva+fam_papel));

		if (familia=='FEM'){
			$('#mat_tot_fam_total').html(formatear_cifras_moneda(fam_subtotal+fam_iva+fam_papel+mat_total_acta_final));
			$('#pdf_mat_tot_fam_total').val(formatear_cifras_moneda(fam_subtotal+fam_iva+fam_papel+mat_total_acta_final));
		}

	});

	// ===============================================================================================================
	//                                  Consultar el formulario de enviar el presupuesto por mail
	// ===============================================================================================================
	$(document).on('click', '#btn_email_familia', function(e){
		e.preventDefault();
		$('#btn_email_familia').hide();
		$('#div_enviar_mail_familia').show('slow');
		$('#btn_enviar_familia').show('slow');
	});
	
	
	// ===============================================================================================================
	//                                  Enviar mail con el presupuesto
	// ===============================================================================================================
	$(document).on('click', '#btn_enviar_familia', function(e){
		e.preventDefault();
		email = validarEmail($('#email_familia').val());	
		$("#loading_familia").hide();
		$('.terminos, .terminos_link').removeClass('text-danger');
		terminos= $(document).find("input[type='checkbox'][name='terminos']:checked");
		if (email == true) {	
			if (terminos.val() == 'OK') {
				$("#btn_enviar_familia").hide();
				$("#loading_familia").show();				
				grecaptcha.ready(function() {
					grecaptcha.execute('6LdCoVEqAAAAAHPOAqmBgukE9w8LJUHsfaXJbS6a', {action: 'submit'}).then(function(token) {
						$("#form_enviar_familia_by_mail").append("<input type='hidden' name='g-recaptcha-response' value='" + token + "' />");
						$.ajax({
							method: 'POST',
							url: "/Printer_budget/enviar_by_mail",
							data: $("#form_enviar_familia_by_mail").serialize(),
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
			$('#email_familia').addClass('alert_input');
		}

	});
	
	// ===============================================================================================================
	//						validacion Numero de folios segun el tipo de familia y tipo de folio
	// ===============================================================================================================
	$('#fam_folios_p, #fam_folios_0, #fam_folios_1, #fam_folios_2').on('change', function (e) {
		error_input= 0; 
		valor_input = $(this).val();
		tipo_familia=$("#tipo_familia").val();
		valor_minimo = 0;
		nombre_imput=$(this).attr("name"); 
	 // Pareja de Hecho		
		if (tipo_familia=="PDR" && valor_input < 1 && nombre_imput== 'fam_folios_p' ) 
			valor_minimo = 1;

		if (tipo_familia=="PDR" && valor_input < 1 && nombre_imput== 'fan_folios_0' )
			valor_minimo = 1;
			
	 // Formalización del Expediente Matrimonial
		if (tipo_familia=="FEM" && valor_input < 25) 
			valor_minimo = 25; 
			
	 // Matrimonio
		if (tipo_familia=="MAT" && valor_input < 7 ) 
			valor_minimo = 7;

	 // Divorcio
		if (tipo_familia=="DIV" && valor_input < 3 && nombre_imput== 'fam_folios_p' ) 
			valor_minimo = 3;

		if (tipo_familia=="DIV" && valor_input < 1 && nombre_imput== 'fan_folios_0' )
			valor_minimo = 1;

		if (tipo_familia=="DIV" && valor_input < 2 && nombre_imput== 'fan_folios_1' )
			valor_minimo = 2;
		
		if (tipo_familia=="DIV" && valor_input < 2 && nombre_imput== 'fan_folios_2' )
			valor_minimo = 2;

	 // Capitulaciones Antes de Matrimonio
		if (tipo_familia=="CAA" && valor_input < 1 && nombre_imput== 'fam_folios_p' ) 
			valor_minimo = 1;

		if (tipo_familia=="CAA" && valor_input < 1 && nombre_imput== 'fan_folios_0' )
			valor_minimo = 1;

	 // Capitulaciones Después de Matrimonio
		if (tipo_familia=="CAD" && valor_input < 1 && nombre_imput== 'fam_folios_p' ) 
			valor_minimo = 1;

		if (tipo_familia=="CAD" && valor_input < 1 && nombre_imput== 'fan_folios_0' )
			valor_minimo = 1;

		if (tipo_familia=="CAD" && valor_input < 2 && nombre_imput== 'fan_folios_1' )
			valor_minimo = 2;
		
	 // Emancipación
		if (tipo_familia=="EMA" && valor_input < 2 ) 
			valor_minimo = 2;	
			
	 // Nombramiento de Tutor
		if (tipo_familia=="NDT" && valor_input < 3 ) 
			valor_minimo = 3;		
			
	 // Autocuratela
		if (tipo_familia=="AUC" && valor_input < 1 ) 
			valor_minimo = 1;			
			
	 // Constitución de Patrimonio Protegido
		if (tipo_familia=="CMP" && valor_input < 1 ) 
			valor_minimo = 1;				

	 // ==========si hay valor minimo es porque hay un error==========	
		if (valor_minimo > 0) 
			printa_error($(this), valor_minimo)
	}); 

});


function inicializar_familia()
{
	$('#fam_indicar_folios,#fam_indicar_folios,#box_dpe_fam,#div_incorporar_documento_familia,#fam_copias_adicionales').hide();
	$('#cs_fam_add,#au_fam_add,#el_fam_add').val(0);
	$('#fam_folios_p,#fam_folios_0,#fam_folios_1,#fam_folios_2,#fam_folios_3').val(0);
	$('#resultado_fam,#acta_final_mat').hide();
	$("#folios_agregados_por_documentos_fam").html('');
	$('#acta_final_mat, #hon_acta_final_mat, #tot_acta_final_mat, #tottot__acta_final_mat').hide();
	$("#fam_folios_0,#fam_folios_1, #fam_folios_2").val(1).attr('readonly', false);
	$('#div_cmp_fam, #div_cmp_importe_fam, #div_pdr_fam').hide();
	// document.querySelectorAll('[name=incorporar_documento_fam]').forEach((x) => x.checked = false);
	// document.querySelectorAll('[name=incorporar_contrato_alquiler]').forEach((x) => x.checked = false);
	// document.querySelectorAll('[name=incorporar_convivencia_previa]').forEach((x) => x.checked = false);
	// document.querySelectorAll('[name=incorporar_sentencia_divorcio]').forEach((x) => x.checked = false);
	// document.querySelectorAll('[name=incorporar_libro_familia]').forEach((x) => x.checked = false);
	// document.querySelectorAll('[name=cmp_opcion_fam]').forEach((x) => x.checked = false);
	// document.querySelectorAll('[name=dpe_opcion_fam]').forEach((x) => x.checked = false);
	$('#n_folios_por_documentos_fam').val(0);
	$("#fam_box_folios_p,#fam_box_folios_0, #fam_box_folios_1, #fam_box_folios_2").hide();
	$('#div_result_fam_doc_sin_cuantia,#div_result_fam_doc_con_cuantia,#div_result_fam_folio_matriz,#div_result_fam_copia_simple,#div_result_fam_copia_Autorizada').hide();
	$('#div_result_fam_copia_electronica,#div_result_fam_testimonios,#div_result_fam_diligencias,#notif_correo_fam,#mensajeria_fam').hide();




}
function calculo_honorarios_fam(importe_fam)
{
	if (importe_fam <= 6010.12)
		return 90.15;

	if (importe_fam >= 6010.13 && importe_fam <= 30050.61) 
		return (90.15 + ((importe_fam - 6010.12) * 0.0045));
 
	if (importe_fam >= 30050.62 && importe_fam <= 60101.21) 
		return (90.15 + 108.18 + ((importe_fam - 30050.61) * 0.0015));

	if (importe_fam >= 60101.22 && importe_fam <= 150253.03) 
		return (90.15 + 108.18 + 45.08 + ((importe_fam - 60101.21) * 0.001));

	if (importe_fam >= 150253.04 && importe_fam <= 601012.1) 
		return (90.15 + 108.18 + 45.08 + 90.15 + ((importe_fam - 150253.03) * 0.0005));

	if (importe_fam >= 601012.11) 
		return (90.15 + 108.18 + 45.08 + 90.15 + 225.38 + ((importe_fam - 601012.1) * 0.0003));

	/*if (importe_fam >= 601012.11 && importe_fam <= 6010121.04) 
		return (90.15 + 108.18 + 45.08 + 90.15 + 225.38 + ((importe_fam - 601012.1) * 0.0003));

	if (importe_fam >=6010121.05)
	{
		honor=90.15 + 108.18 + 45.08 + 90.15 + 225.38 + ((Importe - 601012.1) * 0.0003);
		Diferencia6M = honor - 1960.77
		Diferencia6M = Diferencia6M * (1 - (Reduccion / 100))
		return 1960.77 + Diferencia6M;
	}*/
}
function calculo_testimonios_fam(folios_testi)
{
	if (folios_testi==0)
		valor_fam_testi=0;
	else if (folios_testi==1)
		valor_fam_testi= parseFloat(3.005060);
	else
		valor_fam_testi= parseFloat(3.005060 + (0.601012*(folios_testi-1)));

	return Number(valor_fam_testi.toFixed(2));
}

function printa_error(input, valor_min) {
	input.addClass('bg_danger'); 
	$('#btn_calcular_fam').prop('disabled', true);
	input.parent().parent().find('.lavel_input').html('Minimo '+valor_min); 
	input.removeClass('input_not_floating').addClass('input_floating');
	setTimeout(() => {
		input.removeClass('bg_danger').val(valor_min);
		input.parent().parent().find('.lavel_input').html('');  
		input.addClass('input_not_floating').removeClass('input_floating');
		$('#btn_calcular_fam').prop('disabled', false);
	}, 1200);
}
