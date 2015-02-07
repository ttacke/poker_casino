"use strict";

var CasinoVerbindungen = [];
function CasinoHerzschrittmacher(instanzId) {
	console.log("kammerflimmern");
	if(instanzId > -1 && CasinoVerbindungen[instanzId]) {
		CasinoVerbindungen[instanzId].verbindung.onmessage({ data: 'eKammerflimmern besetigt' });
	}
}
// CLASS DEFINITION
function CasinoBesucher() {
	this.verbindung = null;
	this.istVerbunden = false;
	this.warteAufAntwort = false;
	this.istAnTisch = null;
	this.instanzId = -1;
	
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
			CasinoVerbindungen.push(self);
			self.instanzId = CasinoVerbindungen.length - 1;
			
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
				daten.details = JSON.parse(daten.details);
				antwortFunktion(daten);
			}
		);
	};
	// VOID
	this.deponiereImSafe = function(kombination, schatz, antwortFunktion) {
		var self = this;
		this._sende(
			{
				"aktion":"deponiereImSafe",
				"kombination":kombination,
				"schatz":schatz,
			},
			function(daten) {
				antwortFunktion(daten);
			}
		);
	};
	// VOID
	this.zeigeSafeInhalt = function(kombination, antwortFunktion) {
		var self = this;
		this._sende(
			{
				"aktion":"zeigeSafeInhalt",
				"kombination":kombination,
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
		var herzschrittmacher = setTimeout("CasinoHerzschrittmacher(" + this.instanzId + ")", 100);
		this._sendeRohdaten(daten);
		this.warteAufAntwort = true;
		var self = this;
		this.verbindung.onmessage = function(event) {
			clearTimeout(herzschrittmacher);
			self.warteAufAntwort = false;
			self.verbindung.onmessage = function(event) {
				self._unerwarteteAntwort(event);
			};
			self._empfangeRohdaten(empfangsFunktion, event.data);
		};
	};
	// VOID
	this._empfangeRohdaten = function(func, daten) {
		var status = daten.substr(0, 1);
		var details = daten.substr(1, daten.length);
		var uebersetzung = {
			'o': 'ok',
			'e': 'fehler',
			't': 'timeout',
			'q': 'frageVonCroupier',
		};
		if(!uebersetzung[status]) {
			throw new Error("Ungueltige Antwort: " + daten);
		}
		var antwort = {
			'status': uebersetzung[status],
			'details': details,
		};
		// var antwort = JSON.parse(daten);
		func(antwort);
	}
	// VOID
	this._sendeRohdaten = function(daten) {
		// this.verbindung.send(JSON.stringify(daten));
		this.verbindung.send(this.uebersetzeJSONinKuerzel(daten));
	}
	// VOID
	this._unerwarteteAntwort = function(event) {
		throw new Error("Unerwartete Antwort erhalten: " + event.data);
	};
	this.uebersetzeJSONinKuerzel = function(d) {
		var msg = '';
		if(d.aktion == 'eroeffneTisch') {
			// {"aktion":"eroeffneTisch","tischName":"tisch1","nameDesSpiels":"pingpong","croupierName":"Croupier1","croupierPasswort":"Croupier1","spielerTimeout":80}
			msg = 'o' + d.tischName + "\n" + d.nameDesSpiels + "\n" + d.croupierName + "\n" + d.croupierPasswort + "\n" + d.spielerTimeout;
		} else if(d.aktion == 'deponiereImSafe') {
			// {"aktion":"deponiereImSafe","kombination":12345,"schatz":"derRingDesYogurt"}
			msg = 'd' + d.kombination + "\n" + d.schatz;
		} else if(d.aktion == 'zeigeSafeInhalt') {
			// {"aktion":"zeigeSafeInhalt","kombination":12345}
			msg = 'g' + d.kombination;
		} else if(d.aktion == 'zeigeOffeneTische') {
			// {"aktion":"zeigeOffeneTische"}
			msg = 'l';
		} else if(d.aktion == 'spieleAnTisch') {
			// {"aktion":"spieleAnTisch","tischName":"tisch1","spielerPasswort":"Spieler1","spielerName":"Spieler1"}
			msg = 'p' + d.tischName + "\n" + d.spielerName + "\n" + d.spielerPasswort;
		} else if(d.aktion == 'zeigeSpielerDesTisches') {
			// {"aktion":"zeigeSpielerDesTisches"}
			msg = 'v';
		} else if(d.aktion == 'frageDenSpieler') {
			// {"aktion":"frageDenSpieler","spielerName":"a","nachricht":1}
			msg = 'q' + d.spielerName + "\n" + d.nachricht;
		} else if(d.aktion == 'antwortAnDenCroupier') {
			// {"aktion":"antwortAnDenCroupier","nachricht":2}
			msg = 'r' + d.nachricht;
		} else if(d.aktion == 'RESET-ef84ab0c-5df1-4ff3-811b-706c3c92c6f5') {
			msg = 'x-ef84ab0c-5df1-4ff3-811b-706c3c92c6f5';
		}
		return msg;
	}
}
