var listeAllerAbfragen = [];
var aktuelleLogEintragungen = {};

$(function() {
	setInterval('schreibeLog()', 1000);
});

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