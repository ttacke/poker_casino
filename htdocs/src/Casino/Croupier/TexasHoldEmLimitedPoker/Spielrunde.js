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
	// VOID
	this._ermittleDenEinsatz = function(doneFunc, spielerrunde, temp) {
		if(temp <= 0) {//TODO implementieren
			doneFunc(true);
			return;
		}
			
		var spieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		var frage = this.croupier._clone(this.croupier._gibSpielerdaten(spieler));
		frage['Pot'] = this.croupier.pot + '';
		frage['Stack'] = this.croupier.stack[spieler] + '';
		frage['Hoechsteinsatz'] = this.croupier._gibAktuellenHoechsteinsatz() + '';
		
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
					var hoechsteinsatz = self.croupier._gibAktuellenHoechsteinsatz();
					self.croupier._erhoeheAuf(spieler, hoechsteinsatz);
				}
				self.croupier._speichereLetzteAktion(spieler, aktion);
				self._ermittleDenEinsatz(doneFunc, spielerrunde, temp - 1);
			}
		);
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
			self.croupier._clone(daten),
			function() {
				setTimeout(function() {// Rekursion fuer FF aufbrechen
					self._frageAlleSpieler(liste, daten, doneFunc);
				}, 0);
			}
		);
		return;
	};
}
