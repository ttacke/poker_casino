"use strict";

// CLASS DEFINITION
PokerBotVorlage.prototype = new PokerBotBase();
function PokerBotVorlage(name, passwort) {
	this.name = name;
	this.passwort = passwort;
	this.beschreibung = '-';
	this.prefix = '';
	
	// VOID
	this.reagiere = function(frage) {
		if(frage.Rundenname == 'showdown') {
			showdown_info(frage);
			this.ws.send('r' + 'ok');
			return;
		}
		var antwort = beantworte_frage(frage);
		this.ws.send('r' + antwort);
	};
}
// VOID
function starte_bot(conf) {
	new PokerBotVorlage(conf.bot_name, conf.bot_passwort).starte(
		'127.0.0.1', '8080', conf.tisch_name
	);
}
