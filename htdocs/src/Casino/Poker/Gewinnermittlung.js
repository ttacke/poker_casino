"use strict";

// CLASS DEFINITION
function CasinoPokerGewinnermittlung(blatt) {
	// VOID
	this._init = function(blatt) {
		this.blatt = this._sortiereKartenHoechsteZuerst(blatt);
		this.gruppierteZahlwerte = this._gruppiereZahlwerte(blatt);
	};
	// INT
	this.gibPunkte = function() {
		var blatt = this.blatt;
		var punkte = 0
			+ (this._gibRoyalFlushPunkte()		* Math.pow(15, 14))
			+ (this._gibStraightFlushPunkte()	* Math.pow(15, 13))
			+ (this._gibVierlingPunkte()		* Math.pow(15, 12))
			+ (this._gibFlullhousePunkte()		* Math.pow(15, 10))
			+ (this._gibFlushPunkte()			* Math.pow(15, 9))
			+ (this._gibStraightPunkte()		* Math.pow(15, 8))
			+ (this._gibDrillingPunkte()		* Math.pow(15, 7))
			+ (this._gibZweiPaerchenPunkte()	* Math.pow(15, 6))
			+ (this._gibEinPaerchenPunkte()		* Math.pow(15, 5))
			+ (this._gibHighCardPunkte(1)		* Math.pow(15, 4))
			+ (this._gibHighCardPunkte(2)		* Math.pow(15, 3))
			+ (this._gibHighCardPunkte(3)		* Math.pow(15, 2))
			+ (this._gibHighCardPunkte(4)		* Math.pow(15, 1))
			+ (this._gibHighCardPunkte(5)		* Math.pow(15, 0))
		;
		return punkte;
	}
	// INT
	this._gibFlullhousePunkte = function() {
		var drilling = this._gibWertMehrlingKarten(this.blatt, 3);
		if(drilling.length == 0) return 0;
		var paar = this._gibWertMehrlingKarten(this.blatt, 2);
		if(paar.length == 0) return 0;
		return (drilling[0].zahlwert * 15) + (paar[0].zahlwert * 1);
	};
	// INT
	this._gibRoyalFlushPunkte = function() {
		var punkte = this._gibStraightFlushPunkte(this.blatt);
		if(punkte != 14) return 0;
		return 1;
	}
	// INT
	this._gibStraightFlushPunkte = function() {
		var straightPunkte = this._gibStraightPunkte(this.blatt);
		var flushPunkte = this._gibFlushPunkte(this.blatt);
		if(straightPunkte == 0 || flushPunkte == 0) return 0;
		
		return straightPunkte;// Wegen assStraight
	};
	// INT
	this._gibFlushPunkte = function() {
		var letzteKarte = null;
		for(var i = 1; i < this.blatt.length; i++) {
			if(letzteKarte == null) {
				letzteKarte = this.blatt[i];
				continue;
			}
			if(letzteKarte.farbe != this.blatt[i].farbe) {
				return 0;
			}
		}
		return this.blatt[0].zahlwert;
	};
	// INT
	this._gibStraightPunkte = function() {
		var punkte = this._gibNormaleStraightPunkte(this.blatt);
		if(!punkte) punkte = this._gibAssStraightPunkte(this.blatt);
		return punkte;
	}
	// INT
	this._gibAssStraightPunkte = function(blatt) {
		if(blatt[0].bezeichnung != 'A') return 0;
		
		var assStraightBlatt = [];
		for(var i = 1; i < blatt.length; i++) {
			assStraightBlatt.push(blatt[i]);
		}
		assStraightBlatt.push(new CasinoPokerSpielkarte('1', '?'));
		return this._gibNormaleStraightPunkte(assStraightBlatt);
	}
	// INT
	this._gibNormaleStraightPunkte = function(blatt) {
		var vorherigeKarte = null;
		for(var i = 0; i < blatt.length; i++) {
			var karte = blatt[i];
			if(vorherigeKarte) {
				if(vorherigeKarte.zahlwert != karte.zahlwert + 1) {
					return 0;
				}
			}
			vorherigeKarte = karte;
		}
		return blatt[0].zahlwert * 1;
	}
	// INT
	this._gibVierlingPunkte = function() {
		return this._gibMehrlingPunkte(this.blatt, 4, 1);
	};
	// INT
	this._gibDrillingPunkte = function() {
		return this._gibMehrlingPunkte(this.blatt, 3, 1);
	};
	// INT
	this._gibEinPaerchenPunkte = function() {
		var eins = this._gibMehrlingPunkte(this.blatt, 2, 1);
		var zwei = this._gibMehrlingPunkte(this.blatt, 2, 2);
		if(zwei > 0) return 0;
		return eins;
	}
	// INT
	this._gibZweiPaerchenPunkte = function() {
		var eins = this._gibMehrlingPunkte(this.blatt, 2, 1);
		var zwei = this._gibMehrlingPunkte(this.blatt, 2, 2);
		if(eins == 0 || zwei == 0) return 0;
		return eins;
	}
	// INT
	this._gibMehrlingPunkte = function(blatt, gesuchte_mehrling_anzahl, gesuchteMehrlingNummer) {
		var mehrlingListe = this._gibWertMehrlingKarten(blatt, gesuchte_mehrling_anzahl);
		mehrlingListe = this._sortiereKartenHoechsteZuerst(mehrlingListe);
		if(mehrlingListe.length < gesuchteMehrlingNummer) {
			return 0;
		}
		return mehrlingListe[gesuchteMehrlingNummer - 1].zahlwert;
	};
	// INT
	this._gibWertMehrlingKarten = function(blatt, gesuchte_mehrling_anzahl) {
		var mehrlinge = this._gruppiereZahlwerte(blatt);
		var gefundene_mehrlinge = [];
		for(var zahlwert in mehrlinge) {
			if(mehrlinge[zahlwert].length == gesuchte_mehrling_anzahl) {
				gefundene_mehrlinge.push(mehrlinge[zahlwert][0]);
			}
		}
		return gefundene_mehrlinge;
	};
	// HASH
	this._gruppiereZahlwerte = function(blatt) {
		var zahlwerte = {};
		for(var i = 0; i < blatt.length; i++) {
			var karte = blatt[i];
			if(!zahlwerte[karte.zahlwert]) {
				zahlwerte[karte.zahlwert] = [];
			}
			zahlwerte[karte.zahlwert].push(karte);
		}
		return zahlwerte;
	}
	// INT
	this._gibHighCardPunkte = function(kartenNr) {
		if(this.blatt.length < kartenNr) return 0;
		return this.blatt[kartenNr - 1].zahlwert;
	};
	// ARRAY
	this._sortiereKartenHoechsteZuerst = function(blatt) {
		return blatt.sort(function(a, b) { return b.zahlwert - a.zahlwert; });
	};
	
	this._init(blatt);
}
