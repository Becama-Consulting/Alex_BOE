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

function actualitza_pagament(coste,suplido,empresa)
{ 
	var iva=0;
	var irpf=0;
	if (isNaN(coste))
	{
		$("#resultado_poderes").hide();
		return false;
	}
	else
	{
		iva=coste*21/100;
		if (empresa=='empresa')
			irpf=coste*15/100;

		iva= Math.round(iva * 100)/100;
		var total=coste+iva-irpf;
		irpf= Math.round(irpf * 100)/100;
		total= Math.round(total * 100)/100;
		$('#poder_iva').val(convertir(iva));
		if (irpf>0)
			$(".bussines").show();
		else
			$(".bussines").hide();

		$('#poder_irpf').val(convertir(irpf));
		$('#poder_suplidos').val(convertir(suplido));
		$('#poder_liquido').val(convertir(total+suplido));
		//vista del presupuesto
		$('#view_poder_liquido').html(convertir(total+suplido)+' €');
		$('#view_poder_iva').html(convertir(iva)+' €');
		$('#view_poder_irpf').html('- '+convertir(irpf)+' €');
		$('#view_poder_suplidos').html(convertir(suplido)+' €');
		$("#resultado_poderes").show();
		$('#tipo_solicitud_poderes').val('PODERES');
		return total+suplido;
	}
}

function in_array(needle, haystack) {
	var length = haystack.length;
	for(var i = 0; i < length; i++) {
		if(haystack[i] == needle) return true;
	}
	return false;
}

