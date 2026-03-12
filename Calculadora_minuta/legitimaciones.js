////////////////////////////Legitimaciones/////////////////////////////
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

function actualitza_pagament_legitimaciones(honor,empresa)
{ 
	var iva=0;
	var irpf=0;
	if (isNaN(honor))
	{
		return false;
	}
	else
	{
		// honor = honor+9.03;
		iva=honor*21/100;
		if (empresa==1)
			irpf=honor*15/100;

		var total=honor+iva-irpf;

		iva= Math.round(iva * 100)/100;
		honor= Math.round(honor * 100)/100;
		irpf= Math.round(irpf * 100)/100;
		total= Math.round(total * 100)/100;

    	$('#honorarios_l').html(convertir(honor)+' €');
		$('#iva_l').html('+ '+convertir(iva)+' €');
		$('#irpf_l').html('- '+convertir(irpf)+' €');
		$('#liquido_l').html(convertir(total)+' €');

		$('#input_honorarios_l').val(convertir(honor));
		$('#input_iva_l').val(convertir(iva));
		$('#input_liquido_l').val(convertir(total));
		$('#tipo_solicitud_Legitimaciones').val('LEGITIMACIONES');
		
		if (empresa == 1) {
			$("#input_empresa_l").val('Si');
			$('#input_irpf_l').val(convertir(irpf));
			$(".bussines").show();
			$("#irpf_leg").show();
		}else{
			$("#input_empresa_l").val('No');
			$('#input_irpf_l').val('');
			$(".bussines").hide();
			$("#irpf_leg").hide();
		}

		myArrayUrl=valor_url='';
		var urlactual = window.location;
		var myArrayUrl = urlactual.toString().split('?');
		if (typeof(myArrayUrl[2]) != "undefined" && myArrayUrl[2] !== null) {
			var valor_url = myArrayUrl[2].toLowerCase();
		}
	array_json={
		solicitud : 'LEGITIMACIONES',
		honorarios_l  		: convertir(honor),
		iva_l  				: convertir(iva),
		irpf_l  			: convertir(irpf),
		liquido_l  			: convertir(total),	
		empresa				: empresa==1 ? 'SI': 'NO',
	}
	var json = JSON.stringify(array_json);

		timeout = setTimeout(function(){
			// $.post( "Printer_budget/audit_simulaciones/", { url: myArrayUrl, solicitud:'legitimaciones', accion:json, comentario:'simulación presupuesto Legitimaciones'  }, function( data ) {
			// }, "json");
			$("#resultado_legitimacion").slideDown('slow');
			$.ajax({
				method: "POST",
				url: '/Printer_budget/historico_simulaciones',
				data:{ url: myArrayUrl, solicitud:'LEGITIMACIONES', accion:json, comentario:'simulación presupuesto Legitimaciones',tipo_cal:'simulacion'},
				}).done(function (data) {});
		  }, 300)
	}
   
}



