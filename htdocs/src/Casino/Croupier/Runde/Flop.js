"use strict";

// CLASS DEFINITION
CasinoCroupierRundeFlop.prototype = new CasinoCroupierTexasHoldEmLimitedPokerSpielrunde();
function CasinoCroupierRundeFlop(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		spielerrunde.starteWiederAbGeberToken();
		
		this.croupier._gibTischkartenAnAlleSpieler(3, kartenstapel);
	};
}
