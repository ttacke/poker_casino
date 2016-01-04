"use strict";

// CLASS DEFINITION
function CasinoBesucher() {
	this.verbindung = null;
	this.istVerbunden = false;
	this.warteAufAntwort = false;
	this.istAnTisch = null;
	this.empfangsFunktion = function() {};
	this.verbindungsfehlerFunktion = null;
	
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
	this.betrete = function(url, istVerbundenFunktion, verbindungFehlgeschlagenFunc) {
		try {
			this.verbindung = new WebSocket(url + '?noCache=' + new Date().getTime());
		} catch(e) {
			throw "die Casino-URL entspricht nicht dem Websocket-Protokoll";
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
			if(verbindungFehlgeschlagenFunc) {
				verbindungFehlgeschlagenFunc();
			} else {
				console.log('Es sind Fehler bei der Verbindung aufgetreten');
			}
		};
		this.verbindung.onmessage = function(event) {
			self._verarbeiteAntwort(event);
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
			this._verbindungsfehlerAufgetreten();
			return;
		}
		if(this.warteAufAntwort) {
			throw "Es wartet noch eine Anfrage auf Antwort";
		}
		this.empfangsFunktion = empfangsFunktion;
		this.warteAufAntwort = true;
		this._sendeRohdaten(daten);
	};
	// VOID
	this._verbindungsfehlerAufgetreten = function() {
		if(this.verbindungsfehlerFunktion) {
			this.verbindungsfehlerFunktion();
		} else {
			throw "Du hast das Casino noch nicht betreten";
		}
	};
	// VOID
	this._verarbeiteAntwort = function(event) {
		if(!this.warteAufAntwort) {
			return this._unerwarteteAntwort(event);
		}
		this.warteAufAntwort = false;
		this._empfangeRohdaten(this.empfangsFunktion, event.data);
	};
	// VOID
	this._unerwarteteAntwort = function(event) {
		throw "Unerwartete Antwort erhalten: " + event.data;
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
			throw "Ungueltige Antwort: " + daten;
		}
		var antwort = {
			'status': uebersetzung[status],
			'details': this._repariere_encoding(details),
		};
		// var antwort = JSON.parse(daten);
		func(antwort);
	};
	// STRING
	this._repariere_encoding = function(content) {
		var string = encodeURIComponent(content);
		string = string.replace(
			/(%[0-9A-F]{2})%83%C2(%[0-9A-F]{2})/g, 
			function(hit) { return RegExp.$1 + RegExp.$2 }
		);
		return decodeURIComponent(string);
	};
	// VOID
	this._sendeRohdaten = function(daten) {
		// this.verbindung.send(JSON.stringify(daten));
		this.verbindung.send(this.uebersetzeJSONinKuerzel(daten));
	}
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
			msg = 'q' + d.spielerName + "\n" + JSON.stringify(d.nachricht);
		} else if(d.aktion == 'antwortAnDenCroupier') {
			// {"aktion":"antwortAnDenCroupier","nachricht":2}
			msg = 'r' + d.nachricht;
		} else if(d.aktion == 'RESET-ef84ab0c-5df1-4ff3-811b-706c3c92c6f5') {
			msg = 'x-ef84ab0c-5df1-4ff3-811b-706c3c92c6f5';
		}
		return msg;
	}
}
