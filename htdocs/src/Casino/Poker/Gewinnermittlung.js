"use strict";

// CLASS DEFINITION
function CasinoPokerGewinnermittlung(blatt) {
	// ARRAY
	this._clone = function(array) {
		var clone = [];
		for(var i = 0; i < array.length; i++) {
			clone.push(array[i]);
		}
		return clone;
	}
	// ARRAY
	this._kombiniereAlleElemente = function(hand, board) {
		var kombinationen = [];
		for(var hand_i = 0; hand_i < hand.length; hand_i++) {
			for(var board_i = 0; board_i < board.length; board_i++) {
				var tmp = this._clone(board);
				tmp[board_i] = hand[hand_i];
				kombinationen.push(tmp);
			}
		}
		for(var i = 0; i < board.length; i++) {
			for(var ii = i + 1; ii < board.length; ii++) {
				var tmp = this._clone(board);
				tmp[i] = hand[0];
				tmp[ii] = hand[1];
				kombinationen.push(tmp);
			}
		}
		return kombinationen;
	};
	// ARRAY
	this.gibBestesBlatt = function(hand, board) {
		var kombinationen = this._kombiniereAlleElemente(hand, board);
		kombinationen.push(board);
		
		var maxPunkte = 0;
		var maxBlatt = null;
		for(var i = 0; i < kombinationen.length; i++) {
			var blatt = kombinationen[i];
			var punkte = this.gibPunkte(blatt);
			if(punkte > maxPunkte) {
				maxPunkte = punkte;
				maxBlatt = blatt;
			}
		}
		return maxBlatt;
	};
	// INT
	this.gibPunkte = function(blatt) {
		var blatt = this._sortiereKartenHoechsteZuerst(blatt);
		var punkte = 0
			+ (this._gibRoyalFlushPunkte(blatt)		* Math.pow(15, 14))
			+ (this._gibStraightFlushPunkte(blatt)	* Math.pow(15, 13))
			+ (this._gibVierlingPunkte(blatt)		* Math.pow(15, 12))
			+ (this._gibFlullhousePunkte(blatt)		* Math.pow(15, 10))
			+ (this._gibFlushPunkte(blatt)			* Math.pow(15, 9))
			+ (this._gibStraightPunkte(blatt)		* Math.pow(15, 8))
			+ (this._gibDrillingPunkte(blatt)		* Math.pow(15, 7))
			+ (this._gibZweiPaerchenPunkte(blatt)	* Math.pow(15, 6))
			+ (this._gibEinPaerchenPunkte(blatt)	* Math.pow(15, 5))
			+ (this._gibHighCardPunkte(1, blatt)	* Math.pow(15, 4))
			+ (this._gibHighCardPunkte(2, blatt)	* Math.pow(15, 3))
			+ (this._gibHighCardPunkte(3, blatt)	* Math.pow(15, 2))
			+ (this._gibHighCardPunkte(4, blatt)	* Math.pow(15, 1))
			+ (this._gibHighCardPunkte(5, blatt)	* Math.pow(15, 0))
		;
		return punkte;
	}
	// INT
	this._gibFlullhousePunkte = function(blatt) {
		var drilling = this._gibWertMehrlingKarten(blatt, 3);
		if(drilling.length == 0) return 0;
		var paar = this._gibWertMehrlingKarten(blatt, 2);
		if(paar.length == 0) return 0;
		return (drilling[0].zahlwert * 15) + (paar[0].zahlwert * 1);
	};
	// INT
	this._gibRoyalFlushPunkte = function(blatt) {
		var punkte = this._gibStraightFlushPunkte(blatt);
		if(punkte != 14) return 0;
		return 1;
	}
	// INT
	this._gibStraightFlushPunkte = function(blatt) {
		var straightPunkte = this._gibStraightPunkte(blatt);
		var flushPunkte = this._gibFlushPunkte(blatt);
		if(straightPunkte == 0 || flushPunkte == 0) return 0;
		
		return straightPunkte;// Wegen assStraight
	};
	// INT
	this._gibFlushPunkte = function(blatt) {
		var letzteKarte = null;
		for(var i = 0; i < blatt.length; i++) {
			if(letzteKarte == null) {
				letzteKarte = blatt[i];
				continue;
			}
			if(letzteKarte.farbe != blatt[i].farbe) {
				return 0;
			}
		}
		return blatt[0].zahlwert;
	};
	// INT
	this._gibStraightPunkte = function(blatt) {
		var punkte = this._gibNormaleStraightPunkte(blatt);
		if(!punkte) punkte = this._gibAssStraightPunkte(blatt);
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
	this._gibVierlingPunkte = function(blatt) {
		return this._gibMehrlingPunkte(blatt, 4, 1);
	};
	// INT
	this._gibDrillingPunkte = function(blatt) {
		return this._gibMehrlingPunkte(blatt, 3, 1);
	};
	// INT
	this._gibEinPaerchenPunkte = function(blatt) {
		var eins = this._gibMehrlingPunkte(blatt, 2, 1);
		var zwei = this._gibMehrlingPunkte(blatt, 2, 2);
		if(zwei > 0) return 0;
		return eins;
	}
	// INT
	this._gibZweiPaerchenPunkte = function(blatt) {
		var eins = this._gibMehrlingPunkte(blatt, 2, 1);
		var zwei = this._gibMehrlingPunkte(blatt, 2, 2);
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
	this._gibHighCardPunkte = function(kartenNr, blatt) {
		if(blatt.length < kartenNr) return 0;
		return blatt[kartenNr - 1].zahlwert;
	};
	// ARRAY
	this._sortiereKartenHoechsteZuerst = function(blatt) {
		return blatt.sort(function(a, b) { return b.zahlwert - a.zahlwert; });
	};
}
