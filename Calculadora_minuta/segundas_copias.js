////////////////////////////COPIAS SIMPLES//////////////////////////////
$("#tipo_copia").on("change",function(e){
  e.preventDefault();
  let opcion= $(this).val();
  if (opcion=='electronica' || opcion==0) {
    $('.copias_solitadas').slideUp('fast');
  }else{
    $('.copias_solitadas').slideDown('slow');
  }
});


function isvisible() {
	if($("#resultado_segundas_copias").is(":visible")){
		$("#resultado_segundas_copias").hide();
	}
}


$("#fecha_c").on("change",function (e) {
	var fecha = $("#fecha_c").val();

	var year_fecha = new Date(fecha).getFullYear();
	console.log(year_fecha);
	if (isNaN(year_fecha)) {
		$("#fecha_c").addClass('dorder border-1 border-danger');
		isvisible();
		timeout = setTimeout(function(){
			$("#fecha_c").val('').removeClass('dorder border-1 border-danger');	
			$("#error_fecha").html('');
		  }, 1000)	
	}else{
		//-----------------------------------------------
		let date = new Date()
		let day = `${(date.getDate())}`.padStart(2,'0');
		let month = `${(date.getMonth()+1)}`.padStart(2,'0');
		let year = date.getFullYear();	
		var fecha_actual= `${year}-${month}-${day}`;
		if (fecha > fecha_actual) {
			$("#fecha_c").addClass('dorder border-1 border-danger');
			$("#error_fecha").html('la fecha no puede ser mayor que hoy');
			timeout = setTimeout(function(){
				$("#fecha_c").val(fecha_actual).removeClass('dorder border-1 border-danger');	
				$("#error_fecha").html('');
				isvisible();
			}, 1500)	
			}else{
				//menor de 100años
			}
		//-----------------------------------------------
	}
  });

  $("#fecha_c").on("blur",function (e) {
	var fecha = $("#fecha_c").val();
	var year_fecha = new Date(fecha).getFullYear();
	console.log('blur: '+year_fecha);
	if (year_fecha < 1900) {
		$("#fecha_c").addClass('dorder border-1 border-danger');
		$("#error_fecha").html('la fecha es muy antigua');
		isvisible();
		timeout = setTimeout(function(){
			$("#fecha_c").val('').removeClass('dorder border-1 border-danger');	
			$("#error_fecha").html('');
		}, 1500)	
	}

  });

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

