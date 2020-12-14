#!/bin/bash

set -ex

# Required Environment variables. Set them by using the commands below
# export SERVICE_NAME=reponame
# export BUILD_NUMBER=1
: "${SERVICE_NAME:?SERVICE_NAME environment variable is required}"
: "${BUILD_NUMBER:?BUILD_NUMBER environment variable is required}"

IMAGE_NAME="centrality/${SERVICE_NAME}:1.0.${BUILD_NUMBER}"

## inserting gemfury config
# try to get value from local ~/.npmrc to make script work locally
# GEMFURY=$(head -n 1  ~/.npmrc | cut -d= -f2)

# check if we got something in previous command
# if not, use env variable (to make it work on build server)
# if ([[ ! $(echo $GEMFURY | wc -m) -gt 30 ]]); then
#   GEMFURY="${GEMFURY_MIRROR_URL}"
# fi

# test if we have URL
# : "${GEMFURY:?GEMFURY url must be defined, use ~/.npmrc or GEMFURY_MIRROR_URL env variable}"

docker build -t "${IMAGE_NAME}" \
-f ./Dockerfile .

# docker run -t --rm \
#   -v "$(pwd)/build:/workdir/build" \
#   --entrypoint="/bin/sh" \
#   "${IMAGE_NAME}" \
#   "-c" "cp -R web/* /workdir/build"