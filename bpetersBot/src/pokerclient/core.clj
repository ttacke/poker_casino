(ns pokerclient.core
  (:require
    [aleph.http :as http]
    [manifold.deferred :as d]
    [manifold.stream :as s]
    [clojure.data.json :as json]
    [pokerclient.game :as g])
  (:gen-class))


(defn connect [url]
  (let [connection @(http/websocket-client url)]
    (println "started connection" connection)
    connection))

(defn stop [connection]
  (println "stopping - closing connection")
  (s/close! connection)
  (println "closed")
  connection)

(defn response-ok? [response]
  (= response "o"))

(defn sign-up-message [table player-name pass]
  (str "p" table "\n" player-name "\n" pass))

(defn sign-up [connection table player-name pass]
  (println "signing up")
  (s/put! connection (sign-up-message table player-name pass)))

(def print-exception-fn
  (fn [ex]
    (println "ERROR: " ex)
    nil))

(defn action [data]
  (let [command (subs data 0 1)
        state-string (subs data 1)
        state (json/read-str state-string)]
    (g/play state)))

(defn mainloop [connection]
  (d/loop []
    (->
      (d/let-flow [msg (s/take! connection)]
        (if msg
          (d/let-flow [response (d/future (action msg))
                       result (s/put! connection response)]
            (when result
              (d/recur)))
          (if (s/closed? connection)
            (println "connection closed, exiting mainloop")
            (do
              (println "msg empty, sleeping")
              (Thread/sleep 200)
              (d/recur)))))
      (d/catch print-exception-fn))))

(defn enter-mainloop-if-response-is-ok [connection]
  (println "entering mainloop")
  (if (response-ok? @(s/take! connection))
    @(mainloop connection)
    (println "response negative, could not register with server")))

(defn defconvar [connection]
  (def con connection)
  connection)

(defn play [url table player-name pass]
  (println "starting")
  (doto (connect url)
    defconvar
    (sign-up table player-name pass)
    enter-mainloop-if-response-is-ok
    stop))

(defn replstart [& args]
  (println "replstart")
  (future
    (play
      "ws://10.7.0.34:8080"
      "f546402fX020dXd55fXbb75Xda327935a146"
      "Ben"
      "TR8T0R")
    (println "replstop")))

#_(replstart)
#_(prn con)
#_(s/close! con)

(defn -main [url table player-name pass & args]
  (play url table player-name pass))

