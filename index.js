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

		var strTmpl;
		try {
			strTmpl = fs.readFileSync(fileName);
		}
		catch (e){
			process.stderr.write('Error reading: ' + fileName + '\n');
			throw e;
		}

		var fn;
		try {
			fn = vash.compile(strTmpl.toString());
		}
		catch (e){
			process.stderr.write('Error compiling: ' + fileName + '\n');
			throw e;
		}

		var moduleContents = moduleTemplate({
			vashRuntimeLocation: __dirname + '/node_modules/vash/build/vash-runtime.min.js' ,
			fn: fn.toClientString()
		});




		lookup[fileName] = lookup[fileName] || __dirname + '/c/v_' + counter++ + '.js'
		var moduleLocation = lookup[fileName];
		mkdirp('./c');
		fs.writeFileSync(moduleLocation, moduleContents);

		var moduleRequire = 'require("'+moduleLocation + '")';
		cb(null, moduleRequire);
	}
);

module.exports = myTransform;
