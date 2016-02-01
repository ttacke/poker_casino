(ns bpeter.vann.system)

(def PREFIX "Vann:")

#?(:clj
    (defn log [& args] (apply println PREFIX args))
    :cljs
    (defn log [& args]
      (.apply js/console.log js/console (clj->js (cons PREFIX args)))))

; Nötig für Javascript um von Javascript Objekten auf
; Clojure Objekte umzuwandeln
(defn import-from-system-datastructure [input-state]
  #?(:clj
      input-state
      :cljs
      (js->clj input-state)))

(defn parse-int [string]
  #?(:clj
      (try
        (Integer/parseInt string)
        (catch NumberFormatException e
          nil))
      :cljs
      (let [number (js/parseInt string)]
        (if (js/isNaN number)
          nil
          number))))

