"use strict";

// CLASS DEFINITION
CasinoCroupierTexasHoldEmLimitedPokerRiverCard.prototype = new CasinoCroupierTexasHoldEmLimitedPokerSpielrunde();
function CasinoCroupierTexasHoldEmLimitedPokerRiverCard(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	this.rundenname = 'river';
	
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
