var through = require('through');
var objectAssign = require('object-assign');

module.exports = function vashify (file, opts) {

	opts = objectAssign({}, {
		extensions: ['.vash', '.html', '.cshtml'],
		compiler: null,
		runtime: 'vash/runtime'
	}, opts);

	// Only require this afterwards to allow the consumer to pass in their
	// own instance of vash without forcing the local one to be loaded (since
	// vash is only a devDependency it might not be in the tree).
	if (!opts.compiler) opts.compiler = require('vash');

	var vash = opts.compiler;
	vash.config.debug = !(/^prod(uction)?$/i).test(process.env.NODE_ENV);

	var some = opts.extensions.some(function (ext) {
		return file.indexOf(ext) > -1;
	});

	// a pipe or something similar appears as this filename.
	var fileIsLikelyStream = /_stream_[0-9]+\.js/.exec(file);

	if (!some && !fileIsLikelyStream) return through();

	var buffer = '';
	return through (function (chunk) {
		buffer += chunk.toString();
	}, function () {
		var tpl = vash[opts.helper ? 'compileHelper' : 'compile'](buffer, opts);
		var linked = tpl.toClientString();
		var output = ''
			+ '// compiled with vashify\n'
			+ 'var vash = require(\'' + opts.runtime + '\');\n'
			+ 'module.exports = ' + linked + ';\n';
		this.queue(output);
		this.queue(null);
	});
}
