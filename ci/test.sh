#!/bin/bash

CHAIN=$1

set -ex

docker run -i -v $PWD:/e2e -w /e2e --entrypoint=bash cypress/included:3.2.0 -c "npm install && cypress run --env configFile=$CHAIN"

