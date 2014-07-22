#!/bin/sh

rm -rf coverage/
rm -f coverage.html
mocha -r blanket -R html-cov specs/ > coverage.html
