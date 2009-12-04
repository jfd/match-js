//
//  match-js
//  A simple yet powerful pattern matching library for Javascript. 
//  
//  Read readme.md for instructions and LICENSE license.
//  
//  Copyright (c) 2009 Johan Dahlberg 
//
var sys = require('sys');

var Match = (function() {
    var NO_MATCH = { __matchtype__: 'no-match', toString: function() { return 'no-match' }};
    var TYPE_RE = /function\s([A-Za-z_1-9$]+)/;;
    
    function is_prim_type(obj) {
        return obj == String || obj == Number || obj == Date
    }
    
    function is_empty(value) {
        return value == null || value == undefined;
    }
    
    function get_resolver(obj) {
        var ctor;
        if(obj && obj['__is__']) {
            // The __is__ comparer is "most valuable", always prioritized.
            ctor = TYPE_RESOLVERS['-is'];
        } else if(obj && obj.constructor && obj.constructor['__equals__']) {
            ctor = TYPE_RESOLVERS['-equals'];
        } else if(obj && obj['__compare__']) {
            return obj['__compare__'];
        } else if(is_prim_type(obj)) {
            ctor = TYPE_RESOLVERS['-type'];
        } else if(is_empty(obj)) {
            ctor = TYPE_RESOLVERS['-equal'];
        } else {
            var type_name = TYPE_RE(obj.constructor.toString())[1];
            ctor = TYPE_RESOLVERS[type_name];
            if(!ctor) ctor = TYPE_RESOLVERS['Object'];
        }
        return ctor(obj);
    }
    
    var TYPE_RESOLVERS = {

        // Function resolver. Note: Functions in match patterns are not allowed 
        // to throw exceptiosn. If an Exception is throwned, the NO_MATCH value
        // is returned for the case in question.
        Function: function(callback) {
            return function(value) {
                try { 
                    callback(value);
                } catch(ex) { 
                    throw NO_MATCH; 
                }
                return [value];
            }
        },
        
        // Array resolver
        Array: function(arr) {
            if(arr.length == 0) {
                return function(value) {
                    if(value.constructor != Array || value.length != 0)
                        throw NO_MATCH;
                }
            } else {
                var resolvers = []
                for(var i = 0; i < arr.length; i++){
                  resolvers[i] = get_resolver(arr[i]);
                } 
                return function(value) {
                    var result = [];
                    if(!value || value.constructor != Array) throw NO_MATCH;
                    for(var count=0; count < resolvers.length; count++) {
                        result = result.concat(
                             resolvers[count](value[count])
                        );
                    }
                    return result;
                }
            }
        },
        
        // Regexp resolver
        RegExp: function(regexp) {
            return function(value) {
                if(!value || !regexp.test(value)) throw NO_MATCH;
                return [value];
            }
        },
        
        // Number resolver
        Number: function(no) {
            return function(value) {
                if(no !== value) throw NO_MATCH;
                return [value];
            }
        },

        // String resolver
        String: function(str) {
            return function(value) {
                if(str !== value) throw NO_MATCH;
                return [value];
            }
        },
        
        Object: function(obj) {
            var resolvers = {};
            for(var key in obj) {
                resolvers[key] = get_resolver(obj[key]);
            }
            return function(value) {
                if(value === null || value === undefined) throw NO_MATCH;
                var result = [];
                for(var key in resolvers) {
                    result = result.concat(
                        resolvers[key](value[key])
                    );
                }
                return result;
            }
        },
        
        '-type': function(type) {
            return function(value) {
                if(is_empty(value) || value.constructor !== type) throw NO_MATCH;
                return [value];
            }
        },

        '-equal': function(valueA) {
            return function(valueB) {
                if(valueA !== valueB) throw NO_MATCH;
                return [valueB];
            }
        },
        
        '-equals': function(obj) {
            return function(value) {
                var comp = obj.constructor.__equals__;
                if(comp(obj, value)) return [value];
                throw NO_MATCH;
            }
        },
        
        '-is': function(instance) {
            return function(value) {
                if(instance.__is__(value)) return [value];
                throw NO_MATCH;
            }
        },
        
    }
    
    var Result = function() {
        var args = Array.prototype.slice.call(arguments);
        var cases = [], default_case;
        while(args.length) {
            var left = args.shift()
            if(left.__matchtype__ == 'matcher') {
                // This is a filter-
                cases.unshift({ filter: left });
            } else if(left.constructor == Function && !args.length) {
                // The ´default´ case. This callback is called when no other
                // case is matching. This MUST be the last argument.
                default_case = left;
            } else {
                var right = args.shift();
                var resolver = get_resolver(left), callback;
                if(right.constructor == Array) {
                    // The right argument is an array. The first argument in the
                    // Array is the callback. The remaining arguments are the 
                    // arguments to parse to the callback.
                    var fn = right.shift();
                    callback = function() { return fn.apply(null, right.concat(arguments)) };
                } else if(right.constructor == Function) {
                    callback = right;
                }
                cases.unshift({ resolver: resolver, callback: callback });
            }
        }
        
        // The resolver takes one object as argument. The resolver throws an 
        // Exception if no pattern was matched.
        var Matcher = function(orig) {
            var l = cases.length, errors = [], obj = orig;
            while(l-- > 0) {
                var c = cases[l]
                if(c.resolver) {
                    try {
                        var result = c.resolver(obj);
                    } catch(ex) {
                        if(ex == NO_MATCH) continue;
                        throw ex;
                    }
                    // We got a match! Concat the result array with the 
                    // (filtered) object and the original object.
                    return c.callback.apply(this, result.concat([obj, orig]));
                } else if(c.filter){
                    // Run the object through the provided filter.
                    obj = c.filter(obj);
                }
            }
            if(default_case) default_case.apply(this, [obj, orig]);
            else return NO_MATCH;
        };
        
        // Identify the new matcher as a Matcher
        Matcher.__matchtype__ = 'matcher';
        
        // Return the Matcher. 
        return Matcher;
    }
    
    // Export public members
    Result.TYPE_RESOLVERS = TYPE_RESOLVERS;
    Result.NO_MATCH = NO_MATCH;
    Result.get_resolver = get_resolver;
    
    return Result;
})();
try{ exports.Match = Match } catch(e) {}; // Support for node.js