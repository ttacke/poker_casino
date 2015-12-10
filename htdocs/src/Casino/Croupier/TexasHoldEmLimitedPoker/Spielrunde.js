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
	// STRING
	this._uebersetzeAntwort = function(antwort) {
		if(antwort != 'check' && antwort != 'raise') {
			return 'fold';
		}
		return antwort;
	};
	// INT
	this._gibAktuellenHoechsteinsatz = function() {
		var alle_spieler = this.croupier.spielerrunde.gibAlleSpieler();
		var hoechsteinsatz = 0;
		for(var i = 0; i < alle_spieler.length; i++) {
			var aktuellerEinsatz = parseInt(alle_spieler[i].gibEinsatz());
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
		var frage = {
			'Hand': this._clone(spieler.gibHandkarten()),
			'Tisch': this._clone(spieler.gibTischkarten()),
			'LetzteAktion': spieler.gibLetzteAktion(),
			'Einsatz': spieler.gibEinsatz() + '',
			'Pot': spielerrunde.pot + '',
			'Stack': spieler.stack + '',
			'Hoechsteinsatz': this._gibAktuellenHoechsteinsatz() + '',
		};
		var alle_spieler = spielerrunde.gibAlleSpieler();
		frage['Spieler'] = [];
		for(var ii = 0; ii < alle_spieler.length; ii++) {
			frage['Spieler'].push({
				'Name': alle_spieler[ii].name,
				'letzteAktion': alle_spieler[ii].gibLetzteAktion(),
				'Stack': alle_spieler[ii].stack + '',
				'Einsatz': alle_spieler[ii].gibEinsatz() + '',
			});
		}
		var self = this;
		this.croupier.frageDenSpieler(
			spieler.name,
			frage,
			function(antwort) {
				var aktion = self._uebersetzeAntwort(antwort);
				if(aktion == 'check') {
					var hoechsteinsatz = self._gibAktuellenHoechsteinsatz();
					self._erhoeheAuf(spielerrunde, spieler.name, hoechsteinsatz);
				}
				spieler.setzeLetzteAktion(aktion);
				self._ermittleDenEinsatz(doneFunc, spielerrunde, temp - 1);
			}
		);
	};
	// VOID
	this._erhoeheAuf = function(spielerrunde, spielername, geforderterEinsatz) {
		var alle_spieler = spielerrunde.gibAlleSpieler();
		for(var i = 0; i < alle_spieler.length; i++) {
			if(alle_spieler[i].name == spielername) {
				var einsatzVeraenderung = geforderterEinsatz - alle_spieler[i].gibEinsatz();
				alle_spieler[i].erhoeheEinsatz(einsatzVeraenderung);
				alle_spieler[i].stack -= einsatzVeraenderung;
				spielerrunde.pot += einsatzVeraenderung;
			}
		}
	};
	// VOID
	this._frageAlleSpieler = function(liste_aller_spieler, daten, doneFunc) {
		if(!liste_aller_spieler.length) {
			doneFunc(true);
			return;
		}
		
		var neue_liste = [];
		for(var i = 0; i < liste_aller_spieler.length; i++) {
			neue_liste[i] = liste_aller_spieler[i];
		}
		var spieler = neue_liste.shift();
		
		var self = this;
		this.croupier.frageDenSpieler(
			spieler.name,
			self._clone(daten),
			function() {
				setTimeout(function() {// Rekursion fuer FF aufbrechen
					self._frageAlleSpieler(neue_liste, daten, doneFunc);
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
