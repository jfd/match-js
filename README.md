match-js
========
A simple yet powerful pattern matching library for Javascript. 


Let you do stuff like this (a WebWorker example):

	// Create a filter that jsonify incomming data
	var json_filter = Match ( 
        
	    // Match if incomming object has a property called data (of type String)
	    { data: String }, function(data) {
	        return JSON.parse(data);
	    }
    
	);

	// Hook the incoming message event with a Match statement.
	onmessage = Match (
    
	    // Parse the data through the json filter before further processing.
	    json_filter,
    
	    // Wake-up this worker service.
	    'wake-up', function() {
	        post('ping');
	    },
    
	    // Tell main thread that this service is ready for some work
	    'pong', function() {
	        post('ready');
	    },
    
	    // Do a calculation against the specified value. Simulate a heavy 
	    // calculation by sending a delayed answer. 
	    ['calc', Number, Number], function(no1, no2) {
	        setTimeout(function() {
	            post(['calc-done', no1 * no2]);
	        }, 800);
	    }
    
	);


For more examples, please navigate to /examples