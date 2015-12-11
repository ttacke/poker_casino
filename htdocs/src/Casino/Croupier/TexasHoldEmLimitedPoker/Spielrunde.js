"use strict";

// CLASS DEFINITION
function CasinoCroupierTexasHoldEmLimitedPokerSpielrunde(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	this.typ = '-';
	
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		// DoNothing
	};
	// BOOLEAN
	this._bieterrunde_enthaelt_nur_check = function(spielerListe) {
		var trifft_zu = true;
		for(var i = 0; i < spielerListe.length; i++) {
			if(spielerListe[i].gibLetzteAktion() != 'check') {
				trifft_zu = false;
			}
		}
		return trifft_zu;
	}
	// BOOLEAN
	this._bieterrunde_enthaelt_ein_startraise_und_sonst_nur_check = function(spielerListe) {
		if(spielerListe[0].gibLetzteAktion() != 'raise') {
			return false;
		}
		for(var i = 1; i < spielerListe.length; i++) {
			if(spielerListe[i].gibLetzteAktion() != 'check') {
				return false;
			}
		}
		return true;
	}
	// BOOLEAN
	this._nur_noch_ein_spieler_vorhanden = function(spielerListe) {
		var spieler_zaehler = 0;
		for(var i = 0; i < spielerListe.length; i++) {
			if(!spielerListe[i].istAusgestiegen()) {
				spieler_zaehler++;
			}
		}
		if(spieler_zaehler == 1) return true;
		
		return false;
	}
	// BOOLEAN
	this._istWettrundeBeendet = function(spieler, spielerrunde) {
		var spielerListe = spielerrunde.gibSpielerlisteVomAktuellenRueckwaerts(spieler);
		
		if(this._nur_noch_ein_spieler_vorhanden(spielerListe)) return true;
		
		if(this._bieterrunde_enthaelt_nur_check(spielerListe)) return true;
		
		if(this._bieterrunde_enthaelt_ein_startraise_und_sonst_nur_check(spielerListe)) return true;
		
		return false;
	};
	// VOID
	this.spielen = function(spielerrunde, kartenstapel, doneFunc) {
		var spieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		if(this._istWettrundeBeendet(spieler, spielerrunde)) {
			doneFunc();
			return;
		}
		
		var frage = this._erzeugeFrage(spieler, spielerrunde);
		var self = this;
		this.croupier.frageDenSpieler(
			spieler.gibName(),
			frage,
			function(antwort) {
				var aktion = self._uebersetzeAntwort(spieler, antwort);
				if(aktion == 'raise') {
					//TODO
					var hoechsteinsatz = spielerrunde.gibAktuellenHoechsteinsatz();
					spielerrunde.erhoeheEinsatzAuf(spieler, hoechsteinsatz + self._gibRaiseEinsatz());
				}
				
				if(aktion == 'check') {
					var hoechsteinsatz = spielerrunde.gibAktuellenHoechsteinsatz();
					spielerrunde.erhoeheEinsatzAuf(spieler, hoechsteinsatz);
				}
				spieler.setzeLetzteAktion(aktion);
				
				self.spielen(spielerrunde, kartenstapel, doneFunc);
			}
		);
	};
	// INT
	this._gibRaiseEinsatz = function() {
		return this.smallBlind * 2;
	};
	// HASH
	this._erzeugeFrage = function(spieler, spielerrunde) {
		var frage = {
			'typ': this.typ,
			'Hand': this._clone(spieler.gibHandkarten()),
			'Tisch': this._clone(spieler.gibTischkarten()),
			'LetzteAktion': spieler.gibLetzteAktion(),
			'Einsatz': spieler.gibEinsatz() + '',
			'Pot': spielerrunde.gibPot() + '',
			'Stack': spieler.gibStack() + '',
			'Hoechsteinsatz': spielerrunde.gibAktuellenHoechsteinsatz() + '',
		};
		var alle_spieler = spielerrunde.gibAlleSpieler();
		frage['Spieler'] = [];
		for(var i = 0; i < alle_spieler.length; i++) {
			frage['Spieler'].push({
				'Name': alle_spieler[i].gibName(),
				'letzteAktion': alle_spieler[i].gibLetzteAktion(),
				'Stack': alle_spieler[i].gibStack() + '',
				'Einsatz': alle_spieler[i].gibEinsatz() + '',
			});
		}
		return frage;
	};
	// STRING
	this._uebersetzeAntwort = function(spieler, antwort) {
		if(antwort.details != 'check' && antwort.details != 'raise') {
			return 'fold';
		}
		if(antwort.details == 'raise') {
			spieler.fuegeRaiseHinzu();
			if(spieler.anzahlDerRaises() > 3) {
				return 'check';
			}
		}
		return antwort.details;
	};
	// ARRAY
	this._clone = function(item) {
		var self = this;
		if (Object.prototype.toString.call( item ) === "[object Array]") {
			var result = [];
			item.forEach(function(child, index, array) { 
				result[index] = self._clone( child );
			});
			return result;
		} else if (typeof item == "object") {
			var result = {};
			for (var i in item) {
				result[i] = self._clone( item[i] );
			}
			return result;
		} else {
			return item;
		}
	};
}
