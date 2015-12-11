"use strict";

// CLASS DEFINITION
function CasinoPokerPlatzDesSpielers(name, stack) {
	this._name = name;
	this._daten = {};
	this._stack = 0;
	this._letzterGewinn = 0;
	this._fold_gegeben = false;
	this._anzahl_der_raises = 0;
	
	// VOID
	this.fuegeRaiseHinzu = function() {
		this._anzahl_der_raises++;
	};
	// INT
	this.anzahlDerRaises = function() {
		return this._anzahl_der_raises;
	};
	// VOID
	this.setzeRaiseZaehlerZurueck = function() {
		this._anzahl_der_raises = 0;
	};
	// VOID
	this.setzeLetzteAktion = function(aktion) {
		if(aktion == 'fold') this._fold_gegeben = true;
		this._daten['letzteAktion'] = aktion;
	};
	// VOID
	this.resetDerDaten = function() {
		this._fold_gegeben = false;
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
	// VOID
	this.gibLetztenGewinn = function() {
		return this._letzterGewinn;
	};
	// VOID
	this.addiereGewinn = function(wert) {
		this.erhoeheStack(wert);
		this._letzterGewinn = wert;
	};
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
	// BOOLEAN
	this.istAusgestiegen = function() {
		return (this._fold_gegeben ? true : false);
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
	this.verteilePot = function(gewinner_liste) {
		if(!this._pot) return;
		
		var gewinn = Math.floor(this._pot / gewinner_liste.length);
		for(var i = 0; i < gewinner_liste.length; i++) {
			gewinner_liste[i].addiereGewinn(gewinn);
		}
		this._pot = 0;
	}
	// VOID
	this.starteWiederAbGeberToken = function() {
		for(var i = 0; i < this.spielerListe.length; i++) {
			if(!this.spielerListe[i].istAusgestiegen()) {
				this.spielerListe[i].setzeLetzteAktion('-');
				this.spielerListe[i].setzeRaiseZaehlerZurueck();
			}
		}
		this.pointer = this.geberTokenPointer;
	};
	// BOOLEAN
	this.starteNeuesSpielUndSchiebeGeberTokenWeiter = function() {
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
		var i = 0;
		while(i++ < this.spielerListe.length) {
			var spieler = this._gibDenSpielerDerAnDerReiheIst();
			
			if(!spieler.istAusgestiegen()) {
				return spieler;
			}
		}
		throw new Error("Alle Spieler sind ausgestiegen");
	};
	// OBJ
	this._gibDenSpielerDerAnDerReiheIst = function() {
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
	// INT
	this.gibAktuellenHoechsteinsatz = function() {
		var hoechsteinsatz = 0;
		for(var i = 0; i < this.spielerListe.length; i++) {
			var aktuellerEinsatz = this.spielerListe[i].gibEinsatz();
			if(aktuellerEinsatz > hoechsteinsatz) hoechsteinsatz = aktuellerEinsatz;
		}
		return hoechsteinsatz;
	};
	// BOOLEAN
	this.nimmSpielerAufWennNeu = function(spielerName) {
		if(this.spielerListe.length + 1 > this.maximaleSpieleranzahl) return false;
		
		for(var i = 0; i < this.spielerListe.length; i++) {
			if(this.spielerListe[i].gibName() == spielerName) return true;
		}
		
		var spieler = new CasinoPokerPlatzDesSpielers(spielerName, 0);
		this.spielerListe.push(
			spieler
		);
		
		return true;
	};
	// ARRAY(OBJ)
	this.gibAlleSpieler = function() {
		return this.spielerListe;
	};
	// ARRAY(OBJ)
	this.gibSpielerlisteVomAktuellenRueckwaerts = function(spieler) {
		var position = null;
		var liste = [];
		for(var i = 0; i < this.spielerListe.length; i++) {
			if(this.spielerListe[i].gibName() == spieler.gibName()) {
				position = i;
				break;
			}
		}
		for(var i = position; i >= 0; i--) {
			liste.push(i);
		}
		for(var i = this.spielerListe.length - 1; i > position; i--) {
			liste.push(i);
		}
		var spielerListe = [];
		for(var i = 0; i < liste.length; i++) {
			var spieler = this.spielerListe[liste[i]];
			if(spieler.istAusgestiegen()) continue;
			spielerListe.push(spieler);
		}
		return spielerListe;
	}
	// INT
	this.anzahlDerSpieler = function() {
		return this.spielerListe.length;
	};
	
}
