"use strict";

// CLASS DEFINITION
function PokerBotBase() {
	this.name = '';
	this.passwort = '';
	this.beschreibung = '';
	
	this.casinoUrl = null;
	this.tischName = null;
	this.ws = null;
	this.invervallId = null;
	this.zeitpunktLetzteAktion = 0;
	this.maximaleZeitZwischenDenAktionen = 10 * 1000;
	// VOID
	this.starte = function(casinoIp, casinoPort, tischName) {
		this.casinoUrl = 'ws:' + casinoIp  + ':' + casinoPort;
		this.tischName = tischName;
		this._starte();
	}
	// VOID
	this._starte = function() {
		var self = this;
		console.log(this.casinoUrl);
		this.ws = new WebSocket(this.casinoUrl);
		this.ws.onopen = function(event) {
			self.ws.onmessage = function(event) {
				if(event.data != 'o') {
					throw new Error('Betreten fehlgeschlagen: ' + event.data);
				}
				self.invervallId = setInterval(function() {
					if(self.zeitpunktLetzteAktion + self.maximaleZeitZwischenDenAktionen < new Date().getTime()) {
						clearInterval(self.invervallId);
						self._starte();
					}
				}, self.maximaleZeitZwischenDenAktionen);
				
				self.ws.onmessage = function(event) {
					self.zeitpunktLetzteAktion = new Date().getTime();
					var frage = JSON.parse(event.data.substr(1, event.data.length));
					
					if(self.ws) self.reagiere(frage);
				}
			};
			self.ws.send('p' + self.tischName + "\nINT:" + self.name + "\n" + self.passwort);
		};
	};
	// VOID
	this.reagiere = function(frage) {
		throw Error('Implementieren');
	};
}
