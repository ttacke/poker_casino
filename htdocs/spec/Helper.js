// INT
function gibBlattPunkte(string) {
	var blatt = string.substr(string.indexOf(" ") + 1, string.length);
	var punkte = new CasinoPokerGewinnermittlung(
		ich._parseKarten(blatt)
	).gibPunkte();
	return punkte;
};
// VOID
function generateCardSpec(blattA, soll, blattB) {
	it(blattA + ' ' + soll + ' ' + blattB, function() {
		var punkteA = gibBlattPunkte(blattA);
		var punkteB = gibBlattPunkte(blattB);
		
		var ist = '?';
		if(punkteA > punkteB) ist = 'schlaegt';
		if(punkteA == punkteB) ist = 'splitted';
		if(punkteA < punkteB) ist = 'unterliegt';
		
		expect(blattA + " " + ist + " " + blattB)
			.toBe(blattA + " " + soll + " " + blattB);
	});
}
// VOID
function entferneSpielerVerbindungen(croupier) {
	croupier.zeigeSpielerDesTisches = function() {};
	croupier.frageDenSpieler = function() {};
}
// VOID
function erzeugeSpieler(name, croupier, spielerAntwortFunktion) {
	
	var bisherigeSpieler = [];
	croupier.zeigeSpielerDesTisches(function(liste) {
		bisherigeSpieler = liste;
	});
	bisherigeSpieler.push(name);
	croupier.zeigeSpielerDesTisches = function(antwortFunktion) {
		antwortFunktion(bisherigeSpieler);
	};
	
	var alteFunktion = croupier.frageDenSpieler;
	croupier.frageDenSpieler = function(spielerName, nachricht, antwortFunktion) {
		if(spielerName == name) {
			antwortFunktion(spielerAntwortFunktion(nachricht));
		}
		alteFunktion(spielerName, nachricht, antwortFunktion);
	};
}