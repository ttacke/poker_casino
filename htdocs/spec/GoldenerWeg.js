"use strict";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

var wsUrl = "ws://localhost:8080/";

describe("der goldene Weg im Casino:", function() {
	var croupier = null;
	beforeEach(function(done) {
		croupier = new CasinoCroupier("Croupier1", "1");
		croupier.betrete(wsUrl, function() {
			done();
		});
	});
	afterEach(function(done) {
		croupier.verlasse(function() {
			done();
		});
	});
	describe("Wenn ein Croupier einen Tisch erstellt", function(done) {
		var tischId = 'tisch1';
		beforeEach(function(done) {
			croupier.eroeffneTisch(tischId, function(antwort) {
				expect(croupier.stehtAmTisch).toBe(tischId);
				done();
			});
		});
		describe("und ein Spieler an diesem Tisch spielt", function() {
			var spieler = null;
			beforeEach(function(done) {
				spieler = new CasinoSpieler("Spieler1", "1");
				spieler.betrete(wsUrl, function() {
					spieler.spieleAnTisch(tischId, function(antwort) {
						expect(spieler.spieltAnTisch).toBe(true);
						done();
					});
				});
			});
			afterEach(function(done) {
				spieler.verlasseTisch(function(antwort) {
					done();
				});
			});
			it("dann kann der Croupier diesen Spieler sehen", function(done) {
				croupier.zeigeSpielerDesTisches(function(liste) {
					expect(liste).toContain('Spieler1');
					done();
				});
			});
			xit("und der Croupier kann diesen Spieler ansprechen", function() {
			});
			it("und der Spieler den Tisch nicht mehr verlassen", function(done) {
				spieler.verlasseTisch(function(antwort) {
					expect(antwort.erfolg).toBe(false);
					done();
				});
			});
		});
		xit("dann kann er den Tisch schließen", function(done) {
			croupier.schließeTisch(function() {
				done();
			});
		});
		xit("dann kann er Daten hinterlegen und auslesen", function() {
		});
	});
});

describe("Grenzfälle:", function() {
	it("ein Casino-Besucher kann das Casino nur per WebSocket-Protokoll betreten", function() {
		expect(
			function() {
				new Casino().betreten("FAKE")
			}
		).toThrow();
	});
	xit("ein Croupier kann den eigenen Tisch wieder betreten", function() {
	});
	xit("jeder Tisch ist einmalig", function() {
	});
	xit("jeder Spieler ist einmalig", function() {
	});
	xit("ein Croupier kann fremde Tische nicht schließen", function() {
	});
	xit("ein Croupier kann mit Spielern, die nicht an seinem Tische sitzen, nicht sprechen", function() {
	});
	xit("ein Croupier kann nur einen Tisch erstellen", function() {
	});
	xit("ein Croupier kann fremde Tische nicht betreten", function() {
	});
	xit("ein Croupier kann kein Spieler sein", function() {
	});
	xit("ein Spieler kann kein Croupier sein", function() {
	});
	xit("ein Spieler kann nur an einem Tisch spielen", function() {
	});
});
