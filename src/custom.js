// import path from 'path'
// import childProc from 'child_process'
// import phantomjs from 'phantomjs-prebuilt'
// import fs from 'fs'

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

// For test multi index in levels
MongoDB.insertOne({ 'phantomjs': 'saved to mongodb' }, Log, { name: 'levels' })
// date_step + url + date_time + name is unique
MongoDB.insertOne({
  date_step: '20180309_1',
  url: 'https://piaoniu.com/asdfjlk/adf',
  date_time: '2016djf01239jakdfjl2',
  name: 'salamjan'
}, Log, { name: 'levels' })

MongoDB.insertOne({
  date_step: '20180309_1',
  url: 'https://piaoniu.com/asdfjlk/adf',
  date_time: '2016djf01239jakdfjl2',
  name: 'salamjan'
}, Log, { name: 'levels' })
