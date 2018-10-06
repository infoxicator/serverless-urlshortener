#! /bin/bash
stage = $1; 

echo "Deploying app to $stage"
echo "====================="
serverless deploy --stage $stage