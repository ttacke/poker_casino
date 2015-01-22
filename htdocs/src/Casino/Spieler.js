"use strict";

// CLASS DEFINITION
CasinoSpieler.prototype = new CasinoBesucher();
function CasinoSpieler(id, geheimeId) {
	this.id = id;
	this.geheimeId = geheimeId;
	this.spieltAnTisch = false;
	
	// VOID
	this.spieleAnTisch = function(tischId, antwortFunktion) {
		var self = this;
		this._sende(
			{
				"aktion":"spieleAnTisch",
				"tischId":tischId,
				"geheimeSpielerId":this.geheimeId,
				"spielerId":this.id
			},
			function(daten) {
				if(daten.erfolg) {
					self.spieltAnTisch = true;
				}
				antwortFunktion(daten);
			}
		);
	};
	// VOID
	this.zeigeOffeneTische = function(antwortFunktion) {
		var self = this;
		this._sende(
			{
				"aktion":"zeigeOffeneTische"
			},
			function(daten) {
				antwortFunktion(daten);
			}
		);
	};
	this.verlasseTisch = function(antwortFunktion) {
		antwortFunktion({'erfolg':false, 'details':'You can checkout any time you like, but you can never leave.'});
	};
}
