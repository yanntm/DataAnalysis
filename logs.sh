#!/bin/bash

cd ./travisLogs
ls

let length=$2-$1+1
let skipped=$1-1
echo "length : $length, skip until : $skipped"

json=$(curl "https://api.travis-ci.org/v3/repo/yanntm%2FITS-Tools-pnmcc/builds?sort_by=id&limit=$length&offset=$skipped")

for ((i=0; i<length; i++))
do
	#build_num=$(echo $json | jq -r --arg i $i '. | .builds[$i|tonumber].number')
	
	jobs_ids=( $(echo $json | jq -r --arg i $i '. | .builds[$i|tonumber].jobs[].id') )
	
	#printf "build number : $build_num\n" 
	#echo ${jobs_ids[*]}

	for job_id in ${jobs_ids[@]}
	do
		echo $job_id
		curl "https://api.travis-ci.org/v3/job/$job_id/log.txt" > log$job_id.txt
	done
done


#	wget https://api.travis-ci.org/v3/job/job_id/log.txt

