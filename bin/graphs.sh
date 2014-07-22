#!/bin/sh

echo "digraph G {main->modA main->modB modA->modC modB->modC}" | dot -Tsvg >doc/deps.svg
echo "digraph G {modC->modB modB->modA modA->main}" | dot -Tsvg >doc/sorted.svg