// basic-matching.js
// Some basic matching example's 
//
// Note: Requires node.js (http://nodejs.org/) to run.

// Import dependencies
process.mixin(require('utils'));
process.mixin(require('../match'));

var resolver = Match (
		14, function() {
			puts(' - Matched against strict no 14');
		},

		Number, function(no) {
			puts(' - Matched against dynamic no ' + no);
		},

		['msg', Number, Number], function(no1, no2) {
			puts(' - Matched { id: msg no1: ' + no1 + ' no2: ' + no2 + ' }');
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
puts('Running: resolver( \'This value will not match any of the cases.\')', true);
resolver( 'This value will not match any of the cases.');
