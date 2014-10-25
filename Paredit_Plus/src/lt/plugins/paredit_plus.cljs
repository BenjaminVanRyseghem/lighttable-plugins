(ns lt.plugins.paredit-plus
  (:require [lt.object :as object]
            [lt.objs.editor :as editor]
            [lt.objs.editor.pool :as pool]
            [lt.objs.command :as cmd]
            [lt.objs.notifos :as notifos]
            [lt.util.cljs :refer [str-contains?]]))

(defn whitespace? [s]
  (contains? #{" " "\t" "\r" "\n" "\f"} s))

(def pairs [{:type :list :open "(" :close ")"}
            {:type :map :open "{" :close "}"}
            {:type :string :open "\"" :close "\""}
            {:type :vector :open "[" :close "]"}])

(def directions {:backward -1 :forward 1})

(defn dir->int [dir]
  (get directions dir))

(defn pair-chars [t]
  (if (= t :all)
    (clojure.set/union (pair-chars :open) (pair-chars :close))
    (set (map t pairs))))

(defn pair->set [p]
  (set ((juxt :open :close) p)))

(defn char->pair [c]
  (first
   (filter (fn [m] (or
                     (= (:open m) c)
                     (= (:close m) c))) pairs)))

(defn char-type [p c]
  (if (= (:open p) c)
    :open
    :close))

(defn type->dir [t]
  (if (= :open t)
    :forward
    :backward))

(defn opposite-char [c]
  (when-let [p (char->pair c)]
    (if (= (:open p) c)
      (:close p)
      (:open p))))

(defn char-at-loc [ed loc]
  (let [l (editor/line ed (:line loc))
        c (get l (:ch loc))]
    c))

(defn comment|string|char? [ed loc allow-strings?]
  "Check wether the character at loc is part of a comment or string"
  (if-let [tokentype (editor/->token-type ed (editor/adjust-loc loc 1))]
    (cond
      (str-contains? tokentype "comment-form") false
      (str-contains? tokentype "comment") true
      (str-contains? tokentype "char") true
      (str-contains? tokentype "string") (when-not allow-strings? true))
    false))

(defn index->pos [ed i]
  (.posFromIndex (editor/->cm-ed ed) i))

(defn- loc-compare-fn [f]
  (fn [ed & locs]
    (apply f (map #(editor/pos->index ed %) locs))))

(def loc<
  (loc-compare-fn <))

(def loc>
  (loc-compare-fn >))

(def loc>=
  (loc-compare-fn >=))

(def loc<=
  (loc-compare-fn <=))

(defn escaped-char? [ed loc]
  (loop [loc (editor/adjust-loc loc -1)
         result 0]
    (let [[ch line] ((juxt :ch :line) loc)
          c (char-at-loc ed loc)]
      (if (< ch 0)
        (odd? result)
        (if (= "\\" c)
          (recur (editor/adjust-loc loc -1) (inc result))
          (odd? result))))))

(defn escapes-char? [ed loc]
  (if
    (and
     (= "\\" (char-at-loc ed loc))
     (not (escaped-char? ed loc))
     (char-at-loc ed (editor/adjust-loc loc 1)))
    true
    false))

(defn find-pos-h
  ([ed loc amount]
     (find-pos-h ed loc amount :char false))
  ([ed loc amount unit vis?]
     (let [pos (.findPosH (editor/->cm-ed ed) (clj->js loc) amount (name unit) vis?)]
       {:line (.-line pos)
        :ch (.-ch pos)})))

(defn string-boundary [ed l dir]
  (loop [loc l
         result nil]
    (let [token-type (editor/->token-type ed (editor/adjust-loc loc 1))
          next-loc (find-pos-h ed loc (dir->int dir))]
      (if (and
           token-type
           (str-contains? token-type "string") )
        (if (= next-loc loc)
          (condp = dir
                :backward loc
                :forward (editor/adjust-loc loc -1))
          (recur next-loc loc))
        result))))

(defn string-bounds [ed l]
  [(string-boundary ed l :backward) (string-boundary ed l :forward)])

(defn find-match [ed l c]
  (when-let [p (char->pair c)]
    (let [pair-type (:type p)
          type (char-type p c)
          dir (type->dir type)
          opposite (opposite-char c)]
      (if (= pair-type :string)
        (first (remove #(= l %) (string-bounds ed l)))
        (loop [chars (locate-chars ed l #{c opposite} dir)
                    stack 0]
               (when-not (empty? chars)
                 (let [[char loc] (first chars)]
                   (cond
                    (= loc l) (recur (rest chars) stack)
                    (= char c) (recur (rest chars) (inc stack))
                    (= char opposite) (if (= 0 stack)
                                        loc
                                        (recur (rest chars) (dec stack)))
                    :else (recur (rest chars) stack)))))))))

(defn locate-chars
  ([ed l cs dir include-start?]
   (let [l (if include-start?
             l
             (find-pos-h ed l (dir->int dir)))]
     (locate-chars ed l cs dir)))
  ([ed l cs dir]
   (let [next-loc (find-pos-h ed l (dir->int dir))
         c (char-at-loc ed l)
         pair (char->pair c)]
     (cond
      (and
       pair
       (= (:type pair) :string)
       (contains? cs c)) (let [token (editor/->token ed (editor/adjust-loc l 1))
                                       t (:type token)
                                       start (:start token)
                                       end (- (:end token) 1)]
                                   (if (and
                                        (= t "string")
                                        (or (= start (:ch l)) (= end (:ch l))))
                                     (lazy-seq (cons [c l] (locate-chars ed next-loc cs dir)))
                                     (lazy-seq (locate-chars ed next-loc cs dir))))
      (comment|string|char? ed l false) (lazy-seq (locate-chars ed next-loc cs dir))
      (contains? cs c) (if (= next-loc l)
                         (lazy-seq (cons [c l] '()))
                         (lazy-seq (cons [c l] (locate-chars ed next-loc cs dir))))
      (= next-loc l) '()
      :else (lazy-seq (locate-chars ed next-loc cs dir))))))

(defn locate-chars-on-line [ed l cs dir]
  (take-while (fn [[c loc]] (= (:line l) (:line loc))) (locate-chars ed l cs dir)))

(defn find-unbalanced
  ([ed l dir]
   (let [cs (condp = dir
                  :forward (pair-chars :close)
                  :backward (pair-chars :open))]
     (find-unbalanced ed l cs dir)))
  ([ed l cs dir]
   (find-unbalanced ed (locate-chars ed l cs dir) l cs dir))
  ([ed locations l cs dir]
     (if-not (empty? locations)
       (let [[c loc] (first locations)]
         (if-let [matchloc (find-match ed loc c)]
           (if (<
                (* (dir->int dir) (editor/pos->index ed matchloc))
                (* (dir->int dir) (editor/pos->index ed l)))
             (lazy-seq (cons [c loc] (find-unbalanced ed (rest locations) l cs dir)))
             (lazy-seq (find-unbalanced ed (rest locations) l cs dir)))
           (lazy-seq (cons [c loc] (find-unbalanced ed (rest locations) l cs dir)))))
       '())))

(defn pair-bounds [ed l]
  (when-let [[c loc] (first (find-unbalanced ed l :forward))]
    [(find-match ed loc c) loc]))

(defn move-cursor-along-pair [ed l dir side]
  (when-let [[startloc endloc] (pair-bounds ed l)]
    (let [adjustment {:before 0
                      :after 1}
          dir->loc {:forward endloc
                    :backward startloc}]
      (editor/move-cursor ed (editor/adjust-loc (dir->loc dir) (side adjustment))))))

(defn paredit-kill [ed]
  (let [startloc (editor/->cursor ed)
        c (char-at-loc ed startloc)
        all-pair-chars (pair-chars :all)]
    (if (contains? all-pair-chars c)
      (when-let [matchloc (find-match ed startloc c)]
        (if (> (editor/pos->index ed matchloc) (editor/pos->index ed startloc))
          (editor/replace ed startloc (editor/adjust-loc matchloc 1) "")
          (editor/replace ed (editor/adjust-loc startloc 1) matchloc "")))
      (let [line (:line startloc)
            chars (take-while (fn [[c loc]] (= line (:line loc))) (locate-chars ed startloc all-pair-chars :forward))]
        (if (empty? chars)
          (cmd/exec! :editor.kill-line)
          (if-let [kl (some (fn [[c loc]]
                              (when-let [mloc (find-match ed loc c)]
                                (when (loc> ed startloc mloc)
                                  loc))) (filter (fn [[c _]] (contains? (pair-chars :close) c)) chars))]
            (editor/replace ed startloc kl "")
            (if-let [kl (some (fn [[c loc]]
                                (when-let [mloc (find-match ed loc c)]
                                  (when (> (:line mloc) (:line loc))
                                    mloc))) (filter (fn [[c _]] (contains? (pair-chars :open) c)) chars))]
              (editor/replace ed startloc (editor/adjust-loc kl 1) "")
              (cmd/exec! :editor.kill-line))))
        ))))

(defn wrap-region
  ([ed [startloc endloc] p]
   (wrap-region ed [startloc endloc] p false))
  ([ed [startloc endloc] p end-inclusive?]
   (editor/operation ed (fn []
                          (editor/replace ed (editor/adjust-loc endloc (if end-inclusive? 1 0)) (:close p))
                          (editor/replace ed startloc (:open p))))))

(defn paredit-wrap-with-pair [ed l p]
  (let [c (char-at-loc ed l)]
    (cond
     (editor/selection? ed) (let [bounds (editor/selection-bounds ed)]
                              (wrap-region ed [(:from bounds) (:to bounds)] p))
     (comment|string|char? ed l true) (notifos/set-msg! "Illegal context: not available in comments or escaped char")
     (comment|string|char? ed l false) (when-let [bounds (string-bounds ed l)]
                                           (wrap-region ed bounds p true))
     (char->pair c) (when-let [mloc (find-match ed l c)]
                      (wrap-region ed (sort-by #(editor/pos->index ed %) [l mloc]) p true))
     :else (let [token (editor/->token ed (editor/adjust-loc l 1))
                 startloc {:line (:line l) :ch (:start token)}
                 endloc {:line (:line l) :ch (:end token)}]
             (wrap-region ed [startloc endloc] p)))))

(defn paredit-splice-sexp [ed l]
  (when-let [[c loc] (first (find-unbalanced ed l (pair-chars :close) :forward))]
    (when-let [mloc (find-match ed loc c)]
      (editor/operation ed (fn []
                             (editor/replace ed loc (editor/adjust-loc loc 1) "")
                             (editor/replace ed mloc (editor/adjust-loc mloc 1) ""))))))

(defn paredit-splice-sexp-kill [ed l dir]
  (when-let [[c loc] (first (find-unbalanced ed l (pair-chars :close) :forward))]
    (when-let [mloc (find-match ed loc c)]
      (condp = dir
        :backward (editor/operation ed (fn []
                              (editor/replace ed loc (editor/adjust-loc loc 1) "")
                              (editor/replace ed mloc l "")))
        :forward (editor/operation ed (fn []
                              (editor/replace ed l (editor/adjust-loc loc 1) "")
                              (editor/replace ed mloc (editor/adjust-loc mloc 1) "")))))))

(defn paredit-split-sexp [ed l]
  (when-let [[c loc] (first (find-unbalanced ed l (pair-chars :close) :forward))]
            (if (find-match ed loc c)
              (let [p (char->pair c)
                    s (str (:close p) " " (:open p))]
                (editor/operation ed (fn []
                                    (editor/replace ed l s)
                                    (editor/move-cursor ed (editor/adjust-loc l 1))))))))

(defn paredit-join-sexps [ed l]
  (let [[lc ll] (first (locate-chars ed l (pair-chars :close) :backward))
        [rc rl] (first (locate-chars ed l (pair-chars :open) :forward))]
    (if (and lc rc)
      (if (= lc (opposite-char rc))
        (editor/operation ed (fn []
                               (editor/replace ed rl (editor/adjust-loc rl 1) "")
                               (editor/replace ed ll (editor/adjust-loc ll 1) "")
                               (editor/indent-lines ed ll rl "smart")))
        (notifos/set-msg! "Mismatched sexps")))))

(defn paredit-forward-delete [ed l]
  (let [l (editor/->cursor ed)
        nloc (editor/adjust-loc l 1)
        c (char-at-loc ed l)
        nc (char-at-loc ed (editor/adjust-loc l 1))
        pc (char-at-loc ed (editor/adjust-loc l -1))
        pair (char->pair c)
        tokentype (editor/->token-type ed nloc)]
    (cond
     (and tokentype
          (str-contains? tokentype "comment")) (if nc
          (editor/replace ed l (editor/adjust-loc l 1) "")
          (editor/operation ed (fn []
                                 (editor/replace ed l (editor/adjust-loc l 1) "")
                                 (editor/move-cursor ed (editor/adjust-loc l -1) ""))))
     (escaped-char? ed l) (editor/replace ed (editor/adjust-loc l 1) (editor/adjust-loc l -1) "")
     (escapes-char? ed l) (editor/replace ed l (editor/adjust-loc l 2) "")
     pair (cond
           (and
            (contains? (pair-chars :close) c)
            (not (escaped-char? ed l))
            (= pc (opposite-char c))) (editor/replace ed (editor/adjust-loc l 1) (editor/adjust-loc l -1) "")
           nc (editor/move-cursor ed (editor/adjust-loc l 1)))
     nc (editor/replace ed l (editor/adjust-loc l 1) "")
     :else (editor/operation ed (fn []
                                 (editor/replace ed l (editor/adjust-loc l 1) "")
                                 (editor/move-cursor ed (editor/adjust-loc l -1) ""))))))

(defn paredit-backward-delete [ed l]
  (let [l (editor/->cursor ed)
        ploc (editor/adjust-loc l -1)
        nloc (editor/adjust-loc l 1)
        c (char-at-loc ed l)
        pc (char-at-loc ed (editor/adjust-loc l -1))
        tokentype (editor/->token-type ed l)]
    (cond
     (not pc) (editor/replace ed l (find-pos-h ed l -1) "")
     (and tokentype
          (str-contains? tokentype "comment")) (editor/replace ed l ploc "")
     (escaped-char? ed ploc) (editor/replace ed l (editor/adjust-loc l -2) "")
     (escapes-char? ed ploc) (editor/replace ed nloc ploc "")
     (contains? (pair-chars :open) pc) (if (= c (opposite-char pc))
                                         (editor/replace ed nloc ploc "")
                                         (editor/move-cursor ed ploc))
     (contains? (pair-chars :close) pc) (editor/move-cursor ed ploc)
     :else (editor/replace ed l ploc ""))))

(defn paredit-duplicate [ed l]
  (let [startloc l
        startindex (editor/pos->index ed startloc)
        all-pair-chars (pair-chars :all)
        endloc (loop [startloc startloc
                       chars (locate-chars-on-line ed startloc all-pair-chars :forward)]
                  (if-not (empty? chars)
                    (let [[c loc] (first chars)]
                      (when-let [mloc (find-match ed loc c)]
                        (let [sline (:line loc)
                              mline (:line mloc)
                              mindex (editor/pos->index ed mloc)]
                          (cond
                           (< mindex startindex) loc
                           (> mline sline) (recur mloc (locate-chars-on-line ed mloc all-pair-chars :forward))
                           :else (recur startloc (rest chars))))))
                    {:ch (editor/line-length ed (:line startloc)) :line (:line startloc)}))]
    (let [text-to-dupl (editor/range ed startloc endloc)]
      (editor/operation ed (fn []
                             (editor/replace ed startloc endloc (str text-to-dupl "\n" text-to-dupl))
                             (editor/move-cursor ed (find-pos-h ed startloc (inc (count text-to-dupl))))
                             (editor/indent-lines ed startloc (find-pos-h ed endloc (inc (count text-to-dupl)))))))))

(defn delete-pair-contents [ed l]
  (when-let [[start end] (pair-bounds ed l)]
    (editor/replace ed (editor/adjust-loc start 1) end "")))

(defn paredit-raise-sexp [ed l]
  (let [c (char-at-loc ed l)
        token (editor/->token ed (editor/adjust-loc l 1))
        tokentype (:type token)
        delete-surrounding (fn [[startloc endloc]]
                             (when-let [[p-startloc p-endloc] (pair-bounds ed startloc)]
                                            (editor/operation ed (fn []
                                                                   (editor/replace ed (editor/adjust-loc endloc 1) (editor/adjust-loc p-endloc 1) "")
                                                                   (editor/replace ed p-startloc startloc "")))))]
    (cond
     (and tokentype (str-contains? tokentype "comment") (not (str-contains? tokentype "comment-form"))) (notifos/set-msg! "Illegal context: not available in comments")
     (and tokentype (str-contains? tokentype "string")) (delete-surrounding (string-bounds ed l))
     (contains? (pair-chars :all) c) (when-let [mloc (find-match ed l c)]
                                       (delete-surrounding (sort-by #(editor/pos->index ed %) [l mloc])))
     (or (whitespace? c) (nil? c)) (let [nloc (find-pos-h ed l 1)]
                       (when-not (= l nloc)
                         (recur ed nloc)))
     :else (let [line (:line l)]
             (delete-surrounding [{:line line :ch (:start token)} (editor/adjust-loc {:line line :ch (:end token)} -1)])))))

(cmd/command {:command :paredit-plus.raise-sexp
              :desc "Paredit Plus: Raise sexp"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-raise-sexp ed (editor/->cursor ed))))})

(cmd/command {:command :paredit-plus.new-line-after-pair-close
              :desc "Paredit Plus: New line after pair close"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (editor/operation ed (fn []
                                               (move-cursor-along-pair ed (editor/->cursor ed) :forward :after)
                                               (cmd/exec! :editor.new-line-indent)))))})

(cmd/command {:command :paredit-plus.duplicate
              :desc "Paredit Plus: Duplicate"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-duplicate ed (editor/->cursor ed))))})

(cmd/command {:command :paredit-plus.delete-pair-contents
              :desc "Paredit Plus: Delete contents inside current pair"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (delete-pair-contents ed (editor/->cursor ed))))})

(cmd/command {:command :paredit-plus.forward-delete
              :desc "Paredit Plus: Forward delete"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-forward-delete ed (editor/->cursor ed))))})

(cmd/command {:command :paredit-plus.backward-delete
              :desc "Paredit Plus: Backward delete"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-backward-delete ed (editor/->cursor ed))))})

(cmd/command {:command :paredit-plus.join-sexps
              :desc "Paredit Plus: Join sexps"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-join-sexps ed (editor/->cursor ed))))})

(cmd/command {:command :paredit-plus.split-sexp
              :desc "Paredit Plus: Split sexp"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-split-sexp ed (editor/->cursor ed))))})

