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
    ['calc', Number, Number], function(n, no1, no2) {
        setTimeout(function() {
            post(['calc-done', no1 * no2]);
        }, 800);
    }
    
);
