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
  })
</div>
```````````````
######do the transform
```````````````
browserify -t vashify your-file.js > bundle.js
```````````````
######bundle.js
```````````````js
// {({([{({browserify stuff here
var template = (function(){
        var vash = require('vash/build/vash-runtime.min.js');
        return vash.link( function anonymous(model,html,__vopts,vash) {
        try {
        var __vbuffer = html.buffer;
        html.options = __vopts;
        model = model || {};
        html.vl = 1, html.vc = 0;
        __vbuffer.push('<h1>');
        html.vl = 1, html.vc = 5;
        __vbuffer.push(html.escape(model.name).toHtmlString());
        html.vl = 1, html.vc = 11;
        html.vl = 1, html.vc = 15;
        __vbuffer.push('</h1>');
        html.vl = 1, html.vc = 20;
        __vbuffer.push('\n');
        html.vl = 2, html.vc = 0;
        __vbuffer.push('<ul>');
        html.vl = 2, html.vc = 4;
        __vbuffer.push('\n');
        html.vl = 3, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 3, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 3, html.vc = 3;
        __vbuffer.push(model.traits.forEach(function(t){
            html.vl = 4, html.vc = 4;
        __vbuffer.push('<li>');
        html.vl = 4, html.vc = 8;
        __vbuffer.push('You');
        html.vl = 4, html.vc = 11;
        __vbuffer.push(' ');
        html.vl = 4, html.vc = 12;
        __vbuffer.push('are');
        html.vl = 4, html.vc = 15;
        __vbuffer.push(' ');
        html.vl = 4, html.vc = 17;
        __vbuffer.push(html.escape(t).toHtmlString());
        html.vl = 4, html.vc = 17;
        html.vl = 4, html.vc = 18;
        __vbuffer.push('</t>');
        
          }));
        html.vl = 5, html.vc = 3;
        html.vl = 5, html.vc = 4;
        __vbuffer.push(';');
        html.vl = 5, html.vc = 5;
        __vbuffer.push('\n');
        html.vl = 6, html.vc = 0;
        __vbuffer.push('</ul>');
        html.vl = 6, html.vc = 5;
        __vbuffer.push('\n');
        (__vopts && __vopts.onRenderEnd && __vopts.onRenderEnd(null, html));
        return (__vopts && __vopts.asContext)
          ? html
          : html.toString();
        } catch( e ){
          html.reportError( e, html.vl, html.vc, "<h1>@model.name</h1>!LB!<ul>!LB!  @model.traits.forEach(function(t){ !LB!    <li>You are @t</t>!LB!  });!LB!</ul>!LB!" );
        }
        
        }, {"simple":false,"modelName":"model","helpersName":"html"} );
        })();
        var $ = require('jquery');

        $('body').append(template({ name: 'Mike', traits: ['bro', 'tall']}));

  // more browserify stuff })})}]}0})})
````````````
