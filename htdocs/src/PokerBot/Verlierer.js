"use strict";

// CLASS DEFINITION
PokerBotVerlierer.prototype = new PokerBotBase();
function PokerBotVerlierer() {
	this.name = 'Verlierer';
	this.passwort = 'c0ebf5ff-c1aa-4a28-bfdc-c12a5ea72e88';
	this.beschreibung = 'antwortet nur mit "fold"';
	
	// VOID
	this.reagiere = function(frage) {
		if(frage.Rundenname == 'showdown') {
			this.ws.send('r' + 'ok');
			return;
		}
		this.ws.send('r' + 'fold');
	};
}
