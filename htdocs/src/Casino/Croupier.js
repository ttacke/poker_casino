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
	this.aktuelleFrage = null;
	
	// VOID
	this.herzschrittmacherLog = function() {
		console.log("Herzstillstand! Reanimierung durchgefuehrt.");
	}
	// VOID
	this.wiederholeLetzteSpielerfrage = function() {
		if(!this.aktuelleFrage || !this.warteAufAntwort) {
			throw new Error("Herztot! Die letzte Frage konnte nicht wiederholt werden.");
		}
		this.herzschrittmacherLog();
		this.warteAufAntwort = false;
		this.aktuelleFrage();
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
		var self = this;
		this.aktuelleFrage = function() {
			var timeout = this.spielerTimeout * 2;
			if(timeout < 50) timeout = 50;
			var herzschrittmacher = setTimeout("CasinoCroupierHerzschrittmacher(" + this.instanzId + ")", timeout);
			this._sende(
				{
					"aktion": "frageDenSpieler",
					"spielerName": spielerName,
					"nachricht": nachricht,
				},
				function(daten) {
					self.aktuelleFrage = null;
					clearTimeout(herzschrittmacher);
					antwortFunktion(daten);
				}
			);
		}
		this.aktuelleFrage();
	};
}
