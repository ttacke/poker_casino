"use strict";

// CLASS DEFINITION
function PokerSpielStatistik() {
	this.$ramen = null;
	this.$template = null;
	this.daten = [];
	this.trendmenge = 1;
	this.init = function(trendmenge, $ramen, $template) {
		this.$ramen = $ramen;
		this.$template = $template;
		this.trendmenge = trendmenge;
	};
	// VOID
	this.logge = function(aufgezeichnetes_spiel) {
		if(!aufgezeichnetes_spiel || !aufgezeichnetes_spiel.length) return;
		
		var daten = aufgezeichnetes_spiel[aufgezeichnetes_spiel.length - 1];
		if(daten.frage.Rundenname != 'showdown') return;
		
		for(var i = 0;i < daten.frage.Spieler.length; i++) {
			if(!this.daten[daten.frage.Spieler[i].Name]) {
				this.daten[daten.frage.Spieler[i].Name] = [];
			}
			this.daten[daten.frage.Spieler[i].Name].push(daten.frage.Spieler[i].Stack);
		}
	};
	// VOID
	this.zeige = function() {
		var statistik = [];
		for(var name in this.daten) {
			var stack = this.daten[name][
				this.daten[name].length - 1
			];
			
			while(this.daten[name].length > this.trendmenge) {
				this.daten[name].shift();
			}
			
			var trend = this._gib_trend(this.daten[name], this.trendmenge);
			var datenmenge_fuer_kurztrend = Math.floor(this.trendmenge / 20);
			var kurz_trend = this._gib_trend(this.daten[name], datenmenge_fuer_kurztrend);
			
			statistik.push({
				name: name,
				trend: trend,
				kurz: kurz_trend
			});
		}
		statistik.sort(function(a, b){ return b.trend - a.trend });
		
		var template_liste = [];
		for(var i = 0; i < statistik.length; i++) {
			var t = '<tr>' + this.$template.html() + '</tr>';
			t = t.replace(/\[name\]/, statistik[i].name);
			t = t.replace(/\[trend\]/, statistik[i].trend);
			t = t.replace(/\[kurz\]/, statistik[i].kurz);
			template_liste.push(t);
		}
		this.$ramen.html(template_liste.join(''));
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
