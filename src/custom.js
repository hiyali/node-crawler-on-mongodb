// import path from 'path'
// import childProc from 'child_process'
// import phantomjs from 'phantomjs-prebuilt'
// import fs from 'fs'
import distance from 'jaro-winkler' // 'leven'

import { Log, MongoDB/* , GetTargets, ApiServer */ } from './lib'

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

// 5aa8943edb90e25cd6edde5d , tking.cn 5aa88d48db90e25cd6edd5a2
const l5 = distance('上海《糊涂戏班》话剧8.30-9.9', '【上海站】 欧美当代戏剧典藏演出季 英国经典闹剧 《糊涂戏班》')
Log('l5: ' + l5)

// 5aa8943edb90e25cd6edde5d , piaoniu.com 5aa629870cb14328026cbb2d
const l6 = distance('上海《糊涂戏班》话剧8.30-9.9', '[上海] 糊涂戏班')
Log('l6: ' + l6)

// update some
const site_urlList = ['piaoniu.com', 'tking.cn']
site_urlList.forEach((site_url) => {
  MongoDB.updateMany({ site_url, related_ticket_id: { $nin: ['', null, false ] } }, { $set: { related_ticket_id: false } }, { w: 1 }, (result) => {
    Log(result)
  }, { name: 'tickets' })
  MongoDB.find({ site_url, related_ticket_id: { $nin: ['', null, false ] } }, (result) => {
    Log(JSON.stringify(result))
  }, { name: 'tickets' })
})
// */
