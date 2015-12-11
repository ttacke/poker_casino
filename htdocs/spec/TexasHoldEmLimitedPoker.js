"use strict";

var ich = null;
describe("Szenario: das Casino ist geöffnet", function() {
	describe("Angenommen ich bin ein Poker-Croupier für TexasHoldEm mit FixedLimit", function() {
		beforeEach(function() {
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
			ich = new CasinoCroupierTexasHoldEmLimitedPoker("name", "passwort");
			entferneSpielerVerbindungen(ich);
		});
		describe("und ich bekomme Karten 'angesagt'", function() {
			var kartenString = "K♥ 10♣";
			it("dann kann ich daraus einen echten Kartenstapel machen", function() {
				var k = ich._parseKarten(kartenString);
				expect(k.length).toBe(2);
				expect(k[0].bezeichnung).toBe("K");
				expect(k[0].farbe).toBe("♥");
				expect(k[0].zahlwert).toBe(13);
				
				expect(k[1].bezeichnung).toBe("10");
				expect(k[1].farbe).toBe("♣");
				expect(k[1].zahlwert).toBe(10);
			});
		});
		describe("und ich Spiele mit 2 Spielern", function() {
			beforeEach(function(done) {
				erzeugeSpieler('Nr1', ich, function(frage) {});
				erzeugeSpieler('Nr2', ich, function(frage) {});
				ich.nimmMitspielerAuf(done);
			});
			it("dann wird das Spiel nicht begonnen", function(done) {
				ich.spieleEinSpiel(function(erfolg) {
					expect(erfolg).toBe(false);
					done();
				});
			});
		});
		describe("und ich Spiele mit 24 Spielern", function() {
			var spy23 = null;
			var spy24 = null;
			beforeEach(function(done) {
				for(var i = 1; i <= 22; i++) {
					erzeugeSpieler('Nr' + i, ich, function() {
						return 'check';
					});
				}
				
				spy23 = jasmine.createSpy('Nr23');
				erzeugeSpieler('Nr23', ich, function() {
					spy23();
					return 'check';
				});
				
				spy24 = jasmine.createSpy('Nr24');
				erzeugeSpieler('Nr24', ich, function() {
					spy24();
					return 'check';
				});
				
				ich.nimmMitspielerAuf(done);
			});
			it("dann wird das Spiel begonnen und der 24. Spieler nicht beachtet", function(done) {
				ich.spieleEinSpiel(function(erfolg) {
					expect(erfolg).toBe(true);
					expect(spy23).toHaveBeenCalled();
					expect(spy24).not.toHaveBeenCalled();
					done();
				});
			});
		});
		describe("und ich spiele mit einem bigBlind von '2', einem SmallBlind von '1' und 11 Karten (jeweils die 2♦)", function() {
			var waechter = new spielerKommunikationsWaechter();
			beforeEach(function() {
				waechter.reset();
				ich._erstelleKartenstapelString = function() {
					return '2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦';
				};
			});
			var erzeugeAntwortendenSpieler = function(name, antworten) {
				erzeugeSpieler(name, ich, function(frage) {
					waechter.fragen_hook(name, frage);
					var antwort = antworten.shift();
					console.log(name + ': ' + antwort);//TODO
					return antwort;
				});
			};
			describe("und spiele eine PreFlop-Wettrunde", function() {
				beforeEach(function() {
					ich.wettrunden = [
						new CasinoCroupierTexasHoldEmLimitedPokerPreFlop(ich, 1),
					];
				});
				describe("mit den 3 Spielern A, B und C die immer nur checken", function() {
					beforeEach(function(done) {
						erzeugeAntwortendenSpieler('A', ['check', 'check', 'check']);
						erzeugeAntwortendenSpieler('B', ['check', 'check', 'check']);
						erzeugeAntwortendenSpieler('C', ['check', 'check', 'check']);
						ich.nimmMitspielerAuf(
							function() {
								ich._bereiteNeuesSpielVor();
								//TODO
								console.log('>>>>>START');
								ich._spieleAlleWettrundenNEW(ich._erstelleKartenstapel(), function() {
									console.log('>>>>END');
									done();
								});
							}
						);
					});
					it("dann ist die Wettrunde zuende, wenn jeder 1x gefragt wurde", function() {
						waechter.holeDieNachsten3Anfragen();
						waechter.pruefeAktuelleSpielerAufrufe('C', 'A', 'B');
						//TODO ???
						//waechter.holeDieNachsten3Anfragen();
						//waechter.pruefeAktuelleSpielerAufrufe('X', undefined, undefined);
					});
				});
			});
			
			
			
			describe("und mit den 3 Spielern A, B und C die immer nur mit 'check' antworten", function() {
				beforeEach(function(done) {
					erzeugeSpieler('A', ich, function(frage) {
						waechter.fragen_hook('A', frage);
						return 'check';
					});
					erzeugeSpieler('B', ich, function(frage) {
						waechter.fragen_hook('B', frage);
						return 'check';
					});
					erzeugeSpieler('C', ich, function(frage) {
						waechter.fragen_hook('C', frage);
						return 'check';
					});
					ich.nimmMitspielerAuf(done);
				});
				describe("dann wird Spieler A, B und C je ein mal zum Preflop gefragt", function() {
					var spieleEineRunde = function(done) {
						ich.spieleEinSpiel(function(success) {
							expect(success).toBe(true);
							done();
						});
					};
					beforeEach(spieleEineRunde);
					beforeEach(function() {
						waechter.holeDieNachsten3Anfragen();
						waechter.aktuelleSpielerFragenEnthaltenBieterinfos(['2♦','2♦'], []);
					});
					it("beginnend bei Spieler C", function() {
						waechter.pruefeAktuelleSpielerAufrufe('C', 'A', 'B');
					});
					describe("und je ein mal zum Flop gefragt", function() {
						beforeEach(function() {
							waechter.holeDieNachsten3Anfragen();
							waechter.aktuelleSpielerFragenEnthaltenBieterinfos(['2♦','2♦'], ['2♦','2♦','2♦']);
						});
						it("beginnend bei Spieler A", function() {
							waechter.pruefeAktuelleSpielerAufrufe('A', 'B', 'C');
						});
						describe("und je ein mal zur TurnCard gefragt", function() {
							beforeEach(function() {
								waechter.holeDieNachsten3Anfragen();
								waechter.aktuelleSpielerFragenEnthaltenBieterinfos(['2♦','2♦'], ['2♦','2♦','2♦','2♦']);
							});
							it("beginnend bei Spieler A", function() {
								waechter.pruefeAktuelleSpielerAufrufe('A', 'B', 'C');
							});
							describe("und je ein mal zum River gefragt", function() {
								beforeEach(function() {
									waechter.holeDieNachsten3Anfragen();
									waechter.aktuelleSpielerFragenEnthaltenBieterinfos(['2♦','2♦'], ['2♦','2♦','2♦','2♦','2♦']);
								});
								it("beginnend bei Spieler A", function() {
									waechter.pruefeAktuelleSpielerAufrufe('A', 'B', 'C');
								});
								describe("und beim Showdown je ein mal darüber informiert", function() {
									beforeEach(function() {
										waechter.holeDieNachsten3Anfragen();
									});
									it("dass der Pot 6 enthält", function() {
										waechter.aktuelleSpielerFragenEnthalten('Pot', '6');
									});
									it("welche Tischkarten es gab", function() {
										waechter.aktuelleSpielerFragenEnthalten('Tisch', ['2♦','2♦','2♦','2♦','2♦']);
									});
									it("welchen Stack und welche Handkarten alle Spieler hatten und was ihre letzte Aktion war", function() {
										waechter.aktuelleSpielerFragenEnthalten('Spieler', [
											{'Name':'A','letzteAktion':'check','Stack':'-2','Einsatz':'2','Hand':['2♦','2♦']},
											{'Name':'B','letzteAktion':'check','Stack':'-2','Einsatz':'2','Hand':['2♦','2♦']},
											{'Name':'C','letzteAktion':'check','Stack':'-2','Einsatz':'2','Hand':['2♦','2♦']}
										]);
									});
									it("welche Spieler mit welchem Blatt wie viel gewonnen haben", function() {
										waechter.aktuelleSpielerFragenEnthalten('Gewinner', [
											{'Name':'A','Gewinn':'2','Blatt':['2♦','2♦','2♦','2♦','2♦']},
											{'Name':'B','Gewinn':'2','Blatt':['2♦','2♦','2♦','2♦','2♦']},
											{'Name':'C','Gewinn':'2','Blatt':['2♦','2♦','2♦','2♦','2♦']}
										]);
									});
									describe("und dann ist das Spiel beendet.", function() {
										beforeEach(function() {
											expect(waechter.esGibtKeineNeuenAnfragen()).toBe(true);
										});
										describe("Wird ein neues Spiel gestartet, dann wird Spieler A, B und C je ein mal zum Preflop gefragt", function() {
											beforeEach(spieleEineRunde);
											beforeEach(function() {
												waechter.holeDieNachsten3Anfragen();
												waechter.aktuelleSpielerFragenEnthaltenBieterinfos(['2♦','2♦'], []);
											});
											it("beginnend bei Spieler A", function() {
												waechter.pruefeAktuelleSpielerAufrufe('A', 'B', 'C');
											});
										});
									});
								});
							});
						});
					});
				});
				describe("und ich spiele eine PreFlop-Runde mit einem Start-Höchsteinsatz von '0'", function() {
					beforeEach(function(done) {
						ich._bereiteNeuesSpielVor();
						ich.wettrunden = [
							new CasinoCroupierTexasHoldEmLimitedPokerPreFlop(ich, 1),
						];
						ich._spieleAlleWettrunden(ich._erstelleKartenstapel(), function() {
							waechter.holeDieNachsten3Anfragen();
							done();
						});
					});
					it("dann bekommt jeder 2 Hand- und 0 Tischkarten, die Info über den aktuellen Höchsteinsatz '2' und wird nach seinem Einsatz gefragt", function() {
							waechter.aktuelleSpielerFragenEnthalten('Hand', ['2♦', '2♦']);
							waechter.aktuelleSpielerFragenEnthalten('Tisch', []);
							waechter.aktuelleSpielerFragenEnthalten('Hoechsteinsatz', '2');
					});
					describe("beginnend mit Spieler C, der noch nichts gesetzt hat", function() {
						beforeEach(function() {
							waechter.frageFuerSpielerEnthaelt_EinsatzStackPot(0, 'C', '0', '0', '3');
						});
						describe("dann Spieler A, dessen bisheriger Einsatz dem SmallBlind entspricht", function() {
							beforeEach(function() {
								waechter.frageFuerSpielerEnthaelt_EinsatzStackPot(1, 'A', '1', '-1', '5');
							});
							describe("dann Spieler B, dessen bisheriger Einsatz dem BigBlind entspricht", function() {
								beforeEach(function() {
									waechter.frageFuerSpielerEnthaelt_EinsatzStackPot(2, 'B', '2', '-2', '6');
								});
								it("und dann ist der Einsatz jedes Spielers '2', der Pot '6' und die Runde ist beendet", function() {
									derAktuellePotIst(ich, 6);
									aktuelleSpielerDatenEnthalten(ich, 'Einsatz', '2');
									derAktuelleStackVomSpielerIst(ich, 'A', -2);
									derAktuelleStackVomSpielerIst(ich, 'B', -2);
									derAktuelleStackVomSpielerIst(ich, 'C', -2);
									waechter.esGibtKeineNeuenAnfragen();
								});
							});
						});
					});
				});
				function erstelleRundenCheck(name, tischkarten) {
					describe("und ich spiele eine " + name + "-Runde mit einem Start-Höchsteinsatz von '0' und ohne vorherige Karten", function() {
						beforeEach(function(done) {
							ich._bereiteNeuesSpielVor();
							
							var wettrunde = null;
							eval("wettrunde = new CasinoCroupierTexasHoldEmLimitedPoker" + name + "(ich, 1)");
							
							ich.wettrunden = [
								wettrunde
							];
							ich._spieleAlleWettrunden(ich._erstelleKartenstapel(), function() {
								waechter.holeDieNachsten3Anfragen();
								done();
							});
						});
						it("dann bekommt jeder 0 Hand- und " + tischkarten.length + " Tischkarten, die Info über den aktuellen Höchsteinsatz '0' und wird nach seinem Einsatz gefragt", function() {
							waechter.aktuelleSpielerFragenEnthalten('Hand', []);
							waechter.aktuelleSpielerFragenEnthalten('Tisch', tischkarten);
							waechter.aktuelleSpielerFragenEnthalten('Hoechsteinsatz', '0');
						});
						describe("beginnend mit Spieler A", function() {
							beforeEach(function() {
								waechter.frageFuerSpielerEnthaelt_EinsatzStackPot(0, 'A', '0', '0', '0');
							});
							describe("dann Spieler B", function() {
								beforeEach(function() {
									waechter.frageFuerSpielerEnthaelt_EinsatzStackPot(1, 'B', '0', '0', '0');
								});
								describe("dann Spieler C", function() {
									beforeEach(function() {
										waechter.frageFuerSpielerEnthaelt_EinsatzStackPot(2, 'C', '0', '0', '0');
									});
									it("und dann ist der Einsatz jedes Spielers '0' und die Runde ist beendet", function() {
										derAktuellePotIst(ich, 0);
										aktuelleSpielerDatenEnthalten(ich, 'Einsatz', '0');
										derAktuelleStackVomSpielerIst(ich, 'A', 0);
										derAktuelleStackVomSpielerIst(ich, 'B', 0);
										derAktuelleStackVomSpielerIst(ich, 'C', 0);
										waechter.esGibtKeineNeuenAnfragen();
									});
								});
							});
						});
					});
				}
				erstelleRundenCheck('Flop', ['2♦', '2♦', '2♦']);
				erstelleRundenCheck('TurnCard', ['2♦']);
				erstelleRundenCheck('RiverCard', ['2♦']);
				describe("und ich spiele eine Showdown-Runde mit einem Pot von '5', den Tischkarten 2♦ 2♦ 2♦ 2♦ 2♦ und den Handkarten je 2♦ 2♦ und einem Spielerstack von je 0", function() {
					beforeEach(function(done) {
						ich._bereiteNeuesSpielVor();
						var kartenstapel = ich._erstelleKartenstapel();
						ich.gibTischkartenAnAlleSpieler(5, kartenstapel);
						ich.gibHandkartenAnAlleSpieler(2, kartenstapel);
						ich.spielerrunde._pot = 5;
						derAktuellePotIst(ich, 5);
						derAktuelleStackVomSpielerIst(ich, 'A', 0)
						derAktuelleStackVomSpielerIst(ich, 'B', 0)
						derAktuelleStackVomSpielerIst(ich, 'C', 0)
						
						ich.wettrunden = [
							new CasinoCroupierTexasHoldEmLimitedPokerShowdown(ich, 1),
						];
						ich._spieleAlleWettrunden(ich._erstelleKartenstapel(), function() {
							waechter.holeDieNachsten3Anfragen();
							done();
						});
					});
					describe("dann bekommt jeder Spieler die Info, dass Spieler A, B und C je '1' (SplitPot) gewonnen haben", function() {
						beforeEach(function() {
							waechter.aktuelleSpielerFragenEnthalten('Gewinner', [
								{'Name':'A','Gewinn':'1','Blatt':['2♦','2♦','2♦','2♦','2♦']},
								{'Name':'B','Gewinn':'1','Blatt':['2♦','2♦','2♦','2♦','2♦']},
								{'Name':'C','Gewinn':'1','Blatt':['2♦','2♦','2♦','2♦','2♦']}
							]);
						});
						it("und dann steigt der Stack jedes Spielers auf '1' und die Runde ist beendet", function() {
							derAktuelleStackVomSpielerIst(ich, 'A', 1);
							derAktuelleStackVomSpielerIst(ich, 'B', 1);
							derAktuelleStackVomSpielerIst(ich, 'C', 1);
							waechter.esGibtKeineNeuenAnfragen();
						});
					});
				});
			});
		});
		describe("HIER-REGELN-TESTEN und ich spiele mit den 3 Spielern A, B und C", function() {
			var waechter = new spielerKommunikationsWaechter();
			
			beforeEach(function() {
				erzeugeSpieler('A', ich, function(frage) {
					waechter.fragen_hook('A', frage);
					return 'check';
				});
				erzeugeSpieler('B', ich, function(frage) {
					waechter.fragen_hook('B', frage);
					return 'check';
				});
				erzeugeSpieler('C', ich, function(frage) {
					waechter.fragen_hook('C', frage);
					return 'check';
				});
			});
			describe("mit einem Start-Höchsteinsatz von '0', einem Spielerstack von '0', einem SmallBlind von '1' und einem BigBlind von '2' und einem Kartenstapel von 11x 2♦", function() {
				var bigBlind = 2;
				var kartenstapel;
				beforeEach(function(done) {
					waechter.reset();
					ich._erstelleKartenstapelString = function() {
						return '2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦';
					};
					ich.nimmMitspielerAuf(function() {
						ich._bereiteNeuesSpielVor();
						kartenstapel = ich._erstelleKartenstapel();
						derAktuellePotIst(ich, 0);
						derAktuelleStackVomSpielerIst(ich, 'A', 0);
						derAktuelleStackVomSpielerIst(ich, 'B', 0);
						derAktuelleStackVomSpielerIst(ich, 'C', 0);
						done();
					});
				});
			});
		});
/*
		describe("und ich Spiele mit den Spielern A (A♦ 10♦) und B (J♦ J♠) und C (K♣ Q♦) und den Tischkarten 10♣ 10♠ 6♠ 4♥ J♥", function() {
			describe("und ich spiele eine Showdown-Runde mit einem Pot von '2'", function() {
				describe("dann bekommt jeder Spieler", function() {
					xit("die Handkarten aller Spieler gezeigt", function() {});
					xit("die beste Kombination für Spieler A (A♦ 10♦ 10♣ 10♠ J♥) [= Drilling] gezeigt", function() {});
					xit("die beste Kombination für Spieler B (J♦ J♠ J♥ 10♣ 10♠) [= FullHouse] gezeigt", function() {});
					xit("die beste Kombination für Spieler C (K♣ Q♦ J♥ 10♣ 10♠) [=ein Paar] gezeigt", function() {});
					xit("die Info, dass Spieler B den Pot von '2' gewonnen hat", function() {});
				});
				xit("dann sinkt der Stack von Spieler A um '2'", function() {});
				xit("dann steigt der Stack von Spieler B um '2'", function() {});
				xit("dann sinkt der Stack von Spieler C um '2'", function() {});
				describe("und Spieler B hatte gefolded", function() {
					describe("dann bekommt jeder Spieler", function() {
						xit("die Handkarten der Spieler A und C gezeigt", function() {});
						xit("die beste Kombination für Spieler A (A♦ 10♦ 10♣ 10♠ J♥) [= Drilling] gezeigt", function() {});
						xit("keine Kombination für Spieler B gezeigt", function() {});
						xit("die beste Kombination für Spieler C (K♣ Q♦ J♥ 10♣ 10♠) [=ein Paar] gezeigt", function() {});
						xit("die Info, dass Spieler A den Pot von '2' gewonnen hat", function() {});
					});
					xit("dann steigt der Stack von Spieler A um '2'", function() {});
					xit("dann sinkt der Stack von Spieler B um '2'", function() {});
					xit("dann sinkt der Stack von Spieler C um '2'", function() {});
				});
			});
		});
*/
		describe("und will den Gewinner aus 2 Blättern ermitteln, dann gilt:", function() {
			//http://de.wikipedia.org/wiki/Hand_%28Poker%29
			generateCardSpec("HighCard A♦ 10♦ 9♠ 5♣ 4♣", 'schlaegt', "HighCard K♣ Q♦ J♣ 8♥ 7♥");
			generateCardSpec("HighCard A♦ 10♦ 9♠ 5♣ 4♣", 'schlaegt', "HighCard A♣ 9♦ 8♥ 5♠ 4♠");
			generateCardSpec("HighCard Q♣ J♣ 5♦", 'unterliegt', "HighCard K♦ 10♦ 5♣");
			
			generateCardSpec("EinPaar 9♥ 9♣ 2♥ Q♦ 10♦", 'schlaegt', "HighCard A♦ Q♦ 9♠ 10♣ 4♣");
			
			generateCardSpec("EinPaar 10♣ 10♠ 6♠ 4♥ 2♥", 'schlaegt', "EinPaar 9♥ 9♣ A♥ Q♦ 10♦");
			generateCardSpec("EinPaar 10♥ 10♦ J♦ 3♥ 2♣", 'schlaegt', "EinPaar 10♣ 10♠ 6♠ 4♥ 2♥");
			generateCardSpec("EinPaar 10♥ 10♦ J♦ 4♥ 3♣", 'schlaegt', "EinPaar 10♣ 10♠ J♠ 4♦ 2♥");
			
			generateCardSpec("ZweiPaare  7♦ 7♠ 10♠ 10♣ 9♠", 'schlaegt', "EinPaar 10♥ 10♦ J♦ 4♥ 3♣");
			
			generateCardSpec("ZweiPaare K♥ K♦ 2♣ 2♦ J♥", 'schlaegt', "ZweiPaare  J♦ J♠ 10♠ 10♣ 9♠");
			generateCardSpec("ZweiPaare 4♠ 4♣ 3♠ 3♥ K♦", 'schlaegt', "ZweiPaare 4♥ 4♦ 3♦ 3♣ 10♠");
			
			generateCardSpec("Drilling 5♣ 5♥ 5♦ Q♦ 10♣", 'schlaegt', "ZweiPaare 4♠ 4♣ 3♠ 3♥ K♦");
			
			generateCardSpec("Drilling 8♠ 8♥ 8♦ 5♠ 3♣", 'schlaegt', "Drilling 5♣ 5♥ 5♦ Q♦ 10♣");
			generateCardSpec("Drilling 8♠ 8♥ 8♦ A♣ 2♦", 'schlaegt', "Drilling 8♣ 8♥ 8♦ 5♠ 3♣");
			
			generateCardSpec("Straight 6♦ 5♠ 4♦ 3♥ 2♣", 'schlaegt', "Drilling 8♠ 8♥ 8♦ A♣ 2♦");
	
			generateCardSpec("Straight 5♠ 4♠ 3♥ 2♥ A♠", 'schlaegt', "Drilling 8♠ 8♥ 8♦ A♣ 2♦");
			
			generateCardSpec("Straight 8♠ 7♠ 6♥ 5♥ 4♠", 'schlaegt', "Straight 6♦ 5♠ 4♦ 3♥ 2♣");
			generateCardSpec("Straight 8♠ 7♠ 6♥ 5♥ 4♠", 'splitted', "Straight 8♥ 7♦ 6♣ 5♣ 4♥");
			
			generateCardSpec("Flush K♠ Q♠ J♠ 9♠ 6♠", 'schlaegt', "Straight 8♠ 7♠ 6♥ 5♥ 4♠");
			
			generateCardSpec("Flush A♥ Q♥ 10♥ 5♥ 3♥", 'schlaegt', "Flush K♠ Q♠ J♠ 9♠ 6♠");
			generateCardSpec("Flush A♦ K♦ 7♦ 6♦ 2♦", 'schlaegt', "Flush A♥ Q♥ 10♥ 5♥ 3♥");
			generateCardSpec("Flush Q♥ 10♥ 9♥ 5♥ 2♥", 'splitted', "Flush Q♠ 10♠ 9♠ 5♠ 2♠");
			
			generateCardSpec("FullHouse  9♥ 9♣ 9♠ A♥ A♣", 'schlaegt', "Flush Q♥ 10♥ 9♥ 5♥ 2♥");
			
			generateCardSpec("FullHouse 10♠ 10♥ 10♦ 4♠ 4♦", 'schlaegt', "FullHouse  9♥ 9♣ 9♠ A♥ A♣");
			generateCardSpec("FullHouse 10♠ 10♥ 10♦ 4♠ 4♦", 'schlaegt', "FullHouse 10♥ 10♣ 10♠ 3♥ 3♣");
			generateCardSpec("FullHouse Q♥ Q♦ Q♣ 8♥ 8♣", 'splitted', "FullHouse Q♥ Q♦ Q♠ 8♥ 8♣");
			
			generateCardSpec("Vierling 6♦ 6♥ 6♠ 6♣ K♠", 'schlaegt', "FullHouse Q♥ Q♦ Q♣ 8♥ 8♣");
			
			generateCardSpec("Vierling 10♣ 10♦ 10♥ 10♠ 5♦", 'schlaegt', "Vierling 6♦ 6♥ 6♠ 6♣ K♠");
			generateCardSpec("Vierling 10♣ 10♦ 10♥ 10♠ Q♣", 'schlaegt', "Vierling 10♣ 10♦ 10♥ 10♠ 5♦");
			generateCardSpec("Vierling 10♣ 10♦ 10♥ 10♠ Q♣", 'splitted', "Vierling 10♣ 10♦ 10♥ 10♠ Q♦");
			
			generateCardSpec("StraightFlush 5♠ 4♠ 3♠ 2♠ A♠", 'schlaegt', "Vierling 10♣ 10♦ 10♥ 10♠ Q♣");
			
			generateCardSpec("StraightFlush 5♠ 4♠ 3♠ 2♠ A♠", 'splitted', "StraightFlush 5♠ 4♠ 3♠ 2♠ A♠");
			generateCardSpec("StraightFlush 7♥ 6♥ 5♥ 4♥ 3♥", 'schlaegt', "StraightFlush 5♠ 4♠ 3♠ 2♠ A♠");
			generateCardSpec("StraightFlush J♣ 10♣ 9♣ 8♣ 7♣", 'splitted', "StraightFlush J♦ 10♦ 9♦ 8♦ 7♦");
			
			generateCardSpec("RoyalFlush A♣ K♣ Q♣ J♣ 10♣", 'schlaegt', "StraightFlush K♠ Q♠ J♠ 10♠ 9♠");
			
			generateCardSpec("RoyalFlush A♣ K♣ Q♣ J♣ 10♣", 'splitted', "RoyalFlush A♠ K♠ Q♠ J♠ 10♠");
			
			generateCardSpec("FakeFlush 6♣ J♣ Q♥ 4♣ 7♣", 'unterliegt', "Flush Q♥ 10♥ 9♥ 5♥ 2♥");
		});
		describe("und will das beste Blatt aus 2 Handkarten und den 5 Boardkarten ermitteln, dann ergibt es '8♦ 8♥ 8♠ A♠ A♣'", function() {
			var soll = "8♦ 8♥ 8♠ A♠ A♣";
			
			generateCombinationSpec(soll, "wenn man '2♦ 3♥' und '8♠ 8♥ 8♦ A♣ A♠' hat", function() {});
			
			generateCombinationSpec(soll, "wenn man '2♦ 8♠' und '3♥ 8♥ 8♦ A♣ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '2♦ 8♥' und '8♠ 3♥ 8♦ A♣ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '2♦ 8♦' und '8♠ 8♥ 3♥ A♣ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '2♦ A♣' und '8♠ 8♥ 8♦ 3♥ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '2♦ A♠' und '8♠ 8♥ 8♦ A♣ 3♥' hat", function() {});
			
			generateCombinationSpec(soll, "wenn man '8♠ 3♥' und '2♦ 8♥ 8♦ A♣ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '8♥ 3♥' und '8♠ 2♦ 8♦ A♣ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '8♦ 3♥' und '8♠ 8♥ 2♦ A♣ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man 'A♣ 3♥' und '8♠ 8♥ 8♦ 2♦ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man 'A♠ 3♥' und '8♠ 8♥ 8♦ A♣ 2♦' hat", function() {});
			
			generateCombinationSpec(soll, "wenn man '8♠ 8♥' und '2♦ 3♥ 8♦ A♣ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '8♠ 8♦' und '2♦ 8♥ 3♥ A♣ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '8♠ A♣' und '2♦ 8♥ 8♦ 3♥ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '8♠ A♠' und '2♦ 8♥ 8♦ A♣ 3♥' hat", function() {});
			
			generateCombinationSpec(soll, "wenn man '8♥ 8♦' und '8♠ 2♦ 3♥ A♣ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '8♥ A♣' und '8♠ 2♦ 8♦ 3♥ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '8♥ A♠' und '8♠ 2♦ 8♦ A♣ 3♥' hat", function() {});
			
			generateCombinationSpec(soll, "wenn man '8♦ A♣' und '8♠ 8♥ 2♦ 3♥ A♠' hat", function() {});
			generateCombinationSpec(soll, "wenn man '8♦ A♠' und '8♠ 8♥ 2♦ A♣ 3♥' hat", function() {});
			
			generateCombinationSpec(soll, "wenn man 'A♣ A♠' und '8♠ 8♥ 8♦ 2♦ 3♥' hat", function() {});
		});
	});
});