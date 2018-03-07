#!/bin/bash

#let index = $2

a=( $(awk -F "," '{print $4}' "csv1-100.csv" | sort | uniq) )

for i in ${a[@]}
	do
		echo $i
	done