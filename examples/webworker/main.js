
function main() {
	
	// Spawn a new worker.
	var worker = new Worker('worker.js');
	
	// Hook the onmessage event 
	worker.onmessage = Match (
	    
	    // Parse the data through the json filter before further processing.
	    json_filter,

		// Answer to the basic worker ´ping´ mesasge
        'ping', function() {
			println('Received a ping message from worker...');
			post('pong', worker);
			println(' -> \'pong\'');
		},
		
		// Worker is ready to some heavy-lifting. Start a 
		// calculation, 12 * 24.
        'ready-to-work', function() {
			println('Received a ready-to-work message from worker...');
			post(['calc', 12, 24], worker);
			println(' -> [\'calc\', 12, 24]');
		},
		
		// Worker is done with the calculation. 
        ['calc-done', Number], function(id, answer) {
			println('The answer of 12 * 24 is: ' + answer);
		}
	)
	
	println('Note: Your browser requires support for WebWorkers and JSON in order to run this demo');
	println('Start worker thread ', true);
	post('wake-up', worker);
	println(' -> \'wake-up\'');
}


window.addEventListener('load', main, true);