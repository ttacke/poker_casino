"use strict";

// CLASS DEFINITION
function PokerSpielaufzeichnungAbspielen() {
	this.doneFunc = null;
	this.spielzuege = [];
	// VOID
	this.starte = function(spielzuege, doneFunc) {
		this.spielzuege = spielzuege;
		this.doneFunc = doneFunc;
		
		//TODO hier weiter
		// -> jeden Spielzug als Schritt durchlaufen (1s)
		// -> am ende done melden
		// -> board leeren und karten dort anzeigen
		// -> spieler leeren und aktuelle spieler einsetzen
		// -> aktiven spieler markieren
		// -> aktion zeigen
		// -> wenn fold, spieler entsprechend markieren
		// -> handkarten zeigen
		// -> einsatz zeigen (muss aus nächstem Zug ermittelt werden - frage.Spieler.Einsatz )
		
		console.log(spielzuege);
		/*Relevante Daten
		
			#tisch .links
			#tisch .rechts
			
			#tisch .spieler.ist_an_der_reihe.ist_raus
				.name
				.hand
				.einsatz_inner
			
			#tisch .karte (.kreuz.karo.herz.pik) .karte_inner
			
			#tisch #board
			
			spieler = INT:Mitläufer
			antwort.details = check, fold, raise
			frage.Einsatz = 0
			frage.Hand = [ A+ A* ]
			frage.Rundenname = preflop
			frage.Tisch = [ K+ K* ... ]
			frage.Spieler[]
				Name = INT:Mitläufer
				Einsatz = 0
				
			// showdown
			frage.Gewinner[]
				Blatt = [ A* A+ K+ K* ]
				Gewinn = 38
				Name = INT:Mitläufer
		
		
		
		*/
	}
	
	

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
