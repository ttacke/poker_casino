"use strict";

// CLASS DEFINITION
CasinoCroupierRundeTurnCard.prototype = new CasinoCroupierBietrunde();
function CasinoCroupierRundeTurnCard(croupier, smallBlind) {
	this.smallBlind = smallBlind;
	this.croupier = croupier;
	
	// VOID
	this.vorbereiten = function(spielerrunde, kartenstapel) {
		spielerrunde.starteWiederAbGeberToken();
		
		this.croupier._gibTischkartenAnAlleSpieler(1, kartenstapel);
	};
}
