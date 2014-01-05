#! /usr/bin/env bash

actual=$(./node_modules/browserify/bin/cmd.js -t ./index.js ./example/entry.js|node);
expected='Hi chevett.  Your dumb test worked.'

if [[ "$actual" == "$expected" ]]; then
	echo 'Yay it works!';
	exit 0;
fi

echo "$actual"
echo 'Oh noes... it is busted.';
exit 666
