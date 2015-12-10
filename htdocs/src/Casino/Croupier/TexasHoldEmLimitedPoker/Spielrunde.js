"use strict";

// CLASS DEFINITION
function CasinoCroupierTexasHoldEmLimitedPokerSpielrunde(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	
	// VOID
	this.wetten = function(spielerrunde, kartenstapel, naechsteRunde) {
		
		this._ermittleEinsaetzeVonAllen(spielerrunde, naechsteRunde);
	};
	// VOID
	this._ermittleEinsaetzeVonAllen = function(spielerrunde, doneFunc) {
		this._ermittleDenEinsatz(doneFunc, spielerrunde, spielerrunde.anzahlDerSpieler());
		
	};
	// INT
	this._gibAktuellenHoechsteinsatz = function() {
		var alle_spieler = this.croupier.spielerrunde.gibListe();
		var hoechsteinsatz = 0;
		for(var i = 0; i < alle_spieler.length; i++) {
			var daten = this.croupier._gibSpielerdaten(alle_spieler[i]);
			var aktuellerEinsatz = parseInt(daten['Einsatz']);
			if(aktuellerEinsatz > hoechsteinsatz) hoechsteinsatz = aktuellerEinsatz;
		}
		return hoechsteinsatz;
	};
	// VOID
	this._ermittleDenEinsatz = function(doneFunc, spielerrunde, temp) {
		if(temp <= 0) {//TODO implementieren
			doneFunc(true);
			return;
		}
			
		var spieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		var frage = this._clone(this.croupier._gibSpielerdaten(spieler));
		frage['Pot'] = this.croupier.pot + '';
		frage['Stack'] = this.croupier.stack[spieler] + '';
		frage['Hoechsteinsatz'] = this._gibAktuellenHoechsteinsatz() + '';
		
		var alle_spieler = spielerrunde.gibListe();
		frage['Spieler'] = [];
		for(var ii = 0; ii < alle_spieler.length; ii++) {
			var einsatz = this.croupier._gibSpielerdaten(alle_spieler[ii])['Einsatz'];
			frage['Spieler'].push({
				'Name':alle_spieler[ii],
				'letzteAktion':this.croupier._gibSpielerdaten(alle_spieler[ii])['letzteAktion'],
				'Stack':this.croupier.stack[alle_spieler[ii]] + '',
				'Einsatz':einsatz,
			});
		}
		var self = this;
		this.croupier.frageDenSpieler(
			spieler,
			frage,
			function(antwort) {
				var aktion = self.croupier._uebersetzeAntwort(antwort);
				if(aktion == 'check') {
					var hoechsteinsatz = self._gibAktuellenHoechsteinsatz();
					self._erhoeheAuf(spieler, hoechsteinsatz);
				}
				self.croupier._speichereLetzteAktion(spieler, aktion);
				self._ermittleDenEinsatz(doneFunc, spielerrunde, temp - 1);
			}
		);
	};
	// VOID
	this._erhoeheAuf = function(spieler, geforderterEinsatz) {
		var daten = this.croupier._gibSpielerdaten(spieler);
		var einsatzVeraenderung = geforderterEinsatz - daten['Einsatz'];
		daten['Einsatz'] = parseInt(daten['Einsatz']) + einsatzVeraenderung + '';
		this.croupier.stack[spieler] -= einsatzVeraenderung;
		this.croupier.pot += einsatzVeraenderung;
	};
	// VOID
	this._frageAlleSpieler = function(liste, daten, doneFunc) {
		if(!liste.length) {
			doneFunc(true);
			return;
		}
		var spieler = liste.shift();
		var self = this;
		this.croupier.frageDenSpieler(
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
}
