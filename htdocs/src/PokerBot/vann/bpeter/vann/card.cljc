(ns bpeter.vann.card
  (:require [bpeter.vann.system :as s]))

(def spades   \u2660)
(def hearts   \u2665)
(def diamonds \u2666)
(def clubs    \u2663)

(defn parse-suit [string]
  (case (first (reverse string))
    \u2660 :spades
    \u2665 :hearts
    \u2666 :diamonds
    \u2663 :clubs))


(defn ofspades   [rank] (str rank spades))
(defn ofhearts   [rank] (str rank hearts))
(defn ofdiamonds [rank] (str rank diamonds))
(defn ofclubs    [rank] (str rank clubs))

(defn rank-symbol-to-number [rank-symbol-str]
  (case rank-symbol-str
    "J" 11
    "Q" 12
    "K" 13
    "A" 14))

(defn parse-rank [string]
  (let [rank-str (apply str (butlast string))
        num (s/parse-int rank-str)]
    (if (nil? num)
      (rank-symbol-to-number rank-str)
      num)))

(defn parse-card-string [string]
  {
   :rank (parse-rank string)
   :suit (parse-suit string)
   })

