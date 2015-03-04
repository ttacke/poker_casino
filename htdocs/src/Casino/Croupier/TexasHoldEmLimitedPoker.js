"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPoker.prototype = new CasinoCroupier();
function CasinoCroupierTexasHoldEmLimitedPoker(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	
	this.spielerliste = new CasinoCroupierTexasHoldEmLimitedPokerSpielerliste();
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
		this.spielerliste.getNext();
		this.spielerliste.getNext();
		this._spieleRunde('2♦ 2♦');
		this.spielerliste.getNext();
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
		for(var i = 0; i < this.spielerliste.length(); i++) {
			ich.frageDenSpieler(this.spielerliste.getNext(), frage, function(antwort) {});
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
		var self = this;
		
		this.zeigeSpielerDesTisches(function(liste) {
			for(var i = 0; i < liste.length; i++) {
				if(self.spielerliste.length() + 1 == 24) break;
				
				self.spielerliste.add(liste[i]);
			}
			if(self.spielerliste.length() < 3) {
				doneFunc(false);
				return;
			}
			self._spielePreflop();
			self._spieleFlop();
			self._spieleTurnCard();
			self._spieleRiver();
			self._spieleShowdown();
			
			self.spielerliste.gibGeberTokenWeiterUndStarteNeueRunde();
			doneFunc(true);
		});
	};
}
//TODO
function CasinoCroupierTexasHoldEmLimitedPokerSpielerliste() {
	this.list = [];
	this.pointer = 0;
	this.geberPointer = 0;
	// VOID
	this.gibGeberTokenWeiterUndStarteNeueRunde = function() {
		if(this.geberPointer + 1 >= this.list.length) {
			this.geberPointer = 0;
		} else {
			this.geberPointer++;
		}
		this.pointer = this.geberPointer;
	};
	// STRING
	this.getNext = function() {
		var spieler = this.list[this.pointer];
		if(this.pointer + 1 >= this.list.length) {
			this.pointer = 0;
		} else {
			this.pointer++;
		}
		return spieler;
	};
	// VOID
	this.add = function(spieler) {
		for(var i = 0; i < this.list.length; i++) {
			if(this.list[i] == spieler) return;
		}
		this.list.push(spieler);
	};
	// INT
	this.length = function() {
		return this.list.length;
	};
}