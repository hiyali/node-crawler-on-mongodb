#!/bin/bash
DATEVAR=$(date +%Y-%m-%d_%H-%M-%S)

./node_modules/.bin/babel-node ./src/crawl.js --crawl-once-item 2>&1 >> ./logs/crawl_$DATEVAR.once.log && cd /home/ubuntu/pmm/syncer/ && ./sh/sync_once.sh
