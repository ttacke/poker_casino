"use strict";

function Spielkarte(bezeichnung, farbe) {
	this._berechne_zahlwert = function(bezeichnung) {
		if(this.bezeichnung == 'A') return 14;
		if(this.bezeichnung == 'K') return 13;
		if(this.bezeichnung == 'Q') return 12;
		if(this.bezeichnung == 'J') return 11;
		return this.bezeichnung * 1;
	};
	this.bezeichnung = bezeichnung;
	this.farbe = farbe;
	this.zahlwert = this._berechne_zahlwert(bezeichnung);
}
// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPoker.prototype = new CasinoCroupier();
function CasinoCroupierTexasHoldEmLimitedPoker(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	
	// ARRAY
	this.parseKarten = function(string) {
		var stapel = [];
		var liste = string.split(" ");
		for(var i = 0; i < liste.length; i++) {
			if(liste[i].length < 2) continue;
			
			var kartenDaten = liste[i].split("");
			if(kartenDaten.length == 3) {
				kartenDaten[0] += kartenDaten[1];
				kartenDaten[1] = kartenDaten[2];
			}
			stapel.push(new Spielkarte(kartenDaten[0], kartenDaten[1]));
		}
		return stapel;
	};
}
