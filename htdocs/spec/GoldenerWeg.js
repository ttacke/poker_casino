"use strict";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

var wsUrl = "ws://localhost:8080/";

describe("der goldene Weg im Casino:", function() {
	var croupier = null;
	var croupierId = "Croupier1";
	beforeEach(function(done) {
		croupier = new CasinoCroupier(croupierId, "1");
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
		var spielname = 'pingpong'
		beforeEach(function(done) {
			croupier.eroeffneTisch(tischId, spielname, function(antwort) {
				expect(croupier.stehtAmTisch).toBe(tischId);
				done();
			});
		});
		it("dann kann ein Spieler diesen Tisch in der Übersicht sehen", function(done) {
			var spieler = new CasinoSpieler("Spieler1", "1");
			spieler.betrete(wsUrl, function() {
				spieler.zeigeOffeneTische(function(antwort) {
					expect(antwort[0].nameDesSpiels).toEqual(spielname);
					expect(antwort[0].tischId).toEqual(tischId);
					done();
				});
			});
		});
		describe("und ein Spieler an diesem Tisch spielt", function() {
			var spieler = null;
			var spielerId = "Spieler1";
			beforeEach(function(done) {
				spieler = new CasinoSpieler(spielerId, "1");
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
			it("und der Croupier kann diesen Spieler etwas fragen", function(done) {
				spieler.derCroupierFragt = function(frage) {
					expect(frage).toEqual({'PING':'PING'});
					this._antworteDemCroupier({'PONG':'PONG'});
				};
				croupier.frageDenSpieler(spielerId, {'PING':'PING'}, function(antwort) {
					expect(antwort).toEqual({
						antwort: {'PONG':'PONG'},
						status: 'OK'
					});
					done();
				});
			});
			it("und der Spieler den Tisch nicht mehr verlassen", function(done) {
				spieler.verlasseTisch(function(antwort) {
					expect(antwort.erfolg).toBe(false);
					done();
				});
			});
			it("dann kann ein Spieler die Wertung sehen", function(done) {
				spieler.betrete(wsUrl, function() {
					spieler.zeigeOffeneTische(function(antwort) {
						expect(antwort[0].croupierId).toEqual(croupierId);
						expect(antwort[0].spielerAnzahl).toEqual(1);
						var wertung = antwort[0].wertung;
						expect(wertung[0]).toEqual({
							id: spielerId,
							punkte: 0
						});
						done();
					});
				});
			});
			xit("TODO Wertung beeinflussen, d.h. der Test-Croupier muss mal Punkte vergeben un 2 Spieler haben", function() {
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
	xit("wenn ein Spieler auf die Frage des Croupiers nicht rechtzeitig antwortet, bekommt der Croupier einen Timeout und die Antwort wird nicht weitergeleitet", function() {
	});
	xit("wenn ein spieler zu spät antwortet, bekommt er einen TimeoutHinweis", function() {
	});
});
