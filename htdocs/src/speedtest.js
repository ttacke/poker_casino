var listeAllerAbfragen = [];
var aktuelleLogEintragungen = {};
var listeAllerSpielerWerte = {};

$(function() {
	setInterval('schreibeLog()', 1000);
});

// VOID
function fuegeSpielerWertEin(spielerNr, art, wert) {
	if(!listeAllerSpielerWerte[spielerNr]) {
		listeAllerSpielerWerte[spielerNr] = [];
	}
	
	listeAllerSpielerWerte[spielerNr].push({ art: art, wert: wert });
	while(listeAllerSpielerWerte[spielerNr].length > top.window.maxAnzahlFuerAuswertungen) {
		listeAllerSpielerWerte[spielerNr].shift();
	}
}
// INT
function gibSpielerWert(spielerNr, art) {
	if(!listeAllerSpielerWerte[spielerNr]) return 0;
	
	var summe = 0;
	listeAllerSpielerWerte[spielerNr].map(function(obj) { if(obj.art == art) summe += obj.wert; });
	return summe;
}
// INT
function gibGesamtWert(art) {
	var summe = 0;
	for(spielerNr in listeAllerSpielerWerte) {
		listeAllerSpielerWerte[spielerNr].map(function(obj) { if(obj.art == art) summe += obj.wert; });
	}
	return summe;
}
// INT
function ermittleGeschwindigkeit() {
	var jetzt = new Date().getTime();
	listeAllerAbfragen.push(jetzt);
	while(listeAllerAbfragen.length > top.window.maxAnzahlFuerAuswertungen) {
		listeAllerAbfragen.shift();
	}
	var frueher = listeAllerAbfragen[0] || 0;
	return Math.floor(listeAllerAbfragen.length / (jetzt - frueher) * 1000);
}
// VOID
function logge(key, val) {
	//TODO Punkte und Timeouts auch auf einen Zeitraum beziehen /MAX)
	if(val == 'PLUS') {
		if(!aktuelleLogEintragungen[key]) aktuelleLogEintragungen[key] = 0;
		aktuelleLogEintragungen[key]++;
		return;
	}
	aktuelleLogEintragungen[key] = val;
}
// VOID
function schreibeLog() {
	for(key in aktuelleLogEintragungen) {
		$('#' + key).html(aktuelleLogEintragungen[key]);
	}
}
// OBJ
function gibLog(key) {
	return aktuelleLogEintragungen[key];
}