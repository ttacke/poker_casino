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
function spielerKommunikationsWaechter() {
	this.spieler_liste = [];
	this.naechste_3_spieler = [];
	this.fragen_liste = [];
	this.naechste_3_fragen = [];
	
	// VOID
	this.reset = function() {
		this.spieler_liste = [];
		this.naechste_3_spieler = [];
		this.fragen_liste = [];
		this.naechste_3_fragen = [];
	}
	// VOID
	this.fragen_hook = function(spieler, frage) {
		this.spieler_liste.push(spieler);
		this.fragen_liste.push(frage);
	};
	// VOID
	this.aktuelleSpielerFragenSind = function(frage) {
		for(var i = 0; i < 3; i++) {
			expect(this.naechste_3_fragen[i]).toBe(frage);
		}
	}
	// VOID
	this.aktuelleSpielerFragenEnthalten = function(key, value) {
		for(var i = 0; i < 3; i++) {
			expect(this.naechste_3_fragen[i]).toContain(key + ':' + value);
		}
	}
	// BOOLEAN
	this.esGibtKeineNeuenAnfragen= function() {
		if(this.spieler_liste.length == 0) return true;
		
		return false;
	}
	// VOID
	this.holeDieNachsten3Anfragen = function() {
		this.naechste_3_spieler = [];
		this.naechste_3_fragen = [];
		for(var i = 0; i < 3; i++) {
			if(this.spieler_liste.length > 0) {
				this.naechste_3_spieler.push(this.spieler_liste.shift());
				this.naechste_3_fragen.push(this.fragen_liste.shift());
			}
		}
	}
	// VOID
	this.pruefeAktuelleSpielerAufrufe = function(a, b, c) {
		var list = [a, b, c];
		for(var i = 0; i < 3; i++) {
			expect(this.naechste_3_spieler[i]).toBe(list[i]);
		}
	}
}