(ns lt.plugins.subpar
  (:require [lt.plugins.subpar.paredit :refer [parse
                                               in-string  ; takes string
                                               in-string? ; takes parse output
                                               forward-delete-action
                                               backward-delete-action
                                               double-quote-action
                                               close-expression-vals
                                               forward-fn
                                               forward-up-fn
                                               forward-down-fn
                                               forward-slurp-vals
                                               forward-barf-vals
                                               backward-fn
                                               backward-up-fn
                                               backward-down-fn
                                               backward-slurp-vals
                                               backward-barf-vals
                                               splice-vals
                                               splice-delete-forward-vals
                                               splice-delete-backward-vals]]
            [lt.objs.editor.pool :as pool]
            [lt.objs.editor :as editor]
            [lt.objs.command :as cmd]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; what belongs in this namespace: anything related to controlling
;; codemirror or getting info from codemirror.
;;
;; what does not belong in this namespace: anything related to
;; defining key bindings -- those belong in subpar.js. anything
;; related to determining the indices for performing paredit-like
;; operations -- those belong in subpar.paredit.
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn get-index [cm]
  (.indexFromPos cm (.getCursor cm)))

(defn go-to-index
  "moves the point from i to j as long as they're different"
  [cm i j]
  (if (not= i j)
    (.setCursor cm (.posFromIndex cm j))))

(defn nothing-selected? [cm] (= "" (.getSelection cm)))

(defn get-info [cm]
  [(.getCursor  cm)
   (get-index   cm)
   (.getValue   cm)])

(defn ^:export open-expression [cm pair]
  (let [[cur i s] (get-info cm)]
    (if (in-string s i)
      (do (.replaceRange cm (nth pair 0) cur)
          (.setCursor cm (.-line cur) (inc (.-ch cur))))
      (.operation cm
                       (fn []
                         (.replaceRange cm pair cur)
                         (.setCursor cm (.-line cur) (inc (.-ch cur)))
                         (.indentLine cm (.-line cur)))))))

(defn ^:export forward-delete [cm]
  (if (nothing-selected? cm)
    (let [[cur i s] (get-info cm)
          act (forward-delete-action s i)
          s1  (.posFromIndex cm i)
          e1  (.posFromIndex cm (inc i))
          s2  (.posFromIndex cm (dec i))
          e2  e1
          s3  s1
          e3  (.posFromIndex cm (+ i 2))]
      (condp = act
        1 (.replaceRange cm "" s1 e1)
        2 (.replaceRange cm "" s2 e2)
        3 (.replaceRange cm "" s3 e3)
        4 (.setCursor cm e1)))
    (.replaceSelection cm "")))

(defn ^:export backward-delete [cm]
  (if (nothing-selected? cm)
    (let [[cur i s] (get-info cm)
          act (backward-delete-action s i)
          s1  (.posFromIndex cm (dec i))
          e1  (.posFromIndex cm i)
          s2  s1
          e2  (.posFromIndex cm (inc i))
          s3  (.posFromIndex cm (- i 2))
          e3  e1]
      (condp = act
        1 (.replaceRange cm "" s1 e1)
        2 (.replaceRange cm "" s2 e2)
        3 (.replaceRange cm "" s3 e3)
        4 (.setCursor cm s1)))
    (.replaceSelection cm "")))

(defn ^:export double-quote [cm]
  (let [[cur i s] (get-info cm)
        act (double-quote-action s i)]
    (condp = act
      0 (open-expression cm "\"\"")
      1 (.replaceRange cm "\\\"" cur)
      2 (go-to-index cm i (inc i))
      3 (.replaceRange cm "\"" cur))))

(defn ^:export close-expression [cm c]
  (let [[cur i s] (get-info cm)
        p (parse s)]
    (if (in-string? p i)
      (do (.replaceRange cm c cur)
          (.setCursor cm (.-line cur) (inc (.-ch cur))))
      (let [[del beg end dst] (close-expression-vals p i)]
        (if dst
          (do (if del (.replaceRange cm "" (.posFromIndex cm beg) (.posFromIndex cm end)))
              (go-to-index cm i dst)))))))

(defn go [cm f]
  (let [[cur i s] (get-info cm)
        j (f s i)]
    (go-to-index cm i j)))

(defn ^:export backward-up   [cm] (go cm backward-up-fn))
(defn ^:export forward-down  [cm] (go cm forward-down-fn))
(defn ^:export backward      [cm] (go cm backward-fn))
(defn ^:export forward       [cm] (go cm forward-fn))
(defn ^:export backward-down [cm] (go cm backward-down-fn))
(defn ^:export forward-up    [cm] (go cm forward-up-fn))

(defn ^:export forward-slurp [cm]
  (let [[cur i s] (get-info cm)
        [delimiter si di ri] (forward-slurp-vals s i)]
    (if ri
      (let [start (.posFromIndex cm si)
            end (.posFromIndex cm (inc si))
            destination (.posFromIndex cm di)
            line (.-line start)
            update (fn []
                     (.replaceRange cm delimiter destination)
                     (.replaceRange cm "" start end)
                     (map #(.indentLine cm %) (range line (+ line ri))))]
        (.operation cm update)))))

(defn ^:export backward-slurp [cm]
  (let [[cur i s] (get-info cm)
        [delimiter si di ri] (backward-slurp-vals s i)]
    (if ri
      (let [start (.posFromIndex cm si)
            end (.posFromIndex cm (inc si))
            destination (.posFromIndex cm di)
            line (.-line start)
            update (fn []
                     (.replaceRange cm "" start end)
                     (.replaceRange cm delimiter destination)
                     (map #(.indentLine cm %) (range line (+ line ri))))]
        (.operation cm update)))))

(defn ^:export backward-barf [cm]
  (let [[cur i s] (get-info cm)
        [delimiter si di pad ri] (backward-barf-vals s i)]
    (if ri
      (let [delimiter (if pad (str " " delimiter) delimiter)
            destination (.posFromIndex cm di)
            start (.posFromIndex cm si)
            end (.posFromIndex cm (inc si))
            line (.-line start)
            update (fn []
                     (.replaceRange cm delimiter destination)
                     (.replaceRange cm "" start end)
                     (map #(.indentLine cm %) (range line (+ line ri))))]
        (.operation cm update)))))

(defn ^:export forward-barf [cm]
  (let [[cur i s] (get-info cm)
        [delimiter si di pad ri i0] (forward-barf-vals s i)]
    (if ri
      (let [delimiter (if pad (str " " delimiter) delimiter)
            destination (.posFromIndex cm di)
            start (.posFromIndex cm si)
            end (.posFromIndex cm (inc si))
            line (.-line (.posFromIndex cm i0))
            update (fn []
                     (.replaceRange cm "" start end)
                     (.replaceRange cm delimiter destination)
                     (map #(.indentLine cm %) (range line (+ line ri))))]
        (.operation cm update)))))

(defn ^:export splice-delete-backward [cm]
  (let [[cur i s] (get-info cm)
        [start end closer reindent num] (splice-delete-backward-vals s i)]
    (if reindent
      (let [line (.-line (.posFromIndex cm reindent))
            c0 (.posFromIndex cm closer)
            c1 (.posFromIndex cm (inc closer))
            s0 (.posFromIndex cm start)
            s1 (.posFromIndex cm end)
            update (fn []
                     (.replaceRange cm "" c0 c1)
                     (.replaceRange cm "" s0 s1)
                     (map #(.indentLine cm %) (range line (+ line num))))]
        (.operation cm update)))))

;; todo: cut to clipboard instead of delete, for all splice fns
(defn ^:export splice-delete-forward [cm]
  (let [[cur i s] (get-info cm)
        [opener start end reindent num] (splice-delete-forward-vals s i)]
    (if reindent
      (let [line (.-line (.posFromIndex cm reindent))
            o0 (.posFromIndex cm opener)
            o1 (.posFromIndex cm (inc opener))
            s0 (.posFromIndex cm start)
            s1 (.posFromIndex cm end)
            update (fn []
                     (.replaceRange cm "" s0 s1)
                     (.replaceRange cm "" o0 o1)
                     (map #(.indentLine cm %) (range line (+ line num))))]
        (.operation cm update)))))

(defn ^:export splice [cm]
  (let [[cur i s] (get-info cm)
        [opener closer reindent num] (splice-vals s i)]
    (if reindent
      (let [line (.-line (.posFromIndex cm reindent))
            o0 (.posFromIndex cm opener)
            o1 (.posFromIndex cm (inc opener))
            c0 (.posFromIndex cm closer)
            c1 (.posFromIndex cm (inc closer))
            update (fn []
                     (.replaceRange cm "" c0 c1)
                     (.replaceRange cm "" o0 o1)
                     (map #(.indentLine cm %) (range line (+ line num))))]
        (.operation cm update)))))

(defn ^:export indent-selection [cm]
  (if (.somethingSelected cm)
    (let [start (.-line (.getCursor cm true))
          end   (.-line (.getCursor cm false))
          f     (fn [] (map #(.indentLine cm %) (range start (inc end))))]
      (.operation cm f))
    (.indentLine cm (.-line (.getCursor cm)))))

;; Movement
(cmd/command {:command :subpar.move.forward
              :desc "Subpar: Move forward"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (forward ed)))})

(cmd/command {:command :subpar.move.backward
              :desc "Subpar: Move backward"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (backward ed)))})

(cmd/command {:command :subpar.move.forward-up
              :desc "Subpar: Move forward up"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (forward-up ed)))})

(cmd/command {:command :subpar.move.forward-down
              :desc "Subpar: Move forward down"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (forward-down ed)))})

(cmd/command {:command :subpar.move.backward-up
              :desc "Subpar: Move backward up"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (backward-up ed)))})

(cmd/command {:command :subpar.move.backward-down
              :desc "Subpar: Move backward down"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (backward-down ed)))})

;; Grow and Shrink
(cmd/command {:command :subpar.grow.right
              :desc "Subpar: Grow right"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (forward-slurp ed)))})

(cmd/command {:command :subpar.grow.left
              :desc "Subpar: Grow left"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (backward-slurp ed)))})


(cmd/command {:command :subpar.shrink.right
              :desc "Subpar: Shrink right"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (forward-barf ed)))})

(cmd/command {:command :subpar.shrink.left
              :desc "Subpar: Shrink left"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (backward-barf ed)))})

;; Insert pairs
(cmd/command {:command :subpar.open-pair
              :desc "Subpar: Open a pair of (, { or ["
              :exec (fn [pair]
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (open-expression ed pair)))})

(cmd/command {:command :subpar.close-pair
              :desc "Subpar: Close a pair of (, { or ["
              :exec (fn [delim]
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (close-expression ed delim)))})

(cmd/command {:command :subpar.insert-double-quote
              :desc "Subpar: insert \"\""
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (double-quote ed)))})

;; Delete forwards and backwards
(cmd/command {:command :subpar.delete.left
              :desc "Subpar: context sensitive backspace"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (backward-delete ed)))})

(cmd/command {:command :subpar.delete.right
              :desc "Subpar: context sensitive delete"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (forward-delete ed)))})

;; Splice
(cmd/command {:command :subpar.splice
              :desc "Subpar: splice a list into elements"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (splice ed)))})

(cmd/command {:command :subpar.splice.delete-backward
              :desc "Subpar: splice a list deleting elements behind cursor"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (splice-delete-backward ed)))})

(cmd/command {:command :subpar.splice.delete-forward
              :desc "Subpar: splice a list deleting elements after cursor"
              :exec (fn []
                      (when-let [ed (editor/->cm-ed (pool/last-active))]
                        (splice-delete-forward ed)))})
