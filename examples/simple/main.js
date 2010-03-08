
function main() {
	
	var resolver = Match (
		14, function() {
			println(' - Matched against strict no 14');
		},

		Number, function(no) {
			println(' - Matched against dynamic no ' + no);
		},

		['msg', Number, Number], function(no1, no2) {
			println(' - Matched { no1: ' + no1 + ' no2: ' + no2 + ' }');
		},
		
		// Default handler, if no other case is matching. 
        function(in_obj) {
            println(' - The following value did not match: "' + in_obj + '"');
        }

	)
	
	
	
	println('Starting patttern matching: ', true);
	println('');

	println('Running: resolver(14) ', true);
	resolver(14);
	println('Running: resolver(16) ', true);
	resolver(16);
	println('Running: resolver( [\'msg\', 14, 12] ) ', true);
	resolver( ['msg', 14, 12] );
	println('Running: resolver( \'This value will not match any of the cases.\')', true);
	resolver( 'This value will not match any of the cases.');
	
	
}

window.addEventListener('load', main, true);