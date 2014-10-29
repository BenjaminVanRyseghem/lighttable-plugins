(defproject lein-light-nrepl "0.0.19"
  :description "nrepl client for Light Table clj and cljs eval."
  :url "https://github.com/LightTable/Clojure/tree/master/lein-light-nrepl"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.5.1"]
                 [org.clojure/tools.nrepl "0.2.3"]
                 [commons-io/commons-io "2.4"]
                 [ibdknox/tools.reader "0.8.1"]
                 [org.clojure/tools.reader "0.7.10"]
                 [ibdknox/analyzer "0.0.2"]
                 [clj-stacktrace "0.2.7"]
                 [fs "1.3.3"]
                 [org.clojure/clojurescript "0.0-2202"
                   :exclusions [org.apache.ant/ant]]
                 [com.cemerick/pomegranate "0.2.0"]
                 [clojure-complete "0.2.3"]
                 [cheshire "5.2.0"]
                 ]
  :jvm-opts ["-Xmx1g"])
