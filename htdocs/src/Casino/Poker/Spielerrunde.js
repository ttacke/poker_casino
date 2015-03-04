"use strict";

// CLASS DEFINITION
function CasinoPokerSpielerrunde(minimaleSpieleranzahl, maximaleSpieleranzahl) {
	this.spielerListe = [];
	this.pointer = 0;
	this.geberTokenPointer = 0;
	this.maximaleSpieleranzahl = maximaleSpieleranzahl;
	this.minimaleSpieleranzahl = minimaleSpieleranzahl;
	
	// VOID
	this.starteNeuesSpielUndSchiebeGeberTokenWeiter = function() {
		if(this.geberTokenPointer + 1 >= this.spielerListe.length) {
			this.geberTokenPointer = 0;
		} else {
			this.geberTokenPointer++;
		}
		this.pointer = this.geberTokenPointer;
	};
	// STRING
	this.gibDenSpielerDerAnDerReiheIst = function() {
		var spieler = this.spielerListe[this.pointer];
		if(this.pointer + 1 >= this.spielerListe.length) {
			this.pointer = 0;
		} else {
			this.pointer++;
		}
		return spieler;
	};
	// BOOLEAN
	this.nimmSpielerAufWennNeu = function(spieler) {
		if(this.spielerListe.length + 1 > this.maximaleSpieleranzahl) return false;
		
		for(var i = 0; i < this.spielerListe.length; i++) {
			if(this.spielerListe[i] == spieler) return true;
		}
		this.spielerListe.push(spieler);
		
		return true;
	};
	// INT
	this.anzahlDerSpieler = function() {
		return this.spielerListe.length;
	};
}
