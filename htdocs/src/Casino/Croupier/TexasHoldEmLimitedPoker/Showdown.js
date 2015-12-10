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
		var tischkarten = null;
		for(var i = 0; i < alle_spieler.length; i++) {
			datenAllerSpieler.push({
				'Name': alle_spieler[i].gibName(),
				'letzteAktion': alle_spieler[i].gibLetzteAktion(),
				'Stack': alle_spieler[i].gibStack() + '',
				'Einsatz': alle_spieler[i].gibEinsatz() + '',
				'Hand': this._clone(alle_spieler[i].gibHandkarten())
			});
			if(!tischkarten) {
				tischkarten = this._clone(alle_spieler[i].gibTischkarten())
			}
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
		
		var daten = {
			'Tisch': tischkarten,
			'Pot': pot + '',
			'Gewinner':gewinnerDaten,
			'Spieler': datenAllerSpieler
		};
		
		this._meldeAnAlleSpieler(
			alle_spieler,
			daten,
			doneFunc
		);
	};
	// VOID
	this._meldeAnAlleSpieler = function(liste_aller_spieler, daten, doneFunc) {
		if(!liste_aller_spieler.length) {
			doneFunc(true);
			return;
		}
		
		var neue_liste = [];
		for(var i = 0; i < liste_aller_spieler.length; i++) {
			neue_liste[i] = liste_aller_spieler[i];
		}
		var spieler = neue_liste.shift();
		
		var self = this;
		this.croupier.frageDenSpieler(
			spieler.gibName(),
			self._clone(daten),
			function() {
				setTimeout(function() {// Rekursion fuer FF aufbrechen
					self._meldeAnAlleSpieler(neue_liste, daten, doneFunc);
				}, 0);
			}
		);
		return;
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
