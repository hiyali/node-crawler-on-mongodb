// import path from 'path'
// import childProc from 'child_process'
// import phantomjs from 'phantomjs-prebuilt'
// import fs from 'fs'
import distance from 'jaro-winkler' // 'leven'

import { Log/*, MongoDB , GetTargets, ApiServer */ } from './lib'

/*
// use MongoDB lib example
MongoDB.find({ salam: 1 }, Log)
MongoDB.insertMany([{ 'salam': 'dawran' }, { 'dawran': 'alim' }], Log)
MongoDB.insertOne({ 'phantomjs': 'saved to mongodb' }, Log)
MongoDB.deleteMany({ 'url': { '$exists': false } }, Log) // 删除没有 url 字段的记录
MongoDB.updateMany({}, { $set: { status: 0 } }, { w: 1 }, (result) => {
  Log(result)
})
// */

/*
// For test multi index in levels
MongoDB.insertOne({ 'phantomjs': 'saved to mongodb' }, Log, { name: 'levels' })
// date_step + url + date_time + name is unique
MongoDB.insertOne({
  date_step: '20180309_1',
  ticket_parent_id: 'a219d192b64bbd487e9a96',
  date_time: '2018年03月31日 周六 20:00',
  name: '380元特价'
}, Log, { name: 'levels' })

MongoDB.insertOne({
  date_step: '20180309_1',
  ticket_parent_id: 'a219d192b64bbd487e9a96',
  date_time: '2018年03月31日 周六 20:00',
  name: '380元特价'
}, Log, { name: 'levels' })
// */

// Leven test, smaller means similarly
const l = distance('你好么英国人哈哈哈', '你好么英国人哈哈哈')
Log('l: ' + l)

const l1 = distance('哈你好么英国人', '英国人哈哈你好么')
Log('l1: ' + l1)

const l2 = distance('哈你好么英国人呵', '杀飞呵呵')
Log('l2: ' + l2)

const l3 = distance('哈哈哈你好么英国人', '哈哈哈杀杀杀飞飞飞')
Log('l3: ' + l3)

const l4 = distance('杀杀杀飞飞飞呵呵呵', '哈哈哈你好么英国人呵呵呵')
Log('l4: ' + l4)
