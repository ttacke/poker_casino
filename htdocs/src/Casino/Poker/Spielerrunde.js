"use strict";

// CLASS DEFINITION
function CasinoPokerPlatzDesSpielers(name, stack) {
	this.name = name;
	this.daten = {};
	this.stack = 0;
	
	// VOID
	this.setzeLetzteAktion = function(aktion) {
		this.daten['letzteAktion'] = aktion;
	};
	// VOID
	this.resetDerDaten = function() {
		this.daten = {
			'Hand': [],
			'Tisch': [],
			'LetzteAktion': '-',
			'Einsatz': '0',
		};
	}
	// VOID
	this.merkeDirHandkarte = function(karte) {
		this.daten['Hand'].push(karte);
	};
	// VOID
	this.merkeDirTischkarte = function(karte) {
		this.daten['Tisch'].push(karte);
	};
}

// CLASS DEFINITION
function CasinoPokerSpielerrunde(minimaleSpieleranzahl, maximaleSpieleranzahl) {
	this.spielerListe = [];
	this.pointer = 0;
	this.geberTokenPointer = -1;
	this.maximaleSpieleranzahl = maximaleSpieleranzahl;
	this.minimaleSpieleranzahl = minimaleSpieleranzahl;
	this.pot = 0;
	
	// VOID
	this.starteWiederAbGeberToken = function() {
		this.pointer = this.geberTokenPointer;
	};
	// BOOLEAN
	this.starteNeuesSpielUndSchiebeGeberTokenWeiter = function() {
		this.pot = 0;
		if(this.spielerListe.length < this.minimaleSpieleranzahl) {
			return false;
		}
		
		for(var i = 0; i < this.spielerListe.length; i++) {
			this.spielerListe[i].resetDerDaten();
		}
		
		if(this.geberTokenPointer + 1 >= this.spielerListe.length) {
			this.geberTokenPointer = 0;
		} else {
			this.geberTokenPointer++;
		}
		this.starteWiederAbGeberToken();
		return true;
	};
	// OBJ
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
	this.nimmSpielerAufWennNeu = function(spielerName) {
		var spieler = new CasinoPokerPlatzDesSpielers(spielerName, 0);
		if(this.spielerListe.length + 1 > this.maximaleSpieleranzahl) return false;
		
		for(var i = 0; i < this.spielerListe.length; i++) {
			if(this.spielerListe[i].name == spielerName) return true;
		}
		this.spielerListe.push(
			spieler
		);
		
		return true;
	};
	// ARRAY(OBJ)
	this.gibAlleSpieler = function() {
		return this.spielerListe;
	};
	// INT
	this.anzahlDerSpieler = function() {
		return this.spielerListe.length;
	};
	
}
