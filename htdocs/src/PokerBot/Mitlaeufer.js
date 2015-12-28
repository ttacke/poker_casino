"use strict";

// CLASS DEFINITION
PokerBotMitlaeufer.prototype = new PokerBotBase();
function PokerBotMitlaeufer() {
	this.name = 'Mitläufer';
	this.passwort = '1aff7aec-9956-4dad-be2a-ba10bebec86d';
	this.beschreibung = 'geht überall mit';
	
	// VOID
	this.reagiere = function(frage) {
		if(frage.Rundenname == 'showdown') {
			this.ws.send('r' + 'ok');
			return;
		}
		this.ws.send('r' + 'check');
	};
}
