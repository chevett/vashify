var tmpl = require('./template.vash');
var tmpl2 = require('./template.vash');

tmpl.helpers.fullName = function (model){
	return model.first + ' ' + model.last;
};

console.log(tmpl({first:'Hugh', last:'Jass'}));
