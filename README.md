# Node Puppeteer Crawler

> This is an example for NodeJS & Puppeteer Crawler on MongoDB with crawling playlists of youtube music
Crawl all (ALMOST) songs' information of declared playlists in youtube music

### Has features below (and more actually):

* Nodejs + Puppeteer crawler
  * Simple queue
  * Perfect SPA crawling
  * Can crawl multiple sites
    - Just focus on one site
* Data management API
* Mongo Saving
  * Simple DB Api

## Requirement

* MongoDB (3.2 +)
* NodeJS (8.0.0 +) - (Npm)

## Usage

### 1. Start Mongodb service
```shell
./src/sh/mongodb_serv.sh # not tested recently
```

### 2. Start crawling, server running on port 5556
```shell
npm start
```

### 3. Exist APIs

```java
/api/music # (get) get all data, Pagination: ?skip=10&limit=20&sort={"price":-1} , etc. skip = page * limit
/api/music?title=If I were a boy&artist=adele # (get) query
/api/music # (post, Content-Type: application/json, []) save multiple results
/api/music/:id # (get) get one item with mongodb _ID
/api/music/:id # (delete) delete on item with mongodb _ID
/api/music # (put) put all data status: 1, can use like this for other column $set={"status":2}
/api/music/:id # (put) put one record status: 1, could use like this $set={"status":2} for other columns
```

### 4. For daily jobs
```shell
./src/sh/crawl.sh # tested recently many times
```

## dev

target config folder src/targets-config/*

(crawl/api/custom command was tested)
```shell
npm run api # Just run API
npm run crawl # Run targets
npm run crawl:dev # Run dev targets (src/targets-config/*.dev.js)
npm run custom # Run custom.js
npm run example # Run example.back.js, will not save datas
npm run start # Run API & Crawl
```

## Paramsters on using

* ./node_modules/babel-cli/bin/babel-node.js ./src/** --**
```shell
--dont-save-data # wo'nt save data
--dev-mode # Just run *.dev.js and will restrict crawl times
```
