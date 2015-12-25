"use strict";

// CLASS DEFINITION
function PokerSpiel(interne_bots) {
	this.anzeige_groesse = 100;
	this.interne_bots = interne_bots;
	
	// VOID
	this.init = function() {
		this._befuelle_mitspieler_liste();
		this._befuelle_mitspieler_beschreibungen();
		this._befuelle_croupiereinstellungen();
		this._befuelle_casinoeinstellungen();
		this._aktiviere_ui_elemente();
	};
	// VOID
	this.anzeige_vergroessern = function() {
		this.anzeige_groesse += 10;
		$('html').attr('style', 'font-size: ' + this.anzeige_groesse + '%');
	};
	// VOID
	this.anzeige_verkleinern = function() {
		this.anzeige_groesse -= 10;
		$('html').attr('style', 'font-size: ' + this.anzeige_groesse + '%');
	};
	
	// STRING
	this._uuidgen = function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}
	// VOID
	this._befuelle_mitspieler_liste = function() {
		var mitspieler_template = $('#mitspieler .template').parent().html();
		$('#mitspieler .template').remove();
		var $mitspieler = $('#mitspieler');
		
		for(var i = 0; i < this.interne_bots.length; i++) {
			var mitspieler_content = mitspieler_template;
			mitspieler_content = mitspieler_content.replace(/\[value\]/, i);
			mitspieler_content = mitspieler_content.replace(
				/\[text\]/,
				this.interne_bots[i].name + ' + ' + this.interne_bots[0].name + '' 
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
	};
	// VOID
	this._befuelle_mitspieler_beschreibungen = function() {
		var beschreibung_template = $('#bot_liste .template').parent().html();
		$('#bot_liste .template').remove();
		var $beschreibung = $('#bot_liste');
		
		for(var i = 0; i < this.interne_bots.length; i++) {
			var beschreibung_content = beschreibung_template;
			beschreibung_content = beschreibung_content.replace(/\[name\]/, this.interne_bots[i].name);
			beschreibung_content = beschreibung_content.replace(/\[beschreibung\]/, this.interne_bots[i].beschreibung);
			$beschreibung.append(beschreibung_content);
		}
	};
	// VOID
	this._befuelle_croupiereinstellungen = function() {
		$('#tisch_name').val(this._uuidgen());
		$('#croupier_user').val(this._uuidgen());
		$('#croupier_passwort').val(this._uuidgen());
		$('#anzahl_relevanter_spiele').val(10000);
	};
	// VOID
	this._befuelle_casinoeinstellungen= function() {
		$('#casino_domain').val('127.0.0.1');
		$('#casino_port').val('8080');
	};
	// VOID
	this._aktiviere_ui_elemente = function() {
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
	};
}
