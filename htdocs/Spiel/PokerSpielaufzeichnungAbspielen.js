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
	this.$board = null;
	this.$coin_template = null;
	this.$gewinneranzeige = null;
	this.pause_zwischen_den_aktionen = 1000;
	this.$gewinner_template = null;
	
	// VOID
	this._naechsterZug = function() {
		var zug = this.spielzuege.shift();
		
		for(var name in this.spieler_zuordnung) {
			if(name == zug.spieler) continue;
			this.spieler_zuordnung[name].removeClass('ist_an_der_reihe');
		}
		
		if(zug.frage.Rundenname == 'showdown') {
			this._zeige_gewinner();
			return;
		}
		
		this._zeige_spielzug(zug);
	};
	// VOID
	this._zeige_spielzug = function(zug) {
		if(zug.frage.Tisch.length > 0 && this.$board.children().length != zug.frage.Tisch.length) {
			var vorhandene_karten = this.$board.children().length;
			for(var i = vorhandene_karten; i < zug.frage.Tisch.length; i++) {
				var farbe = this._gib_kartenfarbe(zug.frage.Tisch[i]);
				var t = '<span class="karte ' + farbe + '">' + this.$karten_template.html() + '</span>';
				t = t.replace(/\[wert\]/, this._gib_kartenwert(zug.frage.Tisch[i]));
				this.$board.append(t);
			}
			
			var self = this;
			setTimeout(function() {
				self._zeige_spielzug(zug, $anzeige);
			}, this.pause_zwischen_den_aktionen);
			return;
		}
		
		var $anzeige = this.spieler_zuordnung[zug.spieler];
		$anzeige.addClass('ist_an_der_reihe');
		this._zeige_karten(zug, $anzeige);
	};
	// VOID
	this._zeige_karten = function(zug, $anzeige) {
		var $handkarten = $anzeige.find('.hand');
		var self = this;
		
		if(zug.frage.Hand.length > 0 && $handkarten.children().length != zug.frage.Hand.length) {
			setTimeout(function() {
				for(var i = 0; i < zug.frage.Hand.length; i++) {
					var farbe = self._gib_kartenfarbe(zug.frage.Hand[i]);
					var t = '<span class="karte ' + farbe + '">' + self.$karten_template.html() + '</span>';
					t = t.replace(/\[wert\]/, self._gib_kartenwert(zug.frage.Hand[i]));
					$handkarten.append(t);
				}
				self._zeige_karten(zug, $anzeige);
			}, this.pause_zwischen_den_aktionen);
			return;
		}
		
		setTimeout(function() { self._zeige_antwort($anzeige, zug) }, this.pause_zwischen_den_aktionen);
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
	this._zeige_antwort = function($anzeige, zug) {
		var antwort = zug.antwort.details;
		if(antwort != 'check' && antwort != 'raise') antwort = 'fold';
		
		var $a = $anzeige.find('.antwort');
		$a.html(antwort);
		$a.show();
		
		if(antwort != 'fold') this._zeige_einsatz($anzeige, zug);
		
		var self = this;
		setTimeout(function() {
			$a.hide();
			if(antwort == 'fold') $anzeige.addClass('ist_raus');
			
			self._naechsterZug();
		}, this.pause_zwischen_den_aktionen);
	};
	// VOID
	this._zeige_einsatz = function($anzeige, zug) {
		var naehsterZug = this.spielzuege[0];
		var neuer_einsatz = zug.frage.Einsatz;
		for(var i = 0; i < naehsterZug.frage.Spieler.length; i++) {
			if(naehsterZug.frage.Spieler[i].Name == zug.spieler) {
				neuer_einsatz = naehsterZug.frage.Spieler[i].Einsatz;
				break;
			}
		}
		
		this._fuege_einsatz_in_anzeige_hinzu($anzeige, neuer_einsatz);
	};
	// VOID
	this._fuege_einsatz_in_anzeige_hinzu = function($anzeige, neuer_einsatz) {
		var $hundert = $anzeige.find('.einsatz_inner .hundert');
		var $zehn = $anzeige.find('.einsatz_inner .zehn');
		var $ein = $anzeige.find('.einsatz_inner .ein');
		
		var verbleibender_einsatz = this._passe_coins_an($hundert, 100, neuer_einsatz);
		verbleibender_einsatz = this._passe_coins_an($zehn, 10, verbleibender_einsatz);
		this._passe_coins_an($ein, 1, verbleibender_einsatz);
	};
	// INT
	this._passe_coins_an = function($slot, teiler, neuer_einsatz) {
		var anzahl = Math.floor(neuer_einsatz / teiler);
		while($slot.children().length < anzahl) {
			var t = '<span class="coin">' + this.$coin_template.html() + '</span>';
			$slot.append(t);
		}
		while($slot.children().length > anzahl) {
			$slot.children().last().remove();
		}
		var rest = neuer_einsatz - (anzahl * teiler);
		return rest;
	};
	// VOID
	this._gib_showdown_daten = function(spielzuege) {
		return spielzuege[spielzuege.length - 1];
	};
	// VOID
	this._erzeuge_spieler = function(spieler) {
		var sitzen_links = Math.ceil(spieler.length / 2);
		for(var i = 0; i < spieler.length; i++) {
			var t = '<div id="spieleranzeige' + i + '" class="spieler">' + this.$spieler_template.html() + '</spieler>';
			t = t.replace(/\[name\]/, spieler[i].Name);
			if(i < sitzen_links) {
				this.$spielerplaetze_links.append(t);
			} else {
				this.$spielerplaetze_rechts.prepend(t);
			}
			
			this.spieler_zuordnung[spieler[i].Name] = $('#spieleranzeige' + i);
		}
	};
	// VOID
	this._zeige_blinds = function(spieler) {
		var smallBlind = this.spielzuege[spieler.length - 2];
		var bigBlind = this.spielzuege[spieler.length - 1];
		this._fuege_einsatz_in_anzeige_hinzu(
			this.spieler_zuordnung[smallBlind.spieler],
			smallBlind.frage.Einsatz
		);
		this._fuege_einsatz_in_anzeige_hinzu(
			this.spieler_zuordnung[bigBlind.spieler],
			bigBlind.frage.Einsatz
		);
	};
	// VOID
	this._zeige_gewinner = function() {
		var gewinn = 0;
		var gewinnerliste = this.showdown_daten.frage.Gewinner;
		for(var i = 0; i < gewinnerliste.length; i++) {
			var t = '<div class="gewinner">' + this.$gewinner_template.html() + '</div>';
			t = t.replace(/\[name\]/, gewinnerliste[i].Name);
			
			var gewinnerkarten = '';
			for(var j = 0; j < gewinnerliste[i].Blatt.length; j++) {
				var farbe = this._gib_kartenfarbe(gewinnerliste[i].Blatt[j]);
				var kt = '<span class="karte ' + farbe + '">' + this.$karten_template.html() + '</span>';
				kt = kt.replace(/\[wert\]/, this._gib_kartenwert(gewinnerliste[i].Blatt[j]));
				gewinnerkarten += kt;
			}
			
			t = t.replace(/\[gewinnerkarten\]/, gewinnerkarten);
			this.$gewinneranzeige.find('#spieler').append(t);
			gewinn = gewinnerliste[i].Gewinn;
		}
		
		this._fuege_einsatz_in_anzeige_hinzu(
			this.$gewinneranzeige,
			gewinn
		);
		this.$gewinneranzeige.show();
		
		var self = this;
		setTimeout(
			function() {
				self.$gewinneranzeige.hide();
				self.doneFunc()
			},
			this.pause_zwischen_den_aktionen * 5
		);
		return;
	};
	// VOID
	this.starte = function(aufzeichnung, doneFunc) {
		this.showdown_daten = this._gib_showdown_daten(aufzeichnung);
		this.spielzuege = aufzeichnung;
		this.doneFunc = doneFunc;
		this.$spielerplaetze_links = $('#tisch tbody .links');
		this.$spielerplaetze_rechts = $('#tisch tbody .rechts');
		this.$spieler_template = $('#spieler_template');
		this.$karten_template = $('#karte_template');
		this.$board = $('#board');
		this.$coin_template = $('#coin_template');
		this.$gewinneranzeige = $('#gewinner_outer');
		this.$gewinner_template = $('#gewinner_template');
		
		this.$gewinneranzeige.hide();
		this.$spielerplaetze_links.html('');
		this.$spielerplaetze_rechts.html('');
		this.$board.html('');
		this.$gewinneranzeige.find('#spieler').html('');
		this.$gewinneranzeige.find('.einsatz_inner .hundert').html('');
		this.$gewinneranzeige.find('.einsatz_inner .zehn').html('');
		this.$gewinneranzeige.find('.einsatz_inner .ein').html('');
		
		this._erzeuge_spieler(this.showdown_daten.frage.Spieler);
		this._zeige_blinds(this.showdown_daten.frage.Spieler);
		
		var self = this;
		setTimeout(function() { self._naechsterZug() }, this.pause_zwischen_den_aktionen);
	}
}
