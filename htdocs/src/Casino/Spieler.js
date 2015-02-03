"use strict";

// CLASS DEFINITION
CasinoSpieler.prototype = new CasinoBesucher();
function CasinoSpieler(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	
	// VOID
	this.spieleAnTisch = function(tischName, antwortFunktion) {
		var self = this;
		this._sende(
			{
				"aktion":"spieleAnTisch",
				"tischName":tischName,
				"spielerPasswort":this.passwort,
				"spielerName":this.name
			},
			function(daten) {
				antwortFunktion(daten);
			}
		);
	};
	// VOID
	this.verlasseTisch = function(antwortFunktion) {
		antwortFunktion({'erfolg':false, 'details':'You can checkout any time you like, but you can never leave.'});
	};
	// VOID
	this._unerwarteteAntwort = function(event) {
		var daten = JSON.parse(event.data);
		if(daten.status == 'frageVonCroupier') {
			this.derCroupierFragt(daten.details);
		} else {
			throw new Error("Unerwartete Antwort erhalten: " + event.data);
		}
	};
	// VOID
	this.derCroupierFragt = function(frage) {
		throw new Error("Das ist vom Spieler zu implementieren!");
		this._antworteDemCroupier('antwort');
	};
	// VOID
	this._antworteDemCroupier = function(antwort) {
		this.verbindung.send(
			JSON.stringify(
				{
					aktion: 'antwortAnDenCroupier',
					nachricht: antwort,
				}
			)
		);
	};
}
