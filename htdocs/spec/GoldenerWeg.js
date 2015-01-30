"use strict";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;

var wsUrl = "ws://localhost:8080/";
var croupierId = "Croupier1";
var croupierPassword = "1";
var tischId = 'tisch1';
var spielname = 'pingpong';
var spielerId = "Spieler1";
var spielerPassword = "1";

// VOID
function RESET(done) {
	var verbindung = new WebSocket(wsUrl);
	verbindung.onopen = function(event) {
		verbindung.send('{"aktion":"RESET"}');
		verbindung.onmessage = function() {
			done();
		};
	};
}

describe("Szenario: Casino", function() {
	beforeEach(function(done) {
		RESET(done);
	});
	afterEach(function(done) {
		RESET(done);
	});
/*	describe("der goldene Weg im Casino:", function() {
		var croupier = null;
		beforeEach(function(done) {
			croupier = new CasinoCroupier(croupierId, croupierPassword);
			croupier.betrete(wsUrl, function() {
				done();
			});
		});
		afterEach(function(done) {
			croupier.DESTROY(done);
		});
		describe("Wenn ein Croupier einen Tisch erstellt", function(done) {
			beforeEach(function(done) {
				croupier.eroeffneTisch(tischId, spielname, function(antwort) {
					expect(croupier.stehtAmTisch).toBe(tischId);
					done();
				});
			});
			it("dann kann ein Spieler diesen Tisch in der Übersicht sehen", function(done) {
				var spieler = new CasinoSpieler(spielerId, spielerPassword);
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
				beforeEach(function(done) {
					spieler = new CasinoSpieler(spielerId, spielerPassword);
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
				xit("TODO Wertung beeinflussen, d.h. der Test-Croupier muss mal Punkte vergeben und 2 Spieler haben", function() {
				});
			});
			
			xit("dann kann er Daten hinterlegen und auslesen", function() {
			});
		});
	});*/
	describe("Angenommen ich bin ein Casino-Besucher", function() {
		var besucher;
		beforeEach(function() {
			besucher = new CasinoBesucher();
		});
		afterEach(function(done) {
			besucher.DESTROY(done);
		});
		it("wenn ich das Casino betreten will, muss ich eine Websocket Verbindung nutzen", function() {
			expect(
				function() {
					new besucher.betrete("KEINE_WS_URL");
				}
			).toThrow();
		});
	
	});
	describe("Angenommen ich bin ein Croupier", function() {
		var croupier = null;
		beforeEach(function(done) {
			croupier = new CasinoCroupier(croupierId, croupierPassword);
			croupier.betrete(wsUrl, function() {
				done();
			});
		});
		afterEach(function(done) {
			croupier.DESTROY(done);
		});
		
		describe("und ich eroeffne einen Tisch", function(done) {
			beforeEach(function(done) {
				croupier.eroeffneTisch(tischId, spielname, function(antwort) {
					expect(croupier.stehtAmTisch).toBe(tischId);
					expect(antwort.erfolg).toBe(true);
					done();
				});
			});
			describe("und ich verlasse das Casino", function(done) {
				beforeEach(function(done) {
					croupier.DESTROY(done);
				});
				it("dann kann ich den Tisch erneut betreten, wenn ich mich korrekt ausweise (der Spielname bleibt dabei unveraendert)", function(done) {
					croupier = new CasinoCroupier(croupierId, croupierPassword);
					croupier.betrete(wsUrl, function() {
						croupier.eroeffneTisch(tischId, spielname, function(antwort) {
							expect(croupier.stehtAmTisch).toBe(tischId);
							done();
						});
					});
				});
				it("dann wird, beim erneuten betreten des Tisches, der Spielnamen nicht veraendert", function(done) {
					croupier = new CasinoCroupier(croupierId, croupierPassword);
					croupier.betrete(wsUrl, function() {
						var nichtVerwendeterSpielname = spielname + 'SINNFREI';
						croupier.eroeffneTisch(tischId, nichtVerwendeterSpielname, function(antwort) {
							expect(croupier.stehtAmTisch).toBe(tischId);
							croupier.zeigeOffeneTische(function(liste) {
								expect(liste.length).toBe(1);
								expect(liste[0].nameDesSpiels).toBe(spielname);
								done();
							});
						});
					});
				});
				it("dann kann ich den Tisch nicht betreten, wenn ich mich falsch ausweise", function(done) {
					croupier = new CasinoCroupier(croupierId + "FALSCH", croupierPassword + "FALSCH");
					croupier.betrete(wsUrl, function() {
						croupier.eroeffneTisch(tischId, spielname, function(antwort) {
							expect(croupier.stehtAmTisch).toBe(null);
							done();
						});
					});
				});
			});
			describe("und zwei Spieler setzen sich an meinen Tisch", function(done) {
				var spielerA;
				var spielerB;
				var spielerAid = 'a';
				var spielerBid = 'b';
				beforeEach(function(done) {
					spielerA = new CasinoSpieler(spielerAid, spielerPassword);
					spielerA.betrete(wsUrl, function() {
						spielerA.spieleAnTisch(tischId, function(antwort) {
							expect(spielerA.spieltAnTisch).toBe(true);
							done();
						});
					});
				});
				beforeEach(function(done) {
					spielerB = new CasinoSpieler(spielerBid, spielerPassword);
					spielerB.betrete(wsUrl, function() {
						spielerB.spieleAnTisch(tischId, function(antwort) {
							expect(spielerA.spieltAnTisch).toBe(true);
							done();
						});
					});
				});
				afterEach(function(done) {
					spielerA.DESTROY(done);
				});
				afterEach(function(done) {
					spielerB.DESTROY(done);
				});
				it("dann kann ich diese Spieler sehen", function(done) {
					croupier.zeigeSpielerDesTisches(function(liste) {
						expect(liste.length).toBe(2);
						expect(liste).toContain(spielerAid);
						expect(liste).toContain(spielerBid);
						done();
					});
				});
				it("TODO hier klemmt es!!! Ggf erst die EinspielerTests machen! dann kann ich diese Spieler etwas fragen", function(done) {
					spielerA.derCroupierFragt = function(frage) {
						expect(frage).toEqual({'PING':'PING'});
						this._antworteDemCroupier({'PONG':'PONG'});
					};
					// 
					croupier.frageDenSpieler(spielerId, {'PING':'PING'}, function(antwort) {
						expect(antwort).toEqual({
							antwort: {'PONG':'PONG'},
							status: 'OK'
						});
						done();
					});
				});
			});
			xit("dann kann ich diesen Tisch schließen", function() {
			});
		});
		xit("jeder Spieler ist einmalig", function() {
		});
		xit("jeder Spieler kann nur ein mal einen Tisch betreten (je tisch einmalig)", function() {
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
});