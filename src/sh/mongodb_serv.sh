#!/bin/bash

# foreground
# mongod --dbpath $(PWD)/db --port 27188
mongod --dbpath /hunt/db --port 27188

# background
# mongod --fork --dbpath /hunt/db --port 27188 --logpath /hunt/log/mongod.log
# sleep 5

