"use strict";

// CLASS DEFINITION
Crank.prototype = new PokerBotBase();
function Crank() {
	this.name = 'Crank';
	this.passwort = '3e00b261-72fd-4be7-9270-6bab6b741873';
	this.beschreibung = 'Bewertet die Karten';

	// VOID
	this.reagiere = function(frage) {
		if(frage.Rundenname == 'showdown') {
			this.ws.send('r' + 'ok');
			return;
		}
		
		var all_cards = get_all_cards(frage.Tisch, frage.Hand);
		var points = sum_points(all_cards);
		var antwort = do_action_in_round_name(frage.Rundenname, points);
		
		this.ws.send('r' + antwort);
		return;
	}

	var high_cards = {
		'1': 'J',
		'2': 'Q',
		'3': 'K',
		'4': 'A'
	}

	function get_value_of_card(card){
		if (card.length == 2) {
			return card[0];
		} else {
			return card[0] + card[1];
		}
	}

	function sum_points(all_cards) {
		var sum = 0;
		sum += check_for_doubles(all_cards);
		sum += check_for_high_cards(all_cards);
		return sum;
	}

	function check_for_doubles(all_cards) {
		var points = 0;
		for (i = 0; i < all_cards.length; i++) {
			for (j = i + 1; j < all_cards.length; j++) {
				if (
					get_value_of_card(all_cards[i]) ==
					get_value_of_card(all_cards[j])
				) {
					points += 2;
				}
			}
		}
		return points;
	}

	function check_for_high_cards(all_cards) {
		var points = 0;
		for (i = 0; i < all_cards.length; i++) {
			for (var high_card in high_cards) {
				if (
					get_value_of_card(all_cards[i]) ==
					high_cards[high_card]
				) {
					points += high_card * 0.25;
				}
			}
		}
		return points;
	}

	function get_all_cards(Tisch, Hand) {
		all_cards = [];
		Hand.forEach(function(value) {
			all_cards.push(value);
		});

		Tisch.forEach(function(value) {
			all_cards.push(value);
		});
		return all_cards;
	}

	function do_action_in_round_name(round_name, points) {
		var raise = 'raise';
		var check = 'check';
		var fold = 'fold';

		switch(round_name) {
			case 'preflop':
				var minimum = 1;
				var maximum = 2;
				if (points >= minimum && points < maximum) {
					return raise;
				} else if (points > maximum) {
					return raise;
				} else {
					return check;
				}
			case 'flop':
				var minimum = 1.5;
				var maximum = 2.5;
				if (points >= minimum && points < maximum) {
					return check;
				} else if (points > maximum) {
					return raise;
				} else {
					return fold;
				}
			case 'turncard':
				var minimum = 1.75;
				var maximum = 2.75;
				if (points >= minimum && points < maximum) {
					return check;
				} else if (points > maximum) {
					return raise;
				} else {
					return fold;
				}
			case 'river':
				var minimum = 2;
				var maximum = 3;
				if (points >= minimum && points < maximum) {
					return check;
				} else if (points > maximum) {
					return raise;
				} else {
					return fold;
				}
			default:
				throw "never reach here!";
		}
	}
}
