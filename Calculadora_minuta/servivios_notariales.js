$(document).ready( function(){

	var $mensajesSistema = $('#mensajes-sistema');
	if ($mensajesSistema.length) {
		setTimeout(function () {
			$mensajesSistema.slideUp();
		}, 3800);
	}
    var urlactual = window.location;
    var myArrayUrl = urlactual.toString().split('?');  

    is_poderes =  myArrayUrl[0].search('poderes');
    if (is_poderes > 0) {
      if ( myArrayUrl[1] != undefined) {
        switch(myArrayUrl[1]) {
          case 'personalizado':
              peticion = "P"
            break;
          case 'general':
              peticion = "G"
            break;
          case 'especial':
              peticion = "E"
            break;
          case 'preventivo_simple':
            peticion = "S";
            break;
          case 'preventivo_reciproco':
            peticion = "R";
            break;
          case 'mercantil_general':
              peticion = "M"
            break;  
          case 'pleitos':
            peticion = "L"
            break;  
          case 'sustitucion':
            peticion = "T"
            break;
          case 'subapoderamiento':
            peticion = "A"
            break;
          case 'revocacion':
            peticion = "P"
            break;
          case 'renuncia':
            peticion = "N"
            break;
          case 'ratificacion':
            peticion = "F"
            break;
          default:
            peticion ='#';
        }
        $("#tipo_poder").val(peticion).hide();
        $("#nombre_tipo_poder").html(': '+myArrayUrl[1].replace('_',' ')).show();

        setTimeout(() => {
          $("#tipo_poder").trigger("change"); 
        }, 200);
      }
    }

    is_familia =  myArrayUrl[0].search('familia');
    if (is_familia > 0) {
      if ( myArrayUrl[1] != undefined) {
        switch (myArrayUrl[1]) {

          case 'pareja_de_hecho':
            peticion = "PDR"
            break;
          case 'disolucion_pareja_estable':
            peticion = "DPE"
            break;
          case 'formalizacion_expediente_matrimonial':
            peticion = "FEM"
            break;
          case 'matrimonio':
            peticion = "MAT"
            break;
          case 'capitulaciones_antes_matrimonio':
            peticion = "CAA"
            break;
          case 'capitulaciones_despues_matrimonio':
            peticion = "CAD"
            break;
          case 'divorcio':
            peticion = "DIV"
            break;
          case 'emancipacion':
            peticion = "EMA"
            break;
          case 'nombramiento_tutor':
            peticion = "NDT"
            break;
          case 'autocuratela':
            peticion = "AUC"
            break;
          case 'constitucion_asistencia':
            peticion = "CDA"
            break;
          case 'patrimonio_protegido':
            peticion = "CMP"
            break;
          default:
            peticion = '#';
        }
        $("#tipo_familia").val(peticion).hide();        
        setTimeout(() => {
          $("#tipo_familia").trigger("change"); 
          $("#nombre_tipo_familia").html('&nbsp;&nbsp;'+$('#tipo_familia').find('option:selected').text()+'&nbsp;&nbsp;').show();
        }, 200);
      }
    }

    is_sucesiones =  myArrayUrl[0].search('sucesiones');
    if (is_sucesiones > 0) {
      if ( myArrayUrl[1] != undefined) {
        switch (myArrayUrl[1]) {
          case 'testamento':
            peticion = "TE"
            break;
          case 'declaracion_herederos':
            peticion = "DH"
            break;
          case 'renuncia_herencia':
            peticion = "RH"
            break;
          case 'testamento_vital':
            peticion = "UV"
            break;
          case 'certificado_sucesorio_europeo':
            peticion = "ACS"
            break;
          case 'legado_dinerario':
          case 'legitima_dineraria':
            peticion = "ELD"
            break;
          case 'legado_bien_inmueble':
          case 'legitima_bien_inmueble':
            peticion = "ELB"
            break;
          case 'derechos_hereditarios_dinerarios':
          case 'derechos_hereditarios_bienes':
                peticion = "VDH"
            break;
          case 'donacion':
            peticion = "DO"
            break;
          case 'adicion_herencia':
            peticion = "AH"
            break;
          case 'herencia':
            peticion = "HE"
            break;
          default:
            peticion = '#';
        }
        $("#tipo_sucesiones").val(peticion).hide();        
        setTimeout(() => {
          $("#tipo_sucesiones").trigger("change"); 
          $("#nombre_tipo_sucesiones").html('&nbsp;&nbsp;'+$('#tipo_sucesiones').find('option:selected').text()+'&nbsp;&nbsp;').show();
        }, 200);
      }
    }

    is_inmobiliario =  myArrayUrl[0].search('inmobiliario');
    if (is_inmobiliario > 0) {
      if ( myArrayUrl[1] != undefined) {
        switch (myArrayUrl[1]) {

          case 'compraventa':
            peticion = "COMP"
            break;
          case 'extincion_condominio':
            peticion = "EDCO"
            break;
          case 'novacion_subrogacion':
            peticion = "NOSU"
            break;
          case 'prestamo':
            peticion = "PRES"
            break;
          case 'arras':
            peticion = "ARRA"
            break;
          case 'opcion_compra':
            peticion = "OPCO"
            break;
          case 'obra_nueva':
            peticion = "OBNU"
            break;
          case 'division_horizontal':
            peticion = "DIHO"
            break;
          case 'acta_fijacion_saldo':
            peticion = "AFSA"
            break;
          default:
            peticion = '#';
        }
        $("#tipo_inmobiliario").val(peticion).hide();        
        setTimeout(() => {
          $("#tipo_inmobiliario").trigger("change"); 
          $("#nombre_tipo_inmo").html('&nbsp;&nbsp;'+$('#tipo_inmobiliario').find('option:selected').text()+'&nbsp;&nbsp;').show();
        }, 200);
      }
    }

    is_actas =  myArrayUrl[0].search('actas');
    if (is_actas > 0) {
      if ( myArrayUrl[1] != undefined) {
        switch(myArrayUrl[1]) {
          case 'manifestaciones':
              peticion = "M"
            break;
          case 'presencia':
              peticion = "P"
            break;
          case 'legitimaciones':
              peticion = "L"
            break;
          case 'bases_sorteo':
              peticion = "B"
            break;      
          case 'celebracion_sorteo':
            peticion = "C"
            break;      
          case 'notificacion_persona':
            peticion = "NP"
            break;      
          case 'notificacion_correo':
            peticion = "NC"
            break;
          case 'protocolizacion':
            peticion = "PP"
            break;  
          case 'notoriedad':
            peticion = "N"
            break;
          case 'deposito_objeto':
            peticion = "DO"
            break;      
          case 'deposito_dinero':
            peticion = "DD"
            break;    
          default:
            peticion ='#';
        }

        existe = myArrayUrl[0].includes("e426710ebfedbab8c1995caf1d706146446f424c063c27c667bb6ce85f10b02c-calculadora-notarial");
        if (existe) {
          $("#tipo_acta").val(peticion).show();
          $("#nombre_tipo_acta").hide();
        }else{
          $('.inicio_publico').hide();
          $("#tipo_acta").val(peticion).hide();
          $("#nombre_tipo_acta").html(': '+myArrayUrl[1].replace('_',' ')).show();
        }

        $("#nom_tipo_acta").html(myArrayUrl[1].replace('_',' '));
        $("#imput_nom_tipo_acta").val(myArrayUrl[1].replace('_',' '));

        setTimeout(() => {
          $('#body_actas').show();
          $(".input_text_acta").trigger("change"); 
        }, 200);    
      }
    }

    setTimeout(() => {
      if ($("#url_origen").val() == 'public') {
        $("#id_index").html('');
      }
    }, 100);

    $("#tipo_acta").on("change",function(e){
      $('#body_actas').show();
      switch($("#tipo_acta").val()) {
        case 'M':
          peticion = "manifestaciones"
        break;
        case 'P':
            peticion = "presencia"
          break;
        case 'L':
            peticion = "legitimaciones"
          break;
        case 'B':
            peticion = "bases_sorteo"
          break;      
        case 'C':
          peticion = "celebracion_sorteo"
          break;      
        case 'NP':
          peticion = "notificacion_persona"
          break;      
        case 'NC':
          peticion = "notificacion_correo"
          break;
        case 'PP':
          peticion = "protocolizacion"
          break;  
        case 'N':
          peticion = "notoriedad"
          break;
        case 'DO':
          peticion = "deposito_objeto"
          break;      
        case 'DD':
          peticion = "deposito_dinero"
          break;    
        default:
          peticion ='';
      }
      if (peticion != '') {
        $("#tipo_acta").val(peticion).show();  
        window.location.href = "?" + peticion;
      }else{
        $('#body_actas').hide();
        $('#resultado_actas').hide();
      }

    });    

    $(document).on('click', '.input_email, .input_telf', function(e){
      e.preventDefault();
      $(this).removeClass('alert_input text-danger text-success');
    });
    
    $(document).on('change', '.input_email', function(e){
      e.preventDefault();
      email = validarEmail($(this).val());
      console.log(email);
      if (email == true) {
        $(this).addClass('text-success');
      }else{
        $(this).addClass('text-danger');
      }
    });

    $(document).on('change', '.input_telf', function(e){
      e.preventDefault();
      telef = validarTelefono($(this).val());
      console.log('res: ' +telef);
      if (telef == true) {
        $(this).addClass('text-success');
      }else{
        $(this).addClass('text-danger');
      }
    });
});

