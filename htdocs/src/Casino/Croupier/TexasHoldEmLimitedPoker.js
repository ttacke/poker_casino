"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPoker.prototype = new CasinoCroupier();
function CasinoCroupierTexasHoldEmLimitedPoker(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	
	this.spielerrunde = new CasinoPokerSpielerrunde(3, 23);
	
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
	this._spielePreflop = function() {
		this.spielerrunde.gibDenSpielerDerAnDerReiheIst();
		this.spielerrunde.gibDenSpielerDerAnDerReiheIst();
		this._spieleRunde('2♦ 2♦');
		this.spielerrunde.gibDenSpielerDerAnDerReiheIst();
	};
	// VOID
	this._spieleFlop = function() {
		this._spieleRunde('2♦ 2♦ - 2♦ 2♦ 2♦');
	};
	// VOID
	this._spieleTurnCard = function() {
		this._spieleRunde('2♦ 2♦ - 2♦ 2♦ 2♦ 2♦');
	};
	// VOID
	this._spieleRiver = function() {
		this._spieleRunde('2♦ 2♦ - 2♦ 2♦ 2♦ 2♦ 2♦');
	};
	// VOID
	this._spieleRunde = function(frage) {
		for(var i = 0; i < this.spielerrunde.anzahlDerSpieler(); i++) {
			ich.frageDenSpieler(this.spielerrunde.gibDenSpielerDerAnDerReiheIst(), frage, function(antwort) {});
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
	this.nimmMitspielerAuf = function(doneFunc) {
		var self = this;
		this.zeigeSpielerDesTisches(function(liste) {
			for(var i = 0; i < liste.length; i++) {
				self.spielerrunde.nimmSpielerAufWennNeu(liste[i]);
			}
			doneFunc();
		});
	};
	// VOID
	this.spieleEinSpiel = function(doneFunc) {
		var self = this;
		
		if(self.spielerrunde.anzahlDerSpieler() < 3) {
			doneFunc(false);
			return;
		}
		self._spielePreflop();
		self._spieleFlop();
		self._spieleTurnCard();
		self._spieleRiver();
		self._spieleShowdown();
		
		self.spielerrunde.starteNeuesSpielUndSchiebeGeberTokenWeiter();
		doneFunc(true);
	};
}
