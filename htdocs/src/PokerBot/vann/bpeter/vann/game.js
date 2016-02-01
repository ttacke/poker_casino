// Compiled by ClojureScript 1.7.228 {:static-fns true, :optimize-constants true}
goog.provide('bpeter.vann.game');
goog.require('cljs.core');
goog.require('bpeter.vann.card');
goog.require('bpeter.vann.system');
bpeter.vann.game.count_QMARK_ = (function bpeter$vann$game$count_QMARK_(n){
return (function (col){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(n,cljs.core.count(col));
});
});
bpeter.vann.game.in_QMARK_ = (function bpeter$vann$game$in_QMARK_(col,elm){
return cljs.core.some((function (p1__11840_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(elm,p1__11840_SHARP_);
}),col);
});
bpeter.vann.game.group_hand_by_rank = (function bpeter$vann$game$group_hand_by_rank(hand){
return cljs.core.vals(cljs.core.group_by(cljs.core.cst$kw$rank,hand));
});
bpeter.vann.game.pair_QMARK_ = (function bpeter$vann$game$pair_QMARK_(hand){
return cljs.core.some(bpeter.vann.game.count_QMARK_((2)),bpeter.vann.game.group_hand_by_rank(hand));
});
bpeter.vann.game.at_least_same_ranks_QMARK_ = (function bpeter$vann$game$at_least_same_ranks_QMARK_(hand,n){
return cljs.core.some((function (p1__11841_SHARP_){
return (cljs.core.count(p1__11841_SHARP_) >= n);
}),bpeter.vann.game.group_hand_by_rank(hand));
});
bpeter.vann.game.count_same_rank = (function bpeter$vann$game$count_same_rank(hand){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.max,(0),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.count,bpeter.vann.game.group_hand_by_rank(hand)));
});
bpeter.vann.game.hand = (function bpeter$vann$game$hand(state){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(bpeter.vann.card.parse_card_string,cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,"Hand"));
});
bpeter.vann.game.table = (function bpeter$vann$game$table(state){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(bpeter.vann.card.parse_card_string,cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,"Tisch"));
});
bpeter.vann.game.combined = (function bpeter$vann$game$combined(state){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(bpeter.vann.game.hand(state),bpeter.vann.game.table(state));
});
bpeter.vann.game.rank_sum = (function bpeter$vann$game$rank_sum(hand){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$2(cljs.core._PLUS_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$rank,hand));
});
bpeter.vann.game.every_rank_QMARK_ = (function bpeter$vann$game$every_rank_QMARK_(var_args){
var args__7207__auto__ = [];
var len__7200__auto___11846 = arguments.length;
var i__7201__auto___11847 = (0);
while(true){
if((i__7201__auto___11847 < len__7200__auto___11846)){
args__7207__auto__.push((arguments[i__7201__auto___11847]));

var G__11848 = (i__7201__auto___11847 + (1));
i__7201__auto___11847 = G__11848;
continue;
} else {
}
break;
}

var argseq__7208__auto__ = ((((2) < args__7207__auto__.length))?(new cljs.core.IndexedSeq(args__7207__auto__.slice((2)),(0))):null);
return bpeter.vann.game.every_rank_QMARK_.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__7208__auto__);
});

