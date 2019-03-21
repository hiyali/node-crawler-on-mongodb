#!/bin/bash

# foreground
# mongod --dbpath $(PWD)/db --port 27017
mongod --dbpath /yt-db/db --port 27017

# background
# mongod --fork --dbpath /yt-db/db --port 27017 --logpath /yt-db/log/mongod.log
# sleep 5

