"use strict";

// CLASS DEFINITION
PokerBotYgramul.prototype = new PokerBotBase();
function PokerBotYgramul() {
	this.name = 'GaltonFrancis';
	this.passwort = 'b3bea06b-c3fc-44e0-9e67-e9fe74d59a11';
	this.beschreibung = 'Betreibt Zwillingsforschung';
	
	// VOID
	this.reagiere = function(frage) {
		if(frage.Rundenname == 'showdown') {
			this.ws.send('r' + 'ok');
			return;
		}
		
		var best_counter = 0;
		var alleKarten = []
		
		if ('Hand' in frage) {
			frage.Hand.forEach(function(value) {
				alleKarten.push(value);
			});
		}
		frage.Tisch.forEach(function(value) {
			alleKarten.push(value);
		});
		
		for (var i = 0; i < alleKarten.length; i++) {
			for (var j = i+1; j < alleKarten.length; j++) {
				if (getvalueofcard(alleKarten[i]) == getvalueofcard(alleKarten[j])) {
					best_counter += 1;
				}
			}
		}
		
		if (best_counter > 0) {
			//raise, check, fold
			this.ws.send('r' + 'raise');
		} else {
			this.ws.send('r' + 'check');
		}
		
		function getvalueofcard(card) {
			if (card.length == 2) {
				return card[0];
			}
			if (card.length == 3) {
				return card[0] + card[1];
			}
		}
	};
}
