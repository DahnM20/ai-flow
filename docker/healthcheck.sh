#!/bin/bash

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <URL>"
    exit 1
fi

URL="$1"
INTERVAL=5
MAX_ATTEMPTS=20 

attempt=0
while [ $attempt -lt $MAX_ATTEMPTS ]; do
  attempt=$(( $attempt + 1 ))
  
  curl --fail --silent $URL && echo "Service is up!" && exit 0
  
  echo "Service not ready yet. Waiting for $INTERVAL seconds. Attempt $attempt of $MAX_ATTEMPTS."
  sleep $INTERVAL
done

echo "Service did not become ready after $MAX_ATTEMPTS attempts."
exit 1