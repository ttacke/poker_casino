// Compiled by ClojureScript 1.7.228 {:static-fns true, :optimize-constants true}
goog.provide('bpeter.vann.system');
goog.require('cljs.core');
bpeter.vann.system.PREFIX = "Vann:";
bpeter.vann.system.log = (function bpeter$vann$system$log(var_args){
var args__7207__auto__ = [];
var len__7200__auto___11827 = arguments.length;
var i__7201__auto___11828 = (0);
while(true){
if((i__7201__auto___11828 < len__7200__auto___11827)){
args__7207__auto__.push((arguments[i__7201__auto___11828]));

var G__11829 = (i__7201__auto___11828 + (1));
i__7201__auto___11828 = G__11829;
continue;
} else {
}
break;
}

var argseq__7208__auto__ = ((((0) < args__7207__auto__.length))?(new cljs.core.IndexedSeq(args__7207__auto__.slice((0)),(0))):null);
return bpeter.vann.system.log.cljs$core$IFn$_invoke$arity$variadic(argseq__7208__auto__);
});

bpeter.vann.system.log.cljs$core$IFn$_invoke$arity$variadic = (function (args){
return console.log.apply(console,cljs.core.clj__GT_js(cljs.core.cons(bpeter.vann.system.PREFIX,args)));
});

bpeter.vann.system.log.cljs$lang$maxFixedArity = (0);

bpeter.vann.system.log.cljs$lang$applyTo = (function (seq11826){
return bpeter.vann.system.log.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq11826));
});
bpeter.vann.system.import_from_system_datastructure = (function bpeter$vann$system$import_from_system_datastructure(input_state){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(input_state);
});
bpeter.vann.system.parse_int = (function bpeter$vann$system$parse_int(string){
var number = parseInt(string);
if(cljs.core.truth_(isNaN(number))){
return null;
} else {
return number;
}
});
