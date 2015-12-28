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
	
	// VOID
	this._naechsterZug = function() {
		var zug = this.spielzuege.shift();
		var $anzeige = this.spieler_zuordnung[zug.spieler];
		for(var name in this.spieler_zuordnung) {
			if(name == zug.spieler) continue;
			this.spieler_zuordnung[name].removeClass('ist_an_der_reihe');
		}
		$anzeige.addClass('ist_an_der_reihe');
		
		var self = this;
		setTimeout(function() { self._zeige_antwort($anzeige, zug.antwort.details) }, 1000);
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
			console.log(spieler[i].Name);
			console.log($('#spieleranzeige' + i));
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
		
		//TODO hier weiter
		// -> jeden Spielzug als Schritt durchlaufen (1s)
		// -> am ende done melden
		// -> board leeren und karten dort anzeigen
		// -> spieler leeren und aktuelle spieler einsetzen
		this._erzeuge_spieler(this.showdown_daten.frage.Spieler);
		// -> aktiven spieler markieren
		// -> aktion zeigen
		// -> wenn fold, spieler entsprechend markieren
		// -> handkarten zeigen
		// -> einsatz zeigen (muss aus nächstem Zug ermittelt werden - frage.Spieler.Einsatz )
		this._naechsterZug();
		//console.log(spielzuege);
		/*Relevante Daten
		
			#tisch .links
			#tisch .rechts
			
			#tisch .spieler.ist_an_der_reihe.ist_raus
				.name
				.hand
				.einsatz_inner
			
			#tisch .karte (.kreuz.karo.herz.pik) .karte_inner
			
			#tisch #board
			
			spieler = INT:Mitläufer
			antwort.details = check, fold, raise
			frage.Einsatz = 0
			frage.Hand = [ A+ A* ]
			frage.Rundenname = preflop
			frage.Tisch = [ K+ K* ... ]
			frage.Spieler[]
				Name = INT:Mitläufer
				Einsatz = 0
				
			// showdown
			frage.Gewinner[]
				Blatt = [ A* A+ K+ K* ]
				Gewinn = 38
				Name = INT:Mitläufer
		
		
		
		*/
	}
	
	

/*	this.spielzuege = [];
	// VOID
	this.fuegeSpielzugEin = function(spielerName, frage, antwort) {
		this.spielzuege.push({
			spieler: spielerName,
			frage: frage,
			antwort: antwort
		});
	};
	// VOID
	this.gibNaechstenSpielzug = function() {
		return this.spielzuege.shift();
	}
	// ARRAY
	this.gibSpielerPunkte = function() {
		var timeouts = {};
		for(var i = 0; i < this.spielzuege.length; i++) {
			if(this.spielzuege[i].antwort.status == 'timeout') {
				timeouts[this.spielzuege[i].spieler] = true;
			}
		}
		
		var showdown = this.spielzuege[this.spielzuege.length - 1];
		var liste = [];
		for(var i = 0; i < showdown.frage.Spieler.length; i++) {
			var spielerdaten = showdown.frage.Spieler[i];
			var istGewinner = false;
			for(var ii = 0; ii < showdown.frage.Gewinner.length; ii++) {
				if(showdown.frage.Gewinner[ii].Name == spielerdaten.Name) {
					istGewinner = true;
				}
			}
			
			liste.push({
				name: spielerdaten.Name,
				stack: spielerdaten.Stack,
				hatGewonnen: istGewinner,
				hatTimeout: (timeouts[spielerdaten.Name] ? true : false),
			});
		}
		return liste;
	};
	
*/
}
