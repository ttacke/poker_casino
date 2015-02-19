"use strict";


describe("Szenario: das Casino ist geöffnet", function() {
	describe("Angenommen ich bin ein Poker-Croupier für Texas", function() {
		var c = null;
		function blatt(a) {
			var nameA = a.substr(0, a.indexOf(" "));
			var blattA = a.substr(a.indexOf(" ") + 1, a.length);
			return {
				schlaegt: function(b) {
					var nameB = b.substr(0, b.indexOf(" "));
					var blattB = b.substr(b.indexOf(" ") + 1, b.length);
					if(!c.blattAschlaegtB(blattA, blattB) || c.blattAschlaegtB(blattB, blattA)) {
						expect(nameA + " > " + nameB).toBe(a + " schlaegt " + b);
					}
				},
				unterliegt: function(b) {
					var nameB = b.substr(0, b.indexOf(" "));
					var blattB = b.substr(b.indexOf(" ") + 1, b.length);
					if(c.blattAschlaegtB(blattA, blattB) || !c.blattAschlaegtB(blattB, blattA)) {
						expect(nameA + " < " + nameB).toBe(a + " unterliegt " + b);
					}
				},
				splitted: function(b) {
					var nameB = b.substr(0, b.indexOf(" "));
					var blattB = b.substr(b.indexOf(" ") + 1, b.length);
					if(c.blattAschlaegtB(blattA, blattB) || c.blattAschlaegtB(blattB, blattA)) {
						expect(nameA + " == " + nameB).toBe(a + " splitted " + b);
					}
				}
			}
		}
		beforeEach(function() {
			c = new CasinoCroupierTexasHoldEmLimitedPoker("name", "passwort");
		});
		describe("UNITTESTS", function() {
			it("String in Karten konvertieren", function() {
				var k = c.parseKarten("K♥ 10♣");
				expect(k.length).toBe(2);
				expect(k[0].bezeichnung).toBe("K");
				expect(k[0].farbe).toBe("♥");
				expect(k[0].zahlwert).toBe(13);
				
				expect(k[1].bezeichnung).toBe("10");
				expect(k[1].farbe).toBe("♣");
				expect(k[1].zahlwert).toBe(10);
			});
		});
		it("Blatt-Bewertung", function() {
		//TODO Bewertungen lesbar an der Oberfläche
		//TODO Punktebewertung pro Blatt als vergleichbarer String (...Straight13Drilling02Paar0406High1312100908)
			expect(true).toBe(true);
			//http://de.wikipedia.org/wiki/Hand_%28Poker%29
			blatt("HighCard A♦ 10♦ 9♠ 5♣ 4♣").schlaegt("HighCard K♣ Q♦ J♣ 8♥ 7♥");
			blatt("HighCard A♦ 10♦ 9♠ 5♣ 4♣").schlaegt("HighCard A♣ 9♦ 8♥ 5♠ 4♠");
			blatt("HighCard Q♣ J♣ 5♦").unterliegt("HighCard K♦ 10♦ 5♣");
			
			blatt("EinPaar 9♥ 9♣ 2♥ Q♦ 10♦").schlaegt("HighCard A♦ Q♦ 9♠ 10♣ 4♣");
			
			blatt("EinPaar 10♣ 10♠ 6♠ 4♥ 2♥").schlaegt("EinPaar 9♥ 9♣ A♥ Q♦ 10♦");
			blatt("EinPaar 10♥ 10♦ J♦ 3♥ 2♣").schlaegt("EinPaar 10♣ 10♠ 6♠ 4♥ 2♥");
			blatt("EinPaar 10♥ 10♦ J♦ 4♥ 3♣").schlaegt("EinPaar 10♣ 10♠ J♠ 4♦ 2♥");
			
			blatt("ZweiPaare  7♦ 7♠ 10♠ 10♣ 9♠").schlaegt("EinPaar 10♥ 10♦ J♦ 4♥ 3♣");
			
			blatt("ZweiPaare K♥ K♦ 2♣ 2♦ J♥").schlaegt("ZweiPaare  J♦ J♠ 10♠ 10♣ 9♠");
			blatt("ZweiPaare 4♠ 4♣ 3♠ 3♥ K♦").schlaegt("ZweiPaare 4♥ 4♦ 3♦ 3♣ 10♠");
			
			blatt("Drilling 5♣ 5♥ 5♦ Q♦ 10♣").schlaegt("ZweiPaare 4♠ 4♣ 3♠ 3♥ K♦");
			
			blatt("Drilling 8♠ 8♥ 8♦ 5♠ 3♣").schlaegt("Drilling 5♣ 5♥ 5♦ Q♦ 10♣");
			blatt("Drilling 8♠ 8♥ 8♦ A♣ 2♦").schlaegt("Drilling 8♣ 8♥ 8♦ 5♠ 3♣");
			
			blatt("Straight 6♦ 5♠ 4♦ 3♥ 2♣").schlaegt("Drilling 8♠ 8♥ 8♦ A♣ 2♦");
	
			blatt("Straight 5♠ 4♠ 3♥ 2♥ A♠").schlaegt("Drilling 8♠ 8♥ 8♦ A♣ 2♦");
			
			blatt("Straight 8♠ 7♠ 6♥ 5♥ 4♠").schlaegt("Straight 6♦ 5♠ 4♦ 3♥ 2♣");
			blatt("Straight 8♠ 7♠ 6♥ 5♥ 4♠").splitted("Straight 8♥ 7♦ 6♣ 5♣ 4♥");
			
			blatt("Flush K♠ Q♠ J♠ 9♠ 6♠").schlaegt("Straight 8♠ 7♠ 6♥ 5♥ 4♠");
			
			blatt("Flush A♥ Q♥ 10♥ 5♥ 3♥").schlaegt("Flush K♠ Q♠ J♠ 9♠ 6♠");
			blatt("Flush A♦ K♦ 7♦ 6♦ 2♦").schlaegt("Flush A♥ Q♥ 10♥ 5♥ 3♥");
			blatt("Flush Q♥ 10♥ 9♥ 5♥ 2♥").splitted("Flush Q♠ 10♠ 9♠ 5♠ 2♠");
			
			blatt("FullHouse  9♥ 9♣ 9♠ A♥ A♣").schlaegt("Flush Q♥ 10♥ 9♥ 5♥ 2♥");
			
			blatt("FullHouse 10♠ 10♥ 10♦ 4♠ 4♦").schlaegt("FullHouse  9♥ 9♣ 9♠ A♥ A♣");
			blatt("FullHouse 10♠ 10♥ 10♦ 4♠ 4♦").schlaegt("FullHouse 10♥ 10♣ 10♠ 3♥ 3♣");
			blatt("FullHouse Q♥ Q♦ Q♣ 8♥ 8♣").splitted("FullHouse Q♥ Q♦ Q♠ 8♥ 8♣");
			
			blatt("Vierling 6♦ 6♥ 6♠ 6♣ K♠").schlaegt("FullHouse Q♥ Q♦ Q♣ 8♥ 8♣");
			
			blatt("Vierling 10♣ 10♦ 10♥ 10♠ 5♦").schlaegt("Vierling 6♦ 6♥ 6♠ 6♣ K♠");
			blatt("Vierling 10♣ 10♦ 10♥ 10♠ Q♣").schlaegt("Vierling 10♣ 10♦ 10♥ 10♠ 5♦");
			blatt("Vierling 10♣ 10♦ 10♥ 10♠ Q♣").splitted("Vierling 10♣ 10♦ 10♥ 10♠ Q♦");
			
			blatt("StraightFlush 5♠ 4♠ 3♠ 2♠ A♠").schlaegt("Vierling 10♣ 10♦ 10♥ 10♠ Q♣");
			
			blatt("StraightFlush 5♠ 4♠ 3♠ 2♠ A♠").splitted("StraightFlush 5♠ 4♠ 3♠ 2♠ A♠");
			blatt("StraightFlush 7♥ 6♥ 5♥ 4♥ 3♥").schlaegt("StraightFlush 5♠ 4♠ 3♠ 2♠ A♠");
			blatt("StraightFlush J♣ 10♣ 9♣ 8♣ 7♣").splitted("StraightFlush J♦ 10♦ 9♦ 8♦ 7♦");
			
			blatt("RoyalFlush A♣ K♣ Q♣ J♣ 10♣").schlaegt("StraightFlush K♠ Q♠ J♠ 10♠ 9♠");
			
			blatt("RoyalFlush A♣ K♣ Q♣ J♣ 10♣").splitted("RoyalFlush A♠ K♠ Q♠ J♠ 10♠");
			
		});
	});
});