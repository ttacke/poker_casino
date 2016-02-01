// Compiled by ClojureScript 1.7.228 {:static-fns true, :optimize-constants true}
goog.provide('bpeter.vann.card');
goog.require('cljs.core');
goog.require('bpeter.vann.system');
bpeter.vann.card.spades = "\u2660";
bpeter.vann.card.hearts = "\u2665";
bpeter.vann.card.diamonds = "\u2666";
bpeter.vann.card.clubs = "\u2663";
bpeter.vann.card.parse_suit = (function bpeter$vann$card$parse_suit(string){
var G__11833 = cljs.core.first(cljs.core.reverse(string));
switch (G__11833) {
case "\u2660":
return cljs.core.cst$kw$spades;

break;
case "\u2665":
return cljs.core.cst$kw$hearts;

break;
case "\u2666":
return cljs.core.cst$kw$diamonds;

break;
case "\u2663":
return cljs.core.cst$kw$clubs;

break;
default:
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(cljs.core.first(cljs.core.reverse(string)))].join('')));

}
});
bpeter.vann.card.ofspades = (function bpeter$vann$card$ofspades(rank){
return [cljs.core.str(rank),cljs.core.str(bpeter.vann.card.spades)].join('');
});
bpeter.vann.card.ofhearts = (function bpeter$vann$card$ofhearts(rank){
return [cljs.core.str(rank),cljs.core.str(bpeter.vann.card.hearts)].join('');
});
bpeter.vann.card.ofdiamonds = (function bpeter$vann$card$ofdiamonds(rank){
return [cljs.core.str(rank),cljs.core.str(bpeter.vann.card.diamonds)].join('');
});
bpeter.vann.card.ofclubs = (function bpeter$vann$card$ofclubs(rank){
return [cljs.core.str(rank),cljs.core.str(bpeter.vann.card.clubs)].join('');
});
bpeter.vann.card.rank_symbol_to_number = (function bpeter$vann$card$rank_symbol_to_number(rank_symbol_str){
var G__11836 = rank_symbol_str;
switch (G__11836) {
case "J":
return (11);

break;
case "Q":
return (12);

break;
case "K":
return (13);

break;
case "A":
return (14);

break;
default:
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(rank_symbol_str)].join('')));

}
});
bpeter.vann.card.parse_rank = (function bpeter$vann$card$parse_rank(string){
var rank_str = cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.butlast(string));
var num = bpeter.vann.system.parse_int(rank_str);
if((num == null)){
return bpeter.vann.card.rank_symbol_to_number(rank_str);
} else {
return num;
}
});
bpeter.vann.card.parse_card_string = (function bpeter$vann$card$parse_card_string(string){
return new cljs.core.PersistentArrayMap(null, 2, [cljs.core.cst$kw$rank,bpeter.vann.card.parse_rank(string),cljs.core.cst$kw$suit,bpeter.vann.card.parse_suit(string)], null);
});
