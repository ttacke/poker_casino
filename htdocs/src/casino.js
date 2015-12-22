var ANZEIGE_GROESSE = 100;
var INTERNE_BOTS = [
	new PokerBotVerlierer(),
	new PokerBotChecker(),
	new PokerBotNarziss(),
	new PokerBotYgramul()
];
var MITSPIELER = [
	[INTERNE_BOTS[0], INTERNE_BOTS[0]],
	[INTERNE_BOTS[1], INTERNE_BOTS[1]],
	[INTERNE_BOTS[2], INTERNE_BOTS[1]],
	[INTERNE_BOTS[3], INTERNE_BOTS[1]],
	[],
];
// STRING
function uuidgen() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
// VOID
function anzeige_vergroessern() {
	ANZEIGE_GROESSE += 10;
	$('html').attr('style', 'font-size: ' + ANZEIGE_GROESSE + '%');
}
// VOID
function anzeige_verkleinern() {
	ANZEIGE_GROESSE -= 10;
	$('html').attr('style', 'font-size: ' + ANZEIGE_GROESSE + '%');
}
// VOID
function befuelle_interne_bots() {
	var beschreibung_template = $('#bot_liste .template').parent().html();
	$('#bot_liste .template').remove();
	var $beschreibung = $('#bot_liste');
	for(var i = 0; i < INTERNE_BOTS.length; i++) {
		var content = beschreibung_template;
		content = content.replace(/\[name\]/, INTERNE_BOTS[i].name);
		content = content.replace(/\[beschreibung\]/, INTERNE_BOTS[i].beschreibung);
		$beschreibung.append(content);
	}
	
	
	var mitspieler_template = $('#mitspieler .template').parent().html();
	$('#mitspieler .template').remove();
	var $mitspieler = $('#mitspieler');
	for(var i = 0; i < MITSPIELER.length; i++) {
		var content = mitspieler_template;
		content = content.replace(/\[value\]/, i);
		var text = '';
		if(MITSPIELER[i].length == 0) {
			text = 'Keine: freies Spiel, z.B. Turniere';
		} else {
			var list = [];
			for(var j = 0; j < MITSPIELER[i].length; j++) {
				list.push(MITSPIELER[i][j].name);
			}
			text = list.join(' + ');
		}
		content = content.replace(/\[text\]/, text);
		$mitspieler.append(content);
	}
	
	$('#tisch_name').val(uuidgen());
	$('#croupier_user').val(uuidgen());
	$('#croupier_passwort').val(uuidgen());
	$('#anzahl_relevanter_spiele').val(10000);
	$('#casino_domain').val('127.0.0.1');
	$('#casino_port').val('8080');
}
$(function() {
	befuelle_interne_bots();
	
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
	
});