bpeter.vann.game.every_rank_QMARK_.cljs$core$IFn$_invoke$arity$variadic = (function (hand,pred,pred_args){
return cljs.core.every_QMARK_((function (p1__11842_SHARP_){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(pred,p1__11842_SHARP_,pred_args);
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$rank,hand));
});

bpeter.vann.game.every_rank_QMARK_.cljs$lang$maxFixedArity = (2);

bpeter.vann.game.every_rank_QMARK_.cljs$lang$applyTo = (function (seq11843){
var G__11844 = cljs.core.first(seq11843);
var seq11843__$1 = cljs.core.next(seq11843);
var G__11845 = cljs.core.first(seq11843__$1);
var seq11843__$2 = cljs.core.next(seq11843__$1);
return bpeter.vann.game.every_rank_QMARK_.cljs$core$IFn$_invoke$arity$variadic(G__11844,G__11845,seq11843__$2);
});
bpeter.vann.game.flush_QMARK_ = (function bpeter$vann$game$flush_QMARK_(combined){
return cljs.core.some((function (p1__11849_SHARP_){
return (cljs.core.count(p1__11849_SHARP_) >= (5));
}),cljs.core.vals(cljs.core.group_by(cljs.core.cst$kw$suit,combined)));
});
bpeter.vann.game.continous_sequences = (function bpeter$vann$game$continous_sequences(col){
var col__$1 = col;
var cur = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(col__$1)], null);
var all = cljs.core.PersistentVector.EMPTY;
while(true){
if((cljs.core.count(col__$1) > (1))){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((cljs.core.first(col__$1) + (1)),cljs.core.second(col__$1))){
var G__11850 = cljs.core.rest(col__$1);
var G__11851 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cur,cljs.core.second(col__$1));
var G__11852 = all;
col__$1 = G__11850;
cur = G__11851;
all = G__11852;
continue;
} else {
var G__11853 = cljs.core.rest(col__$1);
var G__11854 = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.second(col__$1)], null);
var G__11855 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(all,cur);
col__$1 = G__11853;
cur = G__11854;
all = G__11855;
continue;
}
} else {
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(all,cur);
}
break;
}
});
bpeter.vann.game.max_coll_length = (function bpeter$vann$game$max_coll_length(col_of_cols){
return cljs.core.last(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.count,col_of_cols)));
});
bpeter.vann.game.add_ace_as_one = (function bpeter$vann$game$add_ace_as_one(ranklist){
if(cljs.core.truth_(bpeter.vann.game.in_QMARK_(ranklist,(14)))){
return cljs.core.cons((1),ranklist);
} else {
return ranklist;
}
});
bpeter.vann.game.straight_QMARK_ = (function bpeter$vann$game$straight_QMARK_(combined){
return ((5) <= bpeter.vann.game.max_coll_length(bpeter.vann.game.continous_sequences(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(bpeter.vann.game.add_ace_as_one(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.cst$kw$rank,combined))))));
});
bpeter.vann.game.round = (function bpeter$vann$game$round(state){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(state,"Rundenname");
});
bpeter.vann.game.determine_fold_threshold = (function bpeter$vann$game$determine_fold_threshold(state){
var pred__11859 = cljs.core._EQ_;
var expr__11860 = bpeter.vann.game.round(state);
if(cljs.core.truth_((pred__11859.cljs$core$IFn$_invoke$arity$2 ? pred__11859.cljs$core$IFn$_invoke$arity$2("preflop",expr__11860) : pred__11859.call(null,"preflop",expr__11860)))){
return (7);
} else {
if(cljs.core.truth_((pred__11859.cljs$core$IFn$_invoke$arity$2 ? pred__11859.cljs$core$IFn$_invoke$arity$2("flop",expr__11860) : pred__11859.call(null,"flop",expr__11860)))){
return (13);
} else {
if(cljs.core.truth_((pred__11859.cljs$core$IFn$_invoke$arity$2 ? pred__11859.cljs$core$IFn$_invoke$arity$2("turncard",expr__11860) : pred__11859.call(null,"turncard",expr__11860)))){
return (15);
} else {
if(cljs.core.truth_((pred__11859.cljs$core$IFn$_invoke$arity$2 ? pred__11859.cljs$core$IFn$_invoke$arity$2("river",expr__11860) : pred__11859.call(null,"river",expr__11860)))){
return (16);
} else {
if(cljs.core.truth_((pred__11859.cljs$core$IFn$_invoke$arity$2 ? pred__11859.cljs$core$IFn$_invoke$arity$2("showdown",expr__11860) : pred__11859.call(null,"showdown",expr__11860)))){
return (17);
} else {
throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__11860)].join('')));
}
}
}
}
}
});
bpeter.vann.game.play = (function bpeter$vann$game$play(input_state){
var state = bpeter.vann.system.import_from_system_datastructure(input_state);
var hand = bpeter.vann.game.hand(state);
var combined_hand = bpeter.vann.game.combined(state);
var table = bpeter.vann.game.table(state);
var action = bpeter.vann.game.round(state);
var rank_sum_fold_threshold = bpeter.vann.game.determine_fold_threshold(state);
var same_rank_hand = bpeter.vann.game.count_same_rank(hand);
var same_rank_table = bpeter.vann.game.count_same_rank(table);
var same_rank_combined = bpeter.vann.game.count_same_rank(combined_hand);
if(cljs.core.truth_(bpeter.vann.game.pair_QMARK_(hand))){
return "rraise";
} else {
if(((same_rank_combined >= (2))) && ((same_rank_combined > same_rank_table))){
return "rraise";
} else {
if(cljs.core.truth_(bpeter.vann.game.flush_QMARK_(bpeter.vann.game.combined(state)))){
return "rraise";
} else {
if(cljs.core.truth_(bpeter.vann.game.straight_QMARK_(combined_hand))){
return "rraise";
} else {
if(cljs.core.truth_(bpeter.vann.game.every_rank_QMARK_.cljs$core$IFn$_invoke$arity$variadic(hand,cljs.core._GT__EQ_,cljs.core.array_seq([(13)], 0)))){
return "rraise";
} else {
if(cljs.core.truth_(bpeter.vann.game.every_rank_QMARK_.cljs$core$IFn$_invoke$arity$variadic(hand,cljs.core._LT_,cljs.core.array_seq([(6)], 0)))){
return "rfold";
} else {
if((bpeter.vann.game.rank_sum(hand) < rank_sum_fold_threshold)){
return "rfold";
} else {
return "rcheck";

}
}
}
}
}
}
}
});
goog.exportSymbol('bpeter.vann.game.play', bpeter.vann.game.play);
