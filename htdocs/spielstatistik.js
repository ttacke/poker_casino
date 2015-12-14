var spielstatistik_zugewinnstatistik = {};
var spielstatistik_benutzte_datenmenge = 500;
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
function spielstatistik() {
	var statistik = [];
	for(var name in spielstatistik_zugewinnstatistik) {
		var i = spielstatistik_zugewinnstatistik[name].length - spielstatistik_benutzte_datenmenge;
		var zugewinn = 'verfügbar in ' + (i * -1) + ' Spielen';
		if(i >= 0) {
			var daten = [];
			for(;i < spielstatistik_zugewinnstatistik[name].length; i++) {
				daten.push(spielstatistik_zugewinnstatistik[name][i]);
			}
			zugewinn = _spielstatistik_berechneTrend(daten);
		}
		if(spielerName == name) name = '<strong>' + name + '</strong>';
		statistik.push('<dt>' + name + '</dt><dd>Zugewinn pro Minute: ' + zugewinn + '<br/><small style="color: #CCC">Aktueller Stack: ' + stack + '</small></dd>');
	}
	document.body.innerHTML = '<h1>Spielstatistik</h1><dl>' + statistik.join('') + '</dl>';
}
// VOID
function spielstatistik_log(frage) {
	if(frage.Rundenname != 'showdown') return;
	
	for(var i = 0;i < frage.Spieler.length; i++) {
		if(!spielstatistik_zugewinnstatistik[frage.Spieler[i].Name]) {
			spielstatistik_zugewinnstatistik[frage.Spieler[i].Name] = [];
		}
		spielstatistik_zugewinnstatistik[frage.Spieler[i].Name].push(frage.Spieler[i].Stack);
	}
}
setInterval(function() {
	spielstatistik();
}, 1000);