"use strict";

var CasinoCroupierVerbindungen = [];
function CasinoCroupierHerzschrittmacher(instanzId) {
	if(instanzId > -1 && CasinoCroupierVerbindungen[instanzId]) {
		CasinoCroupierVerbindungen[instanzId].wiederholeLetzteSpielerfrage();
	} else {
		throw new Error("Herztot! Croupier-Instanz nicht gefunden.");
	}
}

// CLASS DEFINITION
CasinoCroupier.prototype = new CasinoBesucher();
function CasinoCroupier(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	this.instanzId = -1;
	this.spielerTimeout = 100;
	this.letzteFrage = null;
	
	this.wiederholeLetzteSpielerfrage = function() {
		if(!this.letzteFrage || !this.warteAufAntwort) {
			throw new Error("Herztot! Die letzte Frage konnte nicht wiederholt werden.");
		}
		
		console.log("Herzstillstand! Reanimierung durchgefuehrt.");
		this.warteAufAntwort = false;
		this.frageDenSpieler(
			this.letzteFrage.spielerName,
			this.letzteFrage.nachricht,
			this.letzteFrage.antwortFunktion
		);
	};
	this.eroeffneTisch = function(tischName, nameDesSpiels, spielerTimeout, antwortFunktion) {
		var self = this;
		this.spielerTimeout = spielerTimeout;
		this._sende(
			{
				"aktion":"eroeffneTisch",
				"tischName":tischName,
				"nameDesSpiels": nameDesSpiels,
				"croupierName":this.name,
				"croupierPasswort":this.passwort,
				"spielerTimeout": spielerTimeout
			},
			function(daten) {
				CasinoCroupierVerbindungen.push(self);
				self.instanzId = CasinoCroupierVerbindungen.length - 1;
				antwortFunktion(daten);
			}
		);
	};
	// VOID
	this.zeigeSpielerDesTisches = function(antwortFunktion) {
		this._sende(
			{
				"aktion":"zeigeSpielerDesTisches",
			},
			function(daten) {
				daten.details = JSON.parse(daten.details);
				antwortFunktion(daten);
			}
		);
	};
	// VOID
	this.frageDenSpieler = function(spielerName, nachricht, antwortFunktion) {
		this.letzteFrage = {
			spielerName: spielerName,
			nachricht: nachricht,
			antwortFunktion: antwortFunktion
		};
		var timeout = this.spielerTimeout * 2;
		if(timeout < 100) timeout = 100;
		var herzschrittmacher = setTimeout("CasinoCroupierHerzschrittmacher(" + this.instanzId + ")", timeout);
		this._sende(
			{
				"aktion":"frageDenSpieler",
				"spielerName":spielerName,
				"nachricht":nachricht,
			},
			function(daten) {
				self.letzteFrage = null;
				clearTimeout(herzschrittmacher);
				antwortFunktion(daten);
			}
		);
	};
}
