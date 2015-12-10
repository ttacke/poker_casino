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
			datenAllerSpieler.push({
				'Name': alle_spieler[i].gibName(),
				'letzteAktion': alle_spieler[i].gibLetzteAktion(),
				'Stack': alle_spieler[i].gibStack() + '',
				'Einsatz': alle_spieler[i].gibEinsatz() + '',
				'Hand': alle_spieler[i].gibHandkarten()
			});
		}
		
		var pot = spielerrunde.pot;
		var gewinner = this._ermittleGewinner(spielerrunde);
		var gewinn = Math.floor(pot / gewinner.length);
		var gewinnerDaten = [];
		for(var i = 0; i < gewinner.length; i++) {
			for(var ii = 0; ii < alle_spieler.length; ii++) {
				if(alle_spieler[ii].gibName() == gewinner[i].spieler) {
					alle_spieler[ii].erhoeheStack(gewinn);
				}
			}
			gewinnerDaten.push({
				'Name': gewinner[i].spieler,
				'Gewinn': gewinn + '',
				'Blatt': gewinner[i].bestesBlatt
			});
		}
		
		spielerrunde.pot = 0;//TODO ???
		
		var daten = {
			'Tisch': ['2♦','2♦','2♦','2♦','2♦'],//TODO implementieren!
			'Pot': pot + '',
			'Gewinner':gewinnerDaten,
			'Spieler': datenAllerSpieler
		};
		
		this._frageAlleSpieler(
			alle_spieler,
			daten,
			doneFunc
		);
	};
	// ARRAY
	this._ermittleGewinner = function(spielerrunde) {
		var gewinnErmittler = new CasinoPokerGewinnermittlung();
		
		var alle = [];
		var alle_spieler = spielerrunde.gibAlleSpieler();
		var maximalePunkte = 0;
		for(var i = 0; i < alle_spieler.length; i++) {
			var bestesBlatt = gewinnErmittler.gibBestesBlatt(
				this.croupier._parseKarten(alle_spieler[i].gibHandkarten().join(' ')),
				this.croupier._parseKarten(alle_spieler[i].gibTischkarten().join(' '))
			);
			var punkte = gewinnErmittler.gibPunkte(bestesBlatt);
			if(maximalePunkte < punkte) maximalePunkte = punkte;
			
			var blatt = [];
			for(var ii = 0; ii < bestesBlatt.length; ii++) {
				blatt.push(bestesBlatt[ii].toString());
			}
			alle.push({
				'spieler': alle_spieler[i].gibName(),
				'punkte': punkte,
				'bestesBlatt': blatt
			});
		}
		var gewinner = [];
		for(var i = 0; i < alle.length; i++) {
			if(alle[i].punkte == maximalePunkte) {
				gewinner.push(alle[i]);
			}
		}
		return gewinner;
	};
}
