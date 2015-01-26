"use strict";

// CLASS DEFINITION
CasinoCroupier.prototype = new CasinoBesucher();
function CasinoCroupier(id, geheimeId) {
	this.id = id;
	this.geheimeId = geheimeId;
	this.stehtAmTisch = null;
	
	this.eroeffneTisch = function(tischId, nameDesSpiels, antwortFunktion) {
		var self = this;
		this._sende(
			{
				"aktion":"eroeffneTisch",
				"tischId":tischId,
				"nameDesSpiels": nameDesSpiels,
				"croupierId":this.id,
				"geheimeCroupierId":this.geheimeId
			},
			function(daten) {
				if(daten.erfolg) {
					self.stehtAmTisch = tischId;
				}
				antwortFunktion(daten);
			}
		);
	};
	// VOID
	this.zeigeSpielerDesTisches = function(antwortFunktion) {
		var self = this;
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
	this.frageDenSpieler = function(spieler, nachricht, antwortFunktion) {
		var self = this;
		this._sende(
			{
				"aktion":"frageDenSpieler",
				"spielerId":spieler.id,
				"nachricht":nachricht,
			},
			function(daten) {
				antwortFunktion(daten);
			}
		);
	};
}
