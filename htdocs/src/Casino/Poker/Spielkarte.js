"use strict";

// CLASS DEFINITION
function CasinoPokerSpielkarte(bezeichnung, farbe) {
	this._berechne_zahlwert = function(bezeichnung) {
		if(this.bezeichnung == 'A') return 14;
		if(this.bezeichnung == 'K') return 13;
		if(this.bezeichnung == 'Q') return 12;
		if(this.bezeichnung == 'J') return 11;
		return this.bezeichnung * 1;
	};
	// INT
	this._berechne_farbwert = function(farbe) {
		if(farbe == '♦') return 1;
		if(farbe == '♥') return 2;
		if(farbe == '♠') return 3;
		if(farbe == '♣') return 4;
	}
	this.bezeichnung = bezeichnung;
	this.farbe = farbe;
	this.zahlwert = this._berechne_zahlwert(bezeichnung);
	this.farbwert = this._berechne_farbwert(farbe);
	// STRING
	this.toString = function() {
		return this.bezeichnung + this.farbe;
	};
}
