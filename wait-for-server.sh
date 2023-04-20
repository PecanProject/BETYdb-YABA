#!/bin/bash

set -e

host="$1"
shift
cmd="$*"

until curl --silent --output /dev/null --fail "http://$host"; do
  echo "Waiting for server..."
  sleep 5
done

exec $cmd
