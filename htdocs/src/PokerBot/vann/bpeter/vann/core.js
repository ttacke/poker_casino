// Compiled by ClojureScript 1.7.228 {:static-fns true, :optimize-constants true}
goog.provide('bpeter.vann.core');
goog.require('cljs.core');
goog.require('bpeter.vann.game');
goog.require('bpeter.vann.system');
bpeter.vann.core.parseJSON = (function bpeter$vann$core$parseJSON(x){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(window.JSON.parse(x));
});
bpeter.vann.core.websocket_STAR_ = (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null) : cljs.core.atom.call(null,null));
bpeter.vann.core.clientdata = (function (){var G__11864 = new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$table,null,cljs.core.cst$kw$player_DASH_name,null,cljs.core.cst$kw$pass,null], null);
return (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(G__11864) : cljs.core.atom.call(null,G__11864));
})();
bpeter.vann.core.sendm = (function bpeter$vann$core$sendm(m){
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(bpeter.vann.core.websocket_STAR_) : cljs.core.deref.call(null,bpeter.vann.core.websocket_STAR_)).send(m);
});
bpeter.vann.core.connect = (function bpeter$vann$core$connect(url){
var connection = (function (){var G__11867 = bpeter.vann.core.websocket_STAR_;
var G__11868 = (new WebSocket(url));
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__11867,G__11868) : cljs.core.reset_BANG_.call(null,G__11867,G__11868));
})();
return connection;
});
bpeter.vann.core.response_ok_QMARK_ = (function bpeter$vann$core$response_ok_QMARK_(response){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(response,"o");
});
bpeter.vann.core.sign_up_message = (function bpeter$vann$core$sign_up_message(clientdata){
return [cljs.core.str("p"),cljs.core.str(cljs.core.cst$kw$table.cljs$core$IFn$_invoke$arity$1(clientdata)),cljs.core.str("\n"),cljs.core.str(cljs.core.cst$kw$player_DASH_name.cljs$core$IFn$_invoke$arity$1(clientdata)),cljs.core.str("\n"),cljs.core.str(cljs.core.cst$kw$pass.cljs$core$IFn$_invoke$arity$1(clientdata))].join('');
});
bpeter.vann.core.sign_up = (function bpeter$vann$core$sign_up(clientdata){
bpeter.vann.system.log.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["signing up"], 0));

return bpeter.vann.core.sendm(bpeter.vann.core.sign_up_message(clientdata));
});
bpeter.vann.core.handle_action = (function bpeter$vann$core$handle_action(data){
var command = cljs.core.subs.cljs$core$IFn$_invoke$arity$3(data,(0),(1));
var state_string = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(data,(1));
var state = bpeter.vann.core.parseJSON(state_string);
return bpeter.vann.core.sendm(bpeter.vann.game.play(state));
});
bpeter.vann.core.handle_setup_response = (function bpeter$vann$core$handle_setup_response(data){
if(cljs.core.truth_(bpeter.vann.core.response_ok_QMARK_(data))){
bpeter.vann.system.log.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["signed up successfully"], 0));

return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(bpeter.vann.core.handle_data,bpeter.vann.core.handle_action) : cljs.core.reset_BANG_.call(null,bpeter.vann.core.handle_data,bpeter.vann.core.handle_action));
} else {
return bpeter.vann.system.log.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["negative sign-up response:",cljs.core.subs.cljs$core$IFn$_invoke$arity$2(data,(1))], 0));
}
});
bpeter.vann.core.handle_data = (cljs.core.atom.cljs$core$IFn$_invoke$arity$1 ? cljs.core.atom.cljs$core$IFn$_invoke$arity$1(bpeter.vann.core.handle_setup_response) : cljs.core.atom.call(null,bpeter.vann.core.handle_setup_response));
bpeter.vann.core.mainloop = (function bpeter$vann$core$mainloop(){
cljs.core.doall.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__11869_SHARP_){
return ((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(bpeter.vann.core.websocket_STAR_) : cljs.core.deref.call(null,bpeter.vann.core.websocket_STAR_))[cljs.core.first(p1__11869_SHARP_)] = cljs.core.second(p1__11869_SHARP_));
}),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["onopen",(function (){
bpeter.vann.system.log.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["socket open"], 0));

return bpeter.vann.core.sign_up((cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(bpeter.vann.core.clientdata) : cljs.core.deref.call(null,bpeter.vann.core.clientdata)));
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["onclose",(function (){
return bpeter.vann.system.log.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["socket closed"], 0));
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["onerror",(function (e){
return bpeter.vann.system.log.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq([[cljs.core.str("socket error"),cljs.core.str(e)].join('')], 0));
})], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["onmessage",(function (m){
return (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(bpeter.vann.core.handle_data) : cljs.core.deref.call(null,bpeter.vann.core.handle_data)).call(null,m.data);
})], null)], null)));

window.addEventListener("unload",(function (){
(cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(bpeter.vann.core.websocket_STAR_) : cljs.core.deref.call(null,bpeter.vann.core.websocket_STAR_)).close();

var G__11872 = (cljs.core.deref.cljs$core$IFn$_invoke$arity$1 ? cljs.core.deref.cljs$core$IFn$_invoke$arity$1(bpeter.vann.core.websocket_STAR_) : cljs.core.deref.call(null,bpeter.vann.core.websocket_STAR_));
var G__11873 = null;
return (cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__11872,G__11873) : cljs.core.reset_BANG_.call(null,G__11872,G__11873));
}));

return bpeter.vann.system.log.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["websocket initialized"], 0));
});
bpeter.vann.core.main = (function bpeter$vann$core$main(url,table,player_name,pass){
bpeter.vann.system.log.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(["starting to play:",[cljs.core.str(url),cljs.core.str(" "),cljs.core.str(table),cljs.core.str(" "),cljs.core.str(player_name),cljs.core.str(" "),cljs.core.str(pass)].join('')], 0));

var G__11876_11878 = bpeter.vann.core.clientdata;
var G__11877_11879 = new cljs.core.PersistentArrayMap(null, 3, [cljs.core.cst$kw$table,table,cljs.core.cst$kw$player_DASH_name,player_name,cljs.core.cst$kw$pass,pass], null);
(cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2 ? cljs.core.reset_BANG_.cljs$core$IFn$_invoke$arity$2(G__11876_11878,G__11877_11879) : cljs.core.reset_BANG_.call(null,G__11876_11878,G__11877_11879));

bpeter.vann.core.connect(url);

return bpeter.vann.core.mainloop();
});
goog.exportSymbol('bpeter.vann.core.main', bpeter.vann.core.main);
