"use strict";

// CLASS DEFINITION
function CasinoPokerSpielerplatz(name, stack) {
	this.name = name;
	this.stack = stack;
}

// CLASS DEFINITION
function CasinoPokerSpielerrunde(minimaleSpieleranzahl, maximaleSpieleranzahl) {
	this.spielerListe = [];
	this.pointer = 0;
	this.geberTokenPointer = -1;
	this.maximaleSpieleranzahl = maximaleSpieleranzahl;
	this.minimaleSpieleranzahl = minimaleSpieleranzahl;
	
	// VOID
	this.starteWiederAbGeberToken = function() {
		this.pointer = this.geberTokenPointer;
	};
	// BOOLEAN
	this.starteNeuesSpielUndSchiebeGeberTokenWeiter = function() {
		if(this.spielerListe.length < this.minimaleSpieleranzahl) {
			return false;
		}
		if(this.geberTokenPointer + 1 >= this.spielerListe.length) {
			this.geberTokenPointer = 0;
		} else {
			this.geberTokenPointer++;
		}
		this.starteWiederAbGeberToken();
		return true;
	};
	// STRING
	this.gibDenSpielerDerAnDerReiheIst = function() {
		var spieler = this.spielerListe[this.pointer];
		if(this.pointer + 1 >= this.spielerListe.length) {
			this.pointer = 0;
		} else {
			this.pointer++;
		}
		return spieler.name;
	};
	// BOOLEAN
	this.nimmSpielerAufWennNeu = function(spielerName) {
		var spieler = new CasinoPokerSpielerplatz(spielerName, 0);
		if(this.spielerListe.length + 1 > this.maximaleSpieleranzahl) return false;
		
		for(var i = 0; i < this.spielerListe.length; i++) {
			if(this.spielerListe[i].name == spielerName) return true;
		}
		this.spielerListe.push(
			spieler
		);
		
		return true;
	};
	// ARRAY
	this.gibListe = function() {
		//TODO
		var namensListe = [];
		for(var i = 0; i < this.spielerListe.length; i++) {
			namensListe.push(this.spielerListe[i].name);
		}
		return namensListe;
	};
	
	// INT
	this.anzahlDerSpieler = function() {
		return this.spielerListe.length;
	};
	
}
