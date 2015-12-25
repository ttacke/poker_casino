"use strict";

// CLASS DEFINITION
function PokerSpiel(interne_bots) {
	this.anzeige_groesse = 100;
	this.interne_bots = interne_bots;
	this.tisch_name = null;
	this.croupier_user = null;
	this.croupier_passwort = null;
	this.anzahl_relevanter_spiele = null;
	this.maximale_antwortzeit_der_bots = null;
	this.casino_domain = null;
	this.casino_port = null;
	this.croupier = null;
	
	// VOID
	this.init = function() {
		this._befuelle_mitspieler_liste();
		this._befuelle_mitspieler_beschreibungen();
		this._befuelle_croupiereinstellungen();
		this._befuelle_casinoeinstellungen();
		this._aktiviere_ui_elemente();
	};
	// VOID
	this.start = function() {
		this._uebernehme_start_parameter();
		this.croupier = new CasinoCroupierTexasHoldEmLimitedPoker(
			this.croupier_user, this.croupier_passwort
		);
		var self = this;
		this.croupier.betrete(
			'ws:' + this.casino_domain + ':' + this.casino_port,
			function() {
				self._eroeffneTisch()
			}
		);
	};
	// VOID
	this._eroeffneTisch = function() {
		var self = this;
		this.croupier.eroeffneTisch(
			this.tisch_name,
			'TexasHoldEmFixedLimit-Poker',
			this.maximale_antwortzeit_der_bots, 
			function(daten) {
				if(daten.status == 'ok') {
					self._zeige_spieltisch();
					//TODO
					console.log('spiele');
				} else {
					//TODO logge('status', "Tisch anlegen ist fehlgeschlagen");
					// setTimeout('_init()', 1000);
					console.log('fehler beim eroeffnen');
				}
			}
		);
	}
	// VOID
	this._zeige_spieltisch = function() {
		$('#start').hide();
		$('#spiel').show();
	};
	// VOID
	this._uebernehme_start_parameter = function() {
		this.tisch_name = $('#tisch_name').val();
		this.croupier_user = $('#croupier_user').val();
		this.croupier_passwort = $('#croupier_passwort').val();
		this.anzahl_relevanter_spiele = $('#anzahl_relevanter_spiele').val();
		this.maximale_antwortzeit_der_bots = $('#maximale_antwortzeit_der_bots').val();
		this.casino_domain = $('#casino_domain').val();
		this.casino_port = $('#casino_port').val();
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
		$('#maximale_antwortzeit_der_bots').val(150);
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
