"use strict";

// CLASS DEFINITION
function CasinoCroupierRundePreflop(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		spielerrunde.starteWiederAbGeberToken();
		
		var smallBlindSpieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		croupier._erhoeheAuf(smallBlindSpieler, this.smallBlind + '');
		//TODO intern!
		
		var bigBlindSpieler = spielerrunde.gibDenSpielerDerAnDerReiheIst();
		croupier._erhoeheAuf(bigBlindSpieler, (this.smallBlind * 2) + '');
		//TODO intern!
		
		croupier._gibHandkartenAnAlleSpieler(2, kartenstapel);
		
	};
	// VOID
	this.wetten = function(spielerrunde, kartenstapel, naechsteRunde) {
		
		croupier._ermittleEinsaetzeVonAllen(naechsteRunde);
	};
}
