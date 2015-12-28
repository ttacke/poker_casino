"use strict";

// CLASS DEFINITION
function PokerSpielaufzeichnungAbspielen() {
	this.doneFunc = null;
	this.spielzuege = [];
	this.showdown_daten = {};
	this.$spieler_template = null;
	this.$spielerplaetze_links = null;
	this.$spielerplaetze_rechts = null;
	this.spieler_zuordnung = {};
	this.$karten_template = null;
	
	// VOID
	this._naechsterZug = function() {
		var zug = this.spielzuege.shift();
		var $anzeige = this.spieler_zuordnung[zug.spieler];
		for(var name in this.spieler_zuordnung) {
			if(name == zug.spieler) continue;
			this.spieler_zuordnung[name].removeClass('ist_an_der_reihe');
		}
		$anzeige.addClass('ist_an_der_reihe');
		
		this._zeige_karten(zug, $anzeige);
	};
	// VOID
	this._zeige_karten = function(zug, $anzeige) {
		var $handkarten = $anzeige.find('.hand');
		var self = this;
		
		if($handkarten.html() == '' && zug.frage.Hand.length > 0) {
			setTimeout(function() {
				for(var i = 0; i < zug.frage.Hand.length; i++) {
					var farbe = self._gib_kartenfarbe(zug.frage.Hand[i]);
					var t = '<span class="karte ' + farbe + '">' + self.$karten_template.html() + '</span>';
					t = t.replace(/\[wert\]/, self._gib_kartenwert(zug.frage.Hand[i]));
					$handkarten.append(t);
				}
				setTimeout(function() { self._zeige_antwort($anzeige, zug.antwort.details) }, 1000);
			}, 1000);
			return;
		}
		setTimeout(function() { self._zeige_antwort($anzeige, zug.antwort.details) }, 1000);
	}
	// STRING
	this._gib_kartenwert = function(karte) {
		return karte.replace(/[♥♦♣♠]/, '');
	};
	// STRING
	this._gib_kartenfarbe = function(karte) {
		if(karte.match(/♥/)) return 'herz';
		if(karte.match(/♦/)) return 'karo';
		if(karte.match(/♣/)) return 'kreuz';
		if(karte.match(/♠/)) return 'pik';
		throw new Error('neverReachHere');
	};
	// VOID
	this._zeige_antwort = function($anzeige, antwort) {
		if(antwort != 'check' && antwort != 'raise') antwort = 'fold';
		
		var $a = $anzeige.find('.antwort');
		$a.html(antwort);
		$a.show();
		
		var self = this;
		setTimeout(function() {
			$a.hide();
			if(antwort == 'fold') $anzeige.addClass('ist_raus');
			
			self._naechsterZug();
		}, 1000);
	};
	// VOID
	this._extrahiere_showdown_daten = function(spielzuege) {
		var showdown = null;
		while(spielzuege[spielzuege.length - 1].frage.Rundenname == 'showdown') {
			showdown = spielzuege.pop();
		}
		return showdown;
	};
	// VOID
	this._erzeuge_spieler = function(spieler) {
		this.$spielerplaetze_links.html('');
		this.$spielerplaetze_rechts.html('');
		
		var sitzen_links = Math.floor(spieler.length / 2) - 1;
		for(var i = 0; i < spieler.length; i++) {
			var t = '<div id="spieleranzeige' + i + '" class="spieler">' + this.$spieler_template.html() + '</spieler>';
			t = t.replace(/\[name\]/, spieler[i].Name);
			if(i <= sitzen_links) {
				this.$spielerplaetze_links.append(t);
			} else {
				this.$spielerplaetze_rechts.prepend(t);
			}
			this.spieler_zuordnung[spieler[i].Name] = $('#spieleranzeige' + i);
		}
	};
	// VOID
	this.starte = function(aufzeichnung, doneFunc) {
		this.showdown_daten = this._extrahiere_showdown_daten(aufzeichnung);
		this.spielzuege = aufzeichnung;
		this.doneFunc = doneFunc;
		this.$spielerplaetze_links = $('#tisch tbody .links');
		this.$spielerplaetze_rechts = $('#tisch tbody .rechts');
		this.$spieler_template = $('#spieler_template');
		this.$karten_template = $('#karte_template');
		
		//TODO hier weiter
		// -> am ende done melden
		// -> board leeren und karten dort anzeigen
		this._erzeuge_spieler(this.showdown_daten.frage.Spieler);
		// -> einsatz zeigen (muss aus nächstem Zug ermittelt werden - frage.Spieler.Einsatz )
		this._naechsterZug();
		
		/*Relevante Daten
		
			#tisch .spieler
				.einsatz_inner
			
			#tisch #board
			
			frage.Einsatz = 0
			frage.Rundenname = preflop
			frage.Tisch = [ K+ K* ... ]
				
			// showdown
			frage.Gewinner[]
				Blatt = [ A* A+ K+ K* ]
				Gewinn = 38
				Name = INT:Mitläufer
		*/
	}
}
