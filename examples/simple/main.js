
function main() {
	
	function IS_MY_OBJ(value) {
		if(!value || !value._myobj) throw "no match!";
	}

	var resolver = Match (
		14, function(no) {
			println(' - Matched against strict no ' + no);
		},

		Number, function(no) {
			println(' - Matched against dynamic no ' + no);
		},

		['msg', Number, Number], function(id, no1, no2) {
			println(' - Matched { id: ' + id + ' no1: ' + no1 + ' no2: ' + no2 + ' }');
		},
		
		// Case with custom handler (IS_MY_OBJ)
		['my-obj', IS_MY_OBJ], function(id, msg) {
			println(' - Custom handler matched');
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
	println('Running: resolver( [\'msg\', {_myobj: true}] ', true);
	resolver( ['my-obj', {_myobj: true}] );
	println('Running: resolver( [\'msg\', {_myobj: false}] ', true);
	resolver( ['my-obj', {_myobj: false}] );
	println('Running: resolver( \'This value will not match any of the cases.\')', true);
	resolver( 'This value will not match any of the cases.');
	
	
}

window.addEventListener('load', main, true);