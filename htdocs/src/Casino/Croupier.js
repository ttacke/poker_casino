"use strict";

// CLASS DEFINITION
CasinoCroupier.prototype = new CasinoBesucher();
function CasinoCroupier(id, geheimeId) {
	this.id = id;
	this.geheimeId = geheimeId;
	
	this.eroeffneTisch = function(tischId, nameDesSpiels, spielerTimeout, antwortFunktion) {
		var self = this;
		this._sende(
			{
				"aktion":"eroeffneTisch",
				"tischId":tischId,
				"nameDesSpiels": nameDesSpiels,
				"croupierId":this.id,
				"geheimeCroupierId":this.geheimeId,
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
