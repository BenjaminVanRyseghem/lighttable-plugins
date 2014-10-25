if(!lt.util.load.provided_QMARK_('lt.plugins.subpar.paredit')) {
goog.provide('lt.plugins.subpar.paredit');
goog.require('cljs.core');
lt.plugins.subpar.paredit.code = "c";
lt.plugins.subpar.paredit.cmmnt = ";";
lt.plugins.subpar.paredit.string = "\"";
lt.plugins.subpar.paredit.openers = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["(",null,"[",null,"{",null], null), null);
lt.plugins.subpar.paredit.closers = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [")",null,"]",null,"}",null], null), null);
lt.plugins.subpar.paredit.opener_QMARK_ = (function opener_QMARK_(a){return cljs.core.contains_QMARK_.call(null,lt.plugins.subpar.paredit.openers,a);
});
lt.plugins.subpar.paredit.closer_QMARK_ = (function closer_QMARK_(a){return cljs.core.contains_QMARK_.call(null,lt.plugins.subpar.paredit.closers,a);
});
lt.plugins.subpar.paredit.whitespace_QMARK_ = (function whitespace_QMARK_(x){return (cljs.core._EQ_.call(null,x,"\t")) || (cljs.core._EQ_.call(null,x," ")) || (cljs.core._EQ_.call(null,x,"\n"));
});
lt.plugins.subpar.paredit.get_opening_delimiter_index_with_parse = (function get_opening_delimiter_index_with_parse(p,i){return cljs.core.nth.call(null,cljs.core.nth.call(null,new cljs.core.Keyword(null,"chars","chars",1108527951).cljs$core$IFn$_invoke$arity$1(p),i),1);
});
lt.plugins.subpar.paredit.get_closing_delimiter_index_with_parse = (function get_closing_delimiter_index_with_parse(p,i){return cljs.core.get_in.call(null,p,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"families","families",1801311860),lt.plugins.subpar.paredit.get_opening_delimiter_index_with_parse.call(null,p,i),new cljs.core.Keyword(null,"closer","closer",3951351020)], null));
});
/**
* returns index of the opening delimiter for the list that contains
* the point. if there is no containing list, this returns -1
*/
lt.plugins.subpar.paredit.get_opening_delimiter_index = (function get_opening_delimiter_index(s,i){return lt.plugins.subpar.paredit.get_opening_delimiter_index_with_parse.call(null,lt.plugins.subpar.paredit.parse.call(null,s),i);
});
/**
* returns index of the closing delimiter for the list that contains
* the point. if there is no containing list, this returns the length
* of the code
*/
lt.plugins.subpar.paredit.get_closing_delimiter_index = (function get_closing_delimiter_index(s,i){return lt.plugins.subpar.paredit.get_closing_delimiter_index_with_parse.call(null,lt.plugins.subpar.paredit.parse.call(null,s),i);
});
/**
* returns the indices of the delimiters of the list containing the
* point.
*/
lt.plugins.subpar.paredit.get_wrapper = (function get_wrapper(p,i){return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [lt.plugins.subpar.paredit.get_opening_delimiter_index_with_parse.call(null,p,i),lt.plugins.subpar.paredit.get_closing_delimiter_index_with_parse.call(null,p,i)], null);
});
/**
* gets the kind of text containin the point: string, code, comment
*/
lt.plugins.subpar.paredit.get_mode = (function get_mode(p,i){return cljs.core.nth.call(null,cljs.core.nth.call(null,new cljs.core.Keyword(null,"chars","chars",1108527951).cljs$core$IFn$_invoke$arity$1(p),i),0);
});
lt.plugins.subpar.paredit.in_QMARK_ = (function in_QMARK_(p,i,mode){return (((0 <= i)) && ((i <= cljs.core.count.call(null,new cljs.core.Keyword(null,"chars","chars",1108527951).cljs$core$IFn$_invoke$arity$1(p))))) && (cljs.core._EQ_.call(null,mode,lt.plugins.subpar.paredit.get_mode.call(null,p,i)));
});
lt.plugins.subpar.paredit.in_comment_QMARK_ = (function in_comment_QMARK_(p,i){return lt.plugins.subpar.paredit.in_QMARK_.call(null,p,i,lt.plugins.subpar.paredit.cmmnt);
});
lt.plugins.subpar.paredit.in_code_QMARK_ = (function in_code_QMARK_(p,i){return lt.plugins.subpar.paredit.in_QMARK_.call(null,p,i,lt.plugins.subpar.paredit.code);
});
lt.plugins.subpar.paredit.in_string_QMARK_ = (function in_string_QMARK_(p,i){return lt.plugins.subpar.paredit.in_QMARK_.call(null,p,i,lt.plugins.subpar.paredit.string);
});
lt.plugins.subpar.paredit.in_string = (function in_string(s,i){return lt.plugins.subpar.paredit.in_string_QMARK_.call(null,lt.plugins.subpar.paredit.parse.call(null,s),i);
});
lt.plugins.subpar.paredit.n_str_QMARK_ = cljs.core.complement.call(null,lt.plugins.subpar.paredit.in_string_QMARK_);
lt.plugins.subpar.paredit.get_all_siblings = (function get_all_siblings(i,p){return cljs.core.get_in.call(null,p,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"families","families",1801311860),lt.plugins.subpar.paredit.get_opening_delimiter_index_with_parse.call(null,p,i),new cljs.core.Keyword(null,"children","children",2673430897)], null));
});
/**
* returns a sorted list of the siblings at point 'i' after they have
* been transformed with 'transform' and filtered by 'predicate', both
* single argument fns
*/
lt.plugins.subpar.paredit.get_siblings = (function get_siblings(i,transform,predicate,p){return cljs.core.sort.call(null,cljs.core.filter.call(null,predicate,transform.call(null,lt.plugins.subpar.paredit.get_all_siblings.call(null,i,p))));
});
/**
* how many lines contain the code from i to j inclusive
*/
lt.plugins.subpar.paredit.count_lines = (function count_lines(s,i,j){var and__6743__auto__ = i;if(cljs.core.truth_(and__6743__auto__))
{var and__6743__auto____$1 = j;if(cljs.core.truth_(and__6743__auto____$1))
{return (cljs.core.count.call(null,cljs.core.filter.call(null,(function (p1__8407_SHARP_){return cljs.core._EQ_.call(null,"\n",p1__8407_SHARP_);
}),cljs.core.drop.call(null,i,cljs.core.drop_last.call(null,((cljs.core.count.call(null,s) - j) - 1),cljs.core.take.call(null,cljs.core.count.call(null,s),s))))) + 1);
} else
{return and__6743__auto____$1;
}
} else
{return and__6743__auto__;
}
});
/**
* whether the current spot is escaped
*/
lt.plugins.subpar.paredit.escaped_QMARK_ = (function escaped_QMARK_(s,i){return cljs.core.odd_QMARK_.call(null,(function (){var c = 0;var j = (i - 1);while(true){
var a = cljs.core.nth.call(null,s,j,null);if((j < 0))
{return c;
} else
{if((a == null))
{return c;
} else
{if(cljs.core.not_EQ_.call(null,"\\",a))
{return c;
} else
{if(true)
{{
var G__8440 = (c + 1);
var G__8441 = (j - 1);
c = G__8440;
j = G__8441;
continue;
}
} else
{return null;
}
}
}
}
break;
}
})());
});
lt.plugins.subpar.paredit.closes_list_QMARK_ = (function closes_list_QMARK_(p,i){return cljs.core.some.call(null,cljs.core.PersistentHashSet.fromArray([i], true),cljs.core.map.call(null,new cljs.core.Keyword(null,"closer","closer",3951351020),cljs.core.vals.call(null,new cljs.core.Keyword(null,"families","families",1801311860).cljs$core$IFn$_invoke$arity$1(p))));
});
lt.plugins.subpar.paredit.opens_list_QMARK_ = (function opens_list_QMARK_(p,i){return cljs.core.some.call(null,cljs.core.PersistentHashSet.fromArray([i], true),cljs.core.keys.call(null,new cljs.core.Keyword(null,"families","families",1801311860).cljs$core$IFn$_invoke$arity$1(p)));
});
lt.plugins.subpar.paredit.backward_up_fn = (function backward_up_fn(s,i){var vec__8409 = lt.plugins.subpar.paredit.get_wrapper.call(null,lt.plugins.subpar.paredit.parse.call(null,s),i);var o = cljs.core.nth.call(null,vec__8409,0,null);var c = cljs.core.nth.call(null,vec__8409,1,null);if(cljs.core._EQ_.call(null,-1,o))
{return i;
} else
{return o;
}
});
/**
* returns 0 if nothing should be done (foo |)
* 1 if one character should be deleted
* 2 if a delimiter pair should be deleted and cursor is in pair (|)
* 3 if a delimiter pair should be deleted and cursor is at start |()
* 4 move forward (into a list to delete contents) |(foo)
*/
lt.plugins.subpar.paredit.forward_delete_action = (function forward_delete_action(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var h = (i - 1);var j = (i + 1);var c = cljs.core.nth.call(null,s,i,null);if((i >= cljs.core.count.call(null,s)))
{return 0;
} else
{if(lt.plugins.subpar.paredit.escaped_QMARK_.call(null,s,i))
{return 2;
} else
{if(lt.plugins.subpar.paredit.escaped_QMARK_.call(null,s,j))
{return 3;
} else
{if(cljs.core._EQ_.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [h,i], null),lt.plugins.subpar.paredit.get_wrapper.call(null,p,i)))
{return 2;
} else
{if(cljs.core.truth_(lt.plugins.subpar.paredit.closes_list_QMARK_.call(null,p,i)))
{return 0;
} else
{if(cljs.core._EQ_.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [i,j], null),lt.plugins.subpar.paredit.get_wrapper.call(null,p,j)))
{return 3;
} else
{if(cljs.core.truth_(lt.plugins.subpar.paredit.opens_list_QMARK_.call(null,p,i)))
{return 4;
} else
{if(true)
{return 1;
} else
{return null;
}
}
}
}
}
}
}
}
});
/**
* returns 0 if nothing should be done (| foo)
* 1 if one character should be deleted
* 2 if a delimiter pair should be deleted and cursor is in pair (|)
* 3 if a delimiter pair should be deleted and cursor is at end ()|
* 4 move backward (into a list to delete contents) (foo)|
*/
lt.plugins.subpar.paredit.backward_delete_action = (function backward_delete_action(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var g = (i - 2);var h = (i - 1);if((i <= 0))
{return 0;
} else
{if(lt.plugins.subpar.paredit.escaped_QMARK_.call(null,s,h))
{return 3;
} else
{if(lt.plugins.subpar.paredit.escaped_QMARK_.call(null,s,i))
{return 2;
} else
{if(cljs.core._EQ_.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [g,h], null),lt.plugins.subpar.paredit.get_wrapper.call(null,p,h)))
{return 3;
} else
{if(cljs.core.truth_(lt.plugins.subpar.paredit.closes_list_QMARK_.call(null,p,h)))
{return 4;
} else
{if(cljs.core._EQ_.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [h,i], null),lt.plugins.subpar.paredit.get_wrapper.call(null,p,i)))
{return 2;
} else
{if(cljs.core.truth_(lt.plugins.subpar.paredit.opens_list_QMARK_.call(null,p,h)))
{return 0;
} else
{if(true)
{return 1;
} else
{return null;
}
}
}
}
}
}
}
}
});
/**
* returns 0 if creating a string,
* 1 if escaping a double-quote,
* 2 if ending a string
* 3 if in comment and need a raw double-quote
*/
lt.plugins.subpar.paredit.double_quote_action = (function double_quote_action(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);if((i < 0))
{return 0;
} else
{if((i >= cljs.core.count.call(null,s)))
{return 0;
} else
{if(lt.plugins.subpar.paredit.in_comment_QMARK_.call(null,p,i))
{return 3;
} else
{if(cljs.core.truth_(lt.plugins.subpar.paredit.n_str_QMARK_.call(null,p,i)))
{return 0;
} else
{if(cljs.core._EQ_.call(null,"\"",cljs.core.nth.call(null,s,i)))
{return 2;
} else
{if(new cljs.core.Keyword(null,"escaping","escaping",2855105648))
{return 1;
} else
{return null;
}
}
}
}
}
}
});
/**
* if nowhere to skip to, returns an emtpy vector.
* 
* otherwise it's an vector of
* 0 - whether we need to delete any whitespace
* 1 - where to start deleting from
* 2 - where to delete to
* 3 - the destination for the cursor
*/
lt.plugins.subpar.paredit.close_expression_vals = (function close_expression_vals(p,i){var vec__8411 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,i);var o = cljs.core.nth.call(null,vec__8411,0,null);var c = cljs.core.nth.call(null,vec__8411,1,null);if(cljs.core._EQ_.call(null,-1,o))
{return cljs.core.PersistentVector.EMPTY;
} else
{var start = ((function (){var or__6755__auto__ = cljs.core.last.call(null,lt.plugins.subpar.paredit.get_siblings.call(null,i,cljs.core.vals,cljs.core.identity,p));if(cljs.core.truth_(or__6755__auto__))
{return or__6755__auto__;
} else
{return o;
}
})() + 1);var delete$ = cljs.core.not_EQ_.call(null,start,c);var dest = ((delete$)?(start + 1):(c + 1));return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [delete$,start,c,dest], null);
}
});
/**
* finds the start of the next list/string/vector/map
*/
lt.plugins.subpar.paredit.get_start_of_next_list = (function get_start_of_next_list(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var r = cljs.core.first.call(null,lt.plugins.subpar.paredit.get_siblings.call(null,i,cljs.core.keys,((function (p){
return (function (p1__8412_SHARP_){var and__6743__auto__ = (p1__8412_SHARP_ >= i);if(and__6743__auto__)
{return cljs.core.get_in.call(null,p,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"families","families",1801311860),p1__8412_SHARP_], null));
} else
{return and__6743__auto__;
}
});})(p))
,p));if((r == null))
{return false;
} else
{return r;
}
});
lt.plugins.subpar.paredit.forward_down_fn = (function forward_down_fn(s,i){var r = lt.plugins.subpar.paredit.get_start_of_next_list.call(null,s,i);if(cljs.core.truth_(r))
{return (r + 1);
} else
{return i;
}
});
/**
* returns the index for the cursor position immediately back an
* s-expression or up an s-expression backward. compare to
* paredit-backward. goal: If there are no more S-expressions in this
* one before the opening delimiter, move past that opening delimiter
* backward; otherwise, move move backward past the S-expression
* preceding the point. and if there's nothing left, stay put.
*/
lt.plugins.subpar.paredit.backward_fn = (function backward_fn(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var b = cljs.core.last.call(null,lt.plugins.subpar.paredit.get_siblings.call(null,i,cljs.core.keys,((function (p){
return (function (p1__8413_SHARP_){return (p1__8413_SHARP_ < i);
});})(p))
,p));var o = lt.plugins.subpar.paredit.get_opening_delimiter_index_with_parse.call(null,p,i);var or__6755__auto__ = b;if(cljs.core.truth_(or__6755__auto__))
{return or__6755__auto__;
} else
{if((o < 0))
{return 0;
} else
{return o;
}
}
});
/**
* paredit-backward-down
*/
lt.plugins.subpar.paredit.backward_down_fn = (function backward_down_fn(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var b = cljs.core.last.call(null,lt.plugins.subpar.paredit.get_siblings.call(null,i,cljs.core.vals,((function (p){
return (function (p1__8414_SHARP_){var and__6743__auto__ = (p1__8414_SHARP_ < i);if(and__6743__auto__)
{return lt.plugins.subpar.paredit.closes_list_QMARK_.call(null,p,p1__8414_SHARP_);
} else
{return and__6743__auto__;
}
});})(p))
,p));var or__6755__auto__ = b;if(cljs.core.truth_(or__6755__auto__))
{return or__6755__auto__;
} else
{return i;
}
});
/**
* paredit-forward-up
*/
lt.plugins.subpar.paredit.forward_up_fn = (function forward_up_fn(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var vec__8416 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,i);var o = cljs.core.nth.call(null,vec__8416,0,null);var c = cljs.core.nth.call(null,vec__8416,1,null);var in_list = cljs.core.not_EQ_.call(null,-1,o);if(in_list)
{return (c + 1);
} else
{return i;
}
});
/**
* returns the index for the cursor position immediately forward an
* s-expression or out the end of an s-expression if already at the
* end. compare to paredit-forward. goal: If there are no more
* S-expressions in this one before the closing delimiter, move past
* that closing delimiter forward; otherwise, move move forward past
* the S-expression at the point. and if there's nothing of interest
* before the end of the file, then go to the end.
*/
lt.plugins.subpar.paredit.forward_fn = (function forward_fn(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var b = cljs.core.first.call(null,lt.plugins.subpar.paredit.get_siblings.call(null,i,cljs.core.vals,((function (p){
return (function (p1__8417_SHARP_){return (p1__8417_SHARP_ >= i);
});})(p))
,p));var c = lt.plugins.subpar.paredit.get_closing_delimiter_index_with_parse.call(null,p,i);var l = cljs.core.count.call(null,s);if(cljs.core.truth_(b))
{return (b + 1);
} else
{if(cljs.core.truth_(c))
{var x__7069__auto__ = (c + 1);var y__7070__auto__ = l;return ((x__7069__auto__ < y__7070__auto__) ? x__7069__auto__ : y__7070__auto__);
} else
{if(true)
{return l;
} else
{return null;
}
}
}
});
/**
* returns an vector of
* 0 - the delimiter that needs to move,
* 1 - the source index,
* 2 - the destination index in the orignal string,
* 3 - the number of lines to indent starting from the source index.
* 
* if nothing should be done, the vector returned will have length 0
*/
lt.plugins.subpar.paredit.forward_slurp_vals = (function forward_slurp_vals(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var vec__8420 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,i);var o = cljs.core.nth.call(null,vec__8420,0,null);var c = cljs.core.nth.call(null,vec__8420,1,null);var in_list = cljs.core.not_EQ_.call(null,-1,o);var a = (function (){var and__6743__auto__ = in_list;if(and__6743__auto__)
{return cljs.core.nth.call(null,s,c,false);
} else
{return and__6743__auto__;
}
})();var d = (function (){var and__6743__auto__ = in_list;if(and__6743__auto__)
{return cljs.core.first.call(null,lt.plugins.subpar.paredit.get_siblings.call(null,o,cljs.core.vals,((function (and__6743__auto__,p,vec__8420,o,c,in_list,a){
return (function (p1__8418_SHARP_){return (p1__8418_SHARP_ > c);
});})(and__6743__auto__,p,vec__8420,o,c,in_list,a))
,p));
} else
{return and__6743__auto__;
}
})();if(cljs.core.truth_((function (){var and__6743__auto__ = a;if(cljs.core.truth_(and__6743__auto__))
{var and__6743__auto____$1 = c;if(cljs.core.truth_(and__6743__auto____$1))
{return d;
} else
{return and__6743__auto____$1;
}
} else
{return and__6743__auto__;
}
})()))
{return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [a,c,(d + 1),lt.plugins.subpar.paredit.count_lines.call(null,s,o,(d + 1))], null);
} else
{return cljs.core.PersistentVector.EMPTY;
}
});
/**
* returns an vector of
* 0 - the delimiter that needs to move,
* 1 - the source index,
* 2 - the destination index in the orignal string,
* 3 - the number of lines to indent starting from the source index.
* 
* if nothing should be done, the vector returned will have length 0
*/
lt.plugins.subpar.paredit.backward_slurp_vals = (function backward_slurp_vals(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var vec__8423 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,i);var o = cljs.core.nth.call(null,vec__8423,0,null);var c = cljs.core.nth.call(null,vec__8423,1,null);var in_list = cljs.core.not_EQ_.call(null,-1,o);var d = (function (){var and__6743__auto__ = in_list;if(and__6743__auto__)
{return cljs.core.last.call(null,lt.plugins.subpar.paredit.get_siblings.call(null,o,cljs.core.keys,((function (and__6743__auto__,p,vec__8423,o,c,in_list){
return (function (p1__8421_SHARP_){return (p1__8421_SHARP_ < o);
});})(and__6743__auto__,p,vec__8423,o,c,in_list))
,p));
} else
{return and__6743__auto__;
}
})();var a = (function (){var and__6743__auto__ = in_list;if(and__6743__auto__)
{return cljs.core.nth.call(null,s,o,false);
} else
{return and__6743__auto__;
}
})();if(cljs.core.truth_((function (){var and__6743__auto__ = a;if(cljs.core.truth_(and__6743__auto__))
{return d;
} else
{return and__6743__auto__;
}
})()))
{return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [a,o,d,lt.plugins.subpar.paredit.count_lines.call(null,s,d,c)], null);
} else
{return cljs.core.PersistentVector.EMPTY;
}
});
/**
* if nothing should be done, this returns an empty vector.
* 
* if there is something to barf, this returns an vector of
* 0 - the delimiter that needs to move,
* 1 - the source index,
* 2 - the destination index in the orignal string,
* 3 - whether there needs to be a padding space after the delimiter
* 4 - the number of lines to indent
* 5 - the starting index for the indentation
*/
lt.plugins.subpar.paredit.forward_barf_vals = (function forward_barf_vals(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var vec__8425 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,i);var o = cljs.core.nth.call(null,vec__8425,0,null);var c = cljs.core.nth.call(null,vec__8425,1,null);var in_list = cljs.core.not_EQ_.call(null,-1,o);var endings = (function (){var and__6743__auto__ = in_list;if(and__6743__auto__)
{return lt.plugins.subpar.paredit.get_siblings.call(null,i,cljs.core.vals,cljs.core.constantly.call(null,true),p);
} else
{return and__6743__auto__;
}
})();var a = (function (){var and__6743__auto__ = c;if(cljs.core.truth_(and__6743__auto__))
{var and__6743__auto____$1 = in_list;if(and__6743__auto____$1)
{return cljs.core.nth.call(null,s,c,null);
} else
{return and__6743__auto____$1;
}
} else
{return and__6743__auto__;
}
})();var r = (function (){var or__6755__auto__ = lt.plugins.subpar.paredit.count_lines.call(null,s,o,c);if(cljs.core.truth_(or__6755__auto__))
{return or__6755__auto__;
} else
{return 1;
}
})();var num = (cljs.core.truth_(endings)?cljs.core.count.call(null,endings):0);if((num > 1))
{return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [a,c,(cljs.core.nth.call(null,endings,(num - 2)) + 1),false,r,o], null);
} else
{if(cljs.core._EQ_.call(null,num,1))
{return new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [a,c,(o + 1),true,r,o], null);
} else
{if(true)
{return cljs.core.PersistentVector.EMPTY;
} else
{return null;
}
}
}
});
/**
* if nothing should be done this returns an empty vector.
* 
* if there is something to barf, this returns an vector of
* 0 - the delimiter that needs to move,
* 1 - the source index,
* 2 - the destination index in the orignal string,
* 3 - whether there needs to be a padding space before the delimiter
* 4 - the number of lines to indent
*/
lt.plugins.subpar.paredit.backward_barf_vals = (function backward_barf_vals(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var vec__8427 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,i);var o = cljs.core.nth.call(null,vec__8427,0,null);var c = cljs.core.nth.call(null,vec__8427,1,null);var in_list = cljs.core.not_EQ_.call(null,-1,o);var starts = (function (){var and__6743__auto__ = in_list;if(and__6743__auto__)
{return lt.plugins.subpar.paredit.get_siblings.call(null,i,cljs.core.keys,cljs.core.constantly.call(null,true),p);
} else
{return and__6743__auto__;
}
})();var a = (function (){var and__6743__auto__ = o;if(cljs.core.truth_(and__6743__auto__))
{var and__6743__auto____$1 = in_list;if(and__6743__auto____$1)
{return cljs.core.nth.call(null,s,o,null);
} else
{return and__6743__auto____$1;
}
} else
{return and__6743__auto__;
}
})();var r = (function (){var or__6755__auto__ = lt.plugins.subpar.paredit.count_lines.call(null,s,o,c);if(cljs.core.truth_(or__6755__auto__))
{return or__6755__auto__;
} else
{return 1;
}
})();var num = (cljs.core.truth_(starts)?cljs.core.count.call(null,starts):0);if((num > 1))
{return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [a,o,cljs.core.second.call(null,starts),false,r], null);
} else
{if(cljs.core._EQ_.call(null,num,1))
{return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [a,o,c,true,r], null);
} else
{if(true)
{return cljs.core.PersistentVector.EMPTY;
} else
{return null;
}
}
}
});
/**
* if nothing should be done this returns an empty vector.
* 
* if there is something to splice, this returns an vector of
* 0 - the opening delimiter of the current list
* 1 - the closing delimiter of the current list
* 2 - the index to start re-indenting from
* 3 - how many lines to re-indent
*/
lt.plugins.subpar.paredit.splice_vals = (function splice_vals(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var vec__8430 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,i);var o = cljs.core.nth.call(null,vec__8430,0,null);var c = cljs.core.nth.call(null,vec__8430,1,null);var in_list = cljs.core.not_EQ_.call(null,-1,o);if(in_list)
{var vec__8431 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,o);var n = cljs.core.nth.call(null,vec__8431,0,null);var d = cljs.core.nth.call(null,vec__8431,1,null);var r = lt.plugins.subpar.paredit.count_lines.call(null,s,n,d);return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,c,(function (){var x__7062__auto__ = 0;var y__7063__auto__ = n;return ((x__7062__auto__ > y__7063__auto__) ? x__7062__auto__ : y__7063__auto__);
})(),r], null);
} else
{return cljs.core.PersistentVector.EMPTY;
}
});
/**
* if nothing should be done this returns an empty vector.
* 
* if there is something to splice, this returns an vector of
* 0 - the opening delimiter of the current list (start killing from here)
* 1 - the index to kill to
* 2 - the original index of the closing delimiter to delete as well (delete this guy first)
* 3 - the index to start re-indenting from
* 4 - how many lines to re-indent
*/
lt.plugins.subpar.paredit.splice_delete_backward_vals = (function splice_delete_backward_vals(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var vec__8434 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,i);var o = cljs.core.nth.call(null,vec__8434,0,null);var c = cljs.core.nth.call(null,vec__8434,1,null);var in_list = cljs.core.not_EQ_.call(null,-1,o);if(in_list)
{var vec__8435 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,o);var n = cljs.core.nth.call(null,vec__8435,0,null);var d = cljs.core.nth.call(null,vec__8435,1,null);var r = lt.plugins.subpar.paredit.count_lines.call(null,s,n,d);return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,(function (){var x__7062__auto__ = o;var y__7063__auto__ = i;return ((x__7062__auto__ > y__7063__auto__) ? x__7062__auto__ : y__7063__auto__);
})(),c,(function (){var x__7062__auto__ = 0;var y__7063__auto__ = n;return ((x__7062__auto__ > y__7063__auto__) ? x__7062__auto__ : y__7063__auto__);
})(),r], null);
} else
{return cljs.core.PersistentVector.EMPTY;
}
});
/**
* if nothing should be done this returns an empty vector.
* 
* if there is something to splice, this returns an vector of
* 0 - the opening delimiter of the current list
* 1 - the index to kill from
* 2 - the original index of the closing delimiter to kill to
* 3 - the index to start re-indenting from
* 4 - how many lines to re-indent
*/
lt.plugins.subpar.paredit.splice_delete_forward_vals = (function splice_delete_forward_vals(s,i){var p = lt.plugins.subpar.paredit.parse.call(null,s);var vec__8438 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,i);var o = cljs.core.nth.call(null,vec__8438,0,null);var c = cljs.core.nth.call(null,vec__8438,1,null);var in_list = cljs.core.not_EQ_.call(null,-1,o);if(in_list)
{var vec__8439 = lt.plugins.subpar.paredit.get_wrapper.call(null,p,o);var n = cljs.core.nth.call(null,vec__8439,0,null);var d = cljs.core.nth.call(null,vec__8439,1,null);var r = lt.plugins.subpar.paredit.count_lines.call(null,s,n,d);return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,i,(c + 1),(function (){var x__7062__auto__ = 0;var y__7063__auto__ = n;return ((x__7062__auto__ > y__7063__auto__) ? x__7062__auto__ : y__7063__auto__);
})(),r], null);
} else
{return cljs.core.PersistentVector.EMPTY;
}
});
/**
* annotates each index in s. assumes/requires all delimiters that are
* not in comments or strings to be paired and properly nested vs ([)].
* 
* returns {:chars [[mode, poi] ... ]
* :families {opener-index {:closer i
* :children {start-index end-index}}}}
* 
* where :chars has one extra element past the end of the string and
* there's a virtual wrapping parent delimiter pair at -1,length
*/
lt.plugins.subpar.paredit.parse = (function parse(ss){var s = [cljs.core.str(ss),cljs.core.str(" ")].join('');var i = 0;var mode = lt.plugins.subpar.paredit.code;var openings = cljs.core._conj.call(null,cljs.core.List.EMPTY,-1);var start = -1;var t = cljs.core.PersistentVector.EMPTY;var families = new cljs.core.PersistentArrayMap(null, 1, [-1,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"children","children",2673430897),cljs.core.PersistentArrayMap.EMPTY], null)], null);var escaping = false;var in_word = false;while(true){
var a = cljs.core.nth.call(null,s,i,null);var j = (i + 1);var o = cljs.core.peek.call(null,openings);if(((a == null)) && (in_word))
{return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"chars","chars",1108527951),t,new cljs.core.Keyword(null,"families","families",1801311860),cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [-1,new cljs.core.Keyword(null,"closer","closer",3951351020)], null),(i - 1)),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [-1,new cljs.core.Keyword(null,"children","children",2673430897),start], null),(i - 1))], null);
} else
{if((a == null))
{return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"chars","chars",1108527951),t,new cljs.core.Keyword(null,"families","families",1801311860),cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [-1,new cljs.core.Keyword(null,"closer","closer",3951351020)], null),(i - 1))], null);
} else
{if((cljs.core.not_EQ_.call(null,lt.plugins.subpar.paredit.cmmnt,mode)) && (cljs.core._EQ_.call(null,"\\",a)) && (!(escaping)) && (!(in_word)))
{{
var G__8442 = j;
var G__8443 = mode;
var G__8444 = openings;
var G__8445 = i;
var G__8446 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8447 = cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"children","children",2673430897),i], null),j);
var G__8448 = true;
var G__8449 = true;
i = G__8442;
mode = G__8443;
openings = G__8444;
start = G__8445;
t = G__8446;
families = G__8447;
escaping = G__8448;
in_word = G__8449;
continue;
}
} else
{if((cljs.core.not_EQ_.call(null,lt.plugins.subpar.paredit.cmmnt,mode)) && (cljs.core._EQ_.call(null,"\\",a)) && (!(escaping)))
{{
var G__8450 = j;
var G__8451 = mode;
var G__8452 = openings;
var G__8453 = i;
var G__8454 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8455 = families;
var G__8456 = true;
var G__8457 = true;
i = G__8450;
mode = G__8451;
openings = G__8452;
start = G__8453;
t = G__8454;
families = G__8455;
escaping = G__8456;
in_word = G__8457;
continue;
}
} else
{if((cljs.core._EQ_.call(null,lt.plugins.subpar.paredit.code,mode)) && (cljs.core._EQ_.call(null,";",a)) && (!(escaping)))
{{
var G__8458 = j;
var G__8459 = lt.plugins.subpar.paredit.cmmnt;
var G__8460 = openings;
var G__8461 = start;
var G__8462 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8463 = families;
var G__8464 = false;
var G__8465 = false;
i = G__8458;
mode = G__8459;
openings = G__8460;
start = G__8461;
t = G__8462;
families = G__8463;
escaping = G__8464;
in_word = G__8465;
continue;
}
} else
{if((cljs.core._EQ_.call(null,lt.plugins.subpar.paredit.cmmnt,mode)) && (cljs.core._EQ_.call(null,"\n",a)))
{{
var G__8466 = j;
var G__8467 = lt.plugins.subpar.paredit.code;
var G__8468 = openings;
var G__8469 = start;
var G__8470 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8471 = families;
var G__8472 = false;
var G__8473 = false;
i = G__8466;
mode = G__8467;
openings = G__8468;
start = G__8469;
t = G__8470;
families = G__8471;
escaping = G__8472;
in_word = G__8473;
continue;
}
} else
{if(cljs.core._EQ_.call(null,lt.plugins.subpar.paredit.cmmnt,mode))
{{
var G__8474 = j;
var G__8475 = lt.plugins.subpar.paredit.cmmnt;
var G__8476 = openings;
var G__8477 = start;
var G__8478 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8479 = families;
var G__8480 = false;
var G__8481 = false;
i = G__8474;
mode = G__8475;
openings = G__8476;
start = G__8477;
t = G__8478;
families = G__8479;
escaping = G__8480;
in_word = G__8481;
continue;
}
} else
{if((cljs.core._EQ_.call(null,lt.plugins.subpar.paredit.code,mode)) && (cljs.core._EQ_.call(null,"\"",a)) && (!(escaping)))
{{
var G__8482 = j;
var G__8483 = lt.plugins.subpar.paredit.string;
var G__8484 = cljs.core.conj.call(null,openings,i);
var G__8485 = -1;
var G__8486 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8487 = cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [i,new cljs.core.Keyword(null,"children","children",2673430897)], null),cljs.core.PersistentArrayMap.EMPTY),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"children","children",2673430897),i], null),j);
var G__8488 = false;
var G__8489 = false;
i = G__8482;
mode = G__8483;
openings = G__8484;
start = G__8485;
t = G__8486;
families = G__8487;
escaping = G__8488;
in_word = G__8489;
continue;
}
} else
{if((cljs.core._EQ_.call(null,lt.plugins.subpar.paredit.string,mode)) && (cljs.core._EQ_.call(null,"\"",a)) && (!(escaping)) && (in_word))
{{
var G__8490 = j;
var G__8491 = lt.plugins.subpar.paredit.code;
var G__8492 = cljs.core.pop.call(null,openings);
var G__8493 = -1;
var G__8494 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8495 = cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"closer","closer",3951351020)], null),i),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.second.call(null,openings),new cljs.core.Keyword(null,"children","children",2673430897),o], null),i),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"children","children",2673430897),start], null),(i - 1));
var G__8496 = false;
var G__8497 = false;
i = G__8490;
mode = G__8491;
openings = G__8492;
start = G__8493;
t = G__8494;
families = G__8495;
escaping = G__8496;
in_word = G__8497;
continue;
}
} else
{if((cljs.core._EQ_.call(null,lt.plugins.subpar.paredit.string,mode)) && (cljs.core._EQ_.call(null,"\"",a)) && (!(escaping)))
{{
var G__8498 = j;
var G__8499 = lt.plugins.subpar.paredit.code;
var G__8500 = cljs.core.pop.call(null,openings);
var G__8501 = -1;
var G__8502 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8503 = cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"closer","closer",3951351020)], null),i),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.second.call(null,openings),new cljs.core.Keyword(null,"children","children",2673430897),o], null),i);
var G__8504 = false;
var G__8505 = false;
i = G__8498;
mode = G__8499;
openings = G__8500;
start = G__8501;
t = G__8502;
families = G__8503;
escaping = G__8504;
in_word = G__8505;
continue;
}
} else
{if((cljs.core._EQ_.call(null,lt.plugins.subpar.paredit.string,mode)) && (!(lt.plugins.subpar.paredit.whitespace_QMARK_.call(null,a))) && (!(in_word)))
{{
var G__8506 = j;
var G__8507 = lt.plugins.subpar.paredit.string;
var G__8508 = openings;
var G__8509 = i;
var G__8510 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8511 = cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"children","children",2673430897),i], null),i);
var G__8512 = false;
var G__8513 = true;
i = G__8506;
mode = G__8507;
openings = G__8508;
start = G__8509;
t = G__8510;
families = G__8511;
escaping = G__8512;
in_word = G__8513;
continue;
}
} else
{if((cljs.core._EQ_.call(null,lt.plugins.subpar.paredit.string,mode)) && (lt.plugins.subpar.paredit.whitespace_QMARK_.call(null,a)) && (in_word))
{{
var G__8514 = j;
var G__8515 = lt.plugins.subpar.paredit.string;
var G__8516 = openings;
var G__8517 = -1;
var G__8518 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8519 = cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"children","children",2673430897),start], null),(i - 1));
var G__8520 = false;
var G__8521 = false;
i = G__8514;
mode = G__8515;
openings = G__8516;
start = G__8517;
t = G__8518;
families = G__8519;
escaping = G__8520;
in_word = G__8521;
continue;
}
} else
{if(cljs.core._EQ_.call(null,lt.plugins.subpar.paredit.string,mode))
{{
var G__8522 = j;
var G__8523 = lt.plugins.subpar.paredit.string;
var G__8524 = openings;
var G__8525 = start;
var G__8526 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8527 = families;
var G__8528 = false;
var G__8529 = in_word;
i = G__8522;
mode = G__8523;
openings = G__8524;
start = G__8525;
t = G__8526;
families = G__8527;
escaping = G__8528;
in_word = G__8529;
continue;
}
} else
{if((lt.plugins.subpar.paredit.opener_QMARK_.call(null,a)) && (in_word))
{{
var G__8530 = j;
var G__8531 = lt.plugins.subpar.paredit.code;
var G__8532 = cljs.core.conj.call(null,openings,i);
var G__8533 = -1;
var G__8534 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8535 = cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"children","children",2673430897),start], null),(i - 1)),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"children","children",2673430897),i], null),i),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [i,new cljs.core.Keyword(null,"children","children",2673430897)], null),cljs.core.PersistentArrayMap.EMPTY);
var G__8536 = false;
var G__8537 = false;
i = G__8530;
mode = G__8531;
openings = G__8532;
start = G__8533;
t = G__8534;
families = G__8535;
escaping = G__8536;
in_word = G__8537;
continue;
}
} else
{if(lt.plugins.subpar.paredit.opener_QMARK_.call(null,a))
{{
var G__8538 = j;
var G__8539 = lt.plugins.subpar.paredit.code;
var G__8540 = cljs.core.conj.call(null,openings,i);
var G__8541 = -1;
var G__8542 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8543 = cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"children","children",2673430897),i], null),i),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [i,new cljs.core.Keyword(null,"children","children",2673430897)], null),cljs.core.PersistentArrayMap.EMPTY);
var G__8544 = false;
var G__8545 = false;
i = G__8538;
mode = G__8539;
openings = G__8540;
start = G__8541;
t = G__8542;
families = G__8543;
escaping = G__8544;
in_word = G__8545;
continue;
}
} else
{if((lt.plugins.subpar.paredit.closer_QMARK_.call(null,a)) && (in_word))
{{
var G__8546 = j;
var G__8547 = lt.plugins.subpar.paredit.code;
var G__8548 = cljs.core.pop.call(null,openings);
var G__8549 = -1;
var G__8550 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8551 = cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"children","children",2673430897),start], null),(i - 1)),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"closer","closer",3951351020)], null),i),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.second.call(null,openings),new cljs.core.Keyword(null,"children","children",2673430897),o], null),i);
var G__8552 = false;
var G__8553 = false;
i = G__8546;
mode = G__8547;
openings = G__8548;
start = G__8549;
t = G__8550;
families = G__8551;
escaping = G__8552;
in_word = G__8553;
continue;
}
} else
{if(lt.plugins.subpar.paredit.closer_QMARK_.call(null,a))
{{
var G__8554 = j;
var G__8555 = lt.plugins.subpar.paredit.code;
var G__8556 = cljs.core.pop.call(null,openings);
var G__8557 = -1;
var G__8558 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8559 = cljs.core.assoc_in.call(null,cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"closer","closer",3951351020)], null),i),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.second.call(null,openings),new cljs.core.Keyword(null,"children","children",2673430897),o], null),i);
var G__8560 = false;
var G__8561 = false;
i = G__8554;
mode = G__8555;
openings = G__8556;
start = G__8557;
t = G__8558;
families = G__8559;
escaping = G__8560;
in_word = G__8561;
continue;
}
} else
{if((!(lt.plugins.subpar.paredit.whitespace_QMARK_.call(null,a))) && (!(in_word)))
{{
var G__8562 = j;
var G__8563 = lt.plugins.subpar.paredit.code;
var G__8564 = openings;
var G__8565 = i;
var G__8566 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8567 = cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"children","children",2673430897),i], null),i);
var G__8568 = false;
var G__8569 = true;
i = G__8562;
mode = G__8563;
openings = G__8564;
start = G__8565;
t = G__8566;
families = G__8567;
escaping = G__8568;
in_word = G__8569;
continue;
}
} else
{if((lt.plugins.subpar.paredit.whitespace_QMARK_.call(null,a)) && (in_word))
{{
var G__8570 = j;
var G__8571 = lt.plugins.subpar.paredit.code;
var G__8572 = openings;
var G__8573 = -1;
var G__8574 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8575 = cljs.core.assoc_in.call(null,families,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [o,new cljs.core.Keyword(null,"children","children",2673430897),start], null),(i - 1));
var G__8576 = false;
var G__8577 = false;
i = G__8570;
mode = G__8571;
openings = G__8572;
start = G__8573;
t = G__8574;
families = G__8575;
escaping = G__8576;
in_word = G__8577;
continue;
}
} else
{if((lt.plugins.subpar.paredit.whitespace_QMARK_.call(null,a)) && (!(in_word)))
{{
var G__8578 = j;
var G__8579 = lt.plugins.subpar.paredit.code;
var G__8580 = openings;
var G__8581 = -1;
var G__8582 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8583 = families;
var G__8584 = false;
var G__8585 = false;
i = G__8578;
mode = G__8579;
openings = G__8580;
start = G__8581;
t = G__8582;
families = G__8583;
escaping = G__8584;
in_word = G__8585;
continue;
}
} else
{if((!(lt.plugins.subpar.paredit.whitespace_QMARK_.call(null,a))) && (in_word))
{{
var G__8586 = j;
var G__8587 = lt.plugins.subpar.paredit.code;
var G__8588 = openings;
var G__8589 = start;
var G__8590 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [mode,o], null));
var G__8591 = families;
var G__8592 = false;
var G__8593 = true;
i = G__8586;
mode = G__8587;
openings = G__8588;
start = G__8589;
t = G__8590;
families = G__8591;
escaping = G__8592;
in_word = G__8593;
continue;
}
} else
{if(new cljs.core.Keyword(null,"default","default",2558708147))
{{
var G__8594 = j;
var G__8595 = lt.plugins.subpar.paredit.code;
var G__8596 = openings;
var G__8597 = start;
var G__8598 = cljs.core.conj.call(null,t,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["?",o], null));
var G__8599 = families;
var G__8600 = escaping;
var G__8601 = in_word;
i = G__8594;
mode = G__8595;
openings = G__8596;
start = G__8597;
t = G__8598;
families = G__8599;
escaping = G__8600;
in_word = G__8601;
continue;
}
} else
{return null;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
break;
}
});
}
if(!lt.util.load.provided_QMARK_('lt.plugins.subpar')) {
goog.provide('lt.plugins.subpar');
goog.require('cljs.core');
goog.require('lt.plugins.subpar.paredit');
goog.require('lt.objs.command');
goog.require('lt.objs.command');
goog.require('lt.objs.editor');
goog.require('lt.objs.editor');
goog.require('lt.objs.editor.pool');
goog.require('lt.objs.editor.pool');
goog.require('lt.plugins.subpar.paredit');
lt.plugins.subpar.get_index = (function get_index(cm){return cm.indexFromPos(cm.getCursor());
});
/**
* moves the point from i to j as long as they're different
*/
lt.plugins.subpar.go_to_index = (function go_to_index(cm,i,j){if(cljs.core.not_EQ_.call(null,i,j))
{return cm.setCursor(cm.posFromIndex(j));
} else
{return null;
}
});
lt.plugins.subpar.nothing_selected_QMARK_ = (function nothing_selected_QMARK_(cm){return cljs.core._EQ_.call(null,"",cm.getSelection());
});
lt.plugins.subpar.get_info = (function get_info(cm){return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cm.getCursor(),lt.plugins.subpar.get_index.call(null,cm),cm.getValue()], null);
});
lt.plugins.subpar.open_expression = (function open_expression(cm,pair){var vec__8125 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8125,0,null);var i = cljs.core.nth.call(null,vec__8125,1,null);var s = cljs.core.nth.call(null,vec__8125,2,null);if(lt.plugins.subpar.paredit.in_string.call(null,s,i))
{cm.replaceRange(cljs.core.nth.call(null,pair,0),cur);
return cm.setCursor(cur.line,(cur.ch + 1));
} else
{return cm.operation((function (){cm.replaceRange(pair,cur);
cm.setCursor(cur.line,(cur.ch + 1));
return cm.indentLine(cur.line);
}));
}
});
goog.exportSymbol('lt.plugins.subpar.open_expression', lt.plugins.subpar.open_expression);
lt.plugins.subpar.forward_delete = (function forward_delete(cm){if(lt.plugins.subpar.nothing_selected_QMARK_.call(null,cm))
{var vec__8130 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8130,0,null);var i = cljs.core.nth.call(null,vec__8130,1,null);var s = cljs.core.nth.call(null,vec__8130,2,null);var act = lt.plugins.subpar.paredit.forward_delete_action.call(null,s,i);var s1 = cm.posFromIndex(i);var e1 = cm.posFromIndex((i + 1));var s2 = cm.posFromIndex((i - 1));var e2 = e1;var s3 = s1;var e3 = cm.posFromIndex((i + 2));var pred__8131 = cljs.core._EQ_;var expr__8132 = act;if(cljs.core.truth_(pred__8131.call(null,1,expr__8132)))
{return cm.replaceRange("",s1,e1);
} else
{if(cljs.core.truth_(pred__8131.call(null,2,expr__8132)))
{return cm.replaceRange("",s2,e2);
} else
{if(cljs.core.truth_(pred__8131.call(null,3,expr__8132)))
{return cm.replaceRange("",s3,e3);
} else
{if(cljs.core.truth_(pred__8131.call(null,4,expr__8132)))
{return cm.setCursor(e1);
} else
{throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__8132)].join('')));
}
}
}
}
} else
{return cm.replaceSelection("");
}
});
goog.exportSymbol('lt.plugins.subpar.forward_delete', lt.plugins.subpar.forward_delete);
lt.plugins.subpar.backward_delete = (function backward_delete(cm){if(lt.plugins.subpar.nothing_selected_QMARK_.call(null,cm))
{var vec__8138 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8138,0,null);var i = cljs.core.nth.call(null,vec__8138,1,null);var s = cljs.core.nth.call(null,vec__8138,2,null);var act = lt.plugins.subpar.paredit.backward_delete_action.call(null,s,i);var s1 = cm.posFromIndex((i - 1));var e1 = cm.posFromIndex(i);var s2 = s1;var e2 = cm.posFromIndex((i + 1));var s3 = cm.posFromIndex((i - 2));var e3 = e1;var pred__8139 = cljs.core._EQ_;var expr__8140 = act;if(cljs.core.truth_(pred__8139.call(null,1,expr__8140)))
{return cm.replaceRange("",s1,e1);
} else
{if(cljs.core.truth_(pred__8139.call(null,2,expr__8140)))
{return cm.replaceRange("",s2,e2);
} else
{if(cljs.core.truth_(pred__8139.call(null,3,expr__8140)))
{return cm.replaceRange("",s3,e3);
} else
{if(cljs.core.truth_(pred__8139.call(null,4,expr__8140)))
{return cm.setCursor(s1);
} else
{throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__8140)].join('')));
}
}
}
}
} else
{return cm.replaceSelection("");
}
});
goog.exportSymbol('lt.plugins.subpar.backward_delete', lt.plugins.subpar.backward_delete);
lt.plugins.subpar.double_quote = (function double_quote(cm){var vec__8146 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8146,0,null);var i = cljs.core.nth.call(null,vec__8146,1,null);var s = cljs.core.nth.call(null,vec__8146,2,null);var act = lt.plugins.subpar.paredit.double_quote_action.call(null,s,i);var pred__8147 = cljs.core._EQ_;var expr__8148 = act;if(cljs.core.truth_(pred__8147.call(null,0,expr__8148)))
{return lt.plugins.subpar.open_expression.call(null,cm,"\"\"");
} else
{if(cljs.core.truth_(pred__8147.call(null,1,expr__8148)))
{return cm.replaceRange("\\\"",cur);
} else
{if(cljs.core.truth_(pred__8147.call(null,2,expr__8148)))
{return lt.plugins.subpar.go_to_index.call(null,cm,i,(i + 1));
} else
{if(cljs.core.truth_(pred__8147.call(null,3,expr__8148)))
{return cm.replaceRange("\"",cur);
} else
{throw (new Error([cljs.core.str("No matching clause: "),cljs.core.str(expr__8148)].join('')));
}
}
}
}
});
goog.exportSymbol('lt.plugins.subpar.double_quote', lt.plugins.subpar.double_quote);
lt.plugins.subpar.close_expression = (function close_expression(cm,c){var vec__8152 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8152,0,null);var i = cljs.core.nth.call(null,vec__8152,1,null);var s = cljs.core.nth.call(null,vec__8152,2,null);var p = lt.plugins.subpar.paredit.parse.call(null,s);if(lt.plugins.subpar.paredit.in_string_QMARK_.call(null,p,i))
{cm.replaceRange(c,cur);
return cm.setCursor(cur.line,(cur.ch + 1));
} else
{var vec__8153 = lt.plugins.subpar.paredit.close_expression_vals.call(null,p,i);var del = cljs.core.nth.call(null,vec__8153,0,null);var beg = cljs.core.nth.call(null,vec__8153,1,null);var end = cljs.core.nth.call(null,vec__8153,2,null);var dst = cljs.core.nth.call(null,vec__8153,3,null);if(cljs.core.truth_(dst))
{if(cljs.core.truth_(del))
{cm.replaceRange("",cm.posFromIndex(beg),cm.posFromIndex(end));
} else
{}
return lt.plugins.subpar.go_to_index.call(null,cm,i,dst);
} else
{return null;
}
}
});
goog.exportSymbol('lt.plugins.subpar.close_expression', lt.plugins.subpar.close_expression);
lt.plugins.subpar.go = (function go(cm,f){var vec__8155 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8155,0,null);var i = cljs.core.nth.call(null,vec__8155,1,null);var s = cljs.core.nth.call(null,vec__8155,2,null);var j = f.call(null,s,i);return lt.plugins.subpar.go_to_index.call(null,cm,i,j);
});
lt.plugins.subpar.backward_up = (function backward_up(cm){return lt.plugins.subpar.go.call(null,cm,lt.plugins.subpar.paredit.backward_up_fn);
});
goog.exportSymbol('lt.plugins.subpar.backward_up', lt.plugins.subpar.backward_up);
lt.plugins.subpar.forward_down = (function forward_down(cm){return lt.plugins.subpar.go.call(null,cm,lt.plugins.subpar.paredit.forward_down_fn);
});
goog.exportSymbol('lt.plugins.subpar.forward_down', lt.plugins.subpar.forward_down);
lt.plugins.subpar.backward = (function backward(cm){return lt.plugins.subpar.go.call(null,cm,lt.plugins.subpar.paredit.backward_fn);
});
goog.exportSymbol('lt.plugins.subpar.backward', lt.plugins.subpar.backward);
lt.plugins.subpar.forward = (function forward(cm){return lt.plugins.subpar.go.call(null,cm,lt.plugins.subpar.paredit.forward_fn);
});
goog.exportSymbol('lt.plugins.subpar.forward', lt.plugins.subpar.forward);
lt.plugins.subpar.backward_down = (function backward_down(cm){return lt.plugins.subpar.go.call(null,cm,lt.plugins.subpar.paredit.backward_down_fn);
});
goog.exportSymbol('lt.plugins.subpar.backward_down', lt.plugins.subpar.backward_down);
lt.plugins.subpar.forward_up = (function forward_up(cm){return lt.plugins.subpar.go.call(null,cm,lt.plugins.subpar.paredit.forward_up_fn);
});
goog.exportSymbol('lt.plugins.subpar.forward_up', lt.plugins.subpar.forward_up);
lt.plugins.subpar.forward_slurp = (function forward_slurp(cm){var vec__8159 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8159,0,null);var i = cljs.core.nth.call(null,vec__8159,1,null);var s = cljs.core.nth.call(null,vec__8159,2,null);var vec__8160 = lt.plugins.subpar.paredit.forward_slurp_vals.call(null,s,i);var delimiter = cljs.core.nth.call(null,vec__8160,0,null);var si = cljs.core.nth.call(null,vec__8160,1,null);var di = cljs.core.nth.call(null,vec__8160,2,null);var ri = cljs.core.nth.call(null,vec__8160,3,null);if(cljs.core.truth_(ri))
{var start = cm.posFromIndex(si);var end = cm.posFromIndex((si + 1));var destination = cm.posFromIndex(di);var line = start.line;var update = ((function (start,end,destination,line){
return (function (){cm.replaceRange(delimiter,destination);
cm.replaceRange("",start,end);
return cljs.core.map.call(null,((function (start,end,destination,line){
return (function (p1__8156_SHARP_){return cm.indentLine(p1__8156_SHARP_);
});})(start,end,destination,line))
,cljs.core.range.call(null,line,(line + ri)));
});})(start,end,destination,line))
;return cm.operation(update);
} else
{return null;
}
});
goog.exportSymbol('lt.plugins.subpar.forward_slurp', lt.plugins.subpar.forward_slurp);
lt.plugins.subpar.backward_slurp = (function backward_slurp(cm){var vec__8164 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8164,0,null);var i = cljs.core.nth.call(null,vec__8164,1,null);var s = cljs.core.nth.call(null,vec__8164,2,null);var vec__8165 = lt.plugins.subpar.paredit.backward_slurp_vals.call(null,s,i);var delimiter = cljs.core.nth.call(null,vec__8165,0,null);var si = cljs.core.nth.call(null,vec__8165,1,null);var di = cljs.core.nth.call(null,vec__8165,2,null);var ri = cljs.core.nth.call(null,vec__8165,3,null);if(cljs.core.truth_(ri))
{var start = cm.posFromIndex(si);var end = cm.posFromIndex((si + 1));var destination = cm.posFromIndex(di);var line = start.line;var update = ((function (start,end,destination,line){
return (function (){cm.replaceRange("",start,end);
cm.replaceRange(delimiter,destination);
return cljs.core.map.call(null,((function (start,end,destination,line){
return (function (p1__8161_SHARP_){return cm.indentLine(p1__8161_SHARP_);
});})(start,end,destination,line))
,cljs.core.range.call(null,line,(line + ri)));
});})(start,end,destination,line))
;return cm.operation(update);
} else
{return null;
}
});
goog.exportSymbol('lt.plugins.subpar.backward_slurp', lt.plugins.subpar.backward_slurp);
lt.plugins.subpar.backward_barf = (function backward_barf(cm){var vec__8169 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8169,0,null);var i = cljs.core.nth.call(null,vec__8169,1,null);var s = cljs.core.nth.call(null,vec__8169,2,null);var vec__8170 = lt.plugins.subpar.paredit.backward_barf_vals.call(null,s,i);var delimiter = cljs.core.nth.call(null,vec__8170,0,null);var si = cljs.core.nth.call(null,vec__8170,1,null);var di = cljs.core.nth.call(null,vec__8170,2,null);var pad = cljs.core.nth.call(null,vec__8170,3,null);var ri = cljs.core.nth.call(null,vec__8170,4,null);if(cljs.core.truth_(ri))
{var delimiter__$1 = (cljs.core.truth_(pad)?[cljs.core.str(" "),cljs.core.str(delimiter)].join(''):delimiter);var destination = cm.posFromIndex(di);var start = cm.posFromIndex(si);var end = cm.posFromIndex((si + 1));var line = start.line;var update = ((function (delimiter__$1,destination,start,end,line){
return (function (){cm.replaceRange(delimiter__$1,destination);
cm.replaceRange("",start,end);
return cljs.core.map.call(null,((function (delimiter__$1,destination,start,end,line){
return (function (p1__8166_SHARP_){return cm.indentLine(p1__8166_SHARP_);
});})(delimiter__$1,destination,start,end,line))
,cljs.core.range.call(null,line,(line + ri)));
});})(delimiter__$1,destination,start,end,line))
;return cm.operation(update);
} else
{return null;
}
});
goog.exportSymbol('lt.plugins.subpar.backward_barf', lt.plugins.subpar.backward_barf);
lt.plugins.subpar.forward_barf = (function forward_barf(cm){var vec__8174 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8174,0,null);var i = cljs.core.nth.call(null,vec__8174,1,null);var s = cljs.core.nth.call(null,vec__8174,2,null);var vec__8175 = lt.plugins.subpar.paredit.forward_barf_vals.call(null,s,i);var delimiter = cljs.core.nth.call(null,vec__8175,0,null);var si = cljs.core.nth.call(null,vec__8175,1,null);var di = cljs.core.nth.call(null,vec__8175,2,null);var pad = cljs.core.nth.call(null,vec__8175,3,null);var ri = cljs.core.nth.call(null,vec__8175,4,null);var i0 = cljs.core.nth.call(null,vec__8175,5,null);if(cljs.core.truth_(ri))
{var delimiter__$1 = (cljs.core.truth_(pad)?[cljs.core.str(" "),cljs.core.str(delimiter)].join(''):delimiter);var destination = cm.posFromIndex(di);var start = cm.posFromIndex(si);var end = cm.posFromIndex((si + 1));var line = cm.posFromIndex(i0).line;var update = ((function (delimiter__$1,destination,start,end,line){
return (function (){cm.replaceRange("",start,end);
cm.replaceRange(delimiter__$1,destination);
return cljs.core.map.call(null,((function (delimiter__$1,destination,start,end,line){
return (function (p1__8171_SHARP_){return cm.indentLine(p1__8171_SHARP_);
});})(delimiter__$1,destination,start,end,line))
,cljs.core.range.call(null,line,(line + ri)));
});})(delimiter__$1,destination,start,end,line))
;return cm.operation(update);
} else
{return null;
}
});
goog.exportSymbol('lt.plugins.subpar.forward_barf', lt.plugins.subpar.forward_barf);
lt.plugins.subpar.splice_delete_backward = (function splice_delete_backward(cm){var vec__8179 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8179,0,null);var i = cljs.core.nth.call(null,vec__8179,1,null);var s = cljs.core.nth.call(null,vec__8179,2,null);var vec__8180 = lt.plugins.subpar.paredit.splice_delete_backward_vals.call(null,s,i);var start = cljs.core.nth.call(null,vec__8180,0,null);var end = cljs.core.nth.call(null,vec__8180,1,null);var closer = cljs.core.nth.call(null,vec__8180,2,null);var reindent = cljs.core.nth.call(null,vec__8180,3,null);var num = cljs.core.nth.call(null,vec__8180,4,null);if(cljs.core.truth_(reindent))
{var line = cm.posFromIndex(reindent).line;var c0 = cm.posFromIndex(closer);var c1 = cm.posFromIndex((closer + 1));var s0 = cm.posFromIndex(start);var s1 = cm.posFromIndex(end);var update = ((function (line,c0,c1,s0,s1){
return (function (){cm.replaceRange("",c0,c1);
cm.replaceRange("",s0,s1);
return cljs.core.map.call(null,((function (line,c0,c1,s0,s1){
return (function (p1__8176_SHARP_){return cm.indentLine(p1__8176_SHARP_);
});})(line,c0,c1,s0,s1))
,cljs.core.range.call(null,line,(line + num)));
});})(line,c0,c1,s0,s1))
;return cm.operation(update);
} else
{return null;
}
});
goog.exportSymbol('lt.plugins.subpar.splice_delete_backward', lt.plugins.subpar.splice_delete_backward);
lt.plugins.subpar.splice_delete_forward = (function splice_delete_forward(cm){var vec__8184 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8184,0,null);var i = cljs.core.nth.call(null,vec__8184,1,null);var s = cljs.core.nth.call(null,vec__8184,2,null);var vec__8185 = lt.plugins.subpar.paredit.splice_delete_forward_vals.call(null,s,i);var opener = cljs.core.nth.call(null,vec__8185,0,null);var start = cljs.core.nth.call(null,vec__8185,1,null);var end = cljs.core.nth.call(null,vec__8185,2,null);var reindent = cljs.core.nth.call(null,vec__8185,3,null);var num = cljs.core.nth.call(null,vec__8185,4,null);if(cljs.core.truth_(reindent))
{var line = cm.posFromIndex(reindent).line;var o0 = cm.posFromIndex(opener);var o1 = cm.posFromIndex((opener + 1));var s0 = cm.posFromIndex(start);var s1 = cm.posFromIndex(end);var update = ((function (line,o0,o1,s0,s1){
return (function (){cm.replaceRange("",s0,s1);
cm.replaceRange("",o0,o1);
return cljs.core.map.call(null,((function (line,o0,o1,s0,s1){
return (function (p1__8181_SHARP_){return cm.indentLine(p1__8181_SHARP_);
});})(line,o0,o1,s0,s1))
,cljs.core.range.call(null,line,(line + num)));
});})(line,o0,o1,s0,s1))
;return cm.operation(update);
} else
{return null;
}
});
goog.exportSymbol('lt.plugins.subpar.splice_delete_forward', lt.plugins.subpar.splice_delete_forward);
lt.plugins.subpar.splice = (function splice(cm){var vec__8189 = lt.plugins.subpar.get_info.call(null,cm);var cur = cljs.core.nth.call(null,vec__8189,0,null);var i = cljs.core.nth.call(null,vec__8189,1,null);var s = cljs.core.nth.call(null,vec__8189,2,null);var vec__8190 = lt.plugins.subpar.paredit.splice_vals.call(null,s,i);var opener = cljs.core.nth.call(null,vec__8190,0,null);var closer = cljs.core.nth.call(null,vec__8190,1,null);var reindent = cljs.core.nth.call(null,vec__8190,2,null);var num = cljs.core.nth.call(null,vec__8190,3,null);if(cljs.core.truth_(reindent))
{var line = cm.posFromIndex(reindent).line;var o0 = cm.posFromIndex(opener);var o1 = cm.posFromIndex((opener + 1));var c0 = cm.posFromIndex(closer);var c1 = cm.posFromIndex((closer + 1));var update = ((function (line,o0,o1,c0,c1){
return (function (){cm.replaceRange("",c0,c1);
cm.replaceRange("",o0,o1);
return cljs.core.map.call(null,((function (line,o0,o1,c0,c1){
return (function (p1__8186_SHARP_){return cm.indentLine(p1__8186_SHARP_);
});})(line,o0,o1,c0,c1))
,cljs.core.range.call(null,line,(line + num)));
});})(line,o0,o1,c0,c1))
;return cm.operation(update);
} else
{return null;
}
});
goog.exportSymbol('lt.plugins.subpar.splice', lt.plugins.subpar.splice);
lt.plugins.subpar.indent_selection = (function indent_selection(cm){if(cljs.core.truth_(cm.somethingSelected()))
{var start = cm.getCursor(true).line;var end = cm.getCursor(false).line;var f = ((function (start,end){
return (function (){return cljs.core.map.call(null,((function (start,end){
return (function (p1__8191_SHARP_){return cm.indentLine(p1__8191_SHARP_);
});})(start,end))
,cljs.core.range.call(null,start,(end + 1)));
});})(start,end))
;return cm.operation(f);
} else
{return cm.indentLine(cm.getCursor().line);
}
});
goog.exportSymbol('lt.plugins.subpar.indent_selection', lt.plugins.subpar.indent_selection);
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.move.forward","subpar.move.forward",4105172871),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Move forward",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.forward.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.move.backward","subpar.move.backward",3992614917),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Move backward",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.backward.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.move.forward-up","subpar.move.forward-up",4603884229),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Move forward up",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.forward_up.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.move.forward-down","subpar.move.forward-down",2125429452),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Move forward down",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.forward_down.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.move.backward-up","subpar.move.backward-up",1464367495),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Move backward up",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.backward_up.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.move.backward-down","subpar.move.backward-down",4411857166),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Move backward down",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.backward_down.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.grow.right","subpar.grow.right",2615988640),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Grow right",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.forward_slurp.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.grow.left","subpar.grow.left",926854439),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Grow left",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.backward_slurp.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.shrink.right","subpar.shrink.right",576586710),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Shrink right",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.forward_barf.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.shrink.left","subpar.shrink.left",1969445937),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Shrink left",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.backward_barf.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.open-pair","subpar.open-pair",3912861858),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Open a pair of (, { or [",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (pair){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.open_expression.call(null,ed,pair);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.close-pair","subpar.close-pair",3617903278),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: Close a pair of (, { or [",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (delim){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.close_expression.call(null,ed,delim);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.insert-double-quote","subpar.insert-double-quote",4032040057),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: insert \"\"",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.double_quote.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.delete.left","subpar.delete.left",4180251087),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: context sensitive backspace",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.backward_delete.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.delete.right","subpar.delete.right",4687036920),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: context sensitive delete",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.forward_delete.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.splice","subpar.splice",2169919003),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: splice a list into elements",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.splice.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.splice.delete-backward","subpar.splice.delete-backward",3898326002),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: splice a list deleting elements behind cursor",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.splice_delete_backward.call(null,ed);
} else
{return null;
}
})], null));
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"subpar.splice.delete-forward","subpar.splice.delete-forward",776995322),new cljs.core.Keyword(null,"desc","desc",1016984067),"Subpar: splice a list deleting elements after cursor",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){var temp__4092__auto__ = lt.objs.editor.__GT_cm_ed.call(null,lt.objs.editor.pool.last_active.call(null));if(cljs.core.truth_(temp__4092__auto__))
{var ed = temp__4092__auto__;return lt.plugins.subpar.splice_delete_forward.call(null,ed);
} else
{return null;
}
})], null));
}

//# sourceMappingURL=subpar_compiled.js.map