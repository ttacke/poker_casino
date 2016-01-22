// INT
function gibBlattPunkte(string) {
	var blatt = string.substr(string.indexOf(" ") + 1, string.length);
	var punkte = new CasinoPokerGewinnermittlung().gibPunkte(
		ich._parseKarten(blatt)
	);
	return punkte;
};
// INT
function gibBesteKombination(hand, board) {
	var blatt = new CasinoPokerGewinnermittlung().gibBestesBlatt(
		ich._parseKarten(hand),
		ich._parseKarten(board)
	);
	return blatt;
};
// VOID
function generateCardSpec(blattA, soll, blattB) {
	it(blattA + ' ' + soll + ' ' + blattB, function() {
		var punkteA = gibBlattPunkte(blattA);
		var punkteB = gibBlattPunkte(blattB);
		
		var ist = '?';
		if(punkteA > punkteB) ist = 'schlaegt';
		if(punkteA == punkteB) ist = 'splitted';
		if(punkteA < punkteB) ist = 'unterliegt';
		
		expect(blattA + " " + ist + " " + blattB)
			.toBe(blattA + " " + soll + " " + blattB);
	});
}
// VOID
function generateCombinationSpec(soll, text) {
	var match = text.match(".*'([^']*)'.*'([^']*)'.*");
	var hand = match[1];
	var board = match[2];
	it(text, function() {
		var istBlatt = gibBesteKombination(hand, board);
		istBlatt.sort(function(a, b) {
			return (a.zahlwert + (a.farbwert / 10)) - (b.zahlwert + (b.farbwert / 10))
		});
		var ist = [];
		for(var i = 0; i < istBlatt.length; i++) {
			ist.push(istBlatt[i].toString());
		}
		expect(ist.join(" ")).toBe(soll);
	});
}
// VOID
function entferneSpielerVerbindungen(croupier) {
	croupier.zeigeSpielerDesTisches = function() {};
	croupier.frageDenSpieler = function() {};
}
// VOID
function erzeugeSpieler(name, croupier, spielerAntwortFunktion) {
	
	var bisherigeSpieler = [];
	croupier.zeigeSpielerDesTisches(function(liste) {
		bisherigeSpieler = liste.details;
	});
	bisherigeSpieler.push(name);
	croupier.zeigeSpielerDesTisches = function(antwortFunktion) {
		antwortFunktion({
			details: bisherigeSpieler
		});
	};
	
	var alteFunktion = croupier.frageDenSpieler;
	croupier.frageDenSpieler = function(spielerName, nachricht, antwortFunktion) {
		if(spielerName == name) {
			setTimeout(function() {
				var antwort = spielerAntwortFunktion(nachricht);
				antwortFunktion({ details: antwort });
			}, 0);
			return;
		}
		alteFunktion(spielerName, nachricht, antwortFunktion);
	};
}
function spielerKommunikationsWaechter() {
	this.spieler_liste = [];
	this.naechste_3_spieler = [];
	this.fragen_liste = [];
	this.naechste_3_fragen = [];
	
	// VOID
	this.reset = function() {
		this.spieler_liste = [];
		this.naechste_3_spieler = [];
		this.fragen_liste = [];
		this.naechste_3_fragen = [];
	}
	// VOID
	this.fragen_hook = function(spieler, frage) {
		this.spieler_liste.push(spieler);
		this.fragen_liste.push(frage);
	};
	// OBJ
	this.gibLetzteSpielerFrage = function(key, val) {
		return this.naechste_3_fragen[this.naechste_3_fragen.length - 1];
	};
	// VOID
	this.aktuelleSpielerFragenEnthalten = function(key, val) {
		for(var i = 0; i < 3; i++) {
			expect(this.naechste_3_fragen[i][key]).toEqual(val);
		}
	};
	// STRING
	this.spieler = function(i) {
		return this.naechste_3_spieler[i];
	};
	// VOID
	this.frageFuerSpielerEnthaelt = function(spieler, key, val) {
		for(var i = 0; i < this.naechste_3_spieler.length; i++) {
			if(this.naechste_3_spieler[i] == spieler) {
				expect(this.naechste_3_fragen[i][key]).toEqual(val);
				return;
			}
		}
		expect(true).toBe(false);
	};
	// VOID
	this.aktuelleSpielerFragenEnthaltenBieterinfos = function(hand, tisch) {
		this.aktuelleSpielerFragenEnthalten('Hand', hand);
		this.aktuelleSpielerFragenEnthalten('Tisch', tisch);
		
		for(var i = 0; i < this.naechste_3_fragen.length; i++) {
			var frage = this.naechste_3_fragen[i];
			expect(frage.Spieler[0].Name).toBe('A');
			expect(frage.Spieler[1].Name).toBe('B');
			expect(frage.Spieler[2].Name).toBe('C');
		}
	};
	// BOOLEAN
	this.esGibtKeineNeuenAnfragen= function() {
		if(this.spieler_liste.length == 0) return true;
		
		return false;
	}
	// VOID
	this.holeDieNachsten3Anfragen = function() {
		this.holeDieNachstenXAnfragen(3);
	}
	// VOID
	this.holeDieNachstenXAnfragen = function(x) {
		this.naechste_3_spieler = [];
		this.naechste_3_fragen = [];
		for(var i = 0; i < x; i++) {
			if(this.spieler_liste.length > 0) {
				this.naechste_3_spieler.push(this.spieler_liste.shift());
				this.naechste_3_fragen.push(this.fragen_liste.shift());
			}
		}
	}
	// VOID
	this.pruefeAktuelleSpielerAufrufe = function(a, b, c) {
		var list = [a, b, c];
		for(var i = 0; i < 3; i++) {
			expect(this.naechste_3_spieler[i]).toBe(list[i]);
		}
	}
	// VOID
	this.frageFuerSpielerEnthaelt_EinsatzStackPot = function(position, spieler, einsatz, stack, pot) {
		expect(this.spieler(position)).toBe(spieler);
		this.frageFuerSpielerEnthaelt(spieler, 'Einsatz', einsatz);
		this.frageFuerSpielerEnthaelt(spieler, 'Stack', stack);
		this.frageFuerSpielerEnthaelt(spieler, 'Pot', pot);
	};
}
// VOID
function aktuelleSpielerDatenEnthalten(croupier, key, val) {
	var spielerliste = croupier.spielerrunde.gibAlleSpieler();
	for(var i = 0; i < spielerliste.length; i++) {
		var daten = spielerliste[i]._daten;
		expect(daten[key] + '').toBe(val);
	}
}
// VOID
function derAktuellePotIst(croupier, pot) {
	expect(croupier.spielerrunde.gibPot()).toBe(pot);
}
// VOID
function derAktuelleStackVomSpielerIst(croupier, spielername, stack) {
	var spielerliste = croupier.spielerrunde.gibAlleSpieler();
	for(var i = 0; i < spielerliste.length; i++) {
		if(spielerliste[i].gibName() == spielername) {
			expect(spielerliste[i].gibStack()).toBe(stack);
			return;
		}
	}
	expect(true).toBe(false);
	
}