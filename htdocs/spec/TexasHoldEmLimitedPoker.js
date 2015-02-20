"use strict";

describe("Szenario: das Casino ist geöffnet", function() {
	describe("Angenommen ich bin ein Poker-Croupier für TexasHoldEm mit FixedLimit", function() {
		var c = null;
		// INT
		function gibBlattPunkte(string) {
			var blatt = string.substr(string.indexOf(" ") + 1, string.length);
			var punkte = new Gewinnermittlung(
				c.parseKarten(blatt)
			).gibPunkte();
			return punkte;
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
		beforeEach(function() {
			c = new CasinoCroupierTexasHoldEmLimitedPoker("name", "passwort");
		});
		describe("und ich bekomme einen String mit Kartendaten", function() {
			var kartenString = "K♥ 10♣";
			it("dann kann ich daraus einen echten Kartenstapel machen", function() {
				var k = c.parseKarten(kartenString);
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
		xit("dann wird das Spiel nicht begonnen", function() {
		});
	});
	describe("und ich Spiele mit 24 Spielern", function() {
		xit("dann wird der 24. Spieler nicht beachtet", function() {
		});
	});
	describe("und ich Spiele mit den 3 Spielern A, B und C und alle Karten sind 2♦", function() {
		describe("und jeder Spieler antwortet immer nur mit 'check'", function() {
			describe("dann wird Spieler A, B und C je ein mal zum Preflop gefragt", function() {
				xit("beginnend bei Spieler C", function() {
				});
				describe("und je ein mal zum Flop gefragt", function() {
					xit("beginnend bei Spieler A", function() {
					});
					describe("und je ein mal zur TurnCard gefragt", function() {
						xit("beginnend bei Spieler A", function() {
						});
						describe("und je ein mal zum River gefragt", function() {
							xit("beginnend bei Spieler A", function() {
							});
							describe("und beim Showdown je ein mal darüber informiert", function() {
								xit("dass er genau so viel gewonnen hat, wie er gesetzt hat", function() {});
								xit("welche Karten Spieler A, B und C hatten", function() {});
								xit("welches Blatt gewonnen hat", function() {});
								describe("und dann wird Spieler A, B und C je ein mal zum Preflop gefragt", function() {
									xit("beginnend bei Spieler A", function() {
									});
								});
							});
						});
					});
				});
			});
		});
	});
	
	/* Noch als Test erfassen
	
	1. Runde: Preflop
	-einer bekommt den Geber-Token
	-jeder kriegt 2 Handkarten
	-blind wird direkt gesetzt (links vom Geber = small, 2links = big)
	-3 x links neben dem Geber beginnt
	-jeder, der ab jetzt mitspielen will, muss auf das aktuellen höchstgebot gehen (call)
	-raise = 1 x bigBlind
	-wettregeln
		-wenn A raised und die Runde ohne weiteres raise wieder bei A ist, ist die wettrunde beendet
		-haben alle ihre 3x Raise verbraucht, ist die Wettrunde beendet
		-sind alle, außer einer, ausgestiegen, ist das Spiel beendet
	
	2. Runde FLop
	-3 Tischkarten
	-der spieler Links vom Geber beginnt
	-raise = 1 x bigBlind
	-wettregeln wie vorher
	
	3.Runde turn Card
	-1 Tischkarte
	-der spieler Links vom Geber beginnt
	-raise = 2 x bigBlind
	-wettregeln wie vorher
	
	4. Runde River
	-wie Runde TurnCard
	
	5. Runde Showdown
	-für den allen Kombinationen
		(nur tisch,
		je eine Tisch durch je eine hand ersetzen,
		je 2 Tisch durch 2 hand ersetzen)
		wird für jeden Spieler die Beste ermittelt
	-der Spieler mit der Besten Kombi gewinnt den Pot
	-bei gleichstand wird der Pot geteilt
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
		});
	});
});