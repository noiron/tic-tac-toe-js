#!/bin/sh

echo $PWD
npm run build
git add .
git commit -m "update build files"
git push heroku master
