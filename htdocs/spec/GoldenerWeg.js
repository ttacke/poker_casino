"use strict";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

var wsUrl = "ws://localhost:8080/";

var croupierId = "Croupier1";
var croupierPassword = "1";
var tischId = 'tisch1';
var spielname = 'pingpong';

var spielerId = "Spieler1";
var spielerPassword = "1";

var spielerBId = "Spieler1";
var spielerBPassword = "1";

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
	describe("Angenommen ich bin ein Casino-Besucher", function() {
		var besucher;
		beforeEach(function() {
			besucher = new CasinoBesucher();
		});
		afterEach(function(done) {
			besucher.DESTROY(done);
		});
		describe("und ich will das Casino betreten", function() {
			it("dann muss ich eine Websocket Verbindung nutzen", function() {
				expect(
					function() {
						new besucher.betrete("KEINE_WS_URL");
					}
				).toThrow();
			});
		});
		describe("und ich betrete das Casino", function() {
			describe("und ich deponiere etwas in der Bank", function() {
				xit("dann kann ich das auch wieder abholen", function() {
				});
			});
		});
	});
	describe("Angenommen ich bin ein Spieler", function() {
		var spieler = null;
		beforeEach(function(done) {
			spieler = new CasinoSpieler(spielerId, spielerPassword);
			spieler.betrete(wsUrl, function() {
				done();
			});
		});
		describe("und finde ein Casino mit einem Tisch vor", function() {
			var croupier = null;
			beforeEach(function(done) {
				croupier = new CasinoCroupier(croupierId, croupierPassword);
				croupier.betrete(wsUrl, function() {
					croupier.eroeffneTisch(tischId, spielname, function(antwort) {
						expect(croupier.stehtAmTisch).toBe(tischId);
						expect(antwort.erfolg).toBe(true);
						done();
					});
				});
			});
			it("dann kann ich diesen in der Übersicht sehen", function(done) {
				spieler.zeigeOffeneTische(function(antwort) {
					expect(antwort[0].nameDesSpiels).toEqual(spielname);
					expect(antwort[0].tischId).toEqual(tischId);
					done();
				});
			});
			describe("und ich spiele an diesem Tisch", function() {
				describe("und ich verlasse den Tisch", function() {
					xit("dann ist mein Name nach wie vor in der Spielerliste", function() {
					});
					xit("dann kann ich an dem Tisch wieder spielen", function() {
					});
				});
			});
			describe("und an diesem spielt ein anderer Spieler", function() {
				var spielerB = null;
				beforeEach(function(done) {
					spielerB = new CasinoSpieler(spielerBId, spielerBPassword);
					spielerB.betrete(wsUrl, function() {
						spielerB.spieleAnTisch(tischId, function(antwort) {
							expect(spielerA.spieltAnTisch).toBe(true);
							done();
						});
					});
				});
				xit("dann kann ich mich nicht mit dem gleichen Namen wie der andere Spieler dort spielen", function() {
				});
				afterEach(function(done) {
					spielerB.DESTROY(done);
				});
			});
			afterEach(function(done) {
				croupier.DESTROY(done);
			});
		});
		afterEach(function(done) {
			spieler.DESTROY(done);
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
				describe("und ich betrete das Casino wieder", function() {
					describe("und ich betrete den Tisch wieder", function() {
						describe("und nutze dabei einen anderen Namen für das gespielte Spiel", function() {
							it("dann bleibt der Name für das Spiel unveraendert", function(done) {
								//TODO austeilen. Das gilt für alle Tests
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
						});
					});
				});
				describe("und ich betrete das Casino mit anderem Namen", function() {
					describe("und ich will den Tisch betreten", function() {
						it("dann werde ich abgewiesen", function(done) {
							croupier = new CasinoCroupier(croupierId + "FALSCH", croupierPassword + "FALSCH");
							croupier.betrete(wsUrl, function() {
								croupier.eroeffneTisch(tischId, spielname, function(antwort) {
									expect(croupier.stehtAmTisch).toBe(null);
									done();
								});
							});
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
				
				describe("und ich die Spieler etwas frage", function() {
					describe("und diese rechtzeitig antworten", function() {
						it("dann bekomme ich die Antworten", function(done) {
							spielerA.derCroupierFragt = function(frage) {
								console.log('A');
								expect(frage).toEqual(1);
								this._antworteDemCroupier(2);
							};
							spielerB.derCroupierFragt = function(frage) {
								console.log('B');
								expect(frage).toEqual(3);
								this._antworteDemCroupier(4);
							};
							croupier.frageDenSpieler(spielerAid, 1, function(antwort) {
								expect(antwort).toEqual({
									antwort: 2,
									status: 'OK'
								});
								croupier.frageDenSpieler(spielerBid, 3, function(antwort) {
									expect(antwort).toEqual({
										antwort: 4,
										status: 'OK'
									});
									done();
								});
							});
						});
					});
					describe("und diese nicht Antworten", function() {
						xit("dann bekomme ich eine Timeout-Meldung", function() {
						});
					});
					describe("und diese zu spät Antworten", function() {
						xit("dann bekomme ich eine Timeout-Meldung und die Spieler-Antwort verfällt", function() {
						});
						xit("dann wird die zu späte Spielerantwort ignoriert", function() {
						});
					});
				});
				describe("und ich frage einen dritten, nicht vorhandenen Spieler", function() {
					xit("dann bekomme ich eine Timeout-Anfrage", function() {
					});
				});
			});
			xit("dann kann ich diesen Tisch schließen", function() {
			});
			describe("und ein anderer Croupier eröffnet einen anderen Tisch", function() {
				describe("und an diesem Tisch sitzt ein weiterer Spieler", function() {
					xit("dann kann ich mit diesem Spieler nicht sprechen", function() {
					});
				});
			});
		});
	});
});