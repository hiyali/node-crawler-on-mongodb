#!/bin/bash
DATEVAR=$(date +%y-%m-%d_%H)
CRAWL_NUM=1
if [ $1 ]; then
  CRAWL_NUM=$1
fi

mongodump --db youtubeMusic -o ./ && tar -zcvf ytMs-$DATEVAR.tar.gz youtubeMusic && rm -rf youtubeMusic

# move to ~/pmm/dl to use.