//____________________________________________________________________________________________
$(document).ready( function(){

	$("#numero_legi").on("change",function(e){
		e.preventDefault();
		$("#documentos_legi").html('');
		$("#body_table_legitimaciones").html('');
		$("#tdbody_legitimaciones").html('');
		$("#resultado_legitimacion").hide();
		var numero=parseFloat($('#numero_legi').val().replace(/\./g,'').replace(',','.'));
		for (i=1;i<=numero;i++)
		{ 
			var elementos="<div class='group_docs border border-1 rounded m-1 mb-3 row' style='background-color: #eee;'> "+
							"<div class='icon-box col-sm-12 col-md-5 my-auto' data-aos='zoom-in' data-aos-delay='150' style='padding-left: 6px;'>"+
								"<i class='bx bx-file'></i>"+
								"<h4 class='pt-2'> Documento "+i+" </h4>"+
							"</div>"+
							"<div data-aos='zoom-in' data-aos-delay='150' class='col-sm-12 col-md-7'>"+
								"<h6 class='p-2 pt-1 pb-1 mb-0 row'>"+
								"<div class='col-sm-12 col-md-7 my-auto'>"+
									"• Número de firmas"+
								"</div>"+
								"<div class='col-sm-12 col-md-4' style='padding-left: 21px;padding-right: 2px;'>"+
								"<input type='text' class='form-control h6 solonumeros' style='text-align: center; margin-bottom: 5px; font-family: Open Sans;'  id='firmas_"+i+"' name='firmas[]'>"+
								"</div>"+
								"</h6>"+
							"</div>"+
							"</div> ";
					$("#documentos_legi").append(elementos);

					var registro="<tr><td class='td_iten'>Documento "+i+"</td>"+
									"<td class='td_right' id='b_l"+i+"'>0</td>"+
									"<td class='td_right' id='e_l"+i+"'>0</td></tr>";
					$("#body_table_legitimaciones").append(registro);

		}
		$("#numero_legi,input[name^='firmas'],input:radio[name='empresa_l']").on("change",function(e){
			var total_firmas=0;
			for (p=1;p<=numero;p++)
			{
				if ($('#firmas_'+p).val()!=0)
					total_firmas=1;
				else
					total_firmas=0;
			}
	
			if ($('#numero_legi').val()!=0 && total_firmas==1 && $("input:radio[name='empresa_l']").is(':checked'))
			{
				var coste_doc=ARANCEL_LEGIT_PRIMERA_FIRMA;
				var coste_firma=ARANCEL_LEGIT_FIRMA_ADICIONAL;
				var total_coste=0;
				var inputs_tables='';
				$("#tdbody_legitimaciones").html('');
				var n_t_firmas=parseFloat(0);
				for (h=1;h<=numero;h++)
				{
					var t=$('#firmas_'+h).val();
					$('#b_l'+h).html(t);
					if (t==1)
						var honor=coste_doc;
					else
						var honor=coste_doc+(coste_firma*(t-1));
	
					honor= Math.round(honor * 100)/100;
	
					$('#e_l'+h).html(convertir(honor)+' €');
	
					n_t_firmas+=parseFloat(t);
					console.log(n_t_firmas);
					total_coste+=honor;

					inputs_tables="	 <input type='hidden' class='col-3' id='td_firmas_"+h+"' name='td_firmas[]' value='"+t+"'>"+
								 	"<input type='hidden' class='col-3' id='td_inport_"+h+"' name='td_import[]' value='"+honor+"'>";
								$("#tdbody_legitimaciones").append(inputs_tables);
				}
				console.log('total: '+n_t_firmas);

				$("#total_firmas_leg").html(n_t_firmas) ;
				$(("#input_firmas_l")).val(n_t_firmas);
				$("#total_importe_leg").html(convertir(total_coste)+' €') ;
				$("#input_importe_docs").val(convertir(total_coste)) ;

				var empresa=$("input[name='empresa_l']:checked").val();
				
				actualitza_pagament_legitimaciones(total_coste,empresa);
			}
		});

	});


	
// ===========================================================================
// ===========================================================================
$(document).on('click', '#btn_email_legitimaciones', function(e){
	e.preventDefault();
	$('#btn_email_legitimaciones').hide();
	$('#div_enviar_mail_legitimaciones').show('slow');
	$('#btn_enviar_legitimaciones').show('slow');
});
// ===========================================================================
$(document).on('click', '#btn_enviar_legitimaciones', function(e){
	e.preventDefault();
	email = validarEmail($('#email_legitimaciones').val());
	$("#loading_legitimaciones").hide();
	$('.terminos, .terminos_link').removeClass('text-danger');
	terminos= $(document).find("input[type='checkbox'][name='terminos']:checked");
	if (email == true) {	
		if (terminos.val() == 'OK') {
			$("#btn_enviar_legitimaciones").hide();
			$("#loading_legitimaciones").show();
			grecaptcha.ready(function() {
				grecaptcha.execute('6LdCoVEqAAAAAHPOAqmBgukE9w8LJUHsfaXJbS6a', {action: 'submit'}).then(function(token) {
					$("#form_enviar_legitimaciones_by_mail").append("<input type='hidden' name='g-recaptcha-response' value='" + token + "' />");
					$.ajax({
						method: 'POST',
						url: "/Printer_budget/enviar_by_mail",
						data: $("#form_enviar_legitimaciones_by_mail").serialize(),
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
		$('#email_legitimaciones').addClass('alert_input');
	}

  });

});


