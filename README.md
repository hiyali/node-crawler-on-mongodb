# Nodejs Phantomjs Crawler on Mongodb

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

### 1. Clone
```shell
git clone https://github.com/hiyali/node-crawler-on-mongodb.git crawler
cd crawler
```

### 2. Install
```shell
npm i
```
or
```shell
yarn
```

### 3. Start Mongodb server
```shell
./src/sh/mongodb_serv.sh
```

### 4. Start Crawl and Serve for data
```shell
npm start
```

### 5. The finished API (default on: http://localhost:5555)

| Methods            | Uri                      | { Header } Body      | Explain             |
| ------------------ | ------------------------ | -------------------- | ------------------- |
| GET                | /api/tickets             |                      | Pageable and sort with ?skip=10&limit=20&sort={"price":-1} (skip = page * limit), filter with query ?title=mongo&price=50USD |
| POST               | /api/tickets             | {Content-Type: application/json} [] | Save multiple inserts |
| GET                | /api/tickets/:id         |                      | Get one             |
| DELETE             | /api/tickets/:id         |                      | Delete One          |
| PUT                | /api/tickets             |                      | Update multiple, You also can use like this `$set={"status":2}` |
| PUT                | /api/tickets/:id         |                      | Update One          |

## Design

![Crawler design](https://raw.githubusercontent.com/hiyali/nodejs-phantomjs-mongodb-crawler/master/assets/design.png "Crawler design")

## Development

Crawl rules at src/targets/*

```shell
npm run api # Run data api
npm run crawl # Run crawl (src/targets/*.js, not *.back.js)
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
