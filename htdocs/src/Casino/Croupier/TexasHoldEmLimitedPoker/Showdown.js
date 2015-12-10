"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPokerShowdown.prototype = new CasinoCroupierTexasHoldEmLimitedPokerSpielrunde();
function CasinoCroupierTexasHoldEmLimitedPokerShowdown(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		// DoNothing
	};
	// VOID
	this.wetten = function(spielerrunde, kartenstapel, naechsteRunde) {
		// DoNothing
	};
	this.abschluss = function(spielerrunde, doneFunc) {
		var datenAllerSpieler = [];
		var alle_spieler = spielerrunde.gibAlleSpieler();
		for(var i = 0; i < alle_spieler.length; i++) {
			var daten = alle_spieler[i].daten;
			datenAllerSpieler.push({
				'Name': alle_spieler[i].name,
				'letzteAktion': daten.letzteAktion,
				'Stack': this.croupier.stack[alle_spieler[i].name] + '',
				'Einsatz': daten.Einsatz,
				'Hand': daten.Hand
			});
		}
		
		var pot = this.croupier.pot;
		var gewinner = this.croupier._ermittleGewinner();
		var gewinn = Math.floor(pot / gewinner.length);
		var gewinnerDaten = [];
		for(var i = 0; i < gewinner.length; i++) {
			this.croupier.stack[gewinner[i].spieler] += gewinn;
			gewinnerDaten.push({
				'Name': gewinner[i].spieler,
				'Gewinn': gewinn + '',
				'Blatt': gewinner[i].bestesBlatt
			});
		}
		
		this.croupier.pot = 0;
		
		var daten = {
			'Tisch': ['2♦','2♦','2♦','2♦','2♦'],//TODO implementieren!
			'Pot': pot + '',
			'Gewinner':gewinnerDaten,
			'Spieler': datenAllerSpieler
		};
		
		var alle_spielernamen = spielerrunde.gibListeDerNamen();
		this._frageAlleSpieler(
			this._clone(alle_spielernamen),
			daten,
			doneFunc
		);
	};
}
