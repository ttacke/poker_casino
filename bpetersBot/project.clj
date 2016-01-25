(defproject pokerclient "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0"]
                 [aleph "0.4.1-beta2"]
                 [org.clojure/data.json "0.2.6"]]
  :main pokerclient.core
  :aot [pokerclient.core]
  :jvm-opts ["-XX:+UseConcMarkSweepGC"])

;  :main "pokerclient.core")
;
;15-12-11 15:27:50: ➜  pokerclient  lein jar
;Warning: specified :main without including it in :aot. 
;Implicit AOT of :main will be removed in Leiningen 3.0.0. 
;If you only need AOT for your uberjar, consider adding :aot :all into your
;:uberjar profile instead.
;Compiling pokerclient.core
;java.lang.ClassCastException: java.lang.String cannot be cast to clojure.lang.Symbol
;        at clojure.core$find_ns.invoke(core.clj:3972)
;        at clojure.core$load_one.invoke(core.clj:5672)
;        at clojure.core$compile$fn__5453.invoke(core.clj:5877)
;        at clojure.core$compile.invoke(core.clj:5876)
;        at user$eval9$fn__16.invoke(form-init8933909265995747687.clj:1)
;        at user$eval9.invoke(form-init8933909265995747687.clj:1)
;        at clojure.lang.Compiler.eval(Compiler.java:6782)
;        at clojure.lang.Compiler.eval(Compiler.java:6772)
;        at clojure.lang.Compiler.load(Compiler.java:7227)
;        at clojure.lang.Compiler.loadFile(Compiler.java:7165)
;        at clojure.main$load_script.invoke(main.clj:275)
;        at clojure.main$init_opt.invoke(main.clj:280)
;        at clojure.main$initialize.invoke(main.clj:308)
;        at clojure.main$null_opt.invoke(main.clj:343)
;        at clojure.main$main.doInvoke(main.clj:421)
;        at clojure.lang.RestFn.invoke(RestFn.java:421)
;        at clojure.lang.Var.invoke(Var.java:383)
;        at clojure.lang.AFn.applyToHelper(AFn.java:156)
;        at clojure.lang.Var.applyTo(Var.java:700)
;        at clojure.main.main(main.java:37)
;Exception in thread "main" java.lang.ClassCastException: java.lang.String cannot be cast to clojure.lang.Symbol, compiling:(/tmp/form-init8933909265995747687.clj:1:73)
;        at clojure.lang.Compiler.load(Compiler.java:7239)
;        at clojure.lang.Compiler.loadFile(Compiler.java:7165)
;        at clojure.main$load_script.invoke(main.clj:275)
;        at clojure.main$init_opt.invoke(main.clj:280)
;        at clojure.main$initialize.invoke(main.clj:308)
;        at clojure.main$null_opt.invoke(main.clj:343)
;        at clojure.main$main.doInvoke(main.clj:421)
;        at clojure.lang.RestFn.invoke(RestFn.java:421)
;        at clojure.lang.Var.invoke(Var.java:383)
;        at clojure.lang.AFn.applyToHelper(AFn.java:156)
;        at clojure.lang.Var.applyTo(Var.java:700)
;        at clojure.main.main(main.java:37)
;Caused by: java.lang.ClassCastException: java.lang.String cannot be cast to clojure.lang.Symbol
;        at clojure.core$find_ns.invoke(core.clj:3972)
;        at clojure.core$load_one.invoke(core.clj:5672)
;        at clojure.core$compile$fn__5453.invoke(core.clj:5877)
;        at clojure.core$compile.invoke(core.clj:5876)
;        at user$eval9$fn__16.invoke(form-init8933909265995747687.clj:1)
;        at user$eval9.invoke(form-init8933909265995747687.clj:1)
;        at clojure.lang.Compiler.eval(Compiler.java:6782)
;        at clojure.lang.Compiler.eval(Compiler.java:6772)
;        at clojure.lang.Compiler.load(Compiler.java:7227)
;        ... 11 more
;Compilation failed: Subprocess failed
;
