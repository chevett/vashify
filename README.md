vashify [![Build Status](https://travis-ci.org/chevett/vashify.png)](https://travis-ci.org/chevett/vashify)
=======

Use [Vash](https://github.com/kirbysayshi/vash) with [Browserify](https://github.com/substack/node-browserify) and get your templates compiled during the transform
``````
npm install vashify
`````
######your-file.js
`````````````js
var template = require('./your-template.vash');
var $ = require('jquery');

$('body').append(template({ name: 'Mike', traits: ['bro', 'tall']}));
```````````````
######your-template.vash
`````````````html
<h1>@model.name</h1>
<ul>
  @model.traits.forEach(function(t){ 
    <li>You are @t</t>
  })
</div>
```````````````
######do the transform
```````````````
browserify -t vashify your-file.js > bundle.js
```````````````

Modules references like require('*.vash') files will be intercepted.  Once intercepted, the template is compiled, a new module is generated and the template is placed in that module.
Next, the module is written to disk and the original require('my-template.vash') is replaced with something like require('tempdir/my-template.vash.js').

This means templates that are required multiple times will only appear in the bundle once... which is good for business.
