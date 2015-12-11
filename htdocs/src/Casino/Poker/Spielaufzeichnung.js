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
	// ARRAY
	this.gibSpielerPunkte = function() {
		var showdown = this.spielzuege[this.spielzuege.length - 1];
		var liste = [];
		for(var i = 0; i < showdown.frage.Spieler.length; i++) {
			var spielerdaten = showdown.frage.Spieler[i];
			var istGewinner = false;
			for(var ii = 0; ii < showdown.frage.Gewinner.length; ii++) {
				if(showdown.frage.Gewinner[ii].Name == spielerdaten.Name) {
					istGewinner = true;
				}
			}
			
			liste.push({
				name: spielerdaten.Name,
				stack: spielerdaten.Stack,
				gewonnen: istGewinner,
			});
		}
		return liste;
	};
}
