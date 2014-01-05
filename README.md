vashify [![Build Status](https://travis-ci.org/chevett/vashify.png)](https://travis-ci.org/chevett/vashify)
=======

Use Vash with Browserify and get your templates compiled during the transform
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
  }
</div>
```````````````
```````````````
browserify -t vashify your-file.js
```````````````

