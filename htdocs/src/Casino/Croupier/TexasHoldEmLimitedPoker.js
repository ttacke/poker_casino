"use strict";

function Spielkarte(bezeichnung, farbe) {
	this._berechne_zahlwert = function(bezeichnung) {
		if(this.bezeichnung == 'A') return 14;
		if(this.bezeichnung == 'K') return 13;
		if(this.bezeichnung == 'Q') return 12;
		if(this.bezeichnung == 'J') return 11;
		return this.bezeichnung * 1;
	};
	this.bezeichnung = bezeichnung;
	this.farbe = farbe;
	this.zahlwert = this._berechne_zahlwert(bezeichnung);
}
// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPoker.prototype = new CasinoCroupier();
function CasinoCroupierTexasHoldEmLimitedPoker(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	
	// BOOLEAN
	this.blattAschlaegtB = function(a, b) {
		var A = this.parseKarten(a);
		var B = this.parseKarten(b);
		
		//console.log(a + " - " + b);
		var punkteA = this._ermittlePunkteFuerBlattA(A, B);
		var punkteB = this._ermittlePunkteFuerBlattA(B, A);
		
		//console.log(punkteA + " > " + punkteB);
		if(punkteA > punkteB) return true;
		return false;
	};
	// INT
	this._ermittlePunkteFuerBlattA = function(A, B) {
		if(this._royalFlushAschlaegtB(A, B)) return 9;
		if(this._straightFlushAschlaegtB(A, B)) return 8;
		if(this._vierlingAschlaegtB(A, B)) return 7;
		if(this._fullHouseAschlaegtB(A, B)) return 6;
		if(this._flushAschlaegtB(A, B)) return 5;
		if(this._straightAschlaegtB(A, B)) return 4;
		if(this._drillingAschlaegtB(A, B)) return 3;
		if(this._paerchenAschlaegtB(A, B)) return 2;
		if(this._highCardAschlaegtB(A, B)) return 1;
		return 0;
	}
	// BOOLEAN
	this._fullHouseAschlaegtB = function(a, b) {
		var punkteA = this._gibFlullhousePunkte(a);
		var punkteB = this._gibFlullhousePunkte(b);
		if(punkteA > punkteB) return true;
		return false;
	};
	// INT
	this._gibFlullhousePunkte = function(blatt) {
		var drilling = this._gibWertMehrlingKarten(blatt, 3);
		if(drilling.length == 0) return 0;
		var paar = this._gibWertMehrlingKarten(blatt, 2);
		if(paar.length == 0) return 0;
		return (drilling[0].zahlwert * 15) + (paar[0].zahlwert * 1);
	};
	// BOOLEAN
	this._royalFlushAschlaegtB = function(a, b) {
		var punkteA = this._gibRoyalFlushPunkte(a);
		var punkteB = this._gibRoyalFlushPunkte(b);
		if(punkteA > punkteB) return true;
		return false;
	}
	// INT
	this._gibRoyalFlushPunkte = function(blatt) {
		var punkte = this._gibStraightFlushPunkte(blatt);
		if(punkte != 14) return 0;
		return 14;
	}
	// BOOLEAN
	this._straightFlushAschlaegtB = function(a, b) {
		var punkteA = this._gibStraightFlushPunkte(a);
		var punkteB = this._gibStraightFlushPunkte(b);
		if(punkteA > punkteB) return true;
		return false;
	};
	// INT
	this._gibStraightFlushPunkte = function(blatt) {
		var straightPunkte = this._gibStraightPunkte(blatt);
		var flushPunkte = this._gibFlushPunkte(blatt);
		if(straightPunkte == 0 || flushPunkte == 0) return 0;
		
		return straightPunkte;// Wegen assStraight
	};
	// BOOLEAN
	this._flushAschlaegtB = function(a, b) {
		var punkteA = this._gibFlushPunkte(a);
		var punkteB = this._gibFlushPunkte(b);
		if(punkteA > punkteB) return true;
		return false;
	};
	// INT
	this._gibFlushPunkte = function(blatt) {
		blatt = this._sortiereKartenHoechsteZuerst(blatt);
		var letzteKarte = null;
		for(var i = 1; i < blatt.length; i++) {
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
	// BOOLEAN
	this._straightAschlaegtB = function(a, b) {
		var punkteA = this._gibStraightPunkte(a);
		var punkteB = this._gibStraightPunkte(b);
		if(punkteA > punkteB) return true;
		return false;
	};
	
	// INT
	this._gibStraightPunkte = function(blatt) {
		blatt = this._sortiereKartenHoechsteZuerst(blatt);
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
		assStraightBlatt.push(new Spielkarte('1', '?'));
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
	// BOOLEAN
	this._vierlingAschlaegtB = function(a, b) {
		return this._mehrlingAschlaegtB(a, b, 4);
	};
	// BOOLEAN
	this._drillingAschlaegtB = function(a, b) {
		return this._mehrlingAschlaegtB(a, b, 3);
	};
	// BOOLEAN
	this._paerchenAschlaegtB = function(a, b) {
		return this._mehrlingAschlaegtB(a, b, 2);
	}
	// BOOLEAN
	this._mehrlingAschlaegtB = function(a, b, gesuchte_mehrling_anzahl) {
		var paareA = this._sortiereKartenHoechsteZuerst(this._gibWertMehrlingKarten(a, gesuchte_mehrling_anzahl));
		var paareB = this._sortiereKartenHoechsteZuerst(this._gibWertMehrlingKarten(b, gesuchte_mehrling_anzahl));
		for(var i = 0; i < paareA.length; i++) {
			var paarKarteA = paareA[i];
			var paarKarteB = paareB[i];
			
			if(paarKarteA && !paarKarteB) return true;
			if(!paarKarteA && paarKarteB) return false;
			
			if(paarKarteA.zahlwert > paarKarteB.zahlwert) return true;
			if(paarKarteA.zahlwert < paarKarteB.zahlwert) return false;
		}
		return false;
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
	// BOOLEAN
	this._highCardAschlaegtB = function(a, b) {
		a = this._sortiereKartenHoechsteZuerst(a);
		b = this._sortiereKartenHoechsteZuerst(b);
		for(var i = 0; i < a.length; i++) {
			var karteA = a[i];
			var karteB = b[i];
		
			if(karteA.zahlwert > karteB.zahlwert) return true;
			if(karteA.zahlwert < karteB.zahlwert) return false;
		}
		return false;
	}
	// ARRAY
	this._sortiereKartenHoechsteZuerst = function(blatt) {
		return blatt.sort(function(a, b) { return b.zahlwert - a.zahlwert; });
	};
	// ARRAY
	this.parseKarten = function(string) {
		var stapel = [];
		var liste = string.split(" ");
		for(var i = 0; i < liste.length; i++) {
			if(liste[i].length < 2) continue;
			
			var kartenDaten = liste[i].split("");
			if(kartenDaten.length == 3) {
				kartenDaten[0] += kartenDaten[1];
				kartenDaten[1] = kartenDaten[2];
			}
			stapel.push(new Spielkarte(kartenDaten[0], kartenDaten[1]));
		}
		return stapel;
	};
}