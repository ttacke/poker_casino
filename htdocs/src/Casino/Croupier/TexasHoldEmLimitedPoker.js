"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPoker.prototype = new CasinoCroupier();
function CasinoCroupierTexasHoldEmLimitedPoker(name, passwort) {
	var minSpielerAnzahl = 3;
	var maxSpielerAnzahl = 23;
	
	this.name = name;
	this.passwort = passwort;
	
	this.spielerrunde = new CasinoPokerSpielerrunde(
		minSpielerAnzahl, maxSpielerAnzahl
	);
	
	this.wettrunden = [];
	
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
		this.wettrunden = [
			new CasinoCroupierTexasHoldEmLimitedPokerPreFlop(this, 1),
			new CasinoCroupierTexasHoldEmLimitedPokerFlop(this, 1),
			new CasinoCroupierTexasHoldEmLimitedPokerTurnCard(this, 1),
			new CasinoCroupierTexasHoldEmLimitedPokerRiverCard(this, 1),
			new CasinoCroupierTexasHoldEmLimitedPokerShowdown(this, 1),
		];
		return this.spielerrunde.starteNeuesSpielUndSchiebeGeberTokenWeiter();
	};
	// VOID
	this._spieleAlleWettrunden = function(kartenstapel, doneFunc) {
		if(!this.wettrunden.length) {
			doneFunc(true);
			return;
		}
		
		var wettrunde = this.wettrunden.shift();
		wettrunde.vorbereiten(this.spielerrunde, kartenstapel);
		var self = this;
		wettrunde.spielen(
			this.spielerrunde,
			kartenstapel,
			function() {
				self._spieleAlleWettrunden(kartenstapel, doneFunc)
			}
		);
	};
	
	
	// VOID TODO
	this._spieleAlleWettrundenNEW = function(kartenstapel, doneFunc) {
		if(!this.wettrunden.length) {
			doneFunc(true);
			return;
		}
		
		var wettrunde = this.wettrunden.shift();
		wettrunde.vorbereiten(this.spielerrunde, kartenstapel);
		var self = this;
		wettrunde.spielenNEW(
			this.spielerrunde,
			kartenstapel,
			function() {
				self._spieleAlleWettrundenNEW(kartenstapel, doneFunc)
			}
		);
	};
	
	// VOID
	this.gibHandkartenAnAlleSpieler = function(anzahl, kartenstapel) {
		var alle_spieler = this.spielerrunde.gibAlleSpieler();
		for(var i = 0; i < alle_spieler.length; i++) {
			for(var ii = 0; ii < anzahl; ii++) {
				alle_spieler[i].merkeDirHandkarte(kartenstapel.pop().toString());
			}
		}
		return;
	};
	// VOID
	this.gibTischkartenAnAlleSpieler = function(anzahl, kartenstapel) {
		var tischkarten = [];
		for(var i = 0; i < anzahl; i++) {
			tischkarten.push(kartenstapel.pop().toString());
		}
		
		var alle_spieler = this.spielerrunde.gibAlleSpieler();
		for(var i = 0; i < alle_spieler.length; i++) {
			for(var ii = 0; ii < tischkarten.length; ii++) {
				alle_spieler[i].merkeDirTischkarte(tischkarten[ii]);
			}
		}
		return;
	};
	// VOID
	this.spieleEinSpiel = function(doneFunc) {
		if(!this._bereiteNeuesSpielVor()) {
			doneFunc(false);
			return;
		}
		
		var kartenstapel = this._erstelleKartenstapel();
		kartenstapel = this._mischeStapel(kartenstapel);
		
		this._spieleAlleWettrunden(kartenstapel, doneFunc)
	};
	// VOID
	this.nimmMitspielerAuf = function(doneFunc) {
		var self = this;
		this.zeigeSpielerDesTisches(function(liste) {
			for(var i = 0; i < liste.length; i++) {
				self.spielerrunde.nimmSpielerAufWennNeu(liste[i]);
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
}
 