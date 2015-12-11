"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPokerRiverCard.prototype = new CasinoCroupierTexasHoldEmLimitedPokerSpielrunde();
function CasinoCroupierTexasHoldEmLimitedPokerRiverCard(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	this.typ = 'river';
	
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		spielerrunde.starteWiederAbGeberToken();
		
		this.croupier.gibTischkartenAnAlleSpieler(1, kartenstapel);
	};
}
