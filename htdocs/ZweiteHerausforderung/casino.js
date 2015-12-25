$(function() {
	var pokerSpiel = new PokerSpiel([
		new PokerBotVerlierer(),
		new PokerBotChecker(),
		new PokerBotNarziss(),
		new GaltonFrancis()
	]);
	pokerSpiel.init();
});