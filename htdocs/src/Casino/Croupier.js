"use strict";

// CLASS DEFINITION
CasinoCroupier.prototype = new CasinoBesucher();
function CasinoCroupier(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	this.spielerTimeout = 100;
	this.aktuelleFrage = null;
	this.aufzeichnung = [];
	
	// OBJ
	this.gibAufzeichnung = function() {
		var list = this.aufzeichnung;
		this.aufzeichnung = [];
		return list;
	};
	// VOID
	this.herzschrittmacherLog = function() {
		console.log("Herzstillstand! Reanimierung durchgefuehrt.");
	}
	// VOID
	this.wiederholeLetzteSpielerfrage = function() {
		if(!this.aktuelleFrage || !this.warteAufAntwort) {
			throw "Herztot! Die letzte Frage konnte nicht wiederholt werden.";
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
			antwortFunktion
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
			var herzschrittmacher = setTimeout(function() {
				self.wiederholeLetzteSpielerfrage();
			}, timeout);
			this._sende(
				{
					"aktion": "frageDenSpieler",
					"spielerName": spielerName,
					"nachricht": nachricht,
				},
				function(daten) {
					self.aktuelleFrage = null;
					clearTimeout(herzschrittmacher);
					self._zeichneSpielzugAuf(spielerName, nachricht, daten);
					antwortFunktion(daten);
				}
			);
		}
		this.aktuelleFrage();
	};
	// VOID
	this._zeichneSpielzugAuf = function(spielerName, frage, antwort) {
		this.aufzeichnung.push({
			spieler: spielerName,
			frage: frage,
			antwort: antwort
		});
	};
}
