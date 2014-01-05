var tt = require('browserify-transform-tools'),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	path = require('path'),
	vash = require('vash');

var counter = 0;
var lookup = Object.create(null);

var moduleTemplate = vash.compile(fs.readFileSync(__dirname + '/module.vash').toString());
var COOL_FILE_REGEX = [
	/\.vash$/i,
	/\.aspx$/i
];

mkdirp.sync(__dirname + '/.temp');


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
		var filePath = args[0];
		if (!isCoolFile(filePath)) return cb();

		var fileName = filePath.match(/[^\/]*$/)[0];
		var dirName = path.dirname(opts.file);
		var fullFileName = path.resolve(dirName, filePath);

		var strTmpl;
		try {
			strTmpl = fs.readFileSync(fullFileName);
		}
		catch (e){
			process.stderr.write('Error reading: ' + filePath + '\n');
			throw e;
		}

		var fn;
		try {
			fn = vash.compile(strTmpl.toString());
		}
		catch (e){
			process.stderr.write('Error compiling: ' + filePath + '\n');
			throw e;
		}

		var moduleContents = moduleTemplate({
			vashRuntimeLocation: __dirname + '/node_modules/vash/build/vash-runtime.min.js' ,
			clientString: fn.toClientString()
		});

		var moduleLocation = lookup[fullFileName];

		if (!moduleLocation){
			moduleLocation = lookup[fullFileName] = __dirname + '/.temp/' + counter++ + '_'+fileName + '.js';
			fs.writeFileSync(moduleLocation, moduleContents);
		}

		var moduleRequire = 'require("'+moduleLocation + '")';
		cb(null, moduleRequire);
	}
);

module.exports = myTransform;
