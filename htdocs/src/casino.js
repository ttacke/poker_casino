var anzeige_groesse = 100;
var interne_bots = [
	new PokerBotVerlierer(),
	new PokerBotChecker(),
	new PokerBotNarziss(),
	new PokerBotYgramul()
];
// VOID
function anzeige_vergroessern() {
	anzeige_groesse += 10;
	$('html').attr('style', 'font-size: ' + anzeige_groesse + '%');
}
// VOID
function anzeige_verkleinern() {
	anzeige_groesse -= 10;
	$('html').attr('style', 'font-size: ' + anzeige_groesse + '%');
}
// VOID
function befuelle_interne_bots() {
	var $template = $('#bot_liste .template').remove();
	var $root = $('#bot_liste');
	for(var i = 0; i < interne_bots.length; i++) {
		var content = $template.html();
		content = content.replace(/\[name\]/, interne_bots[i].name);
		content = content.replace(/\[beschreibung\]/, interne_bots[i].beschreibung);
		$root.append(content);//'<li><span class="bot_name">' + interne_bots[i].name + ':</span><span class="bot_beschreibung">' + interne_bots[i].beschreibung + '</span></li>');
	}
}
$(function() {
	$( "button" ).hover(
		function() {
			$( this ).addClass( "ui-state-hover" );
		},
		function() {
			$( this ).removeClass( "ui-state-hover" );
		}
	);
	$( "select" ).selectmenu();
	$( ".accordeon" ).accordion();
	befuelle_interne_bots();
});