function show_servicio(servicio) {
        //inicializamos los servicios
          let serviciosarancelarios = ["polizas", "testimonios","segundascopias", "legitimaciones", "poderes", "actas", "mercantil", "sucesiones", "familia", "inmobiliario"];
          $('input[type="text"]').val('');
          $('input[type="date"]').val('');
          $('#tipo_copia').val(0);
          document.querySelectorAll('[name=terminos]').forEach((x) => x.checked = false);
          document.querySelectorAll('[name=empresa]').forEach((x) => x.checked = false);
          document.querySelectorAll('[name=empresa_sc]').forEach((x) => x.checked = false);
          document.querySelectorAll('[name=vencimiento]').forEach((x) => x.checked = false);
          document.querySelectorAll('[name=garantes]').forEach((x) => x.checked = false);
          document.querySelectorAll('[name=vivienda]').forEach((x) => x.checked = false);
          document.querySelectorAll('[name=pregunta_folios]').forEach((x) => x.checked = false);          
          $('#nombre_tipo_inmo').html('');
          $('#detalle_docs').html('');
          $('#documentos_legi').html('');
          $("#folios_agregados_por_documentos").html('');
          $('#div_importes_por_herederos, #div_res_doc_con_cuantia_herederos, #input_doc_con_cuantia_herederos').html('');
          $('#n_copias_c').val(1);
          $('#tipo_poder').val('#').trigger("change");;
          // $('#legitimacion_numero').val(1);
          $('.copias_solitadas').hide();
          $("#resultado_segundas_copias").hide();
          $("#resultado_legitimacion").hide();
          $("#resultado_poliza").hide();
          $("#resultado_testimonio").hide();
          $('#resultado_sucesiones').hide();
          $('#resultado_fam').hide();
          $('#resultado_inmo').hide();
          $('#body_actas').hide();
          
          if(servicio=='familia')
            $('#tipo_familia').val('#').trigger('change');

          if(servicio=='inmobiliario')
            $('#tipo_inmobiliario').val('#').trigger('change');

          if(servicio=='mercantil')
            $('#tipo_mercantil').val('#').trigger('change');
          
          if (servicio == 'sucesiones') 
            $('#tipo_sucesiones').val('#').trigger('change');

          serviciosarancelarios.forEach(function(elemento, indice, array) {
            if (servicio==elemento) {
              $("#"+servicio+"").show();
            }else{
                if($("#"+elemento+"").is(":visible")){
                  $("#"+elemento+"").hide();
                }
            }
          })
            $('html, body').animate({
              scrollTop: $("#footer").offset().top
              }, 500);
              // -------------------

};

$('input.solonumeros').keyup(function(event) {
	if(event.which >= 37 && event.which <= 40){
	event.preventDefault();
	}
	$(this).val(function(index, value) {
		return value
		.replace(/\D/g, "") ;
	});
})

function loadScript(url, callback) {
  var script = document.createElement('script');
 
  if (script.readyState) { // IE
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else { // Others
    script.onload = function() {
      callback();
    };
  }
 
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

var myLibrary = '/assets/js/notaria.js';
 
function validarEmail(valor) {
      
  emailRegex =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  if (emailRegex.test(valor)) {
    return true;
  } else {
    return false;
  }
}

function validarTelefono(valortelef) {    
  var telef = new RegExp("^(\\+34|0034|34)?[6789]\\d{8}$");
  console.log(valortelef);
  if (telef.test(valortelef)) {
    return true;
  } else {
    return false;
  }
  
}