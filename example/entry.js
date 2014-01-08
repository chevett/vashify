var tmpl = require('./template.vash');
var tmpl2 = require('./template.vash');

tmpl.addHelper(function fullName(model){
	return model.first + ' ' + model.last;
});

console.log(tmpl({first:'mike', last:'chevett'}));
