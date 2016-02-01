(ns bpeter.vann.core
  (:require [bpeter.vann.game :as g]
            [bpeter.vann.system :as sys]))

(defn parseJSON [x]
  (js->clj (.parse (.-JSON js/window) x)))

(def websocket* (atom nil))
(def clientdata (atom { :table nil :player-name nil :pass nil}))

(defn- sendm [m]
  (.send @websocket* m))

(defn connect [url]
  (let [connection (reset! websocket* (js/WebSocket. url))]
    connection))

(defn response-ok? [response]
  (= response "o"))

(defn sign-up-message [clientdata]
  (str "p" (:table clientdata) "\n" (:player-name clientdata) "\n" (:pass clientdata)))

(defn sign-up [clientdata]
  (sys/log "signing up")
  (sendm (sign-up-message clientdata)))

(defn handle-action [data]
  (let [command (subs data 0 1)
        state-string (subs data 1)
        state (parseJSON state-string)]
    (sendm (g/play state))))

(declare handle-data)

(defn handle-setup-response [data]
  (if (response-ok? data)
    (do
      (sys/log "signed up successfully")
      (reset! handle-data handle-action))
    (sys/log "negative sign-up response:" (subs data 1))))

(def handle-data (atom handle-setup-response))

(defn mainloop []
  (doall
    (map #(aset @websocket* (first %) (second %))
         [["onopen" (fn [] 
                      (sys/log "socket open")
                      (sign-up @clientdata)
                      )]
          ["onclose" (fn [] (sys/log "socket closed"))]
          ["onerror" (fn [e] (sys/log (str "socket error" e)))]
          ["onmessage" (fn [m]
                           (@handle-data (.-data m))
                           )]]))
   (.addEventListener js/window "unload" 
             (fn []
               (.close @websocket*)
               (reset! @websocket* nil)))
  (sys/log "websocket initialized"))

(defn ^:export main [url table player-name pass] 
  (sys/log "starting to play:" (str url " " table " " player-name " " pass))
  (reset! clientdata {:table table :player-name player-name :pass pass})
  (connect url)
  (mainloop))

