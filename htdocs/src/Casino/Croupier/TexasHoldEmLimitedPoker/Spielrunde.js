"use strict";

// CLASS DEFINITION
function CasinoCroupierTexasHoldEmLimitedPokerSpielrunde(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		// DoNothing
	};
	// VOID
	this.spielen = function(spielerrunde, kartenstapel, doneFunc) {
		this._ermittleDenEinsatz(doneFunc, spielerrunde, spielerrunde.anzahlDerSpieler());
	};
	// BOOLEAN
	this._bieterrunde_enthaelt_nur_call = function(spielerListe) {
		var trifft_zu = true;
		for(var i = 0; i < spielerListe.length; i++) {
			if(spielerListe[i].gibLetzteAktion() != 'call') {
				trifft_zu = false;
			}
		}
		return trifft_zu;
	}
	// BOOLEAN
	this._bieterrunde_enthaelt_ein_startraise_und_sonst_nur_call = function(spielerListe) {
		var trifft_zu = true;
		
		if(spielerListe[spielerListe.length - 1].gibLetzteAktion() != 'raise') {
			trifft_zu = false;
		}
		for(var i = 0; i < spielerListe.length - 1; i++) {
			if(spielerListe[i].gibLetzteAktion() != 'call') {
				trifft_zu = false;
			}
		}
		return trifft_zu;
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
		if(this._bieterrunde_enthaelt_nur_call(spielerListe)) return true;
		if(this._bieterrunde_enthaelt_ein_startraise_und_sonst_nur_call(spielerListe)) return true;
		
		return false;//TODO implementieren
	};
	// VOID TODO
	this.spielenNEW = function(spielerrunde, kartenstapel, doneFunc) {
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
				var aktion = self._uebersetzeAntwort(antwort);
				//if(aktion == 'fold') {
			//		spielerrunde.
				//}
				
				if(aktion == 'check') {
					var hoechsteinsatz = spielerrunde.gibAktuellenHoechsteinsatz();
					spielerrunde.erhoeheEinsatzAuf(spieler, hoechsteinsatz);
				}
				spieler.setzeLetzteAktion(aktion);
				
				if(self._istWettrundeBeendet(spieler, spielerrunde)) {
					doneFunc();
					return;
				}
				self.spielenNEW(spielerrunde, kartenstapel, doneFunc);
			}
		);
	};
	// VOID
	this._ermittleDenEinsatz = function(doneFunc, spielerrunde, temp) {
		if(temp <= 0) {//TODO implementieren
			doneFunc(true);
			return;
		}
		
		var spieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		var frage = this._erzeugeFrage(spieler, spielerrunde);
		var self = this;
		this.croupier.frageDenSpieler(
			spieler.gibName(),
			frage,
			function(antwort) {
				var aktion = self._uebersetzeAntwort(antwort);
				if(aktion == 'check') {
					var hoechsteinsatz = spielerrunde.gibAktuellenHoechsteinsatz();
					spielerrunde.erhoeheEinsatzAuf(spieler, hoechsteinsatz);
				}
				spieler.setzeLetzteAktion(aktion);
				self._ermittleDenEinsatz(doneFunc, spielerrunde, temp - 1);
			}
		);
	};
	
	// HASH
	this._erzeugeFrage = function(spieler, spielerrunde) {
		var frage = {
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
	this._uebersetzeAntwort = function(antwort) {
		if(antwort != 'check' && antwort != 'raise') {
			return 'fold';
		}
		return antwort;
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
