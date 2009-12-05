// json-matching.js
// Some examples showing how to use match-js with JSON 
//
// Note: Requires node.js (http://nodejs.org/) to run.

// Import dependencies
process.mixin(require('utils'));
process.mixin(require('../match'));

var resolver = Match (

	// Matches when field's firstName and lastName has a string 
	// value
	{ firstName: String, lastName: String }, function(f, l) {
		puts(' - Matched person: ' + f + ' ' + l);
	},

	// Matches when field firstName has a string value defined. 
	// lastName doesnt have to be present. 
	{ firstName: String}, function(f) {
		puts(' - Matched firstName: ' + f);
	},

	// Matches when field's firstName and lastName has a string 
	// value and when a home phone number is present.
	{ lastName: String, phone: { home: String }}, function(last, phone) {
		puts(' - Matched: ' + last + ' (phone: ' + phone + ' )');
	}
	
)

	
puts('Starting patttern matching: ', true);
puts('');

puts("Running: resolver({firstName: 'John'})", true);
resolver({firstName: 'John'});
puts("Running: resolver({firstName: 'Simon'})", true);
resolver({firstName: 'Simon'});
puts("Running: resolver({firstName: 'John', lastName: 'Smith'})", true);
resolver({firstName: 'John', lastName: 'Smith'});
puts("Running: resolver({firstName: 'Simon', lastName: 'Johnson'})", true);
resolver({firstName: 'Simon', lastName: 'Johnson'});
puts("Running: resolver({lastName: 'Smith', phone: { home: '555-1234'}})", true);
resolver({lastName: 'Smith', phone: { home: '555-1234'}});