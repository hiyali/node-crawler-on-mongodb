# Hunt Crawler

* Nodejs + Phantomjs 爬虫
  * （还没有做正规的队列）
  * 支持抓取 SPA
  * 可以针对更多的网站扩展爬虫规则
    * - 只关心一个网站的抓取规则
* 数据管理接口
* Mongo 存储
  * DB Api 简化

## 依赖

* MongoDB (3.2 +)
* NodeJS (6.0.0 +)

## 使用说明

### 1. 启动 Mongodb 服务
```shell
./src/sh/mongodb_serv.sh
```
### 2. 开始启动爬虫，并监听 5555 端口
```shell
npm start
```

### 3. 现有的 API

```java
/api/tickets # (get) 获取所有数据，分页 ?skip=10&limit=20&sort={"price":-1}，skip 是跳过多少个记录，相当于 skip = page * limit
/api/tickets?title=重庆&price=48元 # (get) 查询
/api/tickets # (post, Content-Type: application/json, []) 保存多个数据
/api/tickets/:id # (get) 用ID获取对应的数据
/api/tickets/:id # (delete) 用ID删除对应的记录
/api/tickets # (put) 全部标记已处理，也可以用 $set={"status":2} 形式来改其他字段
/api/tickets/:id # (put) 标记一条数据已处理，也可以用 $set={"status":2} 形式来改其他字段
```

## 调试说明

爬虫规则文件存储在 src/targets/*

```shell
npm run api # 只有 api 运行
npm run crawl # 只有 爬虫运行
npm run custom # 只有 custom.js 运行
npm run dev # 执行 *.dev.js 的爬虫文件
npm run example # 执行 example.back.js 爬虫示例，无写入到数据库的步骤
npm run phantomjs ./src/targets/**.js # 执行某一 ** 爬虫文件
npm run start # 执行 爬虫 并 运行 api
```

## 已定义的参数

* ./node_modules/babel-cli/bin/babel-node.js ./src/** --**
```shell
--dont-save-data # 不要把临时文件存到数据库里
--just-get-dev-file # 只取 *.dev.js
```

* ./node_modules/phantomjs-prebuilt/bin/phantomjs ./src/targets/**.js --**
```shell
--temp-file # 指定临时文件的路径
```
