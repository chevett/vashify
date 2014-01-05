var tt = require('browserify-transform-tools'),
	fs = require('fs'),
	path = require('path'),
	vash = require('vash');

var codeTemplate = vash.compile(fs.readFileSync('./code.vash').toString());
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

var myTransform = tt.makeRequireTransform('vashify',
	{evaluateArguments: true},
	function(args, opts, cb) {
		var fileName = args[0];
		if (!isCoolFile(fileName)) return cb();

		var dirName = path.dirname(opts.file);
		fileName = path.resolve(dirName, fileName);

		var strTmpl = fs.readFileSync(fileName);
		var fn = vash.compile(strTmpl.toString());

		var newCode = codeTemplate({
			fn: fn.toClientString()
		});

		cb(null, newCode);
	}
);

module.exports = myTransform;
