"use strict";

// CLASS DEFINITION
PokerBotChecker.prototype = new PokerBotBase();
function PokerBotChecker() {
	this.name = 'Checker';
	this.passwort = '1aff7aec-9956-4dad-be2a-ba10bebec86d';
	this.beschreibung = 'antwortet nur mit "check"';
	
	// VOID
	this.reagiere = function(frage) {
		if(frage.Rundenname == 'showdown') {
			this.ws.send('r' + 'ok');
			return;
		}
		this.ws.send('r' + 'check');
	};
}
