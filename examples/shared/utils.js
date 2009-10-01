
function println(txt, bold) {
	var elem = document.getElementById('output');
	var output = bold ? '<b>' + txt + '</b>' : txt;
	elem.innerHTML += output + '\n';
}

// Sends a JS object over a channel. The object is seralized into JSON before 
// sent.
function post(obj, channel) {
    var json = JSON.stringify(obj);
    if(channel) channel.postMessage(json);
    else postMessage(json);
}

// Create a filter that jsonify incomming data
var json_filter = Match ( 
        
    // Match if incomming object has a property called data (of type String)
    { data: String }, function(data) {
        return JSON.parse(data);
    }
    
);

