(ns lt.plugins.jshint
  (:require [lt.object :as object]
            [lt.objs.files :as files]
            [lt.objs.plugins :as plugins]
            [lt.objs.command :as cmd]
            [lt.objs.editor :as editor]
            [lt.objs.editor.pool :as pool]
            [lt.objs.thread :as thread])
  (:require-macros [lt.macros :refer [defui background]]))

(def jshint-path (files/join plugins/*plugin-dir* "node_modules/jshint"))

(def errors (background (fn [obj-id jshint-path code opts]
                          (let [jshint (.-JSHINT (js/require jshint-path))]
                            (jshint code (when opts (clj->js opts)))
                            (->> (js->clj (.-errors jshint) :keywordize-keys true)
                                 (raise obj-id :hinted))))))

(defui mark [errors spacing]
  [:div.hintwrapper
   [:span.spacer spacing]
   [:ul {:class "jshinterrors"}
    (for [e errors]
      [:li (:reason e (:raw e))])]])

(defn ->spacing [text]
  (when text
    (-> (re-seq #"^\s+" text)
        (first))))

(object/behavior* ::inline-hints
                  :triggers #{:hinted}
                  :reaction (fn [this hints]
                              (editor/operation (editor/->cm-ed this)
                                                (fn []
                                                  (let [prev (.getScrollInfo (editor/->cm-ed this))]
                                                    (doseq [hint (:jshint @this)]
                                                      (editor/remove-line-widget this hint))
                                                    (object/merge! this {:jshint (doall (for [[line es] (group-by :line (filter identity hints))]
                                                                                          (editor/line-widget this (dec line) (mark es (->spacing (editor/line this (dec line)))))))})
                                                    ;;Ensure scroll position is the same as it was when we started
                                                    (.scrollTo (editor/->cm-ed this) (.-left prev) (.-top prev)))))))

(object/behavior* ::on-change
                  :debounce 750
                  :type :user
                  :desc "JSHint: Run JSHint on change"
                  :triggers #{:change}
                  :reaction (fn [this]
                              (errors this jshint-path (editor/->val this) (::jshint-options @this))))

(object/behavior* ::on-save
                  :triggers #{:save}
                  :type :user
                  :desc "JSHint: Run JSHint on save"
                  :reaction (fn [this]
                              (errors this jshint-path (editor/->val this) (::jshint-options @this))))

(object/behavior* ::jshint-options
                  :triggers #{:object.instant}
                  :type :user
                  :desc "JSHint: Set JSHint options"
                  :params [{:label "options"
                            :example "{:maxparams 2}"
                            :type :clj}]
                  :reaction (fn [this opts]
                              (object/merge! this {::jshint-options opts})))

(cmd/command {:command :jshint.run
              :desc "JSHint: Run jshint on current editor"
              :exec (fn [this]
                      (when-let [ed (pool/last-active)]
                        (errors ed jshint-path (editor/->val ed) (::jshint-options @ed))))})

