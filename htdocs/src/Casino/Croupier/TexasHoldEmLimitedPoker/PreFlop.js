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
		this._erhoeheAuf(spielerrunde, smallBlindSpieler.name, this.smallBlind + '');
		//TODO intern!
		
		var bigBlindSpieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		this._erhoeheAuf(spielerrunde, bigBlindSpieler.name, (this.smallBlind * 2) + '');
		//TODO intern!
		
		this.croupier.gibHandkartenAnAlleSpieler(2, kartenstapel);
		
	};
}
