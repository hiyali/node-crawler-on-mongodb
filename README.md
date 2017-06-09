# Hunt Crawler

* Nodejs + Phantomjs 爬虫
  * （还没有做正规的队列）
  * 支持抓取 SPA
  * 可以针对更多的网站扩展爬虫规则
    * - 只关心一个网站的抓去规则
* 数据接口
  * （还没有做缓存）
  * 存储数据接口
    * - 支持多项存储
  * 读取数据接口
    * - 支持联合查询
* Mongo 存储
  * Api 简化

## 使用说明

### 启动 Mongodb 服务
```shell
./src/sh/mongodb_serv.sh
```
### 开始启动爬虫，并监听 5555 端口
```shell
npm start
```

### 现有的 API

* 读取 GET

地址： /api/tickets(/:id)?
```java
/api/tickets # 获取所有数据
/api/tickets/234jfasf0uwef0sadfj # 用ID获取某一项数据
/api/tickets?title=重庆&price=48元
```

* 写入 POST

地址： /api/tickets

请求头： Content-Type: application/json

请求 Body： [{...}, {...}]

## 调试说明

爬虫规则文件存储在 src/targets/*

```shell
npm run example # 执行 example.back.js 爬虫示例，无写入到数据库的步骤
npm run dev # 执行 *.dev.js 的爬虫文件
npm run target ./src/targets/**.js # 执行某一 ** 爬虫文件
```
