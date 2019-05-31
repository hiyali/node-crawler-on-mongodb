#!/bin/bash
DATEVAR=$(date +%Y-%m-%d_%H-%M-%S)
CRAWL_NUM=1
if [ $1 ]; then
  CRAWL_NUM=$1
fi
./node_modules/.bin/babel-node ./src/crawl.js --crawl-once-item --crawl-number $CRAWL_NUM 2>&1 >> ./logs/crawl_$DATEVAR.once.log && cd /home/ubuntu/pmm/syncer/ && ./sh/sync_once.sh
