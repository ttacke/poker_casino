"use strict";

// CLASS DEFINITION
CasinoCroupierRundeRiverCard.prototype = new CasinoCroupierTexasHoldEmLimitedPokerSpielrunde();
function CasinoCroupierRundeRiverCard(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		spielerrunde.starteWiederAbGeberToken();
		
		this.croupier._gibTischkartenAnAlleSpieler(1, kartenstapel);
	};
}
