"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPoker.prototype = new CasinoCroupier();
function CasinoCroupierTexasHoldEmLimitedPoker(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	var minSpielerAnzahl = 3;
	var maxSpielerAnzahl = 23;
	this.pot = 0;
	this.stack = {};
	this.gewinnErmittler = new CasinoPokerGewinnermittlung();
	
	this.spielerrunde = new CasinoPokerSpielerrunde(
		minSpielerAnzahl, maxSpielerAnzahl
	);
	
	// OBJ
	this._gibSpielerdaten = function(name) {
		var liste = this.spielerrunde.gibAlleSpieler();
		for(var i = 0; i < liste.length; i++) {
			if(liste[i].name == name) {
				return liste[i].daten;
			}
		}
	};
	// ARRAY
	this._parseKarten = function(string) {
		var stapel = [];
		var liste = string.split(" ");
		for(var i = 0; i < liste.length; i++) {
			if(liste[i].length < 2) continue;
			
			var kartenDaten = liste[i].split("");
			if(kartenDaten.length == 3) {
				kartenDaten[0] += kartenDaten[1];
				kartenDaten[1] = kartenDaten[2];
			}
			stapel.push(new CasinoPokerSpielkarte(kartenDaten[0], kartenDaten[1]));
		}
		return stapel;
	};
	// BOOLEAN
	this._bereiteNeuesSpielVor = function() {
		if(!this.spielerrunde.starteNeuesSpielUndSchiebeGeberTokenWeiter()) {
			return false;
		}
		
		this.pot = 0;
		var alle_spieler = this.spielerrunde.gibAlleSpieler();
		for(var i = 0; i < alle_spieler.length; i++) {
			alle_spieler[i].daten = {
				'Hand': [],
				'Tisch': [],
				'LetzteAktion': '-',
				'Einsatz': '0',
			};
		}
		return true;
	};
	// VOID
	this._gibHandkartenAnAlleSpieler = function(anzahl, kartenstapel) {
		var alle_spieler = this.spielerrunde.gibListeDerNamen();
		for(var i = 0; i < alle_spieler.length; i++) {
			var daten = this._gibSpielerdaten(alle_spieler[i]);
			for(var ii = 0; ii < anzahl; ii++) {
				daten['Hand'].push(kartenstapel.pop().toString());
			}
		}
		return;
	};
	// VOID
	this._gibTischkartenAnAlleSpieler = function(anzahl, kartenstapel) {
		var tischkarten = [];
		for(var i = 0; i < anzahl; i++) {
			tischkarten.push(kartenstapel.pop().toString());
		}
		
		var alle_spieler = this.spielerrunde.gibListeDerNamen();
		for(var i = 0; i < alle_spieler.length; i++) {
			var daten = this._gibSpielerdaten(alle_spieler[i]);
			for(var ii = 0; ii < tischkarten.length; ii++) {
				daten['Tisch'].push(tischkarten[ii]);
			}
		}
		return;
	};
	// VOID
	this._spielePreflop = function(kartenstapel, naechsteRunde) {
		var preflop = new CasinoCroupierTexasHoldEmLimitedPokerPreFlop(this, 1);
		preflop.vorbereiten(this.spielerrunde, kartenstapel);
		preflop.wetten(this.spielerrunde, kartenstapel, naechsteRunde);
	};
	// VOID
	this._spieleFlop = function(kartenstapel, naechsteRunde) {
		var flop = new CasinoCroupierTexasHoldEmLimitedPokerFlop(this, 1);
		flop.vorbereiten(this.spielerrunde, kartenstapel);
		flop.wetten(this.spielerrunde, kartenstapel, naechsteRunde);
	};
	// VOID
	this._spieleTurnCard = function(kartenstapel, naechsteRunde) {
		var turnCard = new CasinoCroupierTexasHoldEmLimitedPokerTurnCard(this, 1);
		turnCard.vorbereiten(this.spielerrunde, kartenstapel);
		turnCard.wetten(this.spielerrunde, kartenstapel, naechsteRunde);
	};
	// VOID
	this._spieleRiver = function(kartenstapel, naechsteRunde) {
		var riverCard = new CasinoCroupierTexasHoldEmLimitedPokerRiverCard(this, 1);
		riverCard.vorbereiten(this.spielerrunde, kartenstapel);
		riverCard.wetten(this.spielerrunde, kartenstapel, naechsteRunde);
	};
	// VOID
	this._speichereLetzteAktion = function(spieler, aktion) {
		var daten = this._gibSpielerdaten(spieler);
		daten['letzteAktion'] = aktion;
		return;
	};
	// ARRAY
	this._ermittleGewinner = function() {
		var alle = [];
		var alle_spieler = this.spielerrunde.gibListeDerNamen();
		var maximalePunkte = 0;
		for(var i = 0; i < alle_spieler.length; i++) {
			var daten = this._gibSpielerdaten(alle_spieler[i]);
			var bestesBlatt = this.gewinnErmittler.gibBestesBlatt(
				this._parseKarten(daten['Hand'].join(' ')),
				this._parseKarten(daten['Tisch'].join(' '))
			);
			var punkte = this.gewinnErmittler.gibPunkte(bestesBlatt);
			if(maximalePunkte < punkte) maximalePunkte = punkte;
			
			var blatt = [];
			for(var ii = 0; ii < bestesBlatt.length; ii++) {
				blatt.push(bestesBlatt[ii].toString());
			}
			alle.push({
				'spieler': alle_spieler[i],
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
	// VOID
	this._spieleShowdown = function(doneFunc) {
		var showdown = new CasinoCroupierTexasHoldEmLimitedPokerShowdown(this, 1);
		var kartenstapel = null;
		showdown.vorbereiten(this.spielerrunde, kartenstapel);
		showdown.wetten(this.spielerrunde, kartenstapel, doneFunc);
		showdown.abschluss(this.spielerrunde, doneFunc);
	};
	// VOID
	this.nimmMitspielerAuf = function(doneFunc) {
		var self = this;
		this.zeigeSpielerDesTisches(function(liste) {
			for(var i = 0; i < liste.length; i++) {
				self.spielerrunde.nimmSpielerAufWennNeu(liste[i]);
				if(self.stack[liste[i]] == null) {
					self.stack[liste[i]] = 0;
				}
			}
			doneFunc();
		});
	};
	// STRING
	this._erstelleKartenstapelString = function() {
		var farben = "♦ ♥ ♠ ♣".split(" ");
		var werte = "2x 3x 4x 5x 6x 7x 8x 9x 10x Jx Qx Kx Ax";
		var alle = [];
		for(var i = 0; i < farben.length; i++) {
			alle.push(werte.replace(/x/g, farben[i]));
		}
		return alle.join(" ");
	};
	// ARRAY
	this._erstelleKartenstapel = function() {
		return this._parseKarten(this._erstelleKartenstapelString());
	};
	// ARRAY
	this._mischeStapel = function(array) {
		var currentIndex = array.length;
		var temporaryValue;
		var randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	};
	// VOID
	this.spieleEinSpiel = function(doneFunc) {
		if(!this._bereiteNeuesSpielVor()) {
			doneFunc(false);
			return;
		}
		
		var kartenstapel = this._erstelleKartenstapel();
		kartenstapel = this._mischeStapel(kartenstapel);
		
		var self = this;
		this._spielePreflop(kartenstapel, function() {
			self._spieleFlop(kartenstapel, function() {
				self._spieleTurnCard(kartenstapel, function() {
					self._spieleRiver(kartenstapel, function() {
						self._spieleShowdown(doneFunc)
					})
				})
			})
		});
	};
}
 