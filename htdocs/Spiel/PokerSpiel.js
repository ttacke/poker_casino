"use strict";

// CLASS DEFINITION
function PokerSpiel(interne_bots, sparring_partner) {
	this.anzeige_groesse = 100;
	this.anzeige_rand = 12;
	this.interne_bots = interne_bots;
	this.sparring_partner = sparring_partner;
	this.mitspieler_variante = null;
	this.tisch_name = null;
	this.croupier_user = null;
	this.croupier_passwort = null;
	this.anzahl_relevanter_spiele = null;
	this.maximale_antwortzeit_der_bots = null;
	this.casino_domain = null;
	this.casino_port = null;
	this.croupier = null;
	this.aktueller_status = 'Uninitialisiert';
	this.letzter_status = '';
	this.rundenzaehler = 0;
	this.aufgezeichnetes_spiel = null;
	this.abspielvorgang_laeuft = false;
	this.statistik = new PokerSpielStatistik();
	this.abspieler = new PokerSpielaufzeichnungAbspielen();
	this.intervallId = null;
	
	// VOID
	this.init = function() {
		this.sparring_partner.name = this.sparring_partner.name + '(sparring)';
		this._befuelle_mitspieler_liste();
		this._befuelle_mitspieler_beschreibungen();
		this._befuelle_croupiereinstellungen();
		this._befuelle_casinoeinstellungen();
		this._aktiviere_ui_elemente();
		this.aktueller_status = 'Warte auf Start';
	};
	// VOID
	this._starteAnzeigeintervalle = function() {
		var self = this;
		this.intervallId = setInterval(
			function() {
				self._zeige_status();
				self._spiele_aufzeichnung_ab();
				self._zeige_statistik();
			},
			1000
		);
	};
	// VOID
	this._zeige_statistik = function() {
		this.statistik.zeige();
	};
	// VOID
	this._zeige_status = function() {
		if(this.letzter_status != this.aktueller_status) {
			this.letzter_status = this.aktueller_status
			$('#status').html(this.aktueller_status);
		}
	};
	// VOID
	this._spiele_aufzeichnung_ab = function() {
		if(!this.aufgezeichnetes_spiel || this.abspielvorgang_laeuft) return;
		
		this.abspielvorgang_laeuft = true;
		var self = this;
		this.abspieler.starte(
			this.aufgezeichnetes_spiel,
			function() {
				self.abspielvorgang_laeuft = false;
			}
		);
	};
	// VOID
	this.abspielen_verlangsamen = function() {
		this.abspieler.pause_zwischen_den_aktionen += 500;
	};
	// VOID
	this.abspielen_beschleunigen = function() {
		if(this.abspieler.pause_zwischen_den_aktionen > 500) {
			this.abspieler.pause_zwischen_den_aktionen -= 500;
		}
	};
	// VOID
	this.start = function() {
		this._uebernehme_start_parameter();
		
		this.statistik.init(
			this.anzahl_relevanter_spiele * 1,
			$('.statistik tbody'),
			$('.statistik .spielerstatistik_template')
		);
		
		this.croupier = new CasinoCroupierTexasHoldEmLimitedPoker(
			this.croupier_user, this.croupier_passwort
		);
		var self = this;
		this.croupier.verbindungsfehlerFunktion = function() {
			self._neustart();
		};
		
		this._starteAnzeigeintervalle();
		
		var self = this;
		this.aktueller_status = 'Starte';
		this.croupier.betrete(
			'ws:' + this.casino_domain + ':' + this.casino_port,
			function() {
				self.aktueller_status = 'Verbindung zum Casino hergestellt';
				self._eroeffneTisch()
			},
			function() {
				self.aktueller_status = 'Verbindung zum Casino fehlgeschlagen';
				setTimeout(function() { self._neustart() }, 2000);
			}
		);
	};
	// VOID
	this._neustart = function() {
		clearInterval(this.intervallId);
		
		this.aktueller_status = 'Verbindung unterbrochen, neuer Versuch...';
		this._zeige_status();
		
		console.log('Spiel wird wegen eines Casino-Server-Neustarts auch neu gestartet');
		
		for(var i = 0; i < this.interne_bots.length; i++) {
			this.interne_bots[i].stoppe();
		}
		this.sparring_partner.stoppe();
		
		var self = this;
		setTimeout(function() {
			console.log('Neustart erfolgt...');
			self.start();
		}, 3 * 1000);
	};
	// VOID
	this._eroeffneTisch = function() {
		var self = this;
		self.aktueller_status = 'Eröffne Tisch';
		this.croupier.eroeffneTisch(
			this.tisch_name,
			'TexasHoldEmFixedLimit-Poker',
			this.maximale_antwortzeit_der_bots, 
			function(daten) {
				if(daten.status == 'ok') {
					$('.tisch_name span').html(self.tisch_name);
					self.aktueller_status = 'Tisch ist eröffnet';
					self._zeige_spieltisch();
					self._starte_mitspieler();
					setTimeout(
						function() {
							self._spiele();
						},
						1000
					);
				} else {
					self.aktueller_status = 'Konnte Tisch nicht eröffnen';
					setTimeout(function() { self._neustart() }, 2000);
				}
			}
		);
	};
	// VOID
	this._starte_mitspieler = function() {
		this.aktueller_status = 'Starte Mitspieler';
		if(this.mitspieler_variante == -1) {
			// DoNothing: freihes Spiel
		} else if(this.mitspieler_variante == -2) {
			for(var i = 0; i < this.interne_bots.length; i++) {
				this.interne_bots[i].starte(
					this.casino_domain, this.casino_port, this.tisch_name
				);
			}
		} else if(this.interne_bots[this.mitspieler_variante]) {
			this.interne_bots[this.mitspieler_variante].starte(
				this.casino_domain, this.casino_port, this.tisch_name
			);
			this.sparring_partner.starte(
				this.casino_domain, this.casino_port, this.tisch_name
			);
		}
		this.aktueller_status = 'Mitspieler gestartet';
	};
	// VOID
	this._spiele = function() {
		var self = this;
		this.croupier.spieleEinSpiel(function(erfolg) {
			if(erfolg) {
				self.rundenzaehler++;
				self.aktueller_status = 'Runde #' + (self.rundenzaehler + 1) + ' gespielt';
				self.aufgezeichnetes_spiel = self.croupier.gibAufzeichnung();
				self.statistik.logge(self.aufgezeichnetes_spiel);
				
				if(self.rundenzaehler % 100 == 0) {
					self.aktueller_status = 'Warte auf neue Mitspieler';
					self.croupier.nimmMitspielerAuf(function() {
						setTimeout(function() { self._spiele() }, 0);
					});
					return;
				}
				setTimeout(function() { self._spiele() }, 0);
				return;
			}
			
			self.aktueller_status = 'Zu wenig Mitspieler, warte...';
			self.croupier.nimmMitspielerAuf(function() {
				setTimeout(function() { self._spiele() }, 1000);
			});
			return;
		});
	};
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
		this.mitspieler_variante = $('#mitspieler').val();
	};
	// VOID
	this.anzeige_vergroessern = function() {
		this.anzeige_groesse += 10;
		this.anzeige_rand += 6;
		$('html').attr('style', 'font-size: ' + this.anzeige_groesse + '%');
		$('#tisch').attr('style', 'padding-left: ' + this.anzeige_rand + '%;padding-right:' + this.anzeige_rand + '%');
	};
	// VOID
	this.anzeige_verkleinern = function() {
		this.anzeige_groesse -= 10;
		this.anzeige_rand -= 6;
		$('html').attr('style', 'font-size: ' + this.anzeige_groesse + '%');
		$('#tisch').attr('style', 'padding-left: ' + this.anzeige_rand + '%;padding-right:' + this.anzeige_rand + '%');
	};
	// STRING
	this._uuidgen = function() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
		}
		return s4() + s4() + 'X' + s4() + 'X' + s4() + 'X' + s4() + 'X' + s4() + s4() + s4();
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
				this.interne_bots[i].name + ' + ' + this.sparring_partner.name + '' 
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
		$('#anzahl_relevanter_spiele').val(3000);
		$('#maximale_antwortzeit_der_bots').val(150);
	};
	// VOID
	this._befuelle_casinoeinstellungen= function() {
		$('#casino_domain').val('10.1.6.150');
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
