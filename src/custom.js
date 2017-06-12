import path from 'path'
import childProc from 'child_process'
import phantomjs from 'phantomjs-prebuilt'
import fs from 'fs'

import { Log, GetTargets, MongoDB, ApiServer } from './lib'

// use MongoDB lib example
// MongoDB.find({ salam: 1 }, Log)
// MongoDB.insertMany([{ "salam": "dawran" }, { "dawran": "alim" }], Log)
// MongoDB.insertOne({ "phantomjs": "saved to mongodb" }, Log)
// MongoDB.deleteMany({ "url": { "$exists": false } }, Log) // 删除没有 url 字段的记录

