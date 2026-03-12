//==================================index======================================
$("#select_tipo_aranceles").on("change",function(e){
  var arancel = $("#select_tipo_aranceles").val();
  if (arancel==1){
    location.href ="/notariaJBl/gestion_polizas_opcion_uno";
  }
});

//=============================================================================

function calculardatos_pdf() {
  $(".honorarios_pdf").html( $('#honorarios_pdf').val());
  $(".iva_pdf").html( $('#iva_pdf').val());
  $(".irpf_pdf").html( $('#irpf_pdf').val());
  $(".res_total_pdf").html( $('#liquido_pdf').val());
  // var divContents = document.getElementById("exampleModalCenter").innerHTML;
  //           var a = window.open('', '', 'height=500, width=500');
  //           a.document.write('<html>');
  //           a.document.write('<body >');
  //           a.document.write(divContents);
  //           a.document.write('</body></html>');
  //           a.document.close();
  //           a.print();
}
(function() {
  
  function actualitza_pagament(base,vencimiento,garante,empresa)
  {
    var honor=0;
    var iva=0;
    var irpf=0;
    // console.log(base);
    // console.log(vencimiento);
    // console.log(garante);
    // console.log(empresa);

    if (isNaN(base))
    {
      return false;
    }
    else
    {
      if (vencimiento==0)		//menos de 6 meses
      {
        if (garante==0)		//No garantes
        {
          if (base<240404.85)
          {
            honor=(base * 2)/1000;
          }
          else if (base<300506.06)
          {
            var resto=base-240404.84;
            honor=(240404.84 * 2)/1000;
            honor+=(resto * 1)/1000;
          }
          else if (base>300506.05)
          {
            var resto=base-300506.05;
            honor=(240404.84 * 2)/1000;
            honor+=((300506.05-240404.84) * 1)/1000;
            honor+=(resto * 0.25)/1000;
          }
        }
        else				//SI garantes
        {
          if (base<90151.82)
          {
            honor=(base * 3)/1000;
          }
          else if (base<150253.04)
          {
            var resto=base-90151.82;
            honor=(90151.82 * 3)/1000;
            honor+=(resto * 2)/1000;
          }
          else if (base<300506.06)
          {
            var resto=base-150253.03;
            honor=(90151.82 * 3)/1000;
            honor+=((150253.03-90151.82) * 2)/1000;
            honor+=(resto * 1)/1000;
          }
          else if (base>300506.05)
          {
            var resto=base-300506.05;
            honor=(90151.82 * 3)/1000;
            honor+=((150253.03-90151.82) * 2)/1000;
            honor+=((300506.05-150253.03) * 1)/1000;
            honor+=(resto * 0.25)/1000;
          }
        }
      }
      else  //mas de 6 meses
      {
        if (garante==0)		//NO garantes
        {
          if (base<90151.82)
          {
            honor=(base * 3)/1000;
          }
          else if (base<150253.04)
          {
            var resto=base-90151.82;
            honor=(90151.82 * 3)/1000;
            honor+=(resto * 2)/1000;
          }
          else if (base<300506.06)
          {
            var resto=base-150253.03;
            honor=(90151.82 * 3)/1000;
            honor+=((150253.03-90151.82) * 2)/1000;
            honor+=(resto * 1)/1000;
          }
          else if (base>300506.05)
          {
            var resto=base-300506.05;
            honor=(90151.82 * 3)/1000;
            honor+=((150253.03-90151.82) * 2)/1000;
            honor+=((300506.05-150253.03) * 1)/1000;
            honor+=(resto * 0.25)/1000;
          }
        }
        else				//Si garantes
        {
          if (base<90151.82)
          {
            if (base<48080.98)
            {
              honor=(base * 4.5)/1000;
            }
            else
            {
              var resto=base-48080.97;
              honor=(48080.97 * 4.5)/1000;
              honor+=(resto * 1.5)/1000;
            }
          }
          else
          {
            if (base<90151.82)
            {
              honor=(base * 3)/1000;
            }
            else if (base<150253.04)
            {
              var resto=base-90151.82;
              honor=(90151.82 * 3)/1000;
              honor+=(resto * 2)/1000;
            }
            else if (base<300506.06)
            {
              var resto=base-150253.03;
              honor=(90151.82 * 3)/1000;
              honor+=((150253.03-90151.82) * 2)/1000;
              honor+=(resto * 1)/1000;
            }
            else if (base>300506.05)
            {
              var resto=base-300506.05;
              honor=(90151.82 * 3)/1000;
              honor+=((150253.03-90151.82) * 2)/1000;
              honor+=((300506.05-150253.03) * 1)/1000;
              honor+=(resto * 0.25)/1000;
            }
          }
        }
      }
      if (honor<12.03) 
        honor=12.02;
  
      iva=honor*21/100;
      if (empresa==1)
        irpf=honor*15/100;
  
      var total=honor+iva-irpf;
      
      iva= Math.round(iva * 100)/100;
      honor= Math.round(honor * 100)/100;
      irpf= Math.round(irpf * 100)/100;
      total= Math.round(total * 100)/100;

      $('#honorarios').html(formatear_cifras_moneda(honor));
      $('#iva').html('+ '+formatear_cifras_moneda(iva));
      $('#irpf').html('-  '+formatear_cifras_moneda(irpf));
      $("#liquido").html(formatear_cifras_moneda(total));
      $('#honorarios_pdf').val(formatear_cifras_moneda(honor));
			$('#iva_pdf').val(formatear_cifras_moneda(iva));
			$('#irpf_pdf').val(formatear_cifras_moneda(irpf));
			$('#liquido_pdf').val(formatear_cifras_moneda(total));

      $('#import').html(' '+formatear_cifras_moneda(base));
      $('#importe_pdf').val(formatear_cifras_moneda(base));
      var vencimiento=$("input[name='vencimiento']:checked").val();
      var garante=$("input[name='garantes']:checked").val();
      var empresa=$("input[name='empresa']:checked").val();
      $('#tipo_solicitud_polizas').val('PÓLIZAS');

      if (vencimiento == 1) {
        $('#vencimiento').html('superior');
        $('#vencimiento_pdf').val('superior');
      }else{
        $('#vencimiento').html('inferior');
        $('#vencimiento_pdf').val('inferior');
      }

      if (garante == 1) {
        $("#garantes_pdf").val('Si');
        $(".garates_resul").show()
      }else{
        $(".garates_resul").hide()
        $("#garantes_pdf").val('No');
      }

      if (empresa == 1) {
        $("#titular_pdf").val('Si');
        $(".bussines").show();
        $('#irpf_polizas').show();
      }else{
        $("#titular_pdf").val('No');
        $(".bussines").hide();
        $('#irpf_polizas').hide();
      }
      myArrayUrl=valor_url='';
			var urlactual = window.location;
			var myArrayUrl = urlactual.toString().split('?');
			if (typeof(myArrayUrl[2]) != "undefined" && myArrayUrl[2] !== null) {
				var valor_url = myArrayUrl[2].toLowerCase();
			}
		array_json={
      importe_pdf     : $('#importe_pdf').val(),
      liquido_pdf     : formatear_cifras_moneda(total),
      vencimiento_pdf : $('#vencimiento_pdf').val(),
      honorarios_pdf  : formatear_cifras_moneda(honor),
      irpf_pdf        : formatear_cifras_moneda(irpf),
      iva_pdf         : formatear_cifras_moneda(iva),
      titular_pdf     : $("#titular_pdf").val(),
      garantes_pdf    : $("#garantes_pdf").val(),
		}
		var json = JSON.stringify(array_json);
    timeout = setTimeout(function(){
      $("#resultado_poliza").slideDown('slow');
        $.ajax({
          method: "POST",
          url: '/Printer_budget/historico_simulaciones',
          data:{ url: myArrayUrl, solicitud:'POLIZAS', accion:json, comentario:'simulación presupuesto Pólizas',tipo_cal:'simulacion'},
      }).done(function (data) {});
      }, 300)
    }
  }




  function formatear_cifras_moneda(parametro) {
    result='';
    if (parametro!= '') {
    monto = Math.round(parametro* 100) / 100;
    monto = new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(monto);
    result = monto;
  }
  return result;
  }
//==================================gestion de polizas======================================
	$("#importe,input:radio[name='vencimiento'],input:radio[name='garantes'],input:radio[name='empresa']").on("change",function(e){
		e.preventDefault();

    var base = $('#importe').val()
    if (base) {
      base= parseFloat(base.replace(/\./g,'').replace(',','.'));
    }

    if ($('#importe').val()==0 || !$("input:radio[name='vencimiento']").is(':checked') || !$("input:radio[name='garantes']").is(':checked') || !$("input:radio[name='empresa']").is(':checked'))
		{
			$('#honorarios').html(formatear_cifras_moneda(0));
			$('#iva').html(formatear_cifras_moneda(0));
			$('#irpf').html(formatear_cifras_moneda(0));
			$('#liquido').html(formatear_cifras_moneda(0));
		}
		else
		{ 
      $("importe").val(base);
			var vencimiento=$("input[name='vencimiento']:checked").val();
			var garante=$("input[name='garantes']:checked").val();
			var empresa=$("input[name='empresa']:checked").val();
      
			actualitza_pagament(base,vencimiento,garante,empresa);
		}
    if (isNaN(base))
    {
      $('#importe').addClass('border border-danger alert_input');
      setTimeout(function(){ $('#importe').removeClass('border border-danger alert_input'),  $('#importe').val('')}, 1200);
      return false;
    }
      monto= formatear_cifras_moneda(base);
      $("#importe").val(monto);

	// $('#garante').popover({  //funcion de rafel
	// 	"title":"Garantes",
	// 	"content":"Fiadores o garantía real si el garante es persona distinta del acreditado o prestatario",
	// 	"trigger":"hover",
	// 	"html":true
	// });

});
  // ===========================================================================

  $(document).on('change', '.input_rango', function (e) {
     let monto= formatear_cifras_moneda(this.value);
     var padreSuperior=$(this).parent();
     let clas_name_padre= ($(padreSuperior).attr('class'));
     $("."+clas_name_padre+"").find(".inporte_prestamo").val(monto);
  });

  $(document).on('change', '.inporte_prestamo', function (e) {
    let monto= this.value;
    var padreSuperior=$(this).parent();
    let clas_name_padre= ($(padreSuperior).attr('class'));
    $("."+clas_name_padre+"").find(".input_rango").val(monto);
    monto= formatear_cifras_moneda(this.value);
    $("."+clas_name_padre+"").find(".inporte_prestamo").val(monto);
 });

  $(document).on('change', '#g_hipoteca1', function(e){
    e.preventDefault();
    ocultar_aletas();
    $("#div_n_fincas").hide('slow');
    $("#number_hipotecas_1").hide('slow');
    $("#number_hipotecas_2").hide('slow');
  });
  $(document).on('change', '#g_hipoteca2', function(e){
    e.preventDefault();
    ocultar_aletas();
    $("#div_n_fincas").show('slow');
    $("#number_hipotecas_1").hide('slow');
    $("#number_hipotecas_2").hide('slow');
  });

  $(document).on('change', '#g_hipoteca3', function(e){
    e.preventDefault();
    ocultar_aletas();
    $("#div_n_fincas").hide('slow');
    $("#number_hipotecas_1").show('slow');
    $("#number_hipotecas_2").hide('slow');
  });

  $(document).on('change', '#g_hipoteca4', function(e){
    e.preventDefault();
    ocultar_aletas();
    $("#div_n_fincas").hide('slow');
    $("#number_hipotecas_2").show('slow');
    $("#number_hipotecas_1").hide('slow');
  });

  $(document).on('change', '#radio_entidad_bancaria_diferente', function(e){
    e.preventDefault();
    $("#entidad_bancaria_diferente").attr("readonly", false); 
  });
  
  $(document).on('change', '#radio_entidad_bancaria_igual', function(e){
    e.preventDefault();
    $("#entidad_bancaria_diferente").val(''); 
    $("#entidad_bancaria_diferente").attr("readonly", true); 
  });
  
  $(document).on('change', '.input_number_hipoteca', function(e){
    e.preventDefault();
    var numero = $(this).val();
    if (numero >= 15) {
      $("#error-tipo_hipoteca").show('slow').html('No aceptamos un numero mayor a quince (15)!');
      setTimeout(ocultar_aletas, 3500);
    }else{
      clonar_inputs_importes(numero);
    }
  });
  
  function ocultar_aletas(){
    $("#error-tipo_hipoteca").hide();
    $(".input_number_hipoteca").val('');
    $("#inputs_inportes").html(''); 

  }
  
  function clonar_inputs_importes(n) {
    var output="";
    for(var i=0; i<n; i++){
      n_prestamo= i+2;
            output+="<div class='col mt-3 p-2 border boder-1 rounded'> "+
                    "<span class='label-audita nunito-bold'>¿CUÁL ERA EL IMPORTE INICIAL DEL PRÉSTAMO "+ n_prestamo + " ?</span>"+
                    "   <div class='text-left'>"+
                    "     <div class='slidecontainer"+i+"'>"+
                    "       <input type='text' class='form-control importe-1-a formatmoney-2 caja-min col-10 inporte_prestamo' value='0' id='demo"+i+"'style='text-align: center; margin-bottom: 5px;'>"+
                    "       <input type='range' min='0' max='1000000' value='0' class='slider input_rango' id='myRange"+i+"'>"+
                    "     </div>"+
                    "   </div>"+
                    "</div>";



    }
    $("#inputs_inportes").html(output); 

  }

  $(document).on('click', '#calcular_prov', function(e){
    $("#res_provisiones").show('slow');
    var n= $('.input_number_hipoteca').val();
    console.log(n); 
    if (n && n>1) {
    }else{
      n=0;
    }
    n++;
    var result_provision="";

    for(var i=0; i<n; i++){
      n_prestamo= i+1;
       result_provision+= "<div class='text-center label-audita nunito-bold p-2 col-lg-4 col-md-6'>IMPORTE INICIAL DEL PRESTAMO "+n_prestamo+" CONCEDIDO <br> <span class='montos'>0.00 €</span></div>"
    }
      $("#result_provision").html(result_provision); 
  });

  // ===========================================================================
  $(document).on('click', '#btn_email_polizas', function(e){
    e.preventDefault();
    $('#btn_email_polizas').hide();
    $('#div_enviar_mail_polizas').show('slow');
    $('#btn_enviar_polizas').show('slow');
  });

  $(document).on('click', '#btn_enviar_polizas', function(e){
    e.preventDefault();
    $("#loading_polizas").hide();
    email = validarEmail($('#email_polizas').val());
    $('.terminos, .terminos_link').removeClass('text-danger');
    terminos= $(document).find("input[type='checkbox'][name='terminos']:checked");
    if (email == true) {
      if (terminos.val() == 'OK') {
        $("#btn_enviar_polizas").hide();
        $("#loading_polizas").show();
        grecaptcha.ready(function() {
          grecaptcha.execute('6LdCoVEqAAAAAHPOAqmBgukE9w8LJUHsfaXJbS6a', {action: 'submit'}).then(function(token) {
            $("#form_enviar_poliza_by_mail").append("<input type='hidden' name='g-recaptcha-response' value='" + token + "' />");
            $.ajax({
              method: 'POST',
              url: "/Printer_budget/enviar_by_mail",
              data: $("#form_enviar_poliza_by_mail").serialize(),
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
      $('#email_polizas').addClass('alert_input');
    }

  });


  // ===========================================================================
  $('input.solonumeros').keyup(function(event) {
    if(event.which >= 37 && event.which <= 40){
    event.preventDefault();
    }
    $(this).val(function(index, value) {
      return value
      .replace(/\D/g, "") ;
    });
  })
  
	$('.decimales').on('input', function () {
		inmo_percent = this.value.replace(/[^0-9,.]/g, '').replace(/,/g, '.');
		$(this).val(inmo_percent);
	});


  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })


  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)



  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false
    });
  });

})()