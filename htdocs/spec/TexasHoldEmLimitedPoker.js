"use strict";

var ich = null;
describe("Szenario: das Casino ist geöffnet", function() {
	describe("Angenommen ich bin ein Poker-Croupier für TexasHoldEm mit FixedLimit", function() {
		beforeEach(function() {
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
					erzeugeSpieler('Nr' + i, ich, function() {});
				}
				spy23 = jasmine.createSpy('Nr23');
				erzeugeSpieler('Nr23', ich, spy23);
				
				spy24 = jasmine.createSpy('Nr24');
				erzeugeSpieler('Nr24', ich, spy24);
				
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
		describe("und ich spiele mit den 3 Spielern A, B und C die immer nur mit 'check' antworten", function() {
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
			describe("mit einem bigBlind von '2', einem SmallBlind von '1' und 11 Karten (jeweils die 2♦)", function() {
				beforeEach(function(done) {
					ich.nimmMitspielerAuf(done);
				});
				var spieleEineRunde = function(done) {
					waechter.reset();
					ich._erstelleKartenstapelString = function() {
						return '2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦ 2♦';
					};
					ich.spieleEinSpiel(function(success) {
						expect(success).toBe(true);
						done();
					});
				};
				beforeEach(spieleEineRunde);
				describe("dann wird Spieler A, B und C je ein mal zum Preflop gefragt", function() {
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
											{'Name':'A','letzteAktion':'check','Stack':'-2','Hand':['2♦','2♦']},
											{'Name':'B','letzteAktion':'check','Stack':'-2','Hand':['2♦','2♦']},
											{'Name':'C','letzteAktion':'check','Stack':'-2','Hand':['2♦','2♦']}
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
				describe("und ich spiele eine PreFlop-Runde mit einem Start-Höchstgebot von '0'", function() {
					describe("dann bekommt jeder 2 Handkarten, die Info über das aktuelle Höchstgebot '2' und wird nach seinem Gebot gefragt", function() {
						describe("beginnend mit Spieler C, der noch kein Gebot abgegeben hat", function() {
							describe("dann Spieler A, dessen bisheriges Gebot dem SmallBlind entspricht", function() {
								describe("dann Spieler B, dessen bisheriges Gebot dem BigBlind entspricht", function() {
									xit("und dann ist das Gebot jedes Spielers '2' und die Runde Flop beginnt", function() {});
								});
							});
						});
					});
				});
				describe("und ich spiele eine Flop-Runde mit einem Start-Höchstgebot von '0'", function() {
					describe("dann bekommt jeder 2 Handkarten und 3 Tischkarten, die Info über das aktuelle Höchstgebot '0' und wird nach seinem Gebot gefragt", function() {
						describe("beginnend mit Spieler A", function() {
							describe("dann Spieler B", function() {
								describe("dann Spieler C", function() {
									xit("und dann ist das Gebot jedes Spielers '0' und die Runde TurnCard beginnt", function() {});
								});
							});
						});
					});
				});
				describe("und ich spiele eine TurnCard-Runde mit einem Start-Höchstgebot von '0'", function() {
					describe("dann bekommt jeder 2 Handkarten und 4 Tischkarten, die Info über das aktuelle Höchstgebot '0' und wird nach seinem Gebot gefragt", function() {
						describe("beginnend mit Spieler A", function() {
							describe("dann Spieler B", function() {
								describe("dann Spieler C", function() {
									xit("und dann ist das Gebot jedes Spielers '0' und die Runde River beginnt", function() {});
								});
							});
						});
					});
				});
				describe("und ich spiele eine River-Runde mit einem Start-Höchstgebot von '0'", function() {
					describe("dann bekommt jeder 2 Handkarten und 5 Tischkarten, die Info über das aktuelle Höchstgebot '0' und wird nach seinem Gebot gefragt", function() {
						describe("beginnend mit Spieler A", function() {
							describe("dann Spieler B", function() {
								describe("dann Spieler C", function() {
									xit("und dann ist das Gebot jedes Spielers '0' und der Showdown beginnt", function() {});
								});
							});
						});
					});
				});
				describe("und ich spiele eine Showdown-Runde mit einem Pot von '5'", function() {
					describe("dann bekommt jeder Spieler die Info, dass Spieler A, B und C je '1' via SplitPot gewonnen haben", function() {
						xit("und dann steigt der Stack jedes Spielers um '2' und der PreFlop beginnt", function() {});
					});
				});
			});
			describe("und ich spiele mit einem Start-Höchstgebot von '0', einem Spielerstack von '10', einem SmallBlind von '1' und einem BigBlind von '2'", function() {
				var smallBlind = 1;
				var bigBlind = 2;
				beforeEach(function() {
				});
				// VOID
				function erstelleWettregelTests(xBigBlindRaise, blindEinsatzEnthalten) {
					var automatischerEinsatz = 0;
					if(blindEinsatzEnthalten) {
						automatischerEinsatz = bigBlind;
					}
					
					it("dann gilt die implizite Wettregel 'wer nicht auf das aktuelle Gebot erhöht, verlässt das Spiel', denn das geht hier gar nicht da 'check' immer erhöhen auf aktuelles Höchstgebot bedeutet", function() {
						expect(true).toBe(true);
					});
					describe("und der erste Spieler raised", function() {
						describe("und der zweite Spieler checked", function() {
							describe("und der dritte Spieler checked", function() {
								xit("dann ist die Wettrunde beendet, denn der erste Spieler währe wieder an der Reihe und ein Spieler darf nicht als einziger 2x hintereinander raisen", function() {});
							});
						});
					});
					describe("und der erste Spieler raised", function() {
						describe("und der zweite Spieler folded", function() {
							describe("und der dritte Spieler checked", function() {
								xit("dann ist die Wettrunde beendet, denn der erste Spieler währe wieder an der Reihe und ein Spieler darf nicht als einziger 2x hintereinander raisen", function() {});
							});
						});
					});
					describe("und alle Spieler immer raisen", function() {
						describe("und die Wettrunde ist beendet", function() {
							var anzahlSpieler = 3;
							var maxRaisesProSpieler = 3; 
							xit("dann ist das Höchstgebot " + (automatischerEinsatz + (bigBlind * xBigBlindRaise * anzahlSpieler * maxRaisesProSpieler)) + ", weil jeder Spieler in dieser Runde je nur " + maxRaisesProSpieler + "x raisen darf", function() {});
						});
					});
					describe("und der erste Spieler foldet", function() {
						describe("und der zweite Spieler foldet", function() {
							describe("dann folgt der Showdown und jeder Spieler bekommt", function() { 
								xit("keine Handkarten von niemandem gezeigt", function() {});
								xit("keine beste Kombination gezeigt", function() {});
								xit("die Info, dass der dritte Spieler Pot gewonnen hat", function() {});
							});
						});
					});
				}
				// VOID
				function erstelleNichtPreFlopWettregelTests(xBigBlindRaise) {
					xit("dann ist der Stack von A '10', von B '10' und von C '10', der Pot '0' und das Höchstgebot '0' weil nichts automatisch gesetzt wird", function() {});
					describe("und der erste Spieler A raised", function() {
						xit("dann ist der Stack von A '" + (10 - 2 * xBigBlindRaise) + "', von B '10' und von C '10', der Pot '" + (2 * xBigBlindRaise) + "' und das Höchstgebot '" + (2 * xBigBlindRaise) + "' weil bei Raise das Höchstgebot um den " + xBigBlindRaise + "xBigBlind erhöht wird", function() {});
					});
					erstelleWettregelTests(xBigBlindRaise, false);
				}
				describe("und spiele eine PreFlop-Runde", function() {
					xit("dann ist der Stack von A '9', von B '8' und von C '10', der Pot '3' und das Höchstgebot '2' weil Small- und BigBlind automatisch gesetzt sind", function() {});
					describe("und der erste Spieler C checked", function() {
						xit("dann ist der Stack von A '9', von B '8' und von C '8', der Pot '5' und das Höchstgebot '2' weil beim Check auf das Höchstgebot gegangen wird", function() {});
					});
					erstelleWettregelTests(1, true);
					describe("und der erste Spieler C raised", function() {
						xit("dann ist der Stack von A '9', von B '8' und von C '6', der Pot '7' und das Höchstgebot '4' weil im PreFlop bei Raise das Höchstgebot um den 1xBigBlind erhöht wird", function() {});
					});
				});
				describe("und spiele eine Flop-Runde", function() {
					erstelleNichtPreFlopWettregelTests(1);
				});
				describe("und spiele eine TurnCard-Runde", function() {
					erstelleNichtPreFlopWettregelTests(2);
				});
				describe("und spiele eine River-Runde", function() {
					erstelleNichtPreFlopWettregelTests(2);
				});
			});
		});
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
			});
		});
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