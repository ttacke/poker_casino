"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPokerFlop.prototype = new CasinoCroupierTexasHoldEmLimitedPokerSpielrunde();
function CasinoCroupierTexasHoldEmLimitedPokerFlop(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		spielerrunde.starteWiederAbGeberToken();
		
		this.croupier.gibTischkartenAnAlleSpieler(3, kartenstapel);
	};
}
