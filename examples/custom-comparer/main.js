process.mixin(require('utils'));
process.mixin(require('../../match'));

function MyClass(a, b) {
    this.a = a;
    this.b = b;
}

// The simpler custom comparer is __equals__. Return ´true´ if the value 
// matches, else ´false´. The matching object is always included in the 
// result callback. The method takes two arguments.
MyClass.__equals__ = function(first, second) {
    return first.a == second.a && first.b == second.b;
}

function OtherClass(a, b) {
    this.a = a;
    this.b = b;
}

OtherClass.prototype = {

    // The __equals__ method is the comparer for object instances . Return 
    // ´true´ if the value matches, else ´false´. The matching object is always 
    // included in the result callback. The method takes one argument.
    __equals__: function(other) {
        return this.a == other.a && this.b == other.b;
    }
    
} 

var CustomComparer = {
    
    // The more advanced custom comparer is the __compare__ method. The 
    // comparer returns an array with the values that should be included
    // when calling the result callback. The comparer MUST throw the 
    // Match.NO_MATCH if not matched.
    __compare__: function(obj) {
        if(obj.constructor != Number) throw Match.NO_MATCH;
        return [obj];
    }
}

var first = new MyClass(1, 2),
    second = new MyClass(1, 2),
    third = new MyClass(2, 2);

var test = Match (
    
    first, function() {
        puts('The argument matched the object named First');
    },

    new MyClass(2, 2), function() {
        puts('The argument matched the newly created object');
    },
    
    new OtherClass(3, 3), function() {
        puts('The argument matched the OtherClass instance');
    },
    
    CustomComparer, function() {
        puts('The argument matches the CustomeComparer (Its a number)');
    }
    
);


// Should match first case
test(second);

// Should match second case
test(third);

// Should match third case
test(new OtherClass(3, 3));

// Should match fourth case
test(123);
