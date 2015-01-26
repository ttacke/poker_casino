"use strict";

// CLASS DEFINITION
function CasinoBesucher() {
	this.verbindung = null;
	this.istVerbunden = false;
	this.warteAufAntwort = false;
	
	// VOID
	this.betrete = function(url, istVerbundenFunktion) {
		try {
			this.verbindung = new WebSocket(url);
		} catch(e) {
			throw new Error("die Casino-URL entspricht nicht dem Websocket-Protokoll");
		}
		var self = this;
		this.verbindung.onopen = function(event) {
			self.istVerbunden = true;
			istVerbundenFunktion();
		};
		this.verbindung.onclose = function(event) {
			self.verbindung = null;
			self.istVerbunden = false;
		};
	};
	// VOID
	this.verlasse = function(istGetrenntFunktion) {
		if(this.verbindung && this.istVerbunden) {
			var func = this.verbindung.onclose;
			this.verbindung.onclose = function(event) {
				func();
				istGetrenntFunktion();
			};
			this.verbindung.close();
		}
	};
	// VOID
	this._sende = function(daten, empfangsFunktion) {
		if(!this.istVerbunden) {
			throw new Error("Du hast das Casino noch nicht betreten");
		}
		if(this.warteAufAntwort) {
			throw new Error("Es wartet noch eine Anfrage auf Antwort");
		}
		var nachricht = JSON.stringify(daten);
		this.verbindung.send(nachricht);
		this.warteAufAntwort = true;
		var self = this;
		this.verbindung.onmessage = function(event) {
			self.warteAufAntwort = false;
			self.verbindung.onmessage = function(event) {
				self._unerwarteteAntwort(event);
			};
			empfangsFunktion(JSON.parse(event.data));
		};
	};
	// VOID
	this._unerwarteteAntwort = function(event) {
		throw new Error("Unerwartete Antwort erhalten: " + event.data);
	};
}
