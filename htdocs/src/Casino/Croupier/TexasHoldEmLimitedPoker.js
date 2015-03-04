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
		this._spieleRunde({
			'Hand': ['2♦','2♦'],
			'Tisch': [],
			'Pot': '6',
			'Spieler': [
				{'Name':'A','letzteAktion':'check','Stack':'-2'},
				{'Name':'B','letzteAktion':'check','Stack':'-2'},
				{'Name':'C','letzteAktion':'check','Stack':'-2'}
			]
		});
		this.spielerrunde.gibDenSpielerDerAnDerReiheIst();
	};
	// VOID
	this._spieleFlop = function() {
		this._spieleRunde({'Hand': ['2♦','2♦'],
			'Tisch': ['2♦','2♦','2♦'],
			'Pot': '6',
			'Spieler': [
				{'Name':'A','letzteAktion':'check','Stack':'-2'},
				{'Name':'B','letzteAktion':'check','Stack':'-2'},
				{'Name':'C','letzteAktion':'check','Stack':'-2'}
			]
		});
	};
	// VOID
	this._spieleTurnCard = function() {
		this._spieleRunde({'Hand': ['2♦','2♦'],
			'Tisch': ['2♦','2♦','2♦','2♦'],
			'Pot': '6',
			'Spieler': [
				{'Name':'A','letzteAktion':'check','Stack':'-2'},
				{'Name':'B','letzteAktion':'check','Stack':'-2'},
				{'Name':'C','letzteAktion':'check','Stack':'-2'}
			]
		});
	};
	// VOID
	this._spieleRiver = function() {
		this._spieleRunde({'Hand': ['2♦','2♦'],
			'Tisch': ['2♦','2♦','2♦','2♦','2♦'],
			'Pot': '6',
			'Spieler': [
				{'Name':'A','letzteAktion':'check','Stack':'-2'},
				{'Name':'B','letzteAktion':'check','Stack':'-2'},
				{'Name':'C','letzteAktion':'check','Stack':'-2'}
			]
		});
	};
	// VOID
	this._spieleRunde = function(frage) {
		for(var i = 0; i < this.spielerrunde.anzahlDerSpieler(); i++) {
			ich.frageDenSpieler(this.spielerrunde.gibDenSpielerDerAnDerReiheIst(), frage, function(antwort) {});
		}
	};
	// VOID
	this._spieleShowdown = function() {
		this._spieleRunde({
			'Tisch': ['2♦','2♦','2♦','2♦','2♦'],
			'Pot': '6',
			'Gewinner':[
				{'Name':'A','Gewinn':'2','Blatt':['2♦','2♦','2♦','2♦','2♦']},
				{'Name':'B','Gewinn':'2','Blatt':['2♦','2♦','2♦','2♦','2♦']},
				{'Name':'C','Gewinn':'2','Blatt':['2♦','2♦','2♦','2♦','2♦']}
			],
			'Spieler': [
				{'Name':'A','letzteAktion':'check','Stack':'-2','Hand':['2♦','2♦']},
				{'Name':'B','letzteAktion':'check','Stack':'-2','Hand':['2♦','2♦']},
				{'Name':'C','letzteAktion':'check','Stack':'-2','Hand':['2♦','2♦']}
			]
		});
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
