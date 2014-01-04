var tt = require('browserify-transform-tools');
var vash = require('vash');
var fs = require('fs');
var options = {
};

var COOL_FILE_REGEX = [
	/\.vash$/i,
	/\.aspx$/i
];


function isCoolFile(fileName){
	var isCool = false;
	COOL_FILE_REGEX.forEach(function(regex){
		isCool = isCool || regex.test(fileName);
	});
	return isCool;
}

function configure(newOptions){
	Object.keys(newOptions).forEach(function(v){
		options[v] = newOptions[v];
	});

	return this;
}

var myTransform = tt.makeRequireTransform("vashify",
	{evaluateArguments: true},
	function(args, opts, cb) {
		var fileName = args[0];
		if (!isCoolFile(fileName)) return cb();

		var strTmpl = fs.readFileSync(fileName);
		var fn = vash.compile(strTmpl.toString());
	
		
		cb(null, '(' + fn.toString() + ')');
	}

);

module.exports = myTransform;
module.exports.configure = function(newOptions){
	Object.keys(newOptions).forEach(function(v){
		options[v] = newOptions[v];
	});

	return this;
};