function actualitza_pagament_segundas_copias(tipo,folios,numero,years,empresa)
{ 
	var iva=0;
	var irpf=0;
	var honor=0;
	var custodia=0;
	var suplidos=0;
	var coste_custodia=ARANCEL_COPIA_SIMPLE_FOLIO;
	var coste_simple=ARANCEL_COPIA_SIMPLE_FOLIO;
	var coste_aut_uno=ARANCEL_COPIA_AUT_FOLIO_NORMAL; //los 11 primeros folios
	var coste_aut_dos=ARANCEL_COPIA_AUT_FOLIO_EXTRA; //a partir del folio 11
	var coste_papel=ARANCEL_PAPEL_FOLIO;
	if (isNaN(folios))
	{
		return false;
	}
	else
	{ 
	
		if (tipo=='simple')
		{
			honor=coste_simple*folios;
			if(years>5)
			{
				honor=honor*2;
				custodia=coste_custodia*years;
			}
		}
		else if (tipo=='autorizada' || tipo=='electronica')
		{
			if (folios>11)
				honor=(coste_aut_uno*11)+(coste_aut_dos*(folios-11));
			else
				honor=coste_aut_uno*folios;

			custodia=coste_custodia*years;
			if (tipo=='autorizada')
				suplidos=coste_papel*folios;

			if(years>5)
			{
				honor=honor*2;
				custodia=coste_custodia*years;
			}
		}

		if (numero>1)
		{
			honor=honor*numero;
			custodia=custodia*numero;
			suplidos=suplidos*numero;
		}
		// honor= honor+9.03;

		iva=(honor+custodia)*21/100;
		if (empresa==1){
			$("#empresa_pdf_sc").val('Si');
			$(".bussines").show();
			irpf=(honor+custodia+suplidos)*15/100;
		}else{
			$("#empresa_pdf_sc").val('No');
			$(".bussines").hide();
		  }


		  iva= Math.round(iva * 100)/100;
		  custodia= Math.round(custodia * 100)/100;
		  irpf= Math.round(irpf * 100)/100;
		  honor= Math.round(honor * 100)/100;

		  if (irpf > 0) 
		  	$("#irpf_segunasc").show();
	  	  else
			  $("#irpf_segunasc").hide();
			
		  if (suplidos > 0) 
		  	$("#suplidos_segunasc").show();
	  	  else
			  $("#suplidos_segunasc").hide();

		  if (custodia > 0) 
		  	$("#custodia_segunasc").show();
	  	  else
			  $("#custodia_segunasc").hide();

			console.log('-------------------------');
			console.log('honor:   '+honor);
			console.log('custodia:   '+custodia);
			console.log('suplidos:   '+suplidos);
			console.log('iva:   '+iva);
			console.log('irpf:   '+irpf);
			console.log('-------------------------');

		  var total=(honor+custodia)+iva-irpf;

		  console.log('total: '+total);

		  total= total+suplidos;

		  console.log('total: '+total);
		  
		  suplidos= Math.round(suplidos * 100)/100;
		  total= Math.round(total * 100)/100;
	
		  

		var fechac = $("#fecha_c").val();
		var fecha = moment(fechac);
		if (suplidos > 0) {
			$(".sc_suplidos").show();
		}else{
			$(".sc_suplidos").hide();
		}
		if (custodia > 0) {
			$(".sc_custodia").show();
		}else{
			$(".sc_custodia").hide();
		}


		fecha_format= fecha.format("DD/MM/YYYY");
		$('#segundac_tipo').html(tipo);
		$('#segundac_folios').html(folios);
		$('#segundac_fecha').html(fecha_format);
		$('#segundac_ncopias').html(numero);

		$('#segundac_honorarios').html(convertir(honor)+' €');
		$('#segundac_custodia').html('+ '+convertir(custodia)+' €');
		$('#segundac_suplidos').html('+ '+convertir(suplidos)+' €');
		$('#segundac_iva').html('+ '+convertir(iva)+' €');
		$('#segundac_irpf').html('- '+convertir(irpf)+' €');
		$('#segundac_liquido').html(convertir(total)+' €');

		$('#pdfsegundac_tipo').val(tipo);
		$('#pdfsegundac_folios').val(folios);
		$('#pdfsegundac_fecha').val(fecha_format);
		$('#pdfsegundac_ncopias').val(numero);

		$('#pdfsegundac_honorarios').val(convertir(honor));
		$('#pdfsegundac_custodia').val(convertir(custodia));
		$('#pdfsegundac_suplidos').val(convertir(suplidos));
		$('#pdfsegundac_iva').val(convertir(iva));
		$('#pdfsegundac_irpf').val(convertir(irpf));
		$('#pdfsegundac_liquido').val(convertir(total));
		$('#tipo_solicitud_segundascopias').val('SEGUNDAS_COPIAS');

			myArrayUrl=valor_url='';
			var urlactual = window.location;
			var myArrayUrl = urlactual.toString().split('?');
			if (typeof(myArrayUrl[2]) != "undefined" && myArrayUrl[2] !== null) {
				var valor_url = myArrayUrl[2].toLowerCase();
			}
		array_json={
			segundac_tipo		: tipo,
			segundac_folios		: folios,
			segundac_fecha		: fecha_format,
			segundac_ncopias	: numero,	
			segundac_honorarios: convertir(honor)+' €',
			segundac_custodia	: '+ '+convertir(custodia)+' €',
			segundac_suplidos	: '+ '+convertir(suplidos)+' €',
			segundac_iva		: '+ '+convertir(iva)+' €',
			segundac_irpf		: '- '+convertir(irpf)+' €',
			segundac_liquido	: convertir(total)+' €',
		}
		var json = JSON.stringify(array_json);


		timeout = setTimeout(function(){
			// $.post( "/Printer_budget/audit_simulaciones/", 
			// { url: myArrayUrl, solicitud:'segundas_copias', accion:json, comentario:'simulación presupuesto Segundas Copias'  }, function( data ) {
			// }, "json");

			$("#resultado_segundas_copias").slideDown('slow');
			$.ajax({
				method: "POST",
				url: '/Printer_budget/historico_simulaciones',
				data:{ url: myArrayUrl, solicitud:'SEGUNDAS_COPIAS', accion:json, comentario:'simulación presupuesto Segundas Copias',tipo_cal:'simulacion'},
				}).done(function (data) {});
		  }, 300)
	}
}

