#!/usr/bin/env bash

function bundle {
	node ./node_modules/browserify/bin/cmd.js -t vashify $1 |
	cat > $2
}


bundle main.js bundle.js
