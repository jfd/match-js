
var resolver = Match (

	// Matches when field's firstName and lastName has a string 
	// value
	{ firstName: String, lastName: String }, function(f, l) {
		println(' - Matched person: ' + f + ' ' + l);
	},

	// Matches when field firstName has a string value defined. 
	// lastName doesnt have to be present. 
	{ firstName: String}, function(f) {
		println(' - Matched firstName: ' + f);
	},

	// Matches when field's firstName and lastName has a string 
	// value and when a home phone number is present.
	{ lastName: String, phone: { home: String }}, function(last, phone) {
		println(' - Matched: ' + last + ' (phone: ' + phone + ' )');
	}
	
)

function main() {
	
	println('Starting patttern matching: ', true);
	println('');

	println("Running: resolver({firstName: 'John'})", true);
	resolver({firstName: 'John'});
	println("Running: resolver({firstName: 'Simon'})", true);
	resolver({firstName: 'Simon'});
	println("Running: resolver({firstName: 'John', lastName: 'Smith'})", true);
	resolver({firstName: 'John', lastName: 'Smith'});
	println("Running: resolver({firstName: 'Simon', lastName: 'Johnson'})", true);
	resolver({firstName: 'Simon', lastName: 'Johnson'});
	println("Running: resolver({lastName: 'Smith', phone: { home: '555-1234'}})", true);
	resolver({lastName: 'Smith', phone: { home: '555-1234'}});

}

window.addEventListener('load', main, true);