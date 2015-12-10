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
			var daten = alle_spieler[i].daten;
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
		var frage;
		var alle_spieler = spielerrunde.gibAlleSpieler();
		for(var i = 0; i < alle_spieler.length; i++) {
			if(alle_spieler[i].name == spieler) {
				frage = this._clone(alle_spieler[i].daten);
			}
		}
		
		
		frage['Pot'] = this.croupier.pot + '';
		frage['Stack'] = this.croupier.stack[spieler] + '';
		frage['Hoechsteinsatz'] = this._gibAktuellenHoechsteinsatz() + '';
		
		var alle_spieler = spielerrunde.gibAlleSpieler();
		frage['Spieler'] = [];
		for(var ii = 0; ii < alle_spieler.length; ii++) {
			var einsatz = alle_spieler[ii].daten['Einsatz'];
			frage['Spieler'].push({
				'Name':alle_spieler[ii].name,
				'letzteAktion':alle_spieler[ii]['letzteAktion'],
				'Stack':this.croupier.stack[alle_spieler[ii].name] + '',
				'Einsatz':einsatz,
			});
		}
		var self = this;
		this.croupier.frageDenSpieler(
			spieler,
			frage,
			function(antwort) {
				var aktion = self._uebersetzeAntwort(antwort);
				if(aktion == 'check') {
					var hoechsteinsatz = self._gibAktuellenHoechsteinsatz();
					self._erhoeheAuf(spielerrunde, spieler, hoechsteinsatz);
				}
				self.croupier._speichereLetzteAktion(spieler, aktion);
				self._ermittleDenEinsatz(doneFunc, spielerrunde, temp - 1);
			}
		);
	};
	// VOID
	this._erhoeheAuf = function(spielerrunde, spielername, geforderterEinsatz) {
		var alle_spieler = spielerrunde.gibAlleSpieler();
		for(var i = 0; i < alle_spieler.length; i++) {
			if(alle_spieler[i].name == spielername) {
				var daten = alle_spieler[i].daten;
				var einsatzVeraenderung = geforderterEinsatz - daten['Einsatz'];
				daten['Einsatz'] = parseInt(daten['Einsatz']) + einsatzVeraenderung + '';
				this.croupier.stack[spielername] -= einsatzVeraenderung;
				this.croupier.pot += einsatzVeraenderung;				
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
