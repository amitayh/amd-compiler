#!/bin/sh

echo "digraph G {main->modA main->modB modA->modC modB->modC}" | dot -Tpng >doc/deps.png
echo "digraph G {modC->modB modB->modA modA->main}" | dot -Tpng >doc/sorted.png