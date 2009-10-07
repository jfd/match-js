
// Import dependencies
node.mixin(require('/utils.js'));
node.mixin(require('../../match.js'));

function main() {
	
	function IS_MY_OBJ(value) {
		if(!value || !value._myobj) throw "no match!";
	}

	var resolver = Match (
		14, function(no) {
			puts(' - Matched against strict no ' + no);
		},

		Number, function(no) {
			puts(' - Matched against dynamic no ' + no);
		},

		['msg', Number, Number], function(id, no1, no2) {
			puts(' - Matched { id: ' + id + ' no1: ' + no1 + ' no2: ' + no2 + ' }');
		},
		
		// Case with custom handler (IS_MY_OBJ)
		['my-obj', IS_MY_OBJ], function(id, msg) {
			puts(' - Custom handler matched');
		},
		
		// Default handler, if no other case is matching. 
        function(in_obj) {
            puts(' - The following value did not match: "' + in_obj + '"');
        }

	)
	
	
	
	puts('Starting patttern matching: ', true);
	puts('');

	puts('Running: resolver(14) ', true);
	resolver(14);
	puts('Running: resolver(16) ', true);
	resolver(16);
	puts('Running: resolver( [\'msg\', 14, 12] ) ', true);
	resolver( ['msg', 14, 12] );
	puts('Running: resolver( [\'msg\', {_myobj: true}] ', true);
	resolver( ['my-obj', {_myobj: true}] );
	puts('Running: resolver( [\'msg\', {_myobj: false}] ', true);
	resolver( ['my-obj', {_myobj: false}] );
	puts('Running: resolver( \'This value will not match any of the cases.\')', true);
	resolver( 'This value will not match any of the cases.');
	
	
}

// Run application
main();