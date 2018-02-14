#!/bin/bash

# recuperation de l'ID du Build

let nb=$2-$1
echo $nb
json=`curl "https://api.travis-ci.org/v3/repo/yanntm%2FITS-Tools-pnmcc/builds?sort_by=id&limit=2&offset=530"`
builds_id=`echo $json | jq '. | .builds[].id'`

for build_id in "${builds_id[@]}"
do 
	echo "$build_id"
done

#echo $json
#nb_job=$1+15
#for job_id in `seq $1 $nb_job`;
#do 
#	echo "Build $i"
#	wget https://api.travis-ci.org/v3/job/job_id/log.txt
#done
