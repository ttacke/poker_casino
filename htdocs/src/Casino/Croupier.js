"use strict";

// CLASS DEFINITION
CasinoCroupier.prototype = new CasinoBesucher();
function CasinoCroupier(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	
	this.eroeffneTisch = function(tischName, nameDesSpiels, spielerTimeout, antwortFunktion) {
		var self = this;
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
				antwortFunktion(daten);
			}
		);
	};
	// VOID
	this.frageDenSpieler = function(spielerName, nachricht, antwortFunktion) {
		this._sende(
			{
				"aktion":"frageDenSpieler",
				"spielerName":spielerName,
				"nachricht":nachricht,
			},
			function(daten) {
				antwortFunktion(daten);
			}
		);
	};
}
