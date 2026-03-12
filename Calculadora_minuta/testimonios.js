
////////////////////////////TESTIMONIOS//////////////////////////////
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

function actualitza_pagament_testimonios(coste,suplido,empresa)
{ 
	var iva=0;
	var irpf=0;
	if (isNaN(coste))
	{
		return false;
	}
	else
	{
		// coste = coste + 9.03;
		iva=coste*21/100;
		if (empresa==1)
			irpf=coste*15/100;

		var total=coste+iva-irpf;

		iva= Math.round(iva * 100)/100;
		irpf= Math.round(irpf * 100)/100;
		total= Math.round(total * 100)/100;
		$('#input_test_honorarios').val(convertir(coste));
		$('#input_test_iva').val(convertir(iva));
		$('#input_test_irpf').val(convertir(irpf));
		$('#input_test_suplidos').val(convertir(suplido));
		$('#input_test_liquido').val(convertir(total+suplido));
		$('#tipo_solicitud_testi').val('TESTIMONIOS');

   		$('#testi_honorarios').html(convertir(coste)+' €');
		$('#testi_iva').html(convertir(iva)+' €');
		$('#testi_irpf').html(convertir(irpf)+' €');
		$('#testi_suplidos').html(convertir(suplido)+' €');
		$('#testi_liquido').html(convertir(total+suplido)+' €');
		myArrayUrl=valor_url='';
		var urlactual = window.location;
		var myArrayUrl = urlactual.toString().split('?');
		if (typeof(myArrayUrl[2]) != "undefined" && myArrayUrl[2] !== null) {
			var valor_url = myArrayUrl[2].toLowerCase();
		}
		array_json={
			solicitud : 'TESTIMONIOS',
			empresa_pdf : $("#empresa_pdf").val(),
			input_test_honorarios : convertir(coste),
			input_test_iva : convertir(iva),
			input_test_irpf : convertir(irpf),
			input_test_suplidos : convertir(suplido),
			input_test_liquido : convertir(total+suplido) }

		var json = JSON.stringify(array_json);
		timeout = setTimeout(function(){
		$("#resultado_testimonio").slideDown('slow');
		$.ajax({
			method: "POST",
			url: '/Printer_budget/historico_simulaciones',
			data:{ url: myArrayUrl, solicitud:'TESTIMONIOS', accion:json, comentario:'simulación presupuesto Testimonios',tipo_cal:'simulacion'},
			}).done(function (data) {});
		}, 300)
	}
}
//================================================================
$(document).ready( function(){
	$("#num_docs_testimonios").on("change",function(e){
		$("#body_table_testimonios").html('');
		var numero=parseFloat($('#num_docs_testimonios').val().replace(/\./g,'').replace(',','.'));
    $("#detalle_docs").html('');

		for (i=1;i<=numero;i++)
		{ 
      var elementos="<div class='group_docs border border-1 rounded m-1 mb-3 row' style='background-color: #eee;'> "+
                      "<div class='icon-box col-sm-12 col-md-5 my-auto' data-aos='zoom-in' data-aos-delay='150' style='padding-left: 6px;'>"+
                        "<i class='bx bx-file'></i>"+
                        "<h4 class='pt-2'> Documento "+i+" </h4>"+
                      "</div>"+
                      "<div data-aos='zoom-in' data-aos-delay='150' class='col-sm-12 col-md-7' >"+
                        "<h6 class='p-2 pt-1 pb-1 mb-0 row'>"+
                          "<div class='col-sm-12 col-md-7 my-auto'>"+
                            "• Número de páginas"+
						  "</div>"+
						  "<div class='col-sm-12 col-md-4' style='padding-left: 21px;padding-right: 2px;'>"+
                            "<input type='text' class='form-control h6 solonumeros' style='text-align: center; margin-bottom: 5px; font-family: Open Sans;' id='pagina_"+i+"' name='pagina[]'>"+
                          "</div>"+
                          "<div class='col-sm-12 col-md-7 my-auto'>"+
                            "• Número de copias"+
						  "</div>"+
						  "<div class='col-sm-12 col-md-4' style='padding-left: 21px;padding-right: 2px;'>"+
                            "<input type='text' class='form-control h6 solonumeros' style='text-align: center; margin-bottom: 5px; font-family: Open Sans;'  id='testi_"+i+"' name='testi[]'>"+
                          "</div>"+
                        "</h6>"+
                      "</div>"+
                    "</div> ";
			$("#detalle_docs").append(elementos);

			var registro="<tr>"+
							"<td class='td_iten'>Documento "+i+"</td>"+
							"<td class='td_right' id='c"+i+"'>0</td>"+
							"<td class='td_right' id='b"+i+"'>0</td>"+
							"<td class='td_right' id='d"+i+"'>0</td>"+
							"<td class='td_right' id='e"+i+"'>0</td>"+
						  "</tr>";
			$("#body_table_testimonios").append(registro);

		}

		$("#num_docs_testimonios,input[name^='pagina'],input[name^='testi'],input:radio[name='empresa_t']").on("change",function(e){
			var total_paginas=0;
			var total_testi=0;
			for (p=1;p<=numero;p++)
			{
				if ($('#pagina_'+p).val()!=0)
					total_paginas=1;
				else
					total_paginas=0;
			}
			for (t=1;t<=numero;t++)
			{
				if ($('#testi_'+t).val()!=0)
					total_testi=1;
				else
					total_testi=0;
			}

			if ($('#num_docs_testimonios').val()!=0 && total_paginas==1 && total_testi==1 && $("input:radio[name='empresa_t']").is(':checked'))
			{
				var coste_copia=ARANCEL_TESTIMONIO_PRIMER_FOLIO;
				var coste_folio=ARANCEL_TESTIMONIO_FOLIO_EXTRA;
				var coste_suplido=ARANCEL_PAPEL_FOLIO;
				var total_coste=0;
				var total_suplido=0;
				$('#tdbody').html('');
				var inputstables;
				for (h=1;h<=numero;h++)
				{
					var t=$('#testi_'+h).val();
					var p=$('#pagina_'+h).val();

					$('#b'+h).html(t);
					$('#c'+h).html(p);
					if (p==1)
						var coste=coste_copia*t;
					else
						var coste=(coste_copia+(coste_folio*(p-1)))*t;

					coste= Math.round(coste * 100)/100;

					var suplido=Math.round((t*p*coste_suplido) * 100)/100;
					$('#d'+h).html(convertir(suplido)+' €');
					$('#e'+h).html(convertir(coste)+' €');

					total_coste+=coste;
					total_suplido+=suplido;
					inputstables= 	"<input type='hidden' class='col-3' id='td_pagina_"+h+"' name='td_pagina[]' value='"+p+"'>"+
									"<input type='hidden' class='col-3' id='td_testim_"+h+"' name='td_testim[]' value='"+t+"'>"+
									"<input type='hidden' class='col-3' id='td_suplid_"+h+"' name='td_costes[]' value='"+convertir(coste)+" €'>"+
									"<input type='hidden' class='col-3' id='td_costes_"+h+"' name='td_suplid[]' value='"+convertir(suplido)+" €'>";
					$("#tdbody").append(inputstables);

				}
				$("#total_suplido").html(convertir(total_suplido)+' €') ;
				$("#total_coste").html(convertir(total_coste)+' €') ;
				$("#total_coste_pdf").val(convertir(total_coste));
				var empresa=$("input[name='empresa_t']:checked").val();
				if (empresa == 1) {
					$("#empresa_pdf").val('Si');
					$(".bussines").show();
					$("#irpf_testi").show();
				  }else{
					$("#empresa_pdf").val('No');
					$(".bussines").hide();
					$("#irpf_testi").hide();
				  }
				actualitza_pagament_testimonios(total_coste,total_suplido,empresa);
			}
		});
	});

// ===========================================================================
// ===========================================================================
	$(document).on('click', '#btn_email_testimonios', function(e){
		e.preventDefault();
		$('#btn_email_testimonios').hide();
		$('#div_enviar_mail_testimonios').show('slow');
		$('#btn_enviar_testimonios').show('slow');
	});
// ===========================================================================
	$(document).on('click', '#btn_enviar_testimonios', function(e){
		e.preventDefault();
		email = validarEmail($('#email_testimonios').val());
		$("#loading_testimonios").hide();
		$('.terminos, .terminos_link').removeClass('text-danger');
		terminos= $(document).find("input[type='checkbox'][name='terminos']:checked");
		if (email == true) {
			if (terminos.val() == 'OK') {
				$("#btn_enviar_testimonios").hide();
				$("#loading_testimonios").show();
				grecaptcha.ready(function() {
					grecaptcha.execute('6LdCoVEqAAAAAHPOAqmBgukE9w8LJUHsfaXJbS6a', {action: 'submit'}).then(function(token) {
						$("#form_enviar_testimonios_by_mail").append("<input type='hidden' name='g-recaptcha-response' value='" + token + "' />");
						$.ajax({
							method: 'POST',
							url: "/Printer_budget/enviar_by_mail",
							data: $("#form_enviar_testimonios_by_mail").serialize(),
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
			$('#email_testimonios').addClass('alert_input');
		  }
  	});

});
