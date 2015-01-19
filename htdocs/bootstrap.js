var websocket = null;
var startTime = new Date().getTime();

window.addEventListener("load", init, false);

// VOID
function init() {
	document.getElementsByTagName('body')[0].innerHTML = '<textarea style="width:100%;height: 140px"></textarea>';
	
	websocket = new WebSocket("ws://localhost:8080/");
	websocket.onopen = function(evt) {
		log('VERBUNDEN');
		_verbindungErfolgreich(evt);
	};
	websocket.onmessage = function(evt) {
		log('EMPFANGE: ' + evt.data);
		_empfangeNachricht(evt);
	};
	websocket.onerror = function(evt) { log('FEHLER: ' + evt.data) };
	websocket.onclose = function(evt) { log('ENDE') };
}
// VOID
function _verbindungErfolgreich(evt) {
	//DoNothing
}
// VOID
function _empfangeNachricht(evt) {
	// DoNothing
	//websocket.close();
}
// VOID
function _versendeNachricht(msg) {
	log('SENDE ' + msg);
	websocket.send(msg);
}
// VOID
function log(message) {
	var time = new Date().getTime() - startTime;
	var pre = document.getElementsByTagName("textarea");
	pre[0].innerHTML = time + ': ' + message + "\n" + pre[0].innerHTML;
}
