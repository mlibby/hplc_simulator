#!/bin/sh
mkdir dist
mkdir dist/js
mkdir dist/css
mkdir dist/html

echo "bowering"
bower update

echo "grunting"
node node_modules/grunt-cli/bin/grunt build --verbose


