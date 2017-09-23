#!/bin/sh

if ! [ -x "$(command -v docker)" ]; then
  echo 'Unable to find docker command, please install Docker (https://www.docker.com/) and retry' >&2
  exit 1
fi

export ARANGODB_DB=graphql-blog
export ARANGODB_USERNAME=root
export ARANGODB_PASSWORD=openfaasgraphqlblog

echo "Deploying stack"
docker stack deploy func --compose-file docker-compose.yml

