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
var VASH_TEMPLATE_REGEX = [
	/\.vash$/i,
	/\.aspx$/i
];

mkdirp.sync(__dirname + '/.temp');

function isVashTemplate(fileName){
	var isCool = false;
	VASH_TEMPLATE_REGEX.forEach(function(regex){
		isCool = isCool || regex.test(fileName);
	});
	return isCool;
}

function isVashLibrary(fileName){
	return (/^vash-runtime$/i).test(fileName);
}

function compileVashTemplate(relativeTemplateReference, moduleFile){
	var templateFileName = relativeTemplateReference.match(/[^\/]*$/)[0];
	var moduleDirName = path.dirname(moduleFile);
	var fullTemplateFileName = path.resolve(moduleDirName, relativeTemplateReference);

	var strTmpl;
	try {
		strTmpl = fs.readFileSync(fullTemplateFileName);
	}
	catch (e){
		process.stderr.write('Error reading: ' + templateFileName + '\n');
		throw e;
	}

	var fn;
	try {
		fn = vash.compile(strTmpl.toString());
	}
	catch (e){
		process.stderr.write('Error compiling: ' + templateFileName + '\n');
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

	return 'require("'+moduleLocation + '")';
}

var makeTransform = tt.makeRequireTransform.bind(tt, 'vashify', {evaluateArguments: true});
var myTransform = makeTransform(function(args, opts, cb) {
	var arg0 = args[0];

	if (isVashLibrary(arg0)) {
		return cb(null, 'require("' + VASH_RUNTIME_LOCATION+ '")');
	}
	
	if (isVashTemplate(arg0)) {
		return cb(null, compileVashTemplate(arg0, opts.file));
	}

	return cb();
	
);

module.exports = myTransform;
