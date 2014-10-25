(ns lt.plugins.gitlight.diff
  (:require [lt.object :as object]
            [lt.objs.command :as cmd]
            [lt.util.dom :as dom]
            [lt.objs.editor.pool :as pool]
            [lt.objs.editor :as editor]
            [clojure.string :as string]
            [lt.plugins.gitlight.gutter :as gut]
            [lt.plugins.gitlight.libs :as lib]
            [lt.plugins.gitlight.git :as git]
            [lt.plugins.gitlight.common-ui :as cui])
  (:require-macros [lt.macros :refer [defui behavior]]))


(def context (atom 3))

; necessary for update
(def last-filename (atom nil))
(def last-cached (atom false))
(def last-commit (atom nil))

(defn update-diff []
    (git-diff @last-filename @last-cached @last-commit))

(def update-after (partial lib/wrap-post update-diff))

(defn dec>0 [x]
  (if (> x 0)
    (dec x)
    0))

(defn make-context []
  (let [inc-and-up (update-after #(swap! context inc))
        dec-and-up (update-after #(swap! context dec>0))]
  [:div.context
   (cui/button "-" dec-and-up)
   (str "context: " @context)
   (cui/button "+" inc-and-up)]))


(defn make-more-context []
  (let [enlarge-context (update-after #(reset! context 100000))
        reset-context (update-after #(reset! context 3))]
   [:div.more-context
    (cui/button "whole file" enlarge-context)
    (cui/button "reset" reset-context)]))


(defn cached-toggle-button []
  (let [cached-txt (if @last-cached "unstaged changes" "staged changes")
        update-cached (update-after #(swap! last-cached not))]
    (cui/button cached-txt update-cached)))


(defui commit-input []
  [:input.title {:type "text"
                 :size 81
           :placeholder "commit title"}])


(defui commit-body []
  [:textarea.body {:placeholder "commit body"
                   :cols 81
                   :rows 10}])

(defn make-commit-form []
  (let [title (commit-input)
        body (commit-body)
        commit-fun #(git/git-commit (dom/val title) (dom/val body))]
    [:div.commit-form
     title [:br]
     body [:br]
     (cui/button "submit" (update-after commit-fun))]))


(defn make-file-table [[header left right]]
  [:table
   [:tr [:td.header header]]
   [:tr
    [:td.left [:b left]]
    [:td.right [:b right]]]])


(defn location-row [location]
  [:tr.where [:td {:colspan 2} [:b location]]])


(defn separate [fun coll]
  [(filter fun coll), (filter (complement fun) coll)])


(defn nil-padder [coll padding]
  (concat coll (repeat padding nil)))


(defn pad-smaller-with-nils [left-right]
  (let [counts (map count left-right)
        paddings (map - (reverse counts) counts)]
    (map nil-padder left-right paddings)))


(defn separate-minus-and-plus [lines]
  (let [minus-plus (separate #(= \- (first %)) lines)]
    (pad-smaller-with-nils minus-plus)))


(defn make-columns [lines]
  (let [separated (separate-minus-and-plus lines)
        make-context-row #(make-diff-row "context" %1 %1)
        make-changes-row (partial make-diff-row "changes")]
    (if (= \space (first (first lines)))
      (map make-context-row lines)
      (apply (partial map make-changes-row) separated))))


(defn make-diff-row [classname left right]
  [:tr {:class classname}
   [:td.left [:pre left]]
   [:td.right [:pre right]]])


(defn split-diff-into-columns [[location diff]]
  (let [splitted-into-groups (partition-by #(= \space (first %)) diff)]
    [(location-row location)
     (map make-columns splitted-into-groups)]))


(defn make-file-diff [file-diff]
  (mapcat split-diff-into-columns file-diff))


(defui diff-panel [this]
  (let [output (:result @this)]
    [:div.gitlight-diff
     [:h1 "diff: " (if (= "" @last-filename)
                     "whole repo"
                     @last-filename)]
     (make-context)
     (make-more-context)
     (cached-toggle-button)

     (when @last-cached
       (make-commit-form))

     (for [[fileinfo file-diff] (parse-git-diff output)]
       (into (make-file-table fileinfo)
             (make-file-diff file-diff)))]))





(defn split-into-groups [file-lines]
  (partition 2 (partition-by #(not= \@ (first %)) file-lines)))


(defn parse-single-git-diff [lines]
  (let [[fileinfo diff-lines] (split-at 3 lines)
        groups (split-into-groups diff-lines)]
    [fileinfo groups]))


(defn split-into-files [lines]
  (let [diff-regexp #"diff --git .*"
        splitter (partial re-matches diff-regexp)
        splitted-by-regexp (partition-by splitter lines)]
    (take-nth 2 (rest splitted-by-regexp))))


(defn parse-git-diff [raw-data]
  (let [lines (string/split-lines (.toString raw-data))
        files (split-into-files lines)]
    (map parse-single-git-diff files)))



(def git-diff-output
  (cui/make-output-tab-object "Git diff"
                              ::gitlight-diff
                              diff-panel))



(defn git-diff
  ([filepath] (git-diff filepath false nil))
  ([filepath cached?] (git-diff filepath cached? nil))
  ([filepath cached? commit] (let [contextstr (str "-U" @context)
                                   args ["diff" "--no-color" contextstr
                                         commit
                                         (when cached? "--cached")
                                         "--" filepath]]
                               (reset! last-filename filepath)
                               (reset! last-cached cached?)
                               (reset! last-commit commit)
                               (git/git args git-diff-output))))


(defn git-diff-button [filename]
  (git-diff filename))

(defn git-diff-cached-button [filename]
  (git-diff filename true))

(defn git-diff-repo-button [filename]
  (git-diff ""))

(defn git-diff-cached-repo-button [filename]
  (git-diff "" true))


(defui style-diff-marker [[p m :as content]]
  [:div {:class (cond
                 (and (= p " ") (nil? m)) "no-change"
                 (and (= p "+") (nil? m)) "added-line"
                 (and (= p " ") (= "-" (first m))) "deleted-lines"
                 (and (= p "+") (= "-" (first m))) "modified-line")}
   content])


(defn filler []
  (let [file-editor (editor/->cm-ed (pool/last-active))
        line-number (.-size (.-doc file-editor))]
    (repeat line-number " ")))


(defn with-deficit [marker deficit]
  (str marker
       (when (> deficit 0)
         (if (= \+ marker)
           "-"
           (str "-" deficit "↑")))))


(defn make-indicator [[consumed deficit] marker]
  (let [new-marker (with-deficit marker deficit)
        added-new (conj consumed new-marker)]
    (case marker
      \-     [consumed  (inc deficit)]
      \+     [added-new (dec>0 deficit)]
      \space [added-new 0])))


(defn diff-gutter [diff-lines]
  (let [diff (map first diff-lines)]
    (first (reduce make-indicator [[] 0] diff))))


(defn parse-diff-gutter-out [this command stdout stderr]
  (let [splitted (string/split-lines (.toString stdout))
        diff-part (drop 5 splitted)]
    (gut/show-gutter-data
      (pool/last-active)
      println
      style-diff-marker
      (if (empty? diff-part)
        (filler)
        (diff-gutter diff-part)))))


(behavior ::parse-diff-gutter-out
          :triggers [:out]
          :reaction parse-diff-gutter-out)


(behavior ::diff-gutter-err
          :triggers [:err]
          :reaction (fn [this command stdout stderr]
                      (println "error" stderr)))


(behavior ::refresh-diff-gutter-on-save
          :triggers #{:save+}
          :type :user
          :desc "gitlight: refresh diff gutter"
          :reaction (fn [editor content]
                      (if (object/has-tag? editor ::gitlight-gutter-on)
                        (do
                          (object/remove-tags editor #{::gitlight-gutter-on})
                          (add-git-diff-gutter)))
                      content))


(def git-diff-gutter-out
  (object/create
   (object/object* ::diff-file-out
                   :tags #{::diff-file-out}
                   :behaviors [::parse-diff-gutter-out ::diff-gutter-err])))


(defn add-git-diff-gutter []
  (object/add-tags (pool/last-active) #{::gitlight-gutter-on})
  (git/git ["diff" "-U10000" "--" (lib/current-file-path)]
           git-diff-gutter-out))


(defn remove-git-diff-gutter []
  (gut/remove-gutters (pool/last-active))
  (object/remove-tags (pool/last-active) #{::gitlight-gutter-on}))


(defn toggle-git-diff-gutter []
  (if (object/has-tag? (pool/last-active) ::gitlight-gutter-on)
    (remove-git-diff-gutter)
    (add-git-diff-gutter)))

(cmd/command {:command ::gitlight-add-diff-gutter
              :desc "gitlight: add gutter diff (experimental)"
              :exec add-git-diff-gutter})


(cmd/command {:command ::gitlight-remove-diff-gutter
              :desc "gitlight: remove gutter diff (experimental)"
              :exec remove-git-diff-gutter})


(cmd/command {:command ::gitlight-toggle-diff-gutter
              :desc "gitlight: toggle gutter diff (experimental)"
              :exec toggle-git-diff-gutter})


(cmd/command {:command ::git-diff-file
              :desc "gitlight: diff this file"
              :exec (fn []
                      (git-diff (lib/current-file-path)))})


(cmd/command {:command ::git-diff-repo
              :desc "gitlight: diff this repo"
              :exec (fn []
                      (git-diff ""))})
