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
	this.bezeichnung = bezeichnung;
	this.farbe = farbe;
	this.zahlwert = this._berechne_zahlwert(bezeichnung);
}
