
==== target 的描述

1. 运行在 phantomjs 之上。
2. 不支持es6，比如 () => {}、import、setTimeout 是不支持的。
3. *.dev.js 为正在测试中的文件，npm run dev 时运行，结果会被写入。
4. example.back.js 为示例，npm run example 时运行。
5. *.back.js 为停止开发的文件，不会运行。
