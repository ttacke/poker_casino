"use strict";

// CLASS DEFINITION
function CasinoPokerSpielaufzeichnung() {
	
	this.spielzuege = [];
	// VOID
	this.fuegeSpielzugEin = function(spielerName, frage, antwort) {
		this.spielzuege.push({
			spieler: spielerName,
			frage: frage,
			antwort: antwort
		});
	};
}
