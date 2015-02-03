"use strict";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

var wsUrl = "ws://localhost:8080/";
var spielerTimeout = 80;
var spielerA = null;
var spielerB = null;
var timeoutAlaeuft = null;
var timeoutBlaeuft = null;
var spaeteAntwort = function(welcherSpieler, frage) {
	if(welcherSpieler == 'A') {
		spielerA._antworteDemCroupier(frage);
		clearTimeout(timeoutAlaeuft);
		timeoutAlaeuft = null;
	} else {
		spielerB._antworteDemCroupier(frage);
		clearTimeout(timeoutBlaeuft);
		timeoutBlaeuft = null;
	}
};

xit("TODO Server nach Croupier und Spieler trennen (auslagern)", function() {
});
xit("TODO Server nicht per JSON anfragen", function() {
});
xit("TODO Geschwindigkeitsregler in SpeedtestCroupier einfügen (für Timeout im Server und einen für Timeout im JS)", function() {
});
xit("TODO Maxschen Croupier und dummy-Spieler umsetzen: https://www.spielwiki.de/M%C3%A4xchen", function() {
});
describe("Szenario: Casino", function() {
	beforeEach(function(done) {
		var verbindung = new WebSocket(wsUrl);
		verbindung.onopen = function(event) {
			verbindung.send('{"aktion":"RESET"}');
			verbindung.onmessage = function() {
				done();
			};
		};
	});
	describe("Angenommen ich bin ein Besucher", function() {
		var besucher;
		beforeEach(function() {
			besucher = new CasinoBesucher();
		});
		afterEach(function(done) {
			besucher.DESTROY(done);
		});
		it("dann schlägt es fehl wenn ich das Casino via NICHT-Websocket-URL betreten will", function() {
			expect(
				function() {
					besucher.betrete("KEINE_WS_URL");
				}
			).toThrow(new Error("die Casino-URL entspricht nicht dem Websocket-Protokoll"));
		});
		describe("und ich betrete das Casino", function() {
			beforeEach(function(done) {
				besucher.betrete(wsUrl, function() {
					done();
				});
			});
			describe("und ich deponiere etwas im Safe", function() {
				var kombination = 12345;
				var schatz = 'derRingDesYogurt';
				beforeEach(function(done) {
					besucher.deponiereImSafe(kombination, schatz, function(antwort) {
						done();
					});
				});
				it("dann kann ich das auch wieder ansehen", function(done) {
					besucher.schaueInSafe(kombination, function(antwort) {
						expect(antwort.schatz).toBe(schatz);
						done();
					});
				});
			});
		});
	});
	describe("Angenommen ich bin ein Spieler", function() {
		var spieler = null;
		var spielerName = "Spieler1";
		var spielerPassword = "Spieler1";
		beforeEach(function() {
			spieler = new CasinoSpieler(spielerName, spielerPassword);
		});
		afterEach(function(done) {
			spieler.DESTROY(done);
		});
		describe("und ich betrete ein Casino", function() {
			beforeEach(function(done) {
				spieler.betrete(wsUrl, function() {
					done();
				});
			});
			describe("und dort existiert ein Tisch", function() {
				var croupier = null;
				var croupierName = "Croupier1";
				var croupierPassword = "Croupier1";
				var tischName = 'tisch1';
				var spielname = 'pingpong';
				beforeEach(function(done) {
					croupier = new CasinoCroupier(croupierName, croupierPassword);
					croupier.betrete(wsUrl, function() {
						croupier.eroeffneTisch(tischName, spielname, spielerTimeout, function(antwort) {
							done();
						});
					});
				});
				afterEach(function(done) {
					croupier.DESTROY(done);
				});
				it("dann kann ich diesen in der Übersicht sehen", function(done) {
					spieler.zeigeOffeneTische(function(antwort) {
						expect(antwort.length).toEqual(1);
						expect(antwort[0].nameDesSpiels).toEqual(spielname);
						expect(antwort[0].tischName).toEqual(tischName);
						done();
					});
				});
				describe("und ich spiele an diesem Tisch", function() {
					beforeEach(function(done) {
						spieler.spieleAnTisch(tischName, function(antwort) {
							expect(antwort.status).toBe('ok');
							done();
						});
					});
					describe("und ein anderer Spieler mit dem gleichen Namen will auch an diesem Tisch spielen", function() {
						var spielerB = null;
						var spielerBpassword = "Spieler2";
						beforeEach(function(done) {
							spielerB = new CasinoSpieler(spielerName, spielerBpassword);
							spielerB.betrete(wsUrl, function() {
								done();
							});
						});
						afterEach(function(done) {
							spielerB.DESTROY(done);
						});
						it("dann wird er abgewiesen", function(done) {
							spielerB.spieleAnTisch(tischName, function(antwort) {
								expect(antwort.status).toBe('fehler');
								done();
							});
						});
					});
					describe("und ich verlasse das Casino", function() {
						beforeEach(function(done) {
							spieler.DESTROY(done);
						});
						describe("und ich betrete es wieder", function() {
							beforeEach(function(done) {
								spieler = new CasinoSpieler(spielerName, spielerPassword);
								spieler.betrete(wsUrl, function() {
									done();
								});
							});
							it("dann kann ich an dem Tisch wieder spielen", function(done) {
								spieler.spieleAnTisch(tischName, function(antwort) {
									expect(antwort.status).toBe('ok');
									done();
								});
							});
						});
					});
				});
			});
		});
	});
	describe("Angenommen ich bin ein Croupier", function() {
		var croupier = null;
		var croupierName = "Croupier1";
		var croupierPassword = "Croupier1";
		beforeEach(function() {
			croupier = new CasinoCroupier(croupierName, croupierPassword);
		});
		afterEach(function(done) {
			croupier.DESTROY(done);
		});
		describe("und ich betrete das Casino", function() {
			beforeEach(function(done) {
				croupier.betrete(wsUrl, function() {
					done();
				});
			});
			describe("und ich eröffne einen Tisch", function(done) {
				var tischName = 'tisch1';
				var spielname = 'pingpong';
				beforeEach(function(done) {
					croupier.eroeffneTisch(tischName, spielname, spielerTimeout, function(antwort) {
						expect(antwort.status).toBe('ok');
						done();
					});
				});
				describe("und ich verlasse das Casino", function(done) {
					beforeEach(function(done) {
						croupier.DESTROY(done);
					});
					describe("und ich betrete das Casino wieder", function() {
						beforeEach(function(done) {
							croupier = new CasinoCroupier(croupierName, croupierPassword);
							croupier.betrete(wsUrl, function() {
								done();
							});
						});
						describe("und ich betrete den Tisch wieder, vergebe dabei aber einen anderen Spielnamen", function() {
							beforeEach(function(done) {
								croupier.eroeffneTisch(tischName, spielname + 'SINNFREI', spielerTimeout + 20, function(antwort) {
									expect(antwort.status).toBe('ok');
									done();
								});
							});
							it("dann bleibt der Spielname unveraendert", function(done) {
								croupier.zeigeOffeneTische(function(liste) {
									expect(liste.length).toBe(1);
									expect(liste[0].nameDesSpiels).toBe(spielname);
									done();
								});
							});
						});
					});
					describe("und ich betrete das Casino mit anderem Namen", function() {
						beforeEach(function(done) {
							croupier = new CasinoCroupier(croupierName + "FALSCH", croupierPassword);
							croupier.betrete(wsUrl, function() {
								done();
							});
						});
						it("dann werde ich abgewiesen wenn ich den Tisch wieder eröffnen will", function(done) {
							croupier.eroeffneTisch(tischName, spielname, spielerTimeout, function(antwort) {
								expect(antwort.status).toBe('fehler');
								done();
							});
						});
					});
				});
				describe("und zwei Spieler setzen sich an meinen Tisch", function(done) {
					spielerA = null;
					spielerB = null;
					var spielerAName = 'a';
					var spielerBName = 'b';
					var spielerPassword = "ab";
					beforeEach(function(done) {
						spielerA = new CasinoSpieler(spielerAName, spielerPassword);
						spielerA.betrete(wsUrl, function() {
							spielerA.spieleAnTisch(tischName, function(antwort) {
								expect(antwort.status).toBe('ok');
								done();
							});
						});
					});
					afterEach(function(done) {
						spielerA.DESTROY(done);
					});
					beforeEach(function(done) {
						spielerB = new CasinoSpieler(spielerBName, spielerPassword);
						spielerB.betrete(wsUrl, function() {
							spielerB.spieleAnTisch(tischName, function(antwort) {
								expect(antwort.status).toBe('ok');
								done();
							});
						});
					});
					afterEach(function(done) {
						spielerB.DESTROY(done);
					});
					it("dann kann ich diese Spieler sehen", function(done) {
						croupier.zeigeSpielerDesTisches(function(liste) {
							expect(liste.length).toBe(2);
							expect(liste).toContain(spielerAName);
							expect(liste).toContain(spielerBName);
							done();
						});
					});
					describe("und ein Spieler das Casino verlässt", function() {
						beforeEach(function(done) {
							spielerB.DESTROY(done);
						});
						it("dann werden nach wie vor alle in der Spielerliste aufgeführt", function(done) {
							croupier.zeigeSpielerDesTisches(function(liste) {
								expect(liste.length).toBe(2);
								expect(liste).toContain(spielerAName);
								expect(liste).toContain(spielerBName);
								done();
							});
						});
					});
					describe("und diese können immer eine Antwort geben", function() {
						beforeEach(function() {
							spielerA.derCroupierFragt = function(frage) {
								expect(frage).toEqual(1);
								this._antworteDemCroupier(2);
							};
							spielerB.derCroupierFragt = function(frage) {
								expect(frage).toEqual(3);
								this._antworteDemCroupier(4);
							};
						});
						it("dann bekomme ich die Antworten wenn ich die Spieler etwas frage", function(done) {
							croupier.frageDenSpieler(spielerAName, 1, function(antwort) {
								expect(antwort).toEqual({
									details: 2,
									status: 'ok'
								});
								croupier.frageDenSpieler(spielerBName, 3, function(antwort) {
									expect(antwort).toEqual({
										details: 4,
										status: 'ok'
									});
									done();
								});
							});
						});
						describe("und diese nicht Antworten", function() {
							beforeEach(function() {
								spielerA.derCroupierFragt = function(frage) {
								};
								spielerB.derCroupierFragt = function(frage) {
								};
							});
							it("dann bekomme ich eine Timeout-Meldung wenn ich die Spieler etwas frage", function(done) {
								croupier.frageDenSpieler(spielerAName, 1, function(antwort) {
									expect(antwort).toEqual({
										details: null,
										status: 'timeout'
									});
									croupier.frageDenSpieler(spielerBName, 3, function(antwort) {
										expect(antwort).toEqual({
											details: null,
											status: 'timeout'
										});
										done();
									});
								});
							});
						});
						describe("und diese zu spät Antworten", function() {
							beforeEach(function() {
								spielerA.derCroupierFragt = function(frage) {
									timeoutAlaeuft = setTimeout("spaeteAntwort('A', " + frage + ")", spielerTimeout * 1.1);
								};
								spielerB.derCroupierFragt = function(frage) {
									timeoutBlaeuft = setTimeout("spaeteAntwort('B', " + frage + ")", spielerTimeout * 1.1);
								};
							});
							afterEach(function() {
								clearTimeout(timeoutAlaeuft);
								clearTimeout(timeoutBlaeuft);
								timeoutAlaeuft = null;
								timeoutBlaeuft= null;
							});
							it("dann bekomme ich eine Timeout-Meldung und die Antwort kommt nie an", function(done) {
								croupier.frageDenSpieler(spielerAName, 1, function(antwort) {
									expect(antwort).toEqual({
										details: null,
										status: 'timeout'
									});
									expect(timeoutAlaeuft).not.toBe(null);
									
									croupier.frageDenSpieler(spielerBName, 2, function(antwort) {
										expect(antwort).toEqual({
											details: null,
											status: 'timeout'
										});
										expect(timeoutAlaeuft).toBe(null);
										expect(timeoutBlaeuft).not.toBe(null);
										
										croupier.frageDenSpieler(spielerAName, 3, function(antwort) {
											expect(antwort).toEqual({
												details: null,
												status: 'timeout'
											});
											expect(timeoutAlaeuft).not.toBe(null);
											expect(timeoutBlaeuft).toBe(null);
											done();
										});
									});
								});
							});
						});
						describe("und einer auf die erste Frage so spät Antwortet, dass schon die Zeit für die zweite Frage an ihn läuft", function() {
							beforeEach(function() {
								spielerA.derCroupierFragt = function(frage) {
									timeoutAlaeuft = setTimeout("spaeteAntwort('A', " + frage + ")", spielerTimeout * 1.1);
								};
							});
							afterEach(function() {
								clearTimeout(timeoutAlaeuft);
								timeoutAlaeuft = null;
							});
							it("dann bekomme ich erst eine Timeout-Meldung und auf die zweite Frage die erste Antwort", function(done) {
								croupier.frageDenSpieler(spielerAName, 1, function(antwort) {
									expect(antwort).toEqual({
										details: null,
										status: 'timeout'
									});
									croupier.frageDenSpieler(spielerAName, 2, function(antwort) {
										expect(antwort).toEqual({
											details: 1,
											status: 'ok'
										});
										done();
									});
								});
							});
						});
					});
					it("dann bekomme ich eine Timeout-Anfrage wenn ich einen dritten, nicht vorhandenen Spieler frage", function(done) {
						croupier.frageDenSpieler(spielerAName + 'UNBEKANNT', 1, function(antwort) {
							expect(antwort).toEqual({
								details: null,
								status: 'timeout'
							});
							done();
						});
					});
				});
			});
		});
	});
});