(cmd/command {:command :paredit-plus.splice-sexp-killing-forward
              :desc "Paredit Plus: Splice sexp killing forward"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-splice-sexp-kill ed (editor/->cursor ed) :forward)))})

(cmd/command {:command :paredit-plus.splice-sexp-killing-backward
              :desc "Paredit Plus: Splice sexp killing backward"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-splice-sexp-kill ed (editor/->cursor ed) :backward)))})

(cmd/command {:command :paredit-plus.splice-sexp
              :desc "Paredit Plus: Splice sexp"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-splice-sexp ed (editor/->cursor ed))))})

(cmd/command {:command :paredit-plus.kill
              :desc "Paredit Plus: Kill"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-kill ed)))})

(cmd/command {:command :paredit-plus.wrap-round
              :desc "Paredit Plus: Wrap round"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-wrap-with-pair ed (editor/->cursor ed) (char->pair "("))))})

(cmd/command {:command :paredit-plus.wrap-square
              :desc "Paredit Plus: Wrap square"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-wrap-with-pair ed (editor/->cursor ed) (char->pair "["))))})

(cmd/command {:command :paredit-plus.wrap-curly
              :desc "Paredit Plus: Wrap curly"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-wrap-with-pair ed (editor/->cursor ed) (char->pair "{"))))})

(cmd/command {:command :paredit-plus.wrap-quote
              :desc "Paredit Plus: Wrap quote"
              :exec (fn []
                      (when-let [ed (pool/last-active)]
                        (paredit-wrap-with-pair ed (editor/->cursor ed) (char->pair "\""))))})
