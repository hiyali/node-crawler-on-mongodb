
## target 的描述

1. 运行在 phantomjs 之上。
2. 不支持es6，比如 () => {}、import、setTimeout、let、function (options = {}) {} 等是不支持的。
3. *.js (非 *.back.js) 为爬取的目标文件，npm run crawl 时运行，结果会被写入。
4. *.dev.js 为正在测试中的文件，npm run crawl:dev 时运行，结果会被写入。
5. example.back.js 为示例，npm run example 时运行，结果不会被写入到数据库。
6. *.back.js 为停止开发的文件，非特殊处理的情况下，不会运行它。
