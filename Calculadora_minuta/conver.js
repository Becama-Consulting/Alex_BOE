function convertir(num){
	var t = num.toString();
	t = strReplace(t,'.',',');

	var nf = new NumberFormat(t);
	nf.setPlaces(2);
	nf.setCurrency(false);
	nf.setSeparators(true,nf.PERIOD,nf.COMMA);
	return nf.toFormatted();
}

function strReplace(s, r, w){
	return s.split(r).join(w);
}

function validar(t){
	t.value= convertir(t);
}
