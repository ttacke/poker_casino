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
		this._erhoeheAuf(spielerrunde, smallBlindSpieler, this.smallBlind + '');
		//TODO intern!
		
		var bigBlindSpieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		this._erhoeheAuf(spielerrunde, bigBlindSpieler, (this.smallBlind * 2) + '');
		//TODO intern!
		
		this.croupier._gibHandkartenAnAlleSpieler(2, kartenstapel);
		
	};
}
