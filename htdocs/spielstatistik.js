// INT
function _spielstatistik_berechneTrend(daten) {
	var x_durchschnitt = ((daten.length + 1) * (daten.length / 2)) / daten.length;
	var y_durchschnitt = _spielstatistik_gibDurchschnitt(daten);
	
	var summe_xy = 0;
	var summe_xx = 0;
	var sxi = 0;
	var syi = 0;
	
	for(var i = 0;i < daten.length; i++) {
		var xi = (i + 1) - x_durchschnitt; 
		var yi = daten[i] - y_durchschnitt;
		
		var xy = xi * yi;
		var xx = xi * xi;
		
		summe_xy += xy * 1;
		summe_xx += xx * 1;
		sxi += xi;
		syi += yi;
	}
	return Math.floor((summe_xy / summe_xx) * daten.length);
}
// FLOAT
function _spielstatistik_gibDurchschnitt(liste) {
	var summe = 0;
	var anzahl = 0;
	for(var i = 0;i < liste.length; i++) {
		anzahl++;
		summe += liste[i] * 1;
	}
	return summe / anzahl;
}
// VOID
function spielstatistik(spieler_statistik, zugewinnstatistik) {
	var statistik = [];
	for(var name in spieler_statistik) {
		var stack = spieler_statistik[name];
		if(!zugewinnstatistik[name]) zugewinnstatistik[name] = [];
		
		zugewinnstatistik[name].push(stack);
		
		var i = zugewinnstatistik[name].length - 60;
		var zugewinn = 'verfügbar in ' + (i * -1) + ' Sekunden';
		if(i >= 0) {
			var daten = [];
			for(;i < zugewinnstatistik[name].length; i++) {
				daten.push(zugewinnstatistik[name][i]);
			}
			zugewinn = _spielstatistik_berechneTrend(daten);
		}
		if(spielerName == name) name = '<strong>' + name + '</strong>';
		statistik.push('<dt>' + name + '</dt><dd>Zugewinn pro Minute: ' + zugewinn + '<br/><small style="color: #CCC">Aktueller Stack: ' + stack + '</small></dd>');
	}
	document.body.innerHTML = '<h1>Spielstatistik</h1><dl>' + statistik.join('') + '</dl>';
}
