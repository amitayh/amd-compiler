#!/bin/sh

echo "digraph G {rankdir=BT; main->modA main->modB modA->modB modA->modC modB->modC}" | dot -Tpng >doc/deps.png
echo "digraph G {rankdir=BT; main->modA modA->modB modB->modC}" | dot -Tpng >doc/sorted.png