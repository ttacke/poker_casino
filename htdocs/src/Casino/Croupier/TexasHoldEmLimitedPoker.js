"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPoker.prototype = new CasinoCroupier();
function CasinoCroupierTexasHoldEmLimitedPoker(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	this.spielerdaten = [];
	var minSpielerAnzahl = 3;
	var maxSpielerAnzahl = 23;
	this.pot = 0;
	this.stack = {};
	this.gewinnErmittler = new CasinoPokerGewinnermittlung();
	
	this.spielerrunde = new CasinoPokerSpielerrunde(
		minSpielerAnzahl, maxSpielerAnzahl
	);
	
	// OBJ
	this._gibSpielerdaten = function(name) {
		if(!this.spielerdaten[name]) {
			this.spielerdaten[name] = {};
		}
		return this.spielerdaten[name];
	};
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
	// BOOLEAN
	this._bereiteNeuesSpielVor = function() {
		if(!this.spielerrunde.starteNeuesSpielUndSchiebeGeberTokenWeiter()) {
			return false;
		}
		
		this.pot = 0;
		this.spielerdaten = new Object();
		var alle_spieler = this.spielerrunde.gibListe();
		for(var i = 0; i < alle_spieler.length; i++) {
			var daten = this._gibSpielerdaten(alle_spieler[i]);
			daten['Hand'] = [];
			daten['Tisch'] = [];
			daten['letzteAktion'] = '-';
			daten['Einsatz'] = '0';
		}
		return true;
	};
	// VOID
	this._gibHandkartenAnAlleSpieler = function(anzahl, kartenstapel) {
		var alle_spieler = this.spielerrunde.gibListe();
		for(var i = 0; i < alle_spieler.length; i++) {
			var daten = this._gibSpielerdaten(alle_spieler[i]);
			for(var ii = 0; ii < anzahl; ii++) {
				daten['Hand'].push(kartenstapel.pop().toString());
			}
		}
		return;
	};
	// VOID
	this._gibTischkartenAnAlleSpieler = function(anzahl, kartenstapel) {
		var tischkarten = [];
		for(var i = 0; i < anzahl; i++) {
			tischkarten.push(kartenstapel.pop().toString());
		}
		
		var alle_spieler = this.spielerrunde.gibListe();
		for(var i = 0; i < alle_spieler.length; i++) {
			var daten = this._gibSpielerdaten(alle_spieler[i]);
			for(var ii = 0; ii < tischkarten.length; ii++) {
				daten['Tisch'].push(tischkarten[ii]);
			}
		}
		return;
	};
	// VOID
	this._spielePreflop = function(kartenstapel, naechsteRunde) {
		this.spielerrunde.starteWiederAbGeberToken();
		
		var smallBlindSpieler = this.spielerrunde.gibDenSpielerDerAnDerReiheIst();
		this._erhoeheAuf(smallBlindSpieler, '1');
		
		var bigBlindSpieler = this.spielerrunde.gibDenSpielerDerAnDerReiheIst();
		this._erhoeheAuf(bigBlindSpieler, '2');
		
		this._gibHandkartenAnAlleSpieler(2, kartenstapel);
		
		this._ermittleEinsaetzeVonAllen(naechsteRunde);
	};
	// VOID
	this._spieleFlop = function(kartenstapel, naechsteRunde) {
		this.spielerrunde.starteWiederAbGeberToken();
		
		this._gibTischkartenAnAlleSpieler(3, kartenstapel);
		this._ermittleEinsaetzeVonAllen(naechsteRunde);
	};
	// VOID
	this._spieleTurnCard = function(kartenstapel, naechsteRunde) {
		this.spielerrunde.starteWiederAbGeberToken();
		
		this._gibTischkartenAnAlleSpieler(1, kartenstapel);
		this._ermittleEinsaetzeVonAllen(naechsteRunde);
	};
	// VOID
	this._spieleRiver = function(kartenstapel, naechsteRunde) {
		this.spielerrunde.starteWiederAbGeberToken();
		
		this._gibTischkartenAnAlleSpieler(1, kartenstapel);
		this._ermittleEinsaetzeVonAllen(naechsteRunde);
	};
	// VOID
	this._ermittleEinsaetzeVonAllen = function(doneFunc) {
		var self = this;
		for(var i = 0; i < this.spielerrunde.anzahlDerSpieler(); i++) {
			var spieler = this.spielerrunde.gibDenSpielerDerAnDerReiheIst();
			var frage = this._clone(this._gibSpielerdaten(spieler));
			frage['Pot'] = this.pot + '';
			frage['Stack'] = this.stack[spieler] + '';
			frage['Hoechsteinsatz'] = self._gibAktuellenHoechsteinsatz() + '';
			
			var alle_spieler = self.spielerrunde.gibListe();
			frage['Spieler'] = [];
			for(var ii = 0; ii < alle_spieler.length; ii++) {
				var einsatz = this._gibSpielerdaten(alle_spieler[ii])['Einsatz'];
				frage['Spieler'].push({
					'Name':alle_spieler[ii],
					'letzteAktion':this._gibSpielerdaten(alle_spieler[ii])['letzteAktion'],
					'Stack':this.stack[alle_spieler[ii]] + '',
					'Einsatz':einsatz,
				});
			}
			self.frageDenSpieler(
				spieler,
				frage,
				function(antwort) {
					var aktion = self._uebersetzeAntwort(antwort);
					if(aktion == 'check') {
						var hoechsteinsatz = self._gibAktuellenHoechsteinsatz();
						self._erhoeheAuf(spieler, hoechsteinsatz);
					}
					self._speichereLetzteAktion(spieler, aktion);
					// TODO: hier rekursiv vorgehen (innerhalb dieser Funktion)!
				}
			);
		}
		doneFunc(true);
	};
	// VOID
	this._erhoeheAuf = function(spieler, geforderterEinsatz) {
		var daten = this._gibSpielerdaten(spieler);
		var einsatzVeraenderung = geforderterEinsatz - daten['Einsatz'];
		daten['Einsatz'] = parseInt(daten['Einsatz']) + einsatzVeraenderung + '';
		this.stack[spieler] -= einsatzVeraenderung;
		this.pot += einsatzVeraenderung;
	};
	// INT
	this._gibAktuellenHoechsteinsatz = function() {
		var alle_spieler = this.spielerrunde.gibListe();
		var hoechsteinsatz = 0;
		for(var i = 0; i < alle_spieler.length; i++) {
			var daten = this._gibSpielerdaten(alle_spieler[i]);
			var aktuellerEinsatz = parseInt(daten['Einsatz']);
			if(aktuellerEinsatz > hoechsteinsatz) hoechsteinsatz = aktuellerEinsatz;
		}
		return hoechsteinsatz;
	};
	// VOID
	this._speichereLetzteAktion = function(spieler, aktion) {
		var daten = this._gibSpielerdaten(spieler);
		daten['letzteAktion'] = aktion;
		return;
	};
	// STRING
	this._uebersetzeAntwort = function(antwort) {
		if(antwort != 'check' && antwort != 'raise') {
			return 'fold';
		}
		return antwort;
	};
	// ARRAY
	this._ermittleGewinner = function() {
		var alle = [];
		var alle_spieler = this.spielerrunde.gibListe();
		var maximalePunkte = 0;
		for(var i = 0; i < alle_spieler.length; i++) {
			var daten = this._gibSpielerdaten(alle_spieler[i]);
			var bestesBlatt = this.gewinnErmittler.gibBestesBlatt(
				this._parseKarten(daten['Hand'].join(' ')),
				this._parseKarten(daten['Tisch'].join(' '))
			);
			var punkte = this.gewinnErmittler.gibPunkte(bestesBlatt);
			if(maximalePunkte < punkte) maximalePunkte = punkte;
			
			var blatt = [];
			for(var ii = 0; ii < bestesBlatt.length; ii++) {
				blatt.push(bestesBlatt[ii].toString());
			}
			alle.push({
				'spieler': alle_spieler[i],
				'punkte': punkte,
				'bestesBlatt': blatt
			});
		}
		var gewinner = [];
		for(var i = 0; i < alle.length; i++) {
			if(alle[i].punkte == maximalePunkte) {
				gewinner.push(alle[i]);
			}
		}
		return gewinner;
	};
	// VOID
	this._spieleShowdown = function(doneFunc) {
		var datenAllerSpieler = [];
		var alle_spieler = this.spielerrunde.gibListe();
		for(var i = 0; i < alle_spieler.length; i++) {
			var daten = this._gibSpielerdaten(alle_spieler[i]);
			datenAllerSpieler.push({
				'Name': alle_spieler[i],
				'letzteAktion': daten.letzteAktion,
				'Stack': this.stack[alle_spieler[i]] + '',
				'Einsatz': daten.Einsatz,
				'Hand': daten.Hand
			});
		}
		
		var pot = this.pot;
		var gewinner = this._ermittleGewinner();
		var gewinn = Math.floor(pot / gewinner.length);
		var gewinnerDaten = [];
		for(var i = 0; i < gewinner.length; i++) {
			this.stack[gewinner[i].spieler] += gewinn;
			gewinnerDaten.push({
				'Name': gewinner[i].spieler,
				'Gewinn': gewinn + '',
				'Blatt': gewinner[i].bestesBlatt
			});
		}
		this.pot = 0;
		
		var daten = {
			'Tisch': ['2♦','2♦','2♦','2♦','2♦'],
			'Pot': pot + '',
			'Gewinner':gewinnerDaten,
			'Spieler': datenAllerSpieler
		};
		this._frageAlleSpieler(this._clone(alle_spieler), daten, doneFunc);
	};
	// ARRAY
	this._clone = function(item) {
		var self = this;
		if (Object.prototype.toString.call( item ) === "[object Array]") {
			var result = [];
			item.forEach(function(child, index, array) { 
				result[index] = self._clone( child );
			});
			return result;
		} else if (typeof item == "object") {
			var result = {};
			for (var i in item) {
				result[i] = self._clone( item[i] );
			}
			return result;
		} else {
			return item;
		}
	};
	// VOID
	this._frageAlleSpieler = function(liste, daten, doneFunc) {
		if(!liste.length) {
			doneFunc(true);
			return;
		}
		var spieler = liste.shift();
		var self = this;
		this.frageDenSpieler(
			spieler,
			self._clone(daten),
			function() {
				setTimeout(function() {// Rekursion fuer FF aufbrechen
					self._frageAlleSpieler(liste, daten, doneFunc);
				}, 0);
			}
		);
		return;
	};
	// VOID
	this.nimmMitspielerAuf = function(doneFunc) {
		var self = this;
		this.zeigeSpielerDesTisches(function(liste) {
			for(var i = 0; i < liste.length; i++) {
				self.spielerrunde.nimmSpielerAufWennNeu(liste[i]);
				if(self.stack[liste[i]] == null) {
					self.stack[liste[i]] = 0;
				}
			}
			doneFunc();
		});
	};
	// STRING
	this._erstelleKartenstapelString = function() {
		var farben = "♦ ♥ ♠ ♣".split(" ");
		var werte = "2x 3x 4x 5x 6x 7x 8x 9x 10x Jx Qx Kx Ax";
		var alle = [];
		for(var i = 0; i < farben.length; i++) {
			alle.push(werte.replace(/x/g, farben[i]));
		}
		return alle.join(" ");
	};
	// ARRAY
	this._erstelleKartenstapel = function() {
		return this._parseKarten(this._erstelleKartenstapelString());
	};
	// ARRAY
	this._mischeStapel = function(array) {
		var currentIndex = array.length;
		var temporaryValue;
		var randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	};
	// VOID
	this.spieleEinSpiel = function(doneFunc) {
		if(!this._bereiteNeuesSpielVor()) {
			doneFunc(false);
			return;
		}
		
		var kartenstapel = this._erstelleKartenstapel();
		kartenstapel = this._mischeStapel(kartenstapel);
		
		var self = this;
		this._spielePreflop(kartenstapel, function() {
			self._spieleFlop(kartenstapel, function() {
				self._spieleTurnCard(kartenstapel, function() {
					self._spieleRiver(kartenstapel, function() {
						self._spieleShowdown(doneFunc)
					})
				})
			})
		});
	};
}
 