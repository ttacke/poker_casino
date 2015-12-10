"use strict";

// CLASS DEFINITION
function CasinoPokerPlatzDesSpielers(name, stack) {
	this._name = name;
	this._daten = {};
	this._stack = 0;
	
	// VOID
	this.setzeLetzteAktion = function(aktion) {
		this._daten['letzteAktion'] = aktion;
	};
	// VOID
	this.resetDerDaten = function() {
		this._daten = {
			'Hand': [],
			'Tisch': [],
			'LetzteAktion': '-',
			'Einsatz': 0,
		};
	}
	// STRING
	this.gibName = function() {
		return this._name;
	}
	// INT
	this.gibStack = function() {
		return this._stack;
	};
	// VOID
	this.verringereStack = function(wert) {
		this._stack -= wert;
	};
	// VOID
	this.erhoeheStack = function(wert) {
		this._stack += wert;
	};
	// VOID
	this.merkeDirHandkarte = function(karte) {
		this._daten['Hand'].push(karte);
	};
	// ARRAY
	this.gibHandkarten = function() {
		return this._daten['Hand'];
	};
	// VOID
	this.merkeDirTischkarte = function(karte) {
		this._daten['Tisch'].push(karte);
	};
	// ARRAY
	this.gibTischkarten = function() {
		return this._daten['Tisch'];
	};
	// STRING
	this.gibLetzteAktion = function() {
		return this._daten['letzteAktion'];
	}
	// STRING
	this.gibEinsatz = function() {
		return this._daten['Einsatz'];
	}
	// STRING
	this.erhoeheEinsatz = function(erhoehung) {
		this._daten['Einsatz'] = this._daten['Einsatz'] + erhoehung;
	}
	// STRING
	this.gibHandkarten = function() {
		return this._daten['Hand'];
	}
}

// CLASS DEFINITION
function CasinoPokerSpielerrunde(minimaleSpieleranzahl, maximaleSpieleranzahl) {
	this.spielerListe = [];
	this.pointer = 0;
	this.geberTokenPointer = -1;
	this.maximaleSpieleranzahl = maximaleSpieleranzahl;
	this.minimaleSpieleranzahl = minimaleSpieleranzahl;
	this._pot = 0;
	
	// INT
	this.gibPot = function() {
		return this._pot;
	};
	
	// VOID
	this.starteWiederAbGeberToken = function() {
		this.pointer = this.geberTokenPointer;
	};
	// BOOLEAN
	this.starteNeuesSpielUndSchiebeGeberTokenWeiter = function() {
		this._pot = 0;
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
	// VOID
	this.erhoeheEinsatzAuf = function(spieler, geforderterEinsatz) {
		var einsatzVeraenderung = geforderterEinsatz - spieler.gibEinsatz();
		spieler.erhoeheEinsatz(einsatzVeraenderung);
		spieler.verringereStack(einsatzVeraenderung);
		this._pot += einsatzVeraenderung;
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
