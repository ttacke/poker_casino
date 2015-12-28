"use strict";

// CLASS DEFINITION
PokerBotAussteiger.prototype = new PokerBotBase();
function PokerBotAussteiger() {
	this.name = 'Aussteiger';
	this.passwort = 'c0ebf5ff-c1aa-4a28-bfdc-c12a5ea72e88';
	this.beschreibung = 'steigt immer sofort aus';
	
	// VOID
	this.reagiere = function(frage) {
		if(frage.Rundenname == 'showdown') {
			this.ws.send('r' + 'ok');
			return;
		}
		this.ws.send('r' + 'fold');
	};
}
