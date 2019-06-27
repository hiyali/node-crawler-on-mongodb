#!/bin/bash
DATEVAR=$(date +%y-%m-%d_%H)

mongodump --db youtubeMusic -o ./ && tar -zcvf ytMs-$DATEVAR.tar.gz youtubeMusic && rm -rf youtubeMusic

# move to ~/pmm/dl to use.
# restore:
# tar -xvzf community_images.tar.gz
# mongorestore --host <database-host> -d <database-name> --port <database-port> foldername
