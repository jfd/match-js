match-js
========
A simple yet powerful pattern matching library for Javascript. 


Let you do stuff like this:

	importScripts('../../match.js');
	importScripts('../shared/utils.js');

	// Hook the incoming message event with a Match statement.
	onmessage = Match (
    
	    // Parse the data through the json filter before further processing.
	    json_filter,
    
	    // Wake-up this worker service.
	    'wake-up', function() {
	        post('ping');
	    },
    
	    // Tell main thread that we are ready to work
	    'pong', function() {
	        post('ready-to-work');
	    },
    
	    // To a calculation against the specified value. Simulate a heavy 
	    // calculation by sending a delayed answer. 
	    ['multiple-value', Number, Number], function(n, no1, no2) {
	        setTimeout(function() {
	            postMessage(['multiple-done', no1 * no2]);
	        }, 800);
	    }
    
	);


More more examples, please navigate to /examples