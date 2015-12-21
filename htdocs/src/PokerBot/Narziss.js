"use strict";

// CLASS DEFINITION
PokerBotNarziss.prototype = new PokerBotBase();
function PokerBotNarziss() {
	this.name = 'Narziss';
	this.passwort = 'de722016-582c-4393-9ad9-791138430f76';
	this.beschreibung = 'Schaut nur auf sich';
	
	// ARRAY
	this.splitCard = function(card) {
		card.match(/^(.*)(.)$/);
		return [RegExp.$1,RegExp.$2];
	}
	// VOID
	this.reagiere = function(frage) {
		if(frage.Rundenname == 'showdown') {
			this.ws.send('r' + 'ok');
			return;
		}
		
		var antwort = 'check';
		var card1 = this.splitCard(frage.Hand[0]);
		var card2 = this.splitCard(frage.Hand[1]);
		if(frage.Rundenname == 'preflop') {
			if(
				card1[0] == 'A'
				|| card1[0] == 'K'
				|| card1[0] == 'Q'
				|| card1[0] == 'J'
				|| card1[0] == '10'
				|| card2[0] == 'A'
				|| card2[0] == 'K'
				|| card2[0] == 'Q'
				|| card2[0] == 'J'
				|| card2[0] == '10'
			) {
				antwort = 'raise';
			}
		}
		if(
			card1[0] == card2[0]
			&& (card1[0] == 'A'
				|| card1[0] == 'K'
				|| card1[0] == 'Q'
				|| card1[0] == 'J'
				|| card1[0] == '10')
		) {
			antwort = 'raise';
		}
		this.ws.send('r' + antwort);
	};
}
