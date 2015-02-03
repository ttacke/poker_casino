"use strict";

// CLASS DEFINITION
CasinoCroupier.prototype = new CasinoBesucher();
function CasinoCroupier(id, passwort) {
	this.id = id;
	this.passwort = passwort;
	
	this.eroeffneTisch = function(tischId, nameDesSpiels, spielerTimeout, antwortFunktion) {
		var self = this;
		this._sende(
			{
				"aktion":"eroeffneTisch",
				"tischId":tischId,
				"nameDesSpiels": nameDesSpiels,
				"croupierId":this.id,
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
	this.frageDenSpieler = function(spielerId, nachricht, antwortFunktion) {
		this._sende(
			{
				"aktion":"frageDenSpieler",
				"spielerId":spielerId,
				"nachricht":nachricht,
			},
			function(daten) {
				antwortFunktion(daten);
			}
		);
	};
}
