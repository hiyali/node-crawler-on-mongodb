#!/bin/bash
DATEVAR=$(date +%Y-%m-%d_%H-%M-%S)
CRAWL_NUM=1
if [ $1 ]; then
  CRAWL_NUM=$1
fi
./node_modules/.bin/babel-node ./src/crawl.js --crawl-number $CRAWL_NUM 2>&1 >> ./logs/crawl_$DATEVAR.log # --dev-mode

# crontab -e # (Not require sudo)
# 23 9 * * * cd pmm/crawler && ./src/sh/crawl.sh
