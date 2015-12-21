var anzeige_groesse = 100;
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
});