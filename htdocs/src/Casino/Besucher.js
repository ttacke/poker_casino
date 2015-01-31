"use strict";

// CLASS DEFINITION
function CasinoBesucher() {
	this.verbindung = null;
	this.istVerbunden = false;
	this.warteAufAntwort = false;
	
	// VOID
	this.DESTROY = function(func) {
		var verbindungWirdGeschlossen = false;
		if(this['verbindung']) {
			verbindungWirdGeschlossen = true;
			if(func) {
				this.verbindung.onclose = function() {
					func();
				}
			}
			this.verbindung.close();
		}
		for(var key in this) {
			delete(this[key]);
		}
		
		if(func && !verbindungWirdGeschlossen) {
			func();
		}
	};
	// VOID
	this.betrete = function(url, istVerbundenFunktion) {
		try {
			this.verbindung = new WebSocket(url + '?noCache=' + new Date().getTime());
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
		this.verbindung.onerror = function() {
			console.log('Es sind Fehler bei der Verbindung aufgetreten');
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
	this.zeigeOffeneTische = function(antwortFunktion) {
		this._sende(
			{
				"aktion":"zeigeOffeneTische"
			},
			function(daten) {
				antwortFunktion(daten);
			}
		);
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
		//TODO fuer Tests nicht gut!!
		//throw new Error("Unerwartete Antwort erhalten: " + event.data + this.id1);
	};
}
