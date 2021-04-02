#!/bin/sh
#echo 'Taking git pull...'
#git pull origin stage
echo 'installing dependencies...'
npm install
npm install webpack@4.28.3
echo 'Removing build directory'
rm -rf build
echo 'Building...'
export NODE_OPTIONS=--max_old_space_size=3000
npm run build:stage
echo 'Deploying on s3...'
aws s3 sync build/ s3://dev-sf-org-web --delete
echo 'Deployment completed.'