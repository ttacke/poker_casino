var ANZEIGE_GROESSE = 100;
var INTERNE_BOTS = [
	new PokerBotVerlierer(),
	new PokerBotChecker(),
	new PokerBotNarziss(),
	new PokerBotYgramul()
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
	
	var mitspieler_template = $('#mitspieler .template').parent().html();
	$('#mitspieler .template').remove();
	var $mitspieler = $('#mitspieler');
	
	for(var i = 0; i < INTERNE_BOTS.length; i++) {
		var beschreibung_content = beschreibung_template;
		beschreibung_content = beschreibung_content.replace(/\[name\]/, INTERNE_BOTS[i].name);
		beschreibung_content = beschreibung_content.replace(/\[beschreibung\]/, INTERNE_BOTS[i].beschreibung);
		$beschreibung.append(beschreibung_content);
		
		var mitspieler_content = mitspieler_template;
		mitspieler_content = mitspieler_content.replace(/\[value\]/, i);
		mitspieler_content = mitspieler_content.replace(
			/\[text\]/,
			INTERNE_BOTS[i].name + ' + ' + INTERNE_BOTS[0].name + '' 
		);
		$mitspieler.append(mitspieler_content);
	}
	
	var mitspieler_content = mitspieler_template;
	mitspieler_content = mitspieler_content.replace(/\[value\]/, -2);
	mitspieler_content = mitspieler_content.replace(
		/\[text\]/,
		'Alle unten genannten'
	);
	$mitspieler.append(mitspieler_content);
	
	var mitspieler_content = mitspieler_template;
	mitspieler_content = mitspieler_content.replace(/\[value\]/, -1);
	mitspieler_content = mitspieler_content.replace(
		/\[text\]/,
		'Keine: freies Spiel, z.B. Turniere'
	);
	$mitspieler.append(mitspieler_content);
	
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