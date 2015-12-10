"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPokerPreFlop.prototype = new CasinoCroupierTexasHoldEmLimitedPokerSpielrunde();
function CasinoCroupierTexasHoldEmLimitedPokerPreFlop(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		spielerrunde.starteWiederAbGeberToken();
		
		var smallBlindSpieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		spielerrunde.erhoeheEinsatzAuf(smallBlindSpieler, this.smallBlind);
		
		var bigBlindSpieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		spielerrunde.erhoeheEinsatzAuf(bigBlindSpieler, this.smallBlind * 2);
		
		this.croupier.gibHandkartenAnAlleSpieler(2, kartenstapel);
	};
}
