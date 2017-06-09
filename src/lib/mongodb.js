import { MongoClient, ObjectID } from 'mongodb'
import test from 'assert'

import { Log } from './index.js'

// Connection URL
const url = 'mongodb://localhost:27188/huntCrawler'

// for Connected
const MongoDo = (toDo) => {
  MongoClient.connect(url, function (err, db) {
    test.equal(null, err)
    Log('MongoClient connected correctly to server')

    toDo(db, (result) => {
      db.close()
      Log('MongoClient closed')
    })
  })
}

const insertMany = function (
  dataList = [],
  resultCB = () => {},
  { name } = { name: 'tickets' }
) {
  const toDo = (db, doneCB) => {
    Log('Prepare to insert dataList', JSON.stringify(dataList), `to ${name}`)

    const dataLength = dataList.length
    const collection = db.collection(name)
    collection.insertMany(dataList, function(err, result) {
      test.equal(err, null)
      test.equal(dataLength, result.result.n)
      test.equal(dataLength, result.ops.length)

      Log(`Inserted ${dataLength} items into the ${name} collection`)

      resultCB(result)
      doneCB(result)
    })
  }

  MongoDo(toDo)
}

const insertOne = function (
  data = null,
  resultCB = () => {},
  { name } = { name: 'tickets' }
) {
  test.ok(!!data && data !== '')
  Log('Prepare to insert data', JSON.stringify(data), `to ${name}`)

  const toDo = (db, doneCB) => {
    const collection = db.collection(name)
    collection.insertOne(data, function(err, result) {
      test.equal(err, null)
      test.equal(1, result.result.n)
      test.equal(1, result.ops.length)

      Log('Inserted', JSON.stringify(data), `into the ${name} collection`)

      resultCB(result)
      doneCB(result)
    })
  }

  MongoDo(toDo)
}

const find = function (
  query = {},
  resultCB = () => {},
  { name, page, perPage } = { name: 'tickets', page: 1, perPage: 10 }
) {
  const toDo = (db, doneCB) => {
    Log('Prepare to find the query:', JSON.stringify(query), `in ${name}`)

    const collection = db.collection(name)
    collection.find(query).toArray(function(err, result) {
      test.equal(err, null)

      Log(`Found the following ${result.length} records`)
      // console.dir(result)

      resultCB(result)
      doneCB(result)
    })
  }

  MongoDo(toDo)
}

const findOne = function (
  query = {},
  resultCB = () => {},
  { name } = { name: 'tickets' }
) {
  const toDo = (db, doneCB) => {
    Log('Prepare to find the query:', JSON.stringify(query), `in ${name}`)

    const collection = db.collection(name)
    collection.findOne(query, {}, function(err, result) {
      test.equal(err, null)

			if (result) {
				Log(`Found ${result.length} record`)
				// console.dir(result)
				resultCB(result)
			} else {
				Log(`Not found any record`)
				resultCB({message: "Not found"})
			}
			doneCB(result)
    })
  }

  MongoDo(toDo)
}

const deleteMany = function (
  query = {},
  resultCB = () => {},
  { name } = { name: 'tickets' }
) {
  const toDo = (db, doneCB) => {
    Log('Prepare to delete with query:', JSON.stringify(query), `in ${name}`)

    const collection = db.collection(name)
    collection.deleteMany(query, { w: 1 }, function(err, result) {
      test.equal(err, null)

      Log(`Deleted the following ${result.length} records`)
      // console.dir(result)

      resultCB(result)
      doneCB(result)
    })
  }

  MongoDo(toDo)
}

export default {
  Client: MongoClient,
	ObjectId: ObjectID,
  Do: MongoDo,
  insertMany,
  insertOne,
  find,
  findOne,
  deleteMany,
  version: '0.0.1'
}
