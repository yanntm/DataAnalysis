#!/bin/bash

# recuperation de l'ID du Build

nb = $2 - $1
build=$(curl -s "https://api.travis-ci.org/v3/repo/yanntm%2FITS-Tools-pnmcc/builds?sort_by=id&limit=$nb&offset=$1"| jq -r .builds[].id)

echo $build
nb_job = $1+15
for job_id in `seq $1 $nb_job`;
do 
	echo "Build $i"
	wget https://api.travis-ci.org/v3/job/job_id/log.txt
done
