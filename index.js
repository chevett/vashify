var tt = require('browserify-transform-tools'),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	path = require('path'),
	vash = require('vash');

vash.config.debug = !(/^prod$|^production$/i).test(process.env.NODE_ENV);

var counter = 0;
var lookup = Object.create(null);
var moduleTemplate = vash.compile(fs.readFileSync(__dirname + '/module.vash').toString());
var VASH_RUNTIME_LOCATION = __dirname + '/node_modules/vash/build/vash-runtime-all.min.js';
var COOL_FILE_REGEX = [
	/\.vash$/i,
	/\.aspx$/i
];

mkdirp.sync(__dirname + '/.temp');


function isVashTemplate(fileName){
	var isCool = false;
	COOL_FILE_REGEX.forEach(function(regex){
		isCool = isCool || regex.test(fileName);
	});
	return isCool;
}

function isVashLibrary(fileName){
	return (/^vash-runtime$/i).test(fileName);
}

var myTransform = tt.makeRequireTransform('vashify',
	{evaluateArguments: true},
	function(args, opts, cb) {
		var argumentToRequire = args[0];
		if (isVashLibrary(argumentToRequire)) return cb(null, 'require("' + VASH_RUNTIME_LOCATION+ '")');
		if (!isVashTemplate(argumentToRequire)) return cb();

		var templateFileName = argumentToRequire.match(/[^\/]*$/)[0];
		var moduleDirName = path.dirname(opts.file);
		var fullTemplateFileName = path.resolve(moduleDirName, argumentToRequire);

		var strTmpl;
		try {
			strTmpl = fs.readFileSync(fullTemplateFileName);
		}
		catch (e){
			process.stderr.write('Error reading: ' + argumentToRequire + '\n');
			throw e;
		}

		var fn;
		try {
			fn = vash.compile(strTmpl.toString());
		}
		catch (e){
			process.stderr.write('Error compiling: ' + argumentToRequire + '\n');
			throw e;
		}


		var moduleLocation = lookup[fullTemplateFileName];

		if (!moduleLocation){
			var moduleContents = moduleTemplate({
				vashRuntimeLocation: VASH_RUNTIME_LOCATION ,
				clientString: fn.toClientString()
			});
			moduleLocation = lookup[fullTemplateFileName] = __dirname + '/.temp/' + counter++ + '_'+templateFileName + '.js';
			fs.writeFileSync(moduleLocation, moduleContents);
		}

		var moduleRequire = 'require("'+moduleLocation + '")';
		cb(null, moduleRequire);
	}
);

module.exports = myTransform;
