"use strict";

// CLASS DEFINITION
CasinoCroupierRundePreFlop.prototype = new CasinoCroupierBietrunde();
function CasinoCroupierRundePreFlop(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		spielerrunde.starteWiederAbGeberToken();
		
		var smallBlindSpieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		this.croupier._erhoeheAuf(smallBlindSpieler, this.smallBlind + '');
		//TODO intern!
		
		var bigBlindSpieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		this.croupier._erhoeheAuf(bigBlindSpieler, (this.smallBlind * 2) + '');
		//TODO intern!
		
		this.croupier._gibHandkartenAnAlleSpieler(2, kartenstapel);
		
	};
}