//____________________________________________________________________________________________
$(document).ready( function(){
	$("input:radio[name='pregunta_folios']").on("change",function(e){
		var pregunta_folios=$("input[name='pregunta_folios']:checked").val();
		$("#ingrese_n_folios").show('slow');
		if (pregunta_folios==0) {
			$("#n_folios_c").val('10');
			$("#alerta_desconoce_n_folios").show();
		}else{
			$("#n_folios_c").val('');
			$("#alerta_desconoce_n_folios").hide();
		}

	});

	$("#n_folios_c,#fecha_c,#n_copias_c,input:radio[name='empresa_sc'],#tipo_copia").on("change",function(e){
		if ($('#n_copias_c').val()==0||$('#n_folios_c').val()==0 || $('#fecha_c').val()==0 || $('#tipo_copia').val()==0 || !$("input:radio[name='empresa_sc']").is(':checked'))
		{
			$('#honorarios').val(convertir(0));
			$('#iva').val(convertir(0));
			$('#irpf').val(convertir(0));
			$('#liquido').val(convertir(0));
			$("#resultado_segundas_copias").hide('fast');
			return false;
		}
		else
		{
			var fecha_actual = moment();
			var input_fecha=$('#fecha_c').val();
			var fecha = moment(input_fecha);

			var years= fecha_actual.diff(fecha, 'years');

			var tipo=$('#tipo_copia').val();
			var folios=$('#n_folios_c').val();
			var numero=$('#n_copias_c').val();
			var empresa=$("input[name='empresa_sc']:checked").val();

			actualitza_pagament_segundas_copias(tipo,folios,numero,years,empresa);
		}
	});

// ===========================================================================
// ===========================================================================
$(document).on('click', '#btn_email_segundascopias', function(e){
	e.preventDefault();
	$('#btn_email_segundascopias').hide();
	$('#div_enviar_mail_segundascopias').show('slow');
	$('#btn_enviar_segundascopias').show('slow');
});
// ===========================================================================
$(document).on('click', '#btn_enviar_segundascopias', function(e){
	e.preventDefault();
	email = validarEmail($('#email_segundascopias').val());
	$("#loading_segundascopias").hide();
	$('.terminos, .terminos_link').removeClass('text-danger');
	terminos= $(document).find("input[type='checkbox'][name='terminos']:checked");
	if (email == true) {
		if (terminos.val() == 'OK') {
			$("#btn_enviar_segundascopias").hide();
			$("#loading_segundascopias").show();
			grecaptcha.ready(function() {
				grecaptcha.execute('6LdCoVEqAAAAAHPOAqmBgukE9w8LJUHsfaXJbS6a', {action: 'submit'}).then(function(token) {
					$("#form_enviar_segundascopias_by_mail").append("<input type='hidden' name='g-recaptcha-response' value='" + token + "' />");
					$.ajax({
						method: 'POST',
						url: "/Printer_budget/enviar_by_mail",
						data: $("#form_enviar_segundascopias_by_mail").serialize(),
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
		$('#email_segundascopias').addClass('alert_input');
	}
  });

});
