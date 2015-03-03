"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPoker.prototype = new CasinoCroupier();
function CasinoCroupierTexasHoldEmLimitedPoker(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	
	this.spielerliste = [];
	
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
	// VOID
	this._bereiteSpielVor = function(optionen) {
		//TODO
	};
	// VOID
	this._spielePreflop = function() {
		this._spieleRunde('2♦ 2♦', ['C', 'A', 'B']);
	};
	// VOID
	this._spieleFlop = function() {
		this._spieleRunde('2♦ 2♦ - 2♦ 2♦ 2♦', ['A', 'B', 'C']);
	};
	// VOID
	this._spieleTurnCard = function() {
		this._spieleRunde('2♦ 2♦ - 2♦ 2♦ 2♦ 2♦', ['A', 'B', 'C']);
	};
	// VOID
	this._spieleRiver = function() {
		this._spieleRunde('2♦ 2♦ - 2♦ 2♦ 2♦ 2♦ 2♦', ['A', 'B', 'C']);
	};
	// VOID
	this._spieleRunde = function(frage, spieler) {
		for(var i = 0; i < spieler.length; i++) {
			ich.frageDenSpieler(spieler[i], frage, function(antwort) {});
		}
	};
	// VOID
	this._spieleShowdown = function() {
		this._spieleRunde(
			'Runde:Showdown,A:2♦ 2♦,B:2♦ 2♦,C:2♦ 2♦,Tisch:2♦ 2♦ 2♦ 2♦ 2♦,'
			+ 'Gewinner:A,B,C,Gewinnerblatt:2♦ 2♦ 2♦ 2♦ 2♦,'
			+ 'Einsatz:2,Pot:6,Gewinn:2',
			['A', 'B', 'C']
		);
	};
	// VOID
	this.spieleEinSpiel = function(doneFunc) {
		this.spielerliste = [];
		var self = this;
		this.zeigeSpielerDesTisches(function(liste) {
			for(var i = 0; i < liste.length; i++) {
				if(self.spielerliste.length + 1 == 24) break;
				
				self.spielerliste.push(liste[i]);
			}
			if(self.spielerliste.length < 3) {
				doneFunc(false);
				return;
			}
			
			self._spielePreflop();
			self._spieleFlop();
			self._spieleTurnCard();
			self._spieleRiver();
			self._spieleShowdown();
			doneFunc(true);
		});
	};
}
