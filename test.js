var browserify = require('browserify');
var b = browserify();
b.transform('./index.js');

var jsStr;
var concatStream = require('concat-stream');

b.add('./main.js');

b.bundle().pipe(concatStream(function(js){
	jsStr = js;
	console.log(js);
}));

