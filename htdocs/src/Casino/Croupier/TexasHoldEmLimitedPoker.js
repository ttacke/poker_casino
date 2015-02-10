"use strict";

function Spielkarte(wert, farbe) {
	this.wert = wert;
	this.farbe = farbe;
	this.punkte = function() {
		if(this.wert == 'A') return 14;
		if(this.wert == 'K') return 13;
		if(this.wert == 'Q') return 12;
		if(this.wert == 'J') return 11;
		return this.wert * 1;
	}
}
// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPoker.prototype = new CasinoCroupier();
function CasinoCroupierTexasHoldEmLimitedPoker(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	
	// BOOLEAN
	this.blattAschlaegtB = function(a, b) {
		var A = this.parseKarten(a);
		var B = this.parseKarten(b);
		
		if(this._einPaarAschlaegtB(A, B)) return true;
		if(this._highCardAschlaegtB(A, B)) return true;
		return false;
	};
	
	
	
	this._einPaarAschlaegtB = function(a, b) {
		var punkteA = this._gibEinPaarPunkte(a);
		var punkteB = this._gibEinPaarPunkte(b);
		if(punkteA > punkteB) return true;
		return false;
	};
	this._gibEinPaarPunkte = function(blatt) {
		var liste = [];
		for(var i = 0; i < blatt.length; i++) {
			liste.push(blatt[i].punkte());
		}
		liste = liste.sort(function(a, b) { return b - a; });
		var letztePunkte = 0;
		for(var i = 0; i < liste.length; i++) {
			if(letztePunkte == liste[i]) {
				return liste[i];
			}
			letztePunkte = liste[i];
		}
		return 0;
	};
	
	
	
	this._highCardAschlaegtB = function(a, b) {
		var highCardA = this._gibAlleHighCardPunkte(a);
		var highCardB = this._gibAlleHighCardPunkte(b);
		while(highCardA.length > 0) {
			var punkteA = highCardA.shift();
			var punkteB = highCardB.shift();
			if(punkteA > punkteB) return true;
			if(punkteA < punkteB) return false;
		}
		return false;
	}
	// ARRAY
	this._gibAlleHighCardPunkte = function(blatt) {
		var liste = [];
		for(var i = 0; i < blatt.length; i++) {
			liste.push(blatt[i].punkte());
		}
		liste = liste.sort(function(a, b) { return b - a; });
		return liste;
	};
	
	
	
	// ARRAY
	this.parseKarten = function(string) {
		var stapel = [];
		var liste = string.split(" ");
		for(var i = 0; i < liste.length; i++) {
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
