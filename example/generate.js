var browserify = require('browserify');
var b = browserify();

b.transform('../index.js'); // or just 'vashify' in your case
b.add('./entry.js');
b.bundle().pipe(process.stdout);

