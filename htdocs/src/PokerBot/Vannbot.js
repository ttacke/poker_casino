"use strict";

/*
 * Nutze diese Datei um den Bot in das Seibert Media Casino zu integrieren.
 *
 * Bot Quellen: https://github.com/dedeibel/seibert-poker-bot-vann
 *
 * Kopiere vann.js und Vanbot.js nach "casino/htdocs/src/PokerBot" im Casino
 * Projekt.
 */

Vann.prototype = new PokerBotBase();
function Vann() {
	this.name = 'Vann';// von bpeter
	this.passwort = 'c6a2b77d-0230-4fbd-b7ca-fb70403f7217';
	this.beschreibung = 'Geht seinen Weg';
	
	// VOID
	this.reagiere = function(frage) {
    // console.log('Vann: reagiere', frage);
		if(frage.Rundenname == 'showdown') {
			this.ws.send('r' + 'ok');
			return;
		}

    this.ws.send(bpeter.vann.game.play(frage));
	};
}

