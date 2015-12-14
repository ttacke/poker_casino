var spielstatistik_daten = {};
var spielstatistik_benutzte_datenmenge_fuer_trend = 2500;
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
// STRING
function spielstatistik_gib_trend(stackliste, benutzte_anzahl) {
	var i = stackliste.length - benutzte_anzahl;
	var trend = 'verfügbar in ' + (i * -1) + ' Spielen';
	if(i >= 0) {
		var daten = [];
		for(;i < stackliste.length; i++) {
			daten.push(stackliste[i]);
		}
		trend = _spielstatistik_berechneTrend(daten);
	}
	return trend;
}
// VOID
function spielstatistik_show() {
	var statistik = [];
	for(var name in spielstatistik_daten) {
		var stack = spielstatistik_daten[name][
			spielstatistik_daten[name].length - 1
		];
		
		while(spielstatistik_daten[name].length > spielstatistik_benutzte_datenmenge_fuer_trend) {
			spielstatistik_daten[name].shift();
		}
		
		var trend = spielstatistik_gib_trend(spielstatistik_daten[name], spielstatistik_benutzte_datenmenge_fuer_trend);
		var datenmenge_fuer_kurztrend = Math.floor(spielstatistik_benutzte_datenmenge_fuer_trend / 10);
		var kurz_trend = spielstatistik_gib_trend(spielstatistik_daten[name], datenmenge_fuer_kurztrend);
		var datenmenge_fuer_sehrkurztrend = Math.floor(spielstatistik_benutzte_datenmenge_fuer_trend / 100);
		var sehr_kurz_trend = spielstatistik_gib_trend(spielstatistik_daten[name], datenmenge_fuer_sehrkurztrend);
		
		if(spielerName == name) name = '<strong>' + name + '</strong>';
		statistik.push(
			'<dt>' + name + '</dt>'
				+ '<dd>Trend für ' + spielstatistik_benutzte_datenmenge_fuer_trend + ' Spiele: ' + trend + ' <strong>("Zugewinn pro Minute")</strong><br/>'
				+ '<small style="color: #999">Trend für ' + datenmenge_fuer_kurztrend + ' Spiele: ' + kurz_trend + '<br/>'
				+ 'Trend für ' + datenmenge_fuer_sehrkurztrend + ' Spiele: ' + sehr_kurz_trend + '<br/>'
				+ 'Aktueller Stack: ' + stack + '</small></dd>'
			);
	}
	document.body.innerHTML = '<h1>Spielstatistik</h1><small style="color:#999">' + new Date() + '</small><dl>' + statistik.join('') + '</dl>';
}
// VOID
function spielstatistik_log(frage) {
	if(frage.Rundenname != 'showdown') return;
	
	for(var i = 0;i < frage.Spieler.length; i++) {
		if(!spielstatistik_daten[frage.Spieler[i].Name]) {
			spielstatistik_daten[frage.Spieler[i].Name] = [];
		}
		spielstatistik_daten[frage.Spieler[i].Name].push(frage.Spieler[i].Stack);
	}
}
setInterval(function() {
	spielstatistik_show();
}, 1000);