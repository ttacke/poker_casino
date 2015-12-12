"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPokerTurnCard.prototype = new CasinoCroupierTexasHoldEmLimitedPokerSpielrunde();
function CasinoCroupierTexasHoldEmLimitedPokerTurnCard(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	this.rundenname = 'turncard';
	
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		spielerrunde.starteWiederAbGeberToken();
		
		this.croupier.gibTischkartenAnAlleSpieler(1, kartenstapel);
	};
	// INT
	this._gibRaiseEinsatz = function() {
		return this.smallBlind * 4;
	};
}
