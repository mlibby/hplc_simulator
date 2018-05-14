#!/bin/sh

echo "npming"
npm update

echo "bowering"
bower update

echo "grunting"
node node_modules/grunt-cli/bin/grunt build-prod --verbose


