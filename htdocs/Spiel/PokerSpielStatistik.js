"use strict";

// CLASS DEFINITION
function PokerSpielStatistik() {
	this.$ramen = null;
	this.$template = null;
	this.stack_historie = {};
	this.timeout_historie = {};
	this.trendmenge = 1;
	this.ist_initialisiert = false;
	this.statistik_bereits_gezeigt = false;
	
	// VOID
	this.init = function(trendmenge, $ramen, $template) {
		if(this.ist_initialisiert) {
			this.stack_historie = this._setze_endpunkt_auf_nulllinie(this.stack_historie);
		}
		
		this.$ramen = $ramen;
		this.$template = $template;
		this.trendmenge = trendmenge;
		this.ist_initialisiert = true;
	};
	// VOID
	this._setze_endpunkt_auf_nulllinie = function(liste) {
		for(var name in liste) {
			var letzter_wert = liste[name][liste[name].length - 1];
			for(var i = 0; i < liste[name].length; i++) {
				liste[name][i] -= letzter_wert;
			}
		}
		return liste;
	};
	// VOID
	this.logge = function(aufgezeichnetes_spiel) {
		if(!aufgezeichnetes_spiel || !aufgezeichnetes_spiel.length) return;
		
		var daten = aufgezeichnetes_spiel[aufgezeichnetes_spiel.length - 1];
		if(daten.frage.Rundenname != 'showdown') return;
		
		for(var i = 0;i < daten.frage.Spieler.length; i++) {
			if(!this.stack_historie[daten.frage.Spieler[i].Name]) {
				this.stack_historie[daten.frage.Spieler[i].Name] = [];
			}
			this.stack_historie[daten.frage.Spieler[i].Name].push(daten.frage.Spieler[i].Stack);
		}
		
		for(var i = 0; i < aufgezeichnetes_spiel.length; i++) {
			var daten = aufgezeichnetes_spiel[i];
			if(!this.timeout_historie[daten.spieler]) {
				this.timeout_historie[daten.spieler] = [];
			}
			
			this.timeout_historie[daten.spieler].push(daten.antwort.status != 'ok' ? true : false);
		}
	};
	// VOID
	this.zeige = function() {
		if(!this.ist_initialisiert) return;
		
		var statistik = [];
		var neue_daten_vorhanden = false;
		for(var name in this.stack_historie) {
			while(this.stack_historie[name].length > this.trendmenge) {
				this.stack_historie[name].shift();
			}
			
			var hat_neue_daten = false;
			while(this.timeout_historie[name].length > 100) {
				this.timeout_historie[name].shift();
				hat_neue_daten = true;
			}
			
			var timeouts = 0;
			for(var i = 0; i < this.timeout_historie[name].length; i++) {
				if(this.timeout_historie[name][i] == true) {
					timeouts++;
				}
			}
			
			var trend = this._gib_trend(this.stack_historie[name], this.trendmenge);
			var datenmenge_fuer_kurztrend = Math.floor(this.trendmenge / 20);
			var kurz_trend = this._gib_trend(this.stack_historie[name], datenmenge_fuer_kurztrend);
			
			statistik.push({
				name: name,
				trend: (hat_neue_daten ? trend : '-'),
				kurz: (hat_neue_daten ? kurz_trend : '-'),
				timeouts: (hat_neue_daten ? timeouts : 100),
			});
			if(hat_neue_daten) neue_daten_vorhanden = true;
		}
		statistik.sort(function(a, b){ return b.trend - a.trend });
		
		if(this.statistik_bereits_gezeigt && !neue_daten_vorhanden) {
			return;
		}
		
		var template_liste = [];
		for(var i = 0; i < statistik.length; i++) {
			var t = '<tr>' + this.$template.html() + '</tr>';
			t = t.replace(/\[name\]/, statistik[i].name);
			t = t.replace(/\[trend\]/, statistik[i].trend);
			t = t.replace(/\[kurz\]/, statistik[i].kurz);
			t = t.replace(/\[timeouts\]/, statistik[i].timeouts);
			template_liste.push(t);
		}
		this.$ramen.html(template_liste.join(''));
		this.statistik_bereits_gezeigt = true;
	};
	// STRING
	this._gib_trend = function(stackliste, benutzte_anzahl) {
		var i = stackliste.length - benutzte_anzahl;
		var trend = 'warten(' + (i * -1) + ')';
		if(i >= 0) {
			var daten = [];
			for(;i < stackliste.length; i++) {
				daten.push(stackliste[i]);
			}
			trend = this._berechne_trend(daten);
		}
		return trend;
	};
	// INT
	this._berechne_trend = function(daten) {
		var x_durchschnitt = ((daten.length + 1) * (daten.length / 2)) / daten.length;
		var y_durchschnitt = this._gib_durchschnitt(daten);
		
		var summe_xy = 0;
		var summe_xx = 0;
		var sxi = 0;
		var syi = 0;
		
		for(var i = 0;i < daten.length; i++) {
			var xi = (i + 1) - x_durchschnitt; 
			var yi = daten[i] - y_durchschnitt;
			
			var xy = xi * yi;
			var xx = xi * xi;
			
			summe_xy += xy * 1;
			summe_xx += xx * 1;
			sxi += xi;
			syi += yi;
		}
		return Math.floor((summe_xy / summe_xx) * daten.length);
	};
	// FLOAT
	this._gib_durchschnitt = function(liste) {
		var summe = 0;
		var anzahl = 0;
		for(var i = 0;i < liste.length; i++) {
			anzahl++;
			summe += liste[i] * 1;
		}
		return summe / anzahl;
	};
}
