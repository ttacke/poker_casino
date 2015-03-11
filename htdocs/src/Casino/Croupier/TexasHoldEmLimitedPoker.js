"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPoker.prototype = new CasinoCroupier();
function CasinoCroupierTexasHoldEmLimitedPoker(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	this.spielerdaten = [];
	var minSpielerAnzahl = 3;
	var maxSpielerAnzahl = 23;
	
	this.spielerrunde = new CasinoPokerSpielerrunde(
		minSpielerAnzahl, maxSpielerAnzahl
	);
	
	// OBJ
	this._gibSpielerdaten = function(name) {
		if(!this.spielerdaten[name]) {
			this.spielerdaten[name] = {};
		}
		return this.spielerdaten[name];
	};
	// ARRAY
	this._parseKarten = function(string) {
		var stapel = [];
		var liste = string.split(" ");
		for(var i = 0; i < liste.length; i++) {
			if(liste[i].length < 2) continue;
			
			var kartenDaten = liste[i].split("");
			if(kartenDaten.length == 3) {
				kartenDaten[0] += kartenDaten[1];
				kartenDaten[1] = kartenDaten[2];
			}
			stapel.push(new CasinoPokerSpielkarte(kartenDaten[0], kartenDaten[1]));
		}
		return stapel;
	};
	// VOID
	this._spielePreflop = function(kartenstapel) {
		this.spielerrunde.gibDenSpielerDerAnDerReiheIst();
		this.spielerrunde.gibDenSpielerDerAnDerReiheIst();
		
		var alle_spieler = this.spielerrunde.gibListe();
		for(var i = 0; i < alle_spieler.length; i++) {
			var spieler = alle_spieler[i];
			var daten = this._gibSpielerdaten(spieler);
			
			daten['Hand'] = [
				kartenstapel.pop().toString(),
				kartenstapel.pop().toString()
			];
			daten['Tisch'] = [];
			daten['letzteAktion'] = '-';
			daten['Pot'] = '6';
			
		}
		//TODO

		this._spieleRunde();
		this.spielerrunde.gibDenSpielerDerAnDerReiheIst();
	};
	// VOID
	this._spieleFlop = function(kartenstapel) {
		var karteA = kartenstapel.pop().toString();
		var karteB = kartenstapel.pop().toString();
		var karteC = kartenstapel.pop().toString();
		
		var alle_spieler = this.spielerrunde.gibListe();
		for(var i = 0; i < alle_spieler.length; i++) {
			var spieler = alle_spieler[i];
			var daten = this._gibSpielerdaten(spieler);
			daten['Tisch'].push(karteA, karteB, karteC);
		}
		this._spieleRunde();
	};
	// VOID
	this._spieleTurnCard = function(kartenstapel) {
		var neueTischkarte = kartenstapel.pop().toString();
		var alle_spieler = this.spielerrunde.gibListe();
		for(var i = 0; i < alle_spieler.length; i++) {
			var spieler = alle_spieler[i];
			var daten = this._gibSpielerdaten(spieler);
			daten['Tisch'].push(neueTischkarte);
		}
		this._spieleRunde();
	};
	// VOID
	this._spieleRiver = function(kartenstapel) {
		var neueTischkarte = kartenstapel.pop().toString();
		var alle_spieler = this.spielerrunde.gibListe();
		for(var i = 0; i < alle_spieler.length; i++) {
			var spieler = alle_spieler[i];
			var daten = this._gibSpielerdaten(spieler);
			daten['Tisch'].push(neueTischkarte);
		}
		this._spieleRunde();
	};
	// VOID
	this._spieleRunde = function(frage) {
		var self = this;
		for(var i = 0; i < this.spielerrunde.anzahlDerSpieler(); i++) {
			var spieler = this.spielerrunde.gibDenSpielerDerAnDerReiheIst();
			if(!frage) {
				frage = eval(uneval(this._gibSpielerdaten(spieler)));
				var alle_spieler = self.spielerrunde.gibListe();
				frage['Spieler'] = [];
				for(var ii = 0; ii < alle_spieler.length; ii++) {
					frage['Spieler'].push({
						'Name':alle_spieler[ii],
						'letzteAktion':'check',//TODO this._gibSpielerdaten(alle_spieler[ii])['letzteAktion'],
						'Stack':'-2'
					});
					//TODO das gemerkte letzte, wird nicht benutzt???
//					console.log(frage['Spieler']);
//					console.log(self._gibSpielerdaten(alle_spieler[ii])['letzteAktion']);
				}
			}
			ich.frageDenSpieler(
				spieler,
				frage,
				function(antwort) {
					var daten = self._gibSpielerdaten(spieler);
					daten['letzteAktion'] = self._uebersetzeAntwort(antwort);
				}
			);
		}
//		console.log(self.spielerdaten);
	};
	// STRING
	this._uebersetzeAntwort = function(antwort) {
		if(antwort != 'check' && antwort != 'raise') {
			return 'fold';
		}
		return antwort;
	};
	// VOID
	this._spieleShowdown = function() {
		this._spieleRunde({
			'Tisch': ['2♦','2♦','2♦','2♦','2♦'],
			'Pot': '6',
			'Gewinner':[
				{'Name':'A','Gewinn':'2','Blatt':['2♦','2♦','2♦','2♦','2♦']},
				{'Name':'B','Gewinn':'2','Blatt':['2♦','2♦','2♦','2♦','2♦']},
				{'Name':'C','Gewinn':'2','Blatt':['2♦','2♦','2♦','2♦','2♦']}
			],
			'Spieler': [
				{'Name':'A','letzteAktion':'check','Stack':'-2','Hand':['2♦','2♦']},
				{'Name':'B','letzteAktion':'check','Stack':'-2','Hand':['2♦','2♦']},
				{'Name':'C','letzteAktion':'check','Stack':'-2','Hand':['2♦','2♦']}
			]
		});
	};
	// VOID
	this.nimmMitspielerAuf = function(doneFunc) {
		var self = this;
		this.zeigeSpielerDesTisches(function(liste) {
			for(var i = 0; i < liste.length; i++) {
				self.spielerrunde.nimmSpielerAufWennNeu(liste[i]);
			}
			doneFunc();
		});
	};
	// STRING
	this._erstelleKartenstapelString = function() {
		var farben = "♦ ♥ ♠ ♣".split(" ");
		var werte = "2x 3x 4x 5x 6x 7x 8x 9x 10x Jx Qx Kx Ax";
		var alle = [];
		for(var i = 0; i < farben.length; i++) {
			alle.push(werte.replace(/x/g, farben[i]));
		}
		return alle.join(" ");
	};
	// ARRAY
	this._erstelleKartenstapel = function() {
		return this._parseKarten(this._erstelleKartenstapelString());
	};
	// ARRAY
	this._mischeStapel = function(array) {
		var currentIndex = array.length;
		var temporaryValue;
		var randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	};
	// VOID
	this.spieleEinSpiel = function(doneFunc) {
		var self = this;
		if(!self.spielerrunde.starteNeuesSpielUndSchiebeGeberTokenWeiter()) {
			doneFunc(false);
			return;
		}
		self.spielerdaten = new Object();
		var kartenstapel = this._erstelleKartenstapel();
		kartenstapel = this._mischeStapel(kartenstapel);
		
		self._spielePreflop(kartenstapel);
		self._spieleFlop(kartenstapel);
		self._spieleTurnCard(kartenstapel);
		self._spieleRiver(kartenstapel);
		self._spieleShowdown(kartenstapel);
		
		doneFunc(true);
	};
}
 