$(document).ready( function(){

	$("#tipo_poder").on("change",function(e){

		var poder=$("#tipo_poder").val();
		if (poder!='#') {
			setTimeout(() => {
				historico_poderes();
			}, 10000);
		}
		inicializar_poderes();
		$("#b_poderdantes,#b_apoderados,#b_folios,#b_ca,#b_cs,#b_mensajeria,#b_diligencia,#b_csa,#b_caa,#b_envio_otro,#b_copia_aut,#b_fuera,#b_cliente_minuta,#b_sustituir,#b_correo,#b_persona,#b_municipio,#b_unido,#b_tramita,#b_empresa").hide();
		$("#b_n_envios,b_folios_cliente,b_urgente,b_folios_sustituir,b_num_correos,b_num_persona,b_num_municipio,#b_folios_unido,#b_num_docs").hide();
		$(".x1,.x2,.x3,.x4,.x5,.x6,.x7,.x8,.x9,.x10,.x11,.x12,.c1,.c2,.c3,.c4,.c5,.p1,.p2,.p3,.f1,.f2,.f3,.f4,.f5,.f6,.f7,.f8,.f9,.f10,.f11,.t1,.t2,.t3").hide();
		$("#nota_copias_simples").html('');
		$("#nota_copias_autorizadas").html('');
		$("#alert_apoderados").html('').hide();
		
		$("#poderdantes").prop('readonly', false);
		$("#apoderados").prop('readonly', false);

		var b_poderdantes=["P","G","E","M","L","T","A","V","N"];
		var b_apoderados=["P","G","E","M","L","T","A","V","N"];
		var b_folios=["P","G","E","M","S","R","L","T","A","V","N","F"];
		var b_ca=["P","G","E","M","S","R","L","T","A","V","N","F"];
		var b_cs=["P","G","E","M","S","R","L","T","A","V","N","F"];
		var b_mensajeria=["P","G","S","R"];
		var b_diligencia=["P"];
		var b_csa=["P","G","E","M","S","R","L","T","A","V","N","F"];
		var b_caa=["P","G","E","M","S","R","L","T","A","V","N","F"];
		var b_envio_otro=["P","E","L","T"];
		var b_copia_aut=["F"];
		var b_fuera=["P","G","E","M","S","R","L","T","A","V","N","F"];
		var b_apostilla=["P","G","E"];
		var b_cliente_minuta=["P","E"];
		var b_sustituir=["T","A"];
		var b_correo=["T","A","V","N"];
		var b_persona=["T","A","V","N"];
		var b_municipio=["T","A","V","N"];
		var b_unido=["T","A","V"];
		var b_tramita=["P","M","T","A","V","N"];
		var b_empresa=["E","L","T","A","V","N","F"];

		if (in_array(poder, b_poderdantes)){
			$("#b_poderdantes").show();
			$("#poderdantes").prop('required',true);
		}
		if (in_array(poder, b_apoderados)){
			$("#b_apoderados").show();
			$("#apoderados").prop('required',true);
		}
		if (in_array(poder, b_folios)){
			$("#b_folios").show();
			$("#folios").prop('required',true);
		}
		if (in_array(poder, b_ca)){
			$("#b_ca").show();
			$("#ca").prop('required',true);
		}
		if (in_array(poder, b_cs)){
			$("#b_cs").show();
			$("#cs").prop('required',true);
		}
		if (in_array(poder, b_mensajeria)){
			$("#b_mensajeria").show();
			$("#mensajeria").prop('required',true);
		}
		if (in_array(poder, b_diligencia)){
			$("#b_diligencia").show();
			$("#diligencia").prop('required',true);
		}
		if (in_array(poder, b_csa)){
			$("#b_csa").show();
			$("#csa").prop('required',true);
		}
		if (in_array(poder, b_caa)){
			$("#b_caa").show();
			$("#caa").prop('required',true);
		}
		if (in_array(poder, b_envio_otro)){
			$("#b_envio_otro").show();
			$("#envio_otro").prop('required',true);
		}
		if (in_array(poder, b_copia_aut)){
			$("#b_copia_aut").show();
			$("#copia_aut").prop('required',true);
		}
		if (in_array(poder, b_fuera)){
			$("#b_fuera").show();
			$("#fuera").prop('required',true);
		}
		if (in_array(poder, b_cliente_minuta)){
			$("#b_cliente_minuta").show();
			$("#cliente_minuta").prop('required',true);
		}
		if (in_array(poder, b_apostilla)){
			$("#b_apostilla").show();
			$("#apostilla").prop('required',true);
		}
		if (in_array(poder, b_sustituir)){
			$("#b_sustituir").show();
			$("#sustituir").prop('required',true);
		}
		if (in_array(poder, b_correo)){
			$("#b_correo").show();
			$("#correo").prop('required',true);
		}
		if (in_array(poder, b_persona)){
			$("#b_persona").show();
			$("#persona").prop('required',true);
		}
		if (in_array(poder, b_municipio)){
			$("#b_municipio").show();
			$("#municipio").prop('required',true);
		}
		if (in_array(poder, b_unido)){
			$("#b_unido").show();
			$("#unido").prop('required',true);
		}
		if (in_array(poder, b_tramita)){
			$("#b_tramita").show();
			$("#tramita").prop('required',true);
		}
		if (in_array(poder, b_empresa)){
			$("#b_empresa").show();
			$("#empresa").prop('required',true);
		}
		// =============PODER GENERAL==========================
		if (poder=='P')
		{	$("#nom_tipo_poder").html('Personalizado');
			$("#pdf_nom_tipo_poder").val('Personalizado')
			$("#folios").val(6);	//minimo
			$("#ca").val(1);
			$("#cs").val(1);
			$("#poderdantes").val(1);
			$('#apoderados').val(1);
			document.querySelector('#mensajeria1').checked = true;
			$("#diligencia").val(1);
			document.querySelector('#fuera2').checked = true;
			document.querySelector('#envio2').checked = true;
			document.querySelector('#cliente_minuta2').checked = true;
			document.querySelector('#apostilla2').checked = true;
			document.querySelector('#empresa1').checked = true;	
			document.querySelector('#tramita2').checked = true;					
			$("#tipo_persona").show();
			//ocultar 
			$("#subsitencia").hide();
			$('.input_radio').trigger('change');
		}
		// =============PODER GENERAL==========================
		if (poder=='G')
		{	$("#nom_tipo_poder").html('General');
			$("#pdf_nom_tipo_poder").val('General')
			$("#poderdantes").val(1).prop('readonly', true);
			$("#folios").val(7);	//minimo
			$("#ca").val(1);
			$("#cs").val(2);
			document.querySelector('#mensajeria1').checked = true;
			$('#apoderados').val(1);
			document.querySelector('#fuera2').checked = true;
			document.querySelector('#apostilla2').checked = true;
			$("#subsitencia").show();
			//ocultar 
			$("#tipo_persona").hide();
			$("#b_poderdantes").hide();
			$("#b_folios").hide();
			$("#b_ca").hide();
			$("#b_cs").hide();
			$("#b_mensajeria").hide();	
			$("#nota_copias_simples").html('Por defecto se presupuestan 2 Copias Simples, si desea mas indequelas');
			$("#nota_copias_autorizadas").html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas');
			empresa='particular';
			$('.input_radio').trigger('change');
		}
		// =============PODER ESPECIAL==========================
		else if (poder=='E')
		{	$("#nom_tipo_poder").html('Especial');
			$("#pdf_nom_tipo_poder").val('Especial')
			$("#folios").val(6);	//minimo
			$("#ca").val(1);
			$("#cs").val(1);
			$("#poderdantes").val(1);
			$('#apoderados').val(1);
			document.querySelector('#fuera2').checked = true;
			document.querySelector('#envio2').checked = true;
			document.querySelector('#cliente_minuta2').checked = true;
			document.querySelector('#apostilla2').checked = true;
			document.querySelector('#empresa1').checked = true;		
			$("#tipo_persona").show();
			//ocultar 
			$("#subsitencia").hide();
			$('#b_folios').hide();
			$("#b_ca").hide();
			$("#b_cs").hide();
			$("#nota_copias_simples").html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas');
			$("#nota_copias_autorizadas").html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas');
			$('.input_radio').trigger('change');
		}
		// =============PODER Mercantil General==========================
		else if (poder=='M')
		{	$("#nom_tipo_poder").html('Mercantil General');
			$("#pdf_nom_tipo_poder").val('Mercantil General')
			$("#poderdantes").val(1).prop('readonly', true);
			$('#apoderados').val(1);
			$("#folios").val(9);	//minimo
			$("#ca").val(1);
			$("#cs").val(1);
			document.querySelector('#fuera2').checked = true;
			document.querySelector('#tramita2').checked = true;					
			empresa='empresa';
			$("#tipo_persona").show();
			//ocultar 
			$("#subsitencia").hide();
			$("#b_poderdantes").hide();
			$('#b_folios').hide();
			$("#b_ca").hide();
			$("#b_cs").hide();
			$("#nota_copias_simples").html('Por defecto se presupuestan 1 Copia Simple, si desea mas indequelas');
			$("#nota_copias_autorizadas").html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas');
			$('.input_radio').trigger('change');
		}
		// =============PODER Preventivo Simple==========================
		else if (poder=='S')
		{	$("#nom_tipo_poder").html('Preventivo Simple');
			$("#pdf_nom_tipo_poder").val('Preventivo Simple')
			$("#folios").val(8);	//minimo
			$("#ca").val(1);
			$("#cs").val(2);
			document.querySelector('#mensajeria1').checked = true;
			document.querySelector('#fuera2').checked = true;
			empresa='particular';
			$("#tipo_persona").show();
			//ocultar 
			$("#subsitencia").hide();			
			$("#b_folios").hide();
			$("#b_ca").hide();
			$("#b_cs").hide();
			$("#b_mensajeria").hide();	
			$("#nota_copias_simples").html('Por defecto se presupuestan 2 Copias Simples, si desea mas indequelas');
			$("#nota_copias_autorizadas").html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas');
			$('.input_radio').trigger('change');
		}
		// =============PODER Preventivo Reciproco==========================
		else if (poder=='R')
		{	$("#nom_tipo_poder").html('Preventivo Reciproco');
			$("#pdf_nom_tipo_poder").val('Preventivo Reciproco')
			$("#folios").val(8);	//minimo
			$("#ca").val(1);
			$("#cs").val(3);
			document.querySelector('#mensajeria1').checked = true;
			document.querySelector('#fuera2').checked = true;
			empresa='particular';
			$("#tipo_persona").show();
			//ocultar 
			$("#subsitencia").hide();	
			$("#b_folios").hide();
			$("#b_ca").hide();
			$("#b_cs").hide();
			$("#b_mensajeria").hide();	
			$("#nota_copias_simples").html('Por defecto se presupuestan 4 Copias Simples, si desea mas indequelas');
			$("#nota_copias_autorizadas").html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas');
			$('.input_radio').trigger('change');
		}
		// =============PODER Pleitos==========================
		else if (poder=='L')
		{	$("#nom_tipo_poder").html('Pleitos');
			$("#pdf_nom_tipo_poder").val('Pleitos');
			$("#poderdantes").val(1);
			$('#apoderados').val(1);
			$("#folios").val(8);	//minimo
			$("#ca").val(1);
			$("#cs").val(1);
			document.querySelector('#envio2').checked = true;
			document.querySelector('#fuera2').checked = true;
			document.querySelector('#empresa2').checked = true;
			$("#tipo_persona").show();
			//ocultar 
			$("#subsitencia").hide();
			$("#b_folios").hide();
			$("#b_ca").hide();
			$("#b_cs").hide();
			$("#nota_copias_simples").html('Por defecto se presupuestan 1 Copias Simples, si desea mas indequelas');
			$("#nota_copias_autorizadas").html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas');
			$('.input_radio').trigger('change');
		}
		// =============PODER Sustitución==========================
		else if (poder=='T')
		{	$("#nom_tipo_poder").html('Sustitución');
			$("#pdf_nom_tipo_poder").val('Sustitución');
			$("#poderdantes").val(1);
			$('#apoderados').val(1);
			$('#n_folios_unido').val(0);
			$('#n_num_docs').val(0);
			$("#folios").val(4);
			$("#ca").val(1);
			$("#cs").val(1);
			document.querySelector('#fuera2').checked = true;
			document.querySelector('#sustituir1').checked = true;
			document.querySelector('#p_gastos_correo2').checked = true;
			document.querySelector('#persona2').checked = true;
			document.querySelector('#municipio2').checked = true;
			document.querySelector('#tramita2').checked = true;
			document.querySelector('#empresa1').checked = true;
			document.querySelector('#envio2').checked = true;
			$("#tipo_persona").show();
			//ocultar 
			$("#subsitencia").hide();			
			$("#b_folios").hide();
			$("#b_ca").hide();
			$("#b_cs").hide();
			$("#nota_copias_simples").html('Por defecto se presupuestan 1 Copias Simples, si desea mas indequelas');
			$("#nota_copias_autorizadas").html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas');
			$('.input_radio').trigger('change');
		}
		// =============PODER Subapoderamiento==========================
		else if (poder=='A')
		{	$("#nom_tipo_poder").html('Subapoderamiento');
			$("#pdf_nom_tipo_poder").val('Subapoderamiento')
			$("#folios").val(4);
			$("#ca").val(1);
			$("#cs").val(1);
			$('#n_folios_unido').val(0);
			$('#n_num_docs').val(0);
			$("#poderdantes").val(1);
			$('#apoderados').val(1);
			document.querySelector('#fuera2').checked = true;
			document.querySelector('#sustituir1').checked = true;
			document.querySelector('#p_gastos_correo2').checked = true;
			document.querySelector('#persona2').checked = true;
			document.querySelector('#municipio2').checked = true;
			document.querySelector('#tramita2').checked = true;
			document.querySelector('#empresa1').checked = true;
			$("#tipo_persona").show();
			//ocultar 
			$("#subsitencia").hide();				
			$("#b_folios").hide();
			$("#b_ca").hide();
			$("#b_cs").hide();
			$("#nota_copias_simples").html('Por defecto se presupuestan 1 Copias Simples, si desea mas indequelas');
			$("#nota_copias_autorizadas").html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas');
			$('.input_radio').trigger('change');
		}
		// =============PODER Revocación==========================
		else if (poder=='V')
		{	$("#nom_tipo_poder").html('Revocación');
			$("#pdf_nom_tipo_poder").val('Revocación')
			$("#folios").val(7);
			$("#ca").val(1);
			$("#cs").val(2);
			$('#n_folios_unido').val(0);
			$('#n_num_docs').val(0);
			$("#poderdantes").val(1);
			$('#apoderados').val(1);
			document.querySelector('#fuera2').checked = true;
			document.querySelector('#p_gastos_correo2').checked = true;
			document.querySelector('#persona2').checked = true;
			document.querySelector('#municipio2').checked = true;
			document.querySelector('#tramita2').checked = true;
			document.querySelector('#empresa1').checked = true;
			$("#tipo_persona").show();
			//ocultar 
			$("#subsitencia").hide();	 
			$("#b_folios").hide();
			$("#b_ca").hide();
			$("#b_cs").hide();
			$("#nota_copias_simples").html('Por defecto se presupuestan 1 Copias Simples, si desea mas indequelas');
			$("#nota_copias_autorizadas").html('Por defecto se presupuesta 2 Copia Autorizada, si desea mas indequelas');
			$('.input_radio').trigger('change');
		}
		// =============PODER Renuncia==========================
		else if (poder=='N')
		{	$("#nom_tipo_poder").html('Renuncia');
			$("#pdf_nom_tipo_poder").val('Renuncia')
			$("#poderdantes").val(1);
			$("#apoderados").val(1);
			$("#folios").val(7);
			$("#ca").val(1);
			$("#cs").val(2);
			document.querySelector('#fuera2').checked = true;
			document.querySelector('#p_gastos_correo2').checked = true;
			document.querySelector('#persona2').checked = true;
			document.querySelector('#municipio2').checked = true;
			document.querySelector('#tramita2').checked = true;
			document.querySelector('#empresa1').checked = true;
			$("#tipo_persona").show();
			//ocultar 
			$("#subsitencia").hide();				
			$("#b_folios").hide();
			$("#b_ca").hide();
			$("#b_cs").hide();
			$("#nota_copias_simples").html('Por defecto se presupuestan 1 Copias Simples, si desea mas indequelas');
			$("#nota_copias_autorizadas").html('Por defecto se presupuesta 2 Copia Autorizada, si desea mas indequelas');
			$('.input_radio').trigger('change');
		}
		// =============PODER Renuncia==========================
		else if (poder=='F')
		{	$("#nom_tipo_poder").html('Ratificación');
			$("#pdf_nom_tipo_poder").val('Ratificación')
			$("#folios").val(4);
			$("#ca").val(1);
			$("#cs").val(1);
			document.querySelector('#copia2').checked = true;
			document.querySelector('#fuera2').checked = true;
			document.querySelector('#empresa1').checked = true;
			$("#tipo_persona").show();
			//ocultar 
			$("#subsitencia").hide();				
			$("#b_folios").hide();
			$("#b_ca").hide();
			$("#b_cs").hide();
			$("#nota_copias_simples").html('Por defecto se presupuestan 1 Copias Simples, si desea mas indequelas');
			$("#nota_copias_autorizadas").html('Por defecto se presupuesta 1 Copia Autorizada, si desea mas indequelas');			
			$('.input_radio').trigger('change');
		}

	});
	var envio=null;
	$("input[name='envio_otro']").on("change",function(e){
		envio=$("input[name='envio_otro']:checked").val();
		// console.log('envio: '+envio);
		if (envio=='SI')
		{
			$("#b_n_envios").show();
			$("#n_envios").prop('required',true);
		}
		else
		{
			$("#b_n_envios").hide();
			$("#n_envios").prop('required',false);
		}
	});
	$("input[name='cliente_minuta']").on("change",function(e){
		var cliente=$("input[name='cliente_minuta']:checked").val();
		if (cliente=='SI')
		{
			$("#b_folios_cliente").show();
			$("#n_folios_cliente").prop('required',true);
		}
		else
		{
			$("#b_folios_cliente").hide();
			$("#n_folios_cliente").prop('required',false);
		}
	});
	$("input[name='apostilla']").on("change",function(e){
		var apostilla=$("input[name='apostilla']:checked").val();
		if (apostilla=='SI')
		{
			$("#b_urgente").show();
			$("#urgente").prop('required',true);
		}
		else
		{
			document.querySelectorAll('[name=urgente]').forEach((x) => x.checked = false);
			$("#b_urgente").hide();
			$("#urgente").prop('required',false);
		}
	});
	$("input[name='sustituir']").on("change",function(e){
		var sustituir=$("input[name='sustituir']:checked").val();
		if (sustituir=='SI')
		{
			$("#b_folios_sustituir,#b_testimonios_sustituir").show();
			$("#n_folios_sustituir").val(8);
			$("#n_testimonios_sustituir").val(1);
			$("#n_folios_sustituir,#n_testimonios_sustituir").prop('required',true);
		}
		else
		{
			$("#b_folios_sustituir,#b_testimonios_sustituir").hide();
			$("#n_folios_sustituir").val(0);
			$("#n_testimonios_sustituir").val(0);
			$("#n_folios_sustituir,#n_testimonios_sustituir").prop('required',false);
		}
	});
	$("input[name='correo']").on("change",function(e){
		var correo=$("input[name='correo']:checked").val();
		if (correo=='SI')
		{
			$("#b_num_correos").show();
			$("#n_num_correos").prop('required',true);
		}
		else
		{
			$("#b_num_correos").hide();
			$("#n_num_correos").prop('required',false);
		}
	});
	$("input[name='persona']").on("change",function(e){
		var persona=$("input[name='persona']:checked").val();

		if (persona=='SI')
		{
			$("#b_num_persona").show();
			$("#n_num_persona").prop('required',true);
		}
		else
		{
			$("#b_num_persona").hide();
			$("#n_num_persona").prop('required',false);
		}
	});
	$("input[name='municipio']").on("change",function(e){
		var municipio=$("input[name='municipio']:checked").val();
		if (municipio=='SI')
		{
			$("#b_num_municipio").show();
			$("#n_num_municipio").prop('required',true);
		}
		else
		{
			$("#b_num_municipio").hide();
			$("#n_num_municipio").prop('required',false);
		}
	});
	//para activar el radio buton
	$("#n_num_docs,#n_folios_unido").on("change",function(e){
		$("#unido1").prop("checked", true).trigger("change");
	});

	$("input[name='unido']").on("change",function(e){
		var unido=$("input[name='unido']:checked").val();
		if (unido=='SI')
		{
			$("#b_folios_unido,#b_num_docs").show();
			$("#n_num_docs,#n_folios_unido").prop('required',true);
		}
		else
		{
			$("#b_folios_unido,#b_num_docs").hide();
			$("#n_num_docs,#n_folios_unido").prop('required',false);
		}
	});

	$("#apoderados").on("change",function(e){
		$("#alert_apoderados").html('').hide();
		let n_apoderados=$("#apoderados").val();
		// y si es poder General
		// -------llamar a rafa --------
		// if (n_apoderados <= 2) 
		// 	$("#folios").val('6');

		if (n_apoderados >= 3 && n_apoderados <= 6) 
			$("#folios").val('7');
		
		if (n_apoderados > 6) {
			var n = 7;
			var r = n_apoderados/6;
			if ( Math.floor(r) > 1 ) 
				$("#folios").val(Math.floor(r-1)+n);
			else
				$("#folios").val(n);
		}
		if (n_apoderados > 14 ){
			let tipo_poder=$("#tipo_poder").val();
			if (tipo_poder != 'P'){
				$("#alert_apoderados").html('Si tiene 15 o más apoderados deberá solicitar un <b>presupuesto Personalizado</b>').show('slow');
				$("#folios").val(Math.floor(r)+6);
				$('#apoderados, #tipo_poder,#folios').addClass('border border-info');
				setTimeout(() => {
					$('#apoderados, #tipo_poder,#folios').removeClass('border border-info');
				}, 1500);
			}
		}
		$('#folios').addClass('border border-info');
		setTimeout(() => {
			$('#folios').removeClass('border border-info');
		}, 1500);
	});

	// $("input[type=text],input[type=radio]").bind("change", function() {
		// consultar a rafa
	$(".input_poder, .input_radio").bind("change", function() {
		var poder=$("#tipo_poder").val();
		var folios=parseInt($("#folios").val());
		var var_empresa=$("input[name='empresa']:checked").val();
		if (var_empresa == 'empresa') {
			if (poder == 'E' ) 
				$("#folios").val(8);	//minimo

			// if (poder == 'L') 
			// 	$("#folios").val(10);	//minimo
			
			// if (poder == 'T' || poder == 'A' || poder == 'F') 
			// 	$("#folios").val(6);	//minimo

			// if (poder == 'V' || poder == 'N') 
			// 	$("#folios").val(9);	//minimo
		}else{
			if (poder == 'E' ) 
			$("#folios").val(6);	//minimo

			if (poder == 'L') 
				$("#folios").val(8);	//minimo
			
			if (poder == 'T' || poder == 'A' || poder == 'F') 
				$("#folios").val(4);	//minimo

			if (poder == 'V' || poder == 'N') 
				$("#folios").val(7);	//minimo
		}

		if (poder=='M')
			var empresa='empresa';
		else
			var empresa=$("input[name='empresa']:checked").val();

		//calcular folios
			var folios_matriz=parseInt($("#folios").val());
			var folios_minuta_cliente=0;
			var folios_sustituir=0;
			var folios_acuse_correos=0;
			var folios_adicionales=0;
			var folios_unido=0;
			var total_fuera=0;

			var cliente_minuta=$("input[name='cliente_minuta']:checked").val();
			if (cliente_minuta=='SI')
				folios_minuta_cliente=parseInt($("#n_folios_cliente").val());

			var sustituir=$("input[name='sustituir']:checked").val();
			if (sustituir=='SI')
				folios_sustituir=parseInt($("#n_folios_sustituir").val());

			var correo=$("input[name='correo']:checked").val();
			if (correo=='SI')
			{
				folios_acuse_correos=diligencias_notificaciones_correo;
				$("#notif_correo").show();
			}

			var persona=$("input[name='persona']:checked").val();
			if (persona=='SI')
			{
				folios_adicionales=diligencias_notificaciones_persona;
				$("#notif_persona").show();
			}

			var unido=$("input[name='unido']:checked").val();
			if (unido=='SI')
				var folios_unido=parseInt($("#n_folios_unido").val());

				var total_folios=folios_matriz+folios_minuta_cliente+folios_sustituir+folios_acuse_correos+folios_adicionales+folios_unido;

		//calcula cuantia
			var cuantia=poder=="L"?precio/2:precio;
			$('#cuantia').val(convertir(cuantia));
			$('#view_cuantia').html(convertir(cuantia)+' €');
		//end cuantia

		//calcular poderdante
			var coste_poderdante=0;
			$(".x1").hide();
			$('#poder_adic').val(0);
			$('#view_poder_adic').html(convertir(coste_poderdante)+' €');
			if ($("#poderdantes").val()>2)
				coste_poderdante=precio_poderdante_apoderado*($("#poderdantes").val()-2);

			if (coste_poderdante!=0)
			{
				$(".x1").show();
				$('#poder_adic').val(convertir(coste_poderdante));
				$('#view_poder_adic').html(convertir(coste_poderdante)+' €');
				
			}
		//end poderdante

		//calcular apoderado
			var coste_apoderado=0;
			$(".x2").hide();
			$('#apod_adic').val(0);
			$('#view_apod_adic').html(0);
			if ($("#apoderados").val()>6)
				coste_apoderado=precio_poderdante_apoderado*($("#apoderados").val()-6);

			if (coste_apoderado!=0)
			{
				$(".x2").show();
				$('#apod_adic').val(convertir(coste_apoderado));
				$('#view_apod_adic').html(convertir(coste_apoderado));
			}
		//end apoderado

		//calcular coste folios
			var coste_folios=0;
			$(".x3").hide();
			$('#folios_matriz').val(0);
			$('#view_folios_matriz').html(0);
			if (total_folios>4)
				coste_folios=precio_folio_matriz*(total_folios-4);

			if (coste_folios!=0)
			{
				$(".x3").show();
				$('#folios_matriz').val(convertir(coste_folios));
				$('#view_folios_matriz').html(convertir(coste_folios)+' €');
				$('.tfm').html(total_folios);
				$('#pdf_tfm').val(total_folios);
			}
		//end coste folios

		//calcular coste copia autentica
			var coste_ca=0;
			$(".x4,.x6").hide();
			$('#cop_a,#tel_elc').val(0);
			$('#view_cop_a,#view_tel_elc').html(0);
			var numero_cas=parseInt($("#ca").val())+parseInt($("#caa").val());
			if (total_folios<11)
				var coste_ca=(precio_ca*total_folios)*numero_cas;
			else
				var coste_ca=((precio_ca*11)*$("#ca").val())+(((precio_ca/2)*(total_folios-11))*numero_cas);

			if (coste_ca!=0)
			{
				if (poder=='F' || (poder=='N' && empresa=='empresa'))
				{
					$(".x6").show();
					$('#tel_elc').val(convertir(coste_ca));
					$('#view_tel_elc').html(convertir(coste_ca)+' €');
				}
				else
				{
					$(".x6").hide();
					$('#tel_elc').val(0);
					$('#view_tel_elc').html(0);
					$(".x4").show();
					$('#cop_a').val(convertir(coste_ca));
					$('#view_cop_a').html(convertir(coste_ca)+' €');
					$('.n_ca').html(numero_cas);
					$('#pdf_n_ca').val(numero_cas);
				}
			}
		//end ca

		//calcular coste copia simple
			var coste_cs=0;
			$(".x5").hide();
			$('#view_cs_i').html(0);
			$('#view_cs_r').html(0);
			$('#n_cs_i').html(0);

			$('#pdf_cs_i').val(0);
			$('#pdf_cs_r').val(0);
			$('#pdf_n_csi').val(0);
			
			var numero_simples=parseInt($("#cs").val())+parseInt($("#csa").val());
			coste_cs=(precio_cs*total_folios)*numero_simples;
			if (coste_cs!=0)
			{
				$(".x5").show();
				monto_cs_reg_civil = (coste_cs / numero_simples);
				monto_cs_interesado = (coste_cs-monto_cs_reg_civil);
				// view
				if (numero_simples==1){	
					$(".solo_una_copia").hide();
					$(".coste_cs").html(convertir(coste_cs)+' €');
					$('#n_c_simples').html('1 Copia Simple');
				}else{
					$(".solo_una_copia").show();
					$(".coste_cs").html('&nbsp;');
					$('#n_c_simples').html(numero_simples+' Copias Simples');
				}
				
				$('#view_cs_i').html(convertir(monto_cs_interesado)+' €');
				$('#view_cs_r').html(convertir(monto_cs_reg_civil)+' €');
				$('#n_cs_i').html(numero_simples-1);
				if (numero_simples-1 == 0) 
					$(".cs_interesado").hide();
				else
					$(".cs_interesado").show();

				// pdf
				$('#pdf_numero_simples').val(numero_simples);
				$('#pdf_coste_cs').val(convertir(coste_cs));
				$('#pdf_cs_i').val(convertir(monto_cs_interesado));
				$('#pdf_cs_r').val(convertir(monto_cs_reg_civil));
				$('#pdf_n_csi').val(numero_simples-1);
			}
		//end cs

		//Calcular consulta registro mercantil
			//Solo si se ha marcado empresa
			$(".x7").hide();
			$('#reg_mer').val(0);
			$('#view_reg_mer').html(0);
			var coste_registro_mercantil=empresa=='empresa'?registro_mercantil:0;
			if (coste_registro_mercantil!=0)
			{
				$(".x7").show();
				$('#reg_mer').val(convertir(coste_registro_mercantil));
				$('#view_reg_mer').html(convertir(coste_registro_mercantil)+' €');
			}
		//end registro

		//Calcular consulta mensajeria
			//Solo poder P-S-R, nº envios PyS=1, R=2
			var coste_mensajeria=0;
			$(".x8").hide();
			$('#mensa').val(0);
			$('#view_mensa').html(0);
			// var radio_mensajeria =$("input[name='mensajeria']:checked").val();
			// if (radio_mensajeria == 'SI') {
				if (poder=='P' || poder=='S' || poder=='G') coste_mensajeria=mensajeria;
				if (poder=='R')	coste_mensajeria=mensajeria*2;
			// }
			if (coste_mensajeria!=0)
				$(".x8").show();

				$('#mensa').val(convertir(coste_mensajeria));
				$('#view_mensa').html(convertir(coste_mensajeria)+' €');
		//end mensajeria

		//calcular coste salida
			//salida, de momento pongo una hora per defecto. pero habra que preguntar
			var coste_salida=0;
			$(".x9").hide();
			$('#salida').val(0);
			$('#view_salida').html(0);
			var salida=$("input[name='fuera']:checked").val();
			if (salida=='SI')
			{
				var horas_salida=1;
				coste_salida=salida_notario*horas_salida;
			}
			if (coste_salida!=0)
			{
				$(".x9").show();
				$('#salida').val(convertir(coste_salida));
				$('#view_salida').html(convertir(coste_salida)+' €');
			}
		//end salida

		//calcular apostilla
			var coste_apostilla=0;
			$(".x10").hide();
			$('#aposti').val(0);
			$('#view_aposti').html(0);
			var urgente=$("input[name='urgente']:checked").val();
			if (urgente=='Urgente')
				coste_apostilla=apostilla_urgente;
			else if (urgente=='Normal')
				coste_apostilla=apostilla_normal;

			if (coste_apostilla!=0)
			{
				$(".x10").show();
				$('#aposti').val(convertir(coste_apostilla));
				$('#view_aposti').html(convertir(coste_apostilla)+' €');
			}
		//end apostilla

		//calcular sustituir
			var coste_sustituir=0;
			$(".x11").hide();
			$('#testimonios').val(0);
			$('#view_testimonios').html(0);
			var sustituir=$("input[name='sustituir']:checked").val();
			if (sustituir=='SI')
			{
				var testi_sus=parseInt($("#n_testimonios_sustituir").val());
				if (folios_sustituir==1)
					coste_sustituir=precio_ca*testi_sus;
				else
					coste_sustituir=(precio_ca+(precio_cs*(folios_sustituir-1)))*testi_sus;
			}
			if (coste_sustituir!=0)
			{
				$(".x11").show();
				$('#poderes_testimonios').val(convertir(coste_sustituir));
				$('#view_testimonios').html(convertir(coste_sustituir)+' €');
			}
		//end sustituir

		//calcular unidos
			var coste_unido=0;
			$(".x12").hide();
			$('#testimonios_unidos').val(0);
			$('#view_testimonios_unidos').html(0);
			var unido=$("input[name='unido']:checked").val();
			if (unido=='SI')
			{
				if (folios_unido==1)
					coste_unido=precio_ca;
				else
					coste_unido=precio_ca+(precio_cs*(folios_unido-1));

			}
			if (coste_unido!=0)
			{
				$(".x12").show();
				$('#testimonios_unidos').val(convertir(coste_unido));
				$('#view_testimonios_unidos').html(convertir(coste_unido)+' €');
			}
		//end unidos
		// console.log('--------------costes-----------------\n');
		// console.log('coste_unido: '+coste_unido);
		// console.log('coste_sustituir: '+coste_sustituir);
		// console.log('coste_apostilla: '+coste_apostilla);
		// console.log('coste_salida: '+coste_salida);
		// console.log('coste_mensajeria: '+coste_mensajeria);
		// console.log('coste_registro_mercantil: '+coste_registro_mercantil);
		// console.log('coste_ca: '+coste_ca);
		// console.log('coste_cs: '+coste_cs);
		// console.log('coste_folios: '+coste_folios);
		// console.log('coste_apoderado:' +coste_apoderado);
		// console.log('coste_poderdante: '+coste_poderdante);
		// console.log('cuantia: '+cuantia);
		// console.log('coste_notaria: '+coste_notaria);
		var coste_notaria=cuantia+coste_poderdante+coste_apoderado+coste_folios+coste_cs+coste_ca+coste_registro_mercantil+coste_mensajeria+coste_salida+coste_apostilla+coste_sustituir+coste_unido+protocolo_electronico;
			
		//apartado correos
			//calcular celula
				$(".c1").hide();
				$('#c_celula').val(0);
				$('#view_c_celula').val(0);
				var coste_correos_celula=0;
				if (correo=='SI')
				{ 
					$("#separadorhtml_c").show();
					var numero_correos=parseInt($("#n_num_correos").val());
					coste_correos_celula=(precio_cs*total_folios)*numero_correos;
				}
				if (coste_correos_celula!=0)
				{
					$(".c1").show();
					$('#c_celula').val(convertir(coste_correos_celula));
					$('#view_c_celula').html(convertir(coste_correos_celula)+' €');
				}else					
					$("#separadorhtml_c").hide();
			//end celula
			//calcular salida
				$(".c2").hide();
				$('#c_salida').val(0);
				$('#view_c_salida').html(0);
				var coste_correos_salida=0;
				if (correo=='SI')
					coste_correos_salida=mensajeria;

				if (coste_correos_salida!=0)
				{
					$(".c2").show();
					$('#c_salida').val(convertir(coste_correos_salida));
					$('#view_c_salida').html(convertir(coste_correos_salida)+' €');
				}
			//end salida
			//calcular diligencia
				$(".c3").hide();
				$('#c_dili').val(0);
				$('#view_c_dili').html(0);
				var coste_correos_dili=0;
				if (correo=='SI')
					coste_correos_dili=coste_diligencia*numero_correos*2;   //el dos es el registro 103 del excel, parece ser siempre 2

				if (coste_correos_dili!=0)
				{
					$(".c3").show();
					$('#c_dili').val(convertir(coste_correos_dili));
					$('#view_c_dili').html(convertir(coste_correos_dili)+' €');
				}
			//end diligencia
			//calcular testimonios
				$(".c4").hide();
				$('#c_testi').val(0);
				$('#view_c_testi').html(0);
				var coste_correos_testi=0;
				if (correo=='SI')
				{
					if (folios_testimonio_acuse_recibo_correo==1)
						coste_correos_testi=precio_ca*folios_testimonio_acuse_recibo_correo;
					else
						coste_correos_testi=precio_ca+(precio_cs*(folios_testimonio_acuse_recibo_correo-1));
				}
				if (coste_correos_testi!=0)
				{
					$(".c4").show();
					$('#c_testi').val(convertir(coste_correos_testi));
					$('#view_c_testi').html(convertir(coste_correos_testi));
				}
			//end testimonios
			//calcular gastos
				$(".c5").hide();
				$('#c_correo').val(0);
				$('#view_c_correo').html(0);
				var coste_gastos_correo=0;
				if (correo=='SI')
					coste_gastos_correo=numero_correos*gastos_correo_notificaciones;

				if (coste_gastos_correo!=0)
				{
					$(".c5").show();
					$('#c_correo').val(convertir(coste_gastos_correo));
					$('#view_c_correo').html(convertir(coste_gastos_correo));
				}
			//end gastos
			var total_correos=coste_correos_celula+coste_correos_salida+coste_correos_dili+coste_correos_testi+coste_gastos_correo;
		//end correos

		//apartado personas
			//calcular celula
				$(".p1").hide();
				$('#p_celula').val(0);
				$('#view_p_celula').html(0);
				var coste_persona_celula=0;
				if (persona=='SI')
				{ 
					$("#separadorhtml_p").show();
					var numero_personas=parseInt($("#n_num_persona").val());
					coste_persona_celula=(precio_cs*total_folios)*numero_personas;
				}else
				$("#separadorhtml_p").hide();

				if (coste_persona_celula!=0)
				{
					$(".p1").show();
					$('#p_celula').val(convertir(coste_persona_celula));
					$('#view_p_celula').html(convertir(coste_persona_celula)+' €');
				}
			//end celula
			//calcular salida
				$(".p2").hide();
				$('#p_salida').val(0);
				$('#view_p_salida').html(0);
				var coste_persona_salida=0;
				if (persona=='SI')
					coste_persona_salida=salida_notario;

				if (coste_persona_salida!=0)
				{
					$(".p2").show();
					$('#p_salida').val(convertir(coste_persona_salida));
					$('#view_p_salida').html(convertir(coste_persona_salida)+' €');
				}
			//end salida
			//calcular diligencia
				$(".p3").hide();
				$('#p_dili').val(0);
				$('#view_p_dili').html(0);
				var coste_persona_dili=0;
				if (persona=='SI')
					coste_persona_dili=coste_diligencia*numero_personas*1;   //el uno es el registro 104 del excel, parece ser siempre 1

				if (coste_persona_dili!=0)
				{
					$(".p3").show();
					$('#p_dili').val(convertir(coste_persona_dili));
					$('#view_p_dili').html(convertir(coste_persona_dili)+ ' €');
				}
			//end diligencia
			var total_persona=coste_persona_celula+coste_persona_salida+coste_persona_dili;
			// console.log('------------costes-persona--------');
			// console.log('coste_persona_celula: '+coste_persona_celula);
			// console.log('coste_persona_salida: '+coste_persona_salida);
			// console.log('coste_persona_dili: '+coste_persona_dili);
			// console.log('total_persona: '+total_persona);
		//end correos

		//apartado fuera
			var total_fuera=0;
			var fuera=$("input[name='municipio']:checked").val();
			if (fuera=='SI')
			{	$("#separadorhtml_fuera").show() ;
				$("#notif_fuera").show();
				//calcular electronica
					$(".f1").hide();
					$('#f_elec').val(0);
					$('#view_f_elec').html(0);
					var coste_fuera_electronica=0;
				if (envio=='SI'){
					if (total_folios<11)
						var coste_fuera_electronica=(precio_ca*total_folios)*diligencias_notificaciones_fuera;
					else
						var coste_fuera_electronica=(precio_ca*11*diligencias_notificaciones_fuera)+(((precio_ca/2)*(total_folios-11))*diligencias_notificaciones_fuera);

					if (coste_fuera_electronica!=0)
					{
						$(".f1").show();
						$('#f_elec').val(convertir(coste_fuera_electronica));
						$('#view_f_elec').html(convertir(coste_fuera_electronica));
					}
				}
				//end electronica
				//calcular acta
					$(".f2").hide();
					$('#f_acta').val(0);
					$('#view_f_acta').html(0);
					var coste_fuera_acta=importe_acta_notificar;
					if (coste_fuera_acta!=0)
					{
						$(".f2").show();
						$('#f_acta').val(convertir(coste_fuera_acta));
						$('#view_f_acta').html(convertir(coste_fuera_acta));
					}
				//end acta
				//calcular número folios
					$(".f3").hide();
					$('#f_folios_nf').val(0);
					$('#view_f_folios_nf').html(0);
					var n_folios_nf=total_folios+folios_matriz_notario_notificar;
					if (n_folios_nf!=0)
					{
						$(".f3").show();
						$('#f_folios_nf').val(convertir(n_folios_nf));
						$('#view_f_folios_nf').html(convertir(n_folios_nf));
					}
				//end número folios
				//calcular número folios matriz
					$(".f4").hide();
					$('#f_folios_m').val(0);
					$('#view_f_folios_m').html(0);
					var coste_fuera_foliosm=0;
					if (n_folios_nf>4)
						coste_fuera_foliosm=precio_folio_matriz*(n_folios_nf-4);

					if (coste_fuera_foliosm!=0)
					{
						$(".f4").show();
						$('#f_folios_m').val(convertir(coste_fuera_foliosm));
						$('#view_f_folios_m').html(convertir(coste_fuera_foliosm));
					}
				//end número folios matriz
				//calcular copia simple
					$(".f5").hide();
					$('#f_simple').val(0);
					$('#view_f_simple').html(0);
					var coste_fuera_simple=0;
						coste_fuera_simple=(precio_cs*n_folios_nf);

					if (coste_fuera_simple!=0)
					{
						$(".f5").show();
						$('#view_f_simple').html(convertir(coste_fuera_simple));
						$('#f_simple').val(convertir(coste_fuera_simple));
					}
				//end copia simple
				//calcular electronica vuelta
					$(".f6").hide();
					$('#f_elec_v').val(0);
					$('#view_f_elec_v').html(0);
					var coste_fuera_elec_v=0;
					if (n_folios_nf<11)
						var coste_fuera_elec_v=(precio_ca*n_folios_nf);
					else
						var coste_fuera_elec_v=(precio_ca*11)+(((precio_ca/2)*(n_folios_nf-11)));

					if (coste_fuera_elec_v!=0)
					{
						$(".f6").show();
						$('#f_elec_v').val(convertir(coste_fuera_elec_v));
						$('#view_f_elec_v').html(convertir(coste_fuera_elec_v));
					}
				//end electronica vuelta
				//calcular traslado papel
					$(".f7").hide();
					$('#f_traslado').val(0);
					$('#view_f_traslado').html(0);
					var coste_fuera_traslado=0;
					if (total_folios==1)
						coste_fuera_traslado=precio_ca;
					else
						coste_fuera_traslado=(precio_ca+(precio_cs*(total_folios-1)));

					if (coste_fuera_traslado!=0)
					{
						$(".f7").show();
						$('#view_f_traslado').html(convertir(coste_fuera_traslado));
						$('#f_traslado').val(convertir(coste_fuera_traslado));
					}
				//end traslado papel
				//calcular diligencia
					$(".f8").hide();
					$('#f_dili').val(0);
					$('#view_f_dili').html(0);
					var coste_fuera_diligencia=0;
					coste_fuera_diligencia=2*coste_diligencia;

					if (coste_fuera_diligencia!=0)
					{
						$(".f8").show();
						$('#f_dili').val(convertir(coste_fuera_diligencia));
						$('#view_f_dili').html(convertir(coste_fuera_diligencia));
					}
				//end diligencia
				//calcular salida
					$(".f9").hide();
					$('#f_salida').val(0);
					$('#view_f_salida').html(0);
					var coste_fuera_salida=0;
					coste_fuera_salida=1*salida_notario;

					if (coste_fuera_salida!=0)
					{
						$(".f9").show();
						$('#f_salida').val(convertir(coste_fuera_salida));
						$('#view_f_salida').html(convertir(coste_fuera_salida));
					}
				//end salida
				//calcular papel timbrado
					$(".f10").hide();
					$('#f_papel').val(0);
					$('#view_f_papel').html(0);
					var coste_fuera_papel=0;
					coste_fuera_papel=(total_folios+(n_folios_nf*2))*coste_papel;

					if (coste_fuera_papel!=0)
					{
						$(".f10").show();
						$('#f_papel').val(convertir(coste_fuera_papel));
						$('#view_f_papel').html(convertir(coste_fuera_papel));
					}
				//end papel timbrado

				//calcular total
					$(".f11").hide();
					$('#f_total').val(0);
					$('#view_f_total').html(0);
					var coste_fuera_total=0;
					var subtotal=coste_fuera_acta+coste_fuera_foliosm+coste_fuera_simple+coste_fuera_elec_v+coste_fuera_traslado+coste_fuera_diligencia+coste_fuera_salida;
					var subtotaliva=subtotal*iva/100;
					if (empresa=='empresa')
						var subtotalirpf=subtotal*irpf/100;
					else
						var subtotalirpf=0;

					var n_num_municipio=parseInt($("#n_num_municipio").val());
					coste_fuera_total=(((subtotal+subtotaliva)-subtotalirpf)+coste_fuera_papel)*n_num_municipio;
					if (coste_fuera_total!=0)
					{
						$(".f11").show();
						$('#f_total').val(convertir(coste_fuera_total));
						$('#view_f_total').html(convertir(coste_fuera_total)+' €');
					}
				//end papel timbrado
				// console.log('coste_fuera_electronica: '+coste_fuera_electronica);
				// console.log('coste_fuera_total: '+coste_fuera_total);
				var total_fuera=coste_fuera_electronica+coste_fuera_total;
			}else
			$("#separadorhtml_fuera").hide() ;
		//end fuera

		//Calcular coste patel timbrado
			var coste_papel_timbrado=0;
			if (poder=='V' || poder=='N' || poder=='F')
				coste_papel_timbrado=(total_folios+1)*coste_papel;
			else
			coste_papel_timbrado=(total_folios+(total_folios*$("#ca").val())+1)*coste_papel;
			$('#papel').val(convertir(coste_papel_timbrado));
			$('#view_papel').html(convertir(coste_papel_timbrado)+' €');
		//end papel timbrado

		//final
		var total_coste=coste_notaria+total_correos+total_persona+total_fuera;
		if (total_coste!=0)		{
			$(".f11").show();
			$('#f_total').val(convertir(total_coste));
			$('#view_f_total').html(convertir(total_coste)+' €');
		}
		// console.log('--------------actualitza_pagament-----------------\n');
		// console.log('total_fuera: '+total_fuera);
		// console.log('total_persona: '+total_persona);
		// console.log('total_correos: '+total_correos);
		// console.log('coste_notaria: '+coste_notaria);
		// console.log('var1 total_coste: '+total_coste);
		// console.log('var2  coste_papel_timbrado: '+coste_papel_timbrado);
		// console.log('var3 empresa: '+empresa);
		// console.log('\n');
		if (empresa=='empresa') {$("#pdf_es_empresa").val('Persona Jurídica'); $("#tip").html('Persona Jurídica')}			
		else {$("#pdf_es_empresa").val('Persona Física'); $("#tip").html('Persona Física')}
		var total_notaria = actualitza_pagament(total_coste,coste_papel_timbrado,empresa);

		//apartado tramita
			var coste_gestion = coste_honorarios_registro=0;
			var tramita=$("input[name='tramita']:checked").val();
			if (tramita=='SI')
			{
				$("#notif_tramita").show();
				//Honorarios Registro
					$(".t1").hide();
					$('#t_honor').val(0);
					$('#view_t_honor').html(0);
					var coste1=parseInt($("#poderdantes").val())*tramite_mercantil;
					var coste2=parseInt($("#apoderados").val())*importe_por_cargos;
					// console.log('coste1 :'+coste1);
					// console.log('coste2 :'+coste2);
					var iva_tramita=(coste1+coste2)*iva/100;
					if (empresa=='empresa') 
						var irpf_tramita=(coste1+coste2)*irpf/100;
					else
						var irpf_tramita=0;

					coste_honorarios_registro=(coste1+coste2)+iva_tramita-irpf_tramita;
					if (coste_honorarios_registro!=0)
					{	$(".tn").show();
						$(".t1").show();
						// $("#view_rcoste1").html(convertir(coste1)+' €');
						$("#pdf_rcoste1").val(convertir(coste1));
						// $("#view_rcoste2").html(convertir(coste2)+' €');
						$("#pdf_rcoste2").val(convertir(coste2));
						$("#view_coste_tramitacion").html(convertir(coste1+coste2)+' €');
						$("#pdf_coste_contramitacion").val(convertir(coste1+coste2));

						$('#t_honor').val(convertir(coste_honorarios_registro));
						$('#view_t_honor').html(convertir(coste_honorarios_registro)+' €');
						$('#iva_tramita').val(convertir(iva_tramita));
						$('#view_iva_tramita').html(convertir(iva_tramita)+' €');
						if (empresa=='empresa') {
							$('#irpf_tramita').val(convertir(irpf_tramita));
							$('#view_irpf_tramita').html(convertir(irpf_tramita)+' €');
							$(".bussines_tramita").show();
						}else
						$(".bussines_tramita").hide();
					}
				//end honorarios registro
				//gestion
					$(".t2").hide();
					$('#t_gestion').val(0);
					$('#view_t_gestion').html(0);
					var iva_gestion=gestion_poder_mercantil*iva/100;
					if (empresa=='empresa') 
						var irpf_gestion=gestion_poder_mercantil*irpf/100;
					else
						var irpf_gestion=0

					coste_gestion=gestion_poder_mercantil+iva_gestion-irpf_gestion;
					if (coste_gestion!=0){		
						$(".t2").show();
						$(".tn").show();
						$("#view_coste_gestion").html(convertir(gestion_poder_mercantil)+' €');
						$("#pdf_coste_gestion").val(convertir(gestion_poder_mercantil));
						$('#t_gestion').val(convertir(coste_gestion));
						$('#view_t_gestion').html(convertir(coste_gestion)+' €');
						$('#iva_gestion').val(convertir(iva_gestion));
						$('#view_iva_gestion').html(convertir(iva_gestion)+' €');
						if (empresa=='empresa') {
							$('#irpf_gestion').val(convertir(irpf_gestion));							
							$('#view_irpf_gestion').html(convertir(irpf_gestion)+' €');
							$(".bussines").show();
						}else
						$(".bussines").hide();
					}else{
						$(".t2").hide();
						$('#t_gestion').val(0);
						$('#iva_gestion').val(0);
						$('#irpf_gestion').val(0);
						$(".bussines").hide();	
					}
				//end gestion
			}else{
				$(".t1").hide();
				$("#pdf_rcoste1").val(0);
				$("#pdf_rcoste2").val(0);
				$('#t_honor').val(0);
				$('#iva_tramita').val(0);
				$('#irpf_tramita').val(0);
				$(".t2").hide();
				$('#t_gestion').val(0);
				$('#iva_gestion').val(0);
				$('#irpf_gestion').val(0);
				$('.tn').hide();
			}
		//en tramita
		//total
		$(".t3").hide();
		$('#t_total').val(0);
		$('#view_t_total').html(0);
		var coste_total_total=0;
		coste_total_total=coste_honorarios_registro+coste_gestion+total_notaria;
		// console.log('--------------totales-----------------\n');
		// console.log('coste_total_total: '+coste_total_total);
		// console.log('coste_honorarios_registro: '+coste_honorarios_registro);
		// console.log('coste_gestion: '+coste_gestion);
		// console.log('total_coste: '+total_coste);
		if (coste_total_total!=0)
		{
			$(".t3").show();
			$('#t_total').val(convertir(coste_total_total)+' €');
			$('#view_t_total').html(convertir(coste_total_total)+' €');
		}
	});

		// ===========================================================================
		// ===========================================================================
		$(document).on('click', '#btn_email_poderes', function(e){
			e.preventDefault();
			$('#btn_email_poderes').hide();
			$('#div_enviar_mail_poderes').show('slow');
			$('#btn_enviar_poderes').show('slow');
		});
		// ===========================================================================
		$(document).on('click', '#btn_enviar_poderes', function(e){
			e.preventDefault();
			email = validarEmail($('#email_poderes').val());	
			$("#loading_segundascopias").hide();
			$('.terminos, .terminos_link').removeClass('text-danger');
			terminos= $(document).find("input[type='checkbox'][name='terminos']:checked");
			if (email == true) {	
				if (terminos.val() == 'OK') {
					$("#btn_enviar_poderes").hide();
					$("#loading_poderes").show();	
					grecaptcha.ready(function() {
						grecaptcha.execute('6LdCoVEqAAAAAHPOAqmBgukE9w8LJUHsfaXJbS6a', {action: 'submit'}).then(function(token) {
							$("#form_enviar_poderes_by_mail").append("<input type='hidden' name='g-recaptcha-response' value='" + token + "' />");
							$.ajax({
								method: 'POST',
								url: "/Printer_budget/enviar_by_mail",
								data: $("#form_enviar_poderes_by_mail").serialize(),
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
				$('#email_poderes').addClass('alert_input');
			}
	
		});

});

function historico_poderes() {
	myArrayUrl=valor_url='';
	var urlactual = window.location;
	var myArrayUrl = urlactual.toString().split('?');
	if (typeof(myArrayUrl[2]) != "undefined" && myArrayUrl[2] !== null) {
		var valor_url = myArrayUrl[2].toLowerCase();
	}
		array_json={
			nom_tipo_poder		: $("#pdf_nom_tipo_poder").val(),
			pdf_cuantia			: $("#cuantia").val(),
			poder_adic			: $("#poder_adic").val(),
			apod_adic			: $("#apod_adic").val(),
			folios_matriz		: $("#folios_matriz").val(),
			cop_a				: $("#cop_a").val(),
			pdf_n_ca			: $("#pdf_n_ca").val(),
			pdf_tfm				: $("#pdf_tfm").val(),
			pdf_numero_simples  : $("#pdf_numero_simples").val(),
			pdf_n_csi			: $("#pdf_n_csi").val(),
			pdf_coste_cs		: $("#pdf_coste_cs").val(),
			pdf_cs_i			: $("#pdf_cs_i").val(),
			pdf_cs_r			: $("#pdf_cs_r").val(),
			tel_elc				: $("#tel_elc").val(),
			reg_mer				: $("#reg_mer").val(),
			mensa				: $("#mensa").val(),
			salida				: $("#salida").val(),
			aposti				: $("#aposti").val(),
			poderes_testimonios	: $("#poderes_testimonios").val(),
			testimonios_unidos	: $("#testimonios_unidos").val(),
			c_celula			: $("#c_celula").val(),
			c_salida			: $("#c_salida").val(),
			c_dili				: $("#c_dili").val(),
			c_testi				: $("#c_testi").val(),
			c_correo			: $("#c_correo").val(),
			p_celula			: $("#p_celula").val(),
			p_salida			: $("#p_salida").val(),
			p_dili				: $("#p_dili").val(),
			f_elec				: $("#f_elec").val(),
			f_acta				: $("#f_acta").val(),
			f_folios_nf			: $("#f_folios_nf").val(),
			f_folios_m			: $("#f_folios_m").val(),
			f_simple			: $("#f_simple").val(),
			f_elec_v			: $("#f_elec_v").val(),
			f_traslado			: $("#f_traslado").val(),
			f_dili				: $("#f_dili").val(),
			f_salida			: $("#f_salida").val(),
			f_papel				: $("#f_papel").val(),
			f_total				: $("#f_total").val(),
			poder_iva			: $("#poder_iva").val(),
			poder_irpf			: $("#poder_irpf").val(),
			papel				: $("#papel").val(),
			poder_liquido		: $("#poder_liquido").val(),
			pdf_coste_contramitacion: $("#pdf_coste_contramitacion").val(),
			pdf_rcoste1			: $("#pdf_rcoste1").val(),
			pdf_rcoste2			: $("#pdf_rcoste2").val(),
			iva_tramita			: $("#iva_tramita").val(),
			irpf_tramita		: $("#irpf_tramita").val(),
			t_honor				: $("#t_honor").val(),
			iva_gestion			: $("#iva_gestion").val(),
			irpf_gestion		: $("#irpf_gestion").val(),
			pdf_coste_gestion	: $("#pdf_coste_gestion").val(),
			t_gestion			: $("#t_gestion").val(),
			t_total				: $("#t_total").val(),
			pdf_es_empresa		: $("#pdf_es_empresa").val()
		}

		var json = JSON.stringify(array_json);

	let poder = $("#pdf_nom_tipo_poder").val();
	
	$.ajax({
		method: "POST",
		url: '/Printer_budget/historico_simulaciones',
		data:{ url: myArrayUrl, solicitud:'PODERES', sub_solicitud: poder, accion:json, comentario:'simulación presupuesto Poder '+poder ,tipo_cal:'simulacion'},
		}).done(function (data) {});
	
}


function inicializar_poderes() {
    // poderes
    $('input[type="text"]').val('');
    $('input[type="hidden"]').val('');
	$('#csa').val(0);
	$('#caa').val(0);
    document.querySelectorAll('[name=tramita]').forEach((x) => x.checked = false);
    document.querySelectorAll('[name=unido]').forEach((x) => x.checked = false);
    document.querySelectorAll('[name=municipio]').forEach((x) => x.checked = false);
    document.querySelectorAll('[name=persona]').forEach((x) => x.checked = false);
    document.querySelectorAll('[name=correo]').forEach((x) => x.checked = false);
    document.querySelectorAll('[name=sustituir]').forEach((x) => x.checked = false);
    document.querySelectorAll('[name=urgente]').forEach((x) => x.checked = false);
    document.querySelectorAll('[name=apostilla]').forEach((x) => x.checked = false);
    document.querySelectorAll('[name=cliente_minuta]').forEach((x) => x.checked = false);
    document.querySelectorAll('[name=fuera]').forEach((x) => x.checked = false);
    document.querySelectorAll('[name=envio_otro]').forEach((x) => x.checked = false);
    document.querySelectorAll('[name=copia_aut]').forEach((x) => x.checked = false);
    $('#b_poderdantes').hide();
    $('#b_apoderados').hide();
    $('#b_folios').hide();
    $('#b_ca').hide();
    $('#b_cs').hide();
    $('#b_mensajeria').hide();
    $('#b_diligencia').hide();
    $('#b_csa').hide();
    $('#b_caa').hide();
    $('#b_copia_aut').hide();
    $('#b_envio_otro').hide();
    $('#b_n_envios').hide();
    $('#b_fuera').hide();
    $('#b_cliente_minuta').hide();
    $('#b_folios_cliente').hide();
    $('#b_apostilla').hide();
    $('#b_urgente').hide();
    $('#b_sustituir').hide();
    $('#b_folios_sustituir').hide();
    $('#b_correo').hide();
    $('#b_num_correos').hide();
    $('#b_persona').hide();
    $('#b_num_persona').hide();
    $('#b_municipio').hide();
    $('#b_num_municipio').hide();
    $('#b_unido').hide();
    $('#b_folios_unido').hide();
    $('#b_tramita').hide();
    $('#b_empresa').hide();
    $("#resultado_poderes").hide();
}
