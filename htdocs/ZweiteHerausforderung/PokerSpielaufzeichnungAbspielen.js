"use strict";

// CLASS DEFINITION
function PokerSpielaufzeichnungAbspielen() {
	this.doneFunc = null;
	this.spielzuege = [];
	// VOID
	this.starte = function(spielzuege, doneFunc) {
		this.spielzuege = spielzuege;
		this.doneFunc = doneFunc;
		console.log(spielzuege);
	}
	
	//TODO hier weiter

/*	this.spielzuege = [];
	// VOID
	this.fuegeSpielzugEin = function(spielerName, frage, antwort) {
		this.spielzuege.push({
			spieler: spielerName,
			frage: frage,
			antwort: antwort
		});
	};
	// VOID
	this.gibNaechstenSpielzug = function() {
		return this.spielzuege.shift();
	}
	// ARRAY
	this.gibSpielerPunkte = function() {
		var timeouts = {};
		for(var i = 0; i < this.spielzuege.length; i++) {
			if(this.spielzuege[i].antwort.status == 'timeout') {
				timeouts[this.spielzuege[i].spieler] = true;
			}
		}
		
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
				hatGewonnen: istGewinner,
				hatTimeout: (timeouts[spielerdaten.Name] ? true : false),
			});
		}
		return liste;
	};
	
*/
}
