#!/bin/sh

rm -rf coverage/
rm coverage.html
mocha -r blanket -R html-cov specs/ > coverage.html
