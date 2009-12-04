//
//  match-js
//  A simple yet powerful pattern matching library for Javascript. 
//  
//  Read readme.md for instructions and LICENSE license.
//  
//  Copyright (c) 2009 Johan Dahlberg 
//
var Match = (function() {
    var NO_MATCH = { __matchtype__: 'no-match', toString: function() { return 'no-match' }};
    var TYPE_RE = /function\s([A-Za-z_1-9$]+)/;;
    
    function is_prim_type(obj) {
        return obj == String || obj == Number || obj == Date || obj == Boolean
    }
    
    function is_empty(value) {
        return value == null || value == undefined;
    }
    
    function get_resolver(obj) {
        var ctor;
        
        // Check if we got an instance __compare__ method (most valuable)
        if(obj && obj['__compare__']) return function(value) {
            return obj.__compare__(value);
        }
        
        // Check if we got an instance __equals__ method (most second most 
        // valuable)
        else if(obj && obj['__equals__']) return function(value) {
            if(obj.__equals__(value)) return [value];
            throw NO_MATCH;
        }

        // Check if the instance constructor class has an __compare__ method. 
        else if(obj && obj.constructor && obj.constructor['__compare__']) return function(value) {
            return obj.constructor.__compare__(obj, value);
        }

        // Check if the instance constructor class has an __equals__ method. 
        else if(obj && obj.constructor && obj.constructor['__equals__']) return function(value) {
            var comp = obj.constructor.__equals__;
            if(comp(obj, value)) return [value];
            throw NO_MATCH;
        }
        
        // Check for native type's (Strings, Number and Regexp's)
        else if(is_prim_type(obj)) return function(value) {
            if(is_empty(value) || value.constructor !== obj) throw NO_MATCH;
            return [value];
        }
        
        // Check for null and undefined types
        else if(is_empty(obj)) return function(value) {
            if(obj !== value) throw NO_MATCH;
            return [value];
        }
        
        // Didnt match any of the special case resolvers. Find it in 
        // the TYPE_RESOLVERS list instead.
        var type_name = TYPE_RE(obj.constructor.toString())[1];
        ctor = TYPE_RESOLVERS[type_name];
        if(!ctor) ctor = TYPE_RESOLVERS['Object'];
        return ctor(obj);
    }
    
    var TYPE_RESOLVERS = {

        // Function (class constructor) resolver. 
        Function: function(ctor) {
            return function(value) {
                if(!value || value.constructor !== ctor) throw NO_MATCH;
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

        // Boolean resolver
        Boolean: function(b) {
            return function(value) {
                if(b !== value) throw NO_MATCH;
                return [];
            }
        },
        
        // Regexp resolver
        RegExp: function(regexp) {
            return function(value) {
                if(!value || !regexp.test(value)) throw NO_MATCH;
                return [];
            }
        },
        
        // Number resolver
        Number: function(no) {
            return function(value) {
                if(no !== value) throw NO_MATCH;
                return [];
            }
        },

        // String resolver
        String: function(str) {
            return function(value) {
                if(str !== value) throw NO_MATCH;
                return [];
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
        }
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
        
        // Matches against defined patterns. The first argument is the object 
        // to match agaisnt. The second argument is optional and respresent the
        // value that is return if no pattern was matched.
        var Matcher = function(orig, nomatch_res) {
            var l = cases.length, 
                errors = [], 
                obj = orig, 
                nomatch = nomatch_res || undefined; // undefined is default
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
            
            // Check if a default case is defined. 
            if(default_case) default_case.apply(this, [obj, orig]);
            
            // No pattern was matched. Return the default nomatch value.
            else return nomatch;
        };
        
        // Identify the new matcher as a Matcher
        Matcher.__matchtype__ = 'matcher';
        
        // Return the Matcher. 
        return Matcher;
    }
    
    // A comparer that ignores a value in the pattern
    var pass = {
        __compare__: function(value) {
            return [];
        }
    }
    
    // A comparer that includes a value without matching.
    var incl = {
        __compare__: function(value) {
            return [value];
        }
    }
    
    // Export public members
    Result.TYPE_RESOLVERS = TYPE_RESOLVERS;
    Result.NO_MATCH = NO_MATCH;
    Result.get_resolver = get_resolver;
    Result.pass = pass;
    Result.incl = incl;
    
    return Result;
})();
try{ exports.Match = Match } catch(e) {}; // Support for node.js