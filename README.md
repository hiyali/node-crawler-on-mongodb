# Nodejs Phantomjs Mongodb Crawler

* Nodejs + Phantomjs crawler
  * support to crawl the SPA
  * support to crawl multiple pages
* Data management api
* Mongo Database
  * MongoDB Api simplify

## Requirements

* MongoDB (3.2 +)
* NodeJS (6.0.0 +)

## Usage

### 1. start Mongodb server
```shell
./src/sh/mongodb_serv.sh
```
### 2. start Crawl and Serve for data
```shell
npm start
```

### 3. The finished API

```java
(GET) /api/tickets # Pageable ?skip=10&limit=20&sort={"price":-1} (skip = page * limit)
(GET) /api/tickets?title=mongo&price=50USD # filter
(POST, Content-Type: application/json, []) /api/tickets # Save multiple inserts
(GET) /api/tickets/:id # Get one
(DELETE) /api/tickets/:id # Delete One
(PUT) /api/tickets # Update multiple, You also can use like this `$set={"status":2}`
(PUT) /api/tickets/:id # Update One
```

## Development

Crawl rules at src/targets/*

```shell
npm run api # Run data api
npm run crawl # Run crawl
npm run custom # Run custom.js
npm run dev # Run src/targets/*.dev.js
npm run example # Run src/targets/example.back.js , and not save the data to mongo
npm run phantomjs ./src/targets/**.js # Run a crawl rule file
npm run start # Run data api and crawl
```

## Params

* ./node_modules/babel-cli/bin/babel-node.js ./src/** --**
```shell
--dont-save-data # Not save data to mongobb
--just-get-dev-file # Just *.dev.js
```

* ./node_modules/phantomjs-prebuilt/bin/phantomjs ./src/targets/**.js --**
```shell
--temp-file # Set the temp file path
```
