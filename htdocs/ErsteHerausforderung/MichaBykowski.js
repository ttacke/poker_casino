<!DOCTYPE html>
<!-- saved from url=(0062)http://10.1.6.150/casino/ErsteHerausforderung/bot_vorlage.html -->
<html data-ember-extension="1"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>Vorlage eines Poker-Bots</title>
		<meta charset="utf-8">
		<script type="text/javascript" src="./spielstatistik.js"></script>
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.js"></script>
		<script type="text/javascript">
			var casinoUrl = 'ws:10.1.6.150:8080';
			var tischName = 'DieErsteHerausforderung-20151215';

			var spielerName = 'mbykovski';// bitte anpassen, aber Sonderzeichen besser vermeiden
			var spielerPasswort = 'testtest123';// bitte anpassen, aber Sonderzeichen besser vermeiden

			var ws = new WebSocket(casinoUrl);
			ws.onopen = function(event) {
				ws.onmessage = function(event) {
					if(event.data != 'o') {
						document.body.innerHTML = 'Betreten fehlgeschlagen';
						throw new Error('Betreten fehlgeschlagen');
					}
					ws.onmessage = function(event) {
						var frage = JSON.parse(event.data.substr(1, event.data.length));
						spielstatistik_log(frage);// Dient der Anzeige der Spielergebnisse

						if(frage.Rundenname == 'showdown') {//preflop, flop, turncard, river, showdown
							//ws.send('r' + 'ok');
							//return;
						}

						var best_counter = 0;
						alleKarten = []

						if ('Hand' in frage) {
							frage.Hand.forEach(function(value) {
								alleKarten.push(value);
							});
						}
						frage.Tisch.forEach(function(value) {
							alleKarten.push(value);
						});

						for (i = 0; i < alleKarten.length; i++) {
							for (j = i+1; j < alleKarten.length; j++) {
								if (getvalueofcard(alleKarten[i]) == getvalueofcard(alleKarten[j])) {
									best_counter += 1;
								}
							}
						}

						if (best_counter > 0) {
							//raise, check, fold
							ws.send('r' + 'raise');
						} else {
							ws.send('r' + 'check');
						}

						function getvalueofcard(card) {
							if (card.length == 2) {
								return card[0];
							}
							if (card.length == 3) {
								return card[0] + card[1];
							}
						}
					}
				};
				ws.send('p' + tischName + "\n" + spielerName + "\n" + spielerPasswort);
			};
		</script>
	</head>
	<body><h1>Spielstatistik</h1><small style="color:#999">Tue Dec 15 2015 10:23:54 GMT+0100 (CET)</small><dl></dl>
	<div id="debug"></div></body></html>