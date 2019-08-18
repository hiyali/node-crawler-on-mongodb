import { MongoClient, ObjectID } from 'mongodb'
import test from 'assert'

import { Log } from './index.js'
// const Log = () => {} // Use this Log function logs will disappear

// Connection URL
const urlPrefix = 'mongodb://localhost:27017/'
const databaseName = 'youtubeMusic'
const collectionName = 'music'

// for Connected
const MongoDo = (toDo, { dbName } = { dbName: databaseName }) => {
  MongoClient.connect(urlPrefix + dbName, function (err, db) {
    if (err) {
      Log(err)
      return
    }

    test.equal(null, err)
    // Log('MongoClient connected correctly to server')

    toDo(db, () => {
      db.close()
      Log('MongoClient is closing...')
    })
  })
}

const insertMany = function (
  dataList = [],
  resultCB = () => {},
  { name, dbName } = { name: collectionName, dbName: databaseName }
) {
  const toDo = (db, doneCB) => {
    Log('Prepare to insert dataList', JSON.stringify(dataList), `to ${name}`)

    const dataLength = dataList.length
    const collection = db.collection(name)
    collection.insertMany(dataList, {
      ordered: false
    }, function(err, result) {
      // test.equal(err, null)
      if (err) {
        Log(err)
      } else {
        test.equal(dataLength, result.result.n)
        test.equal(dataLength, result.ops.length)

        Log(`Inserted ${dataLength} items in ${name} of ${dbName}`)
      }

      resultCB(result)
      doneCB(result)
    })
  }

  MongoDo(toDo, { dbName })
}

const insertOne = function (
  data = null,
  resultCB = () => {},
  { name, dbName } = { name: collectionName, dbName: databaseName }
) {
  test.ok(!!data && data !== '')
  Log('Prepare to insert data', JSON.stringify(data), `to ${name}`)

  const toDo = (db, doneCB) => {
    const collection = db.collection(name)
    collection.insertOne(data, function(err, result) {
      // test.equal(err, null)
      if (err) {
        Log(err)
      } else {
        test.equal(1, result.result.n)
        test.equal(1, result.ops.length)

        Log('Inserted', JSON.stringify(data), `into the ${name} collection`)
      }

      resultCB(result)
      doneCB(result)
    })
  }

  MongoDo(toDo, { dbName })
}

const find = function (
  query = {},
  resultCB = () => {},
  { name, skip, limit, sort, dbName },
) {
  const toDo = (db, doneCB) => {
    dbName = dbName || databaseName
    name = name || collectionName
    skip = skip ? parseInt(skip) : 0
    limit = limit ? parseInt(limit) : 10
    sort = sort ? JSON.parse(sort) : {}

    Log('Prepare to find the query:', JSON.stringify(query), `with options ${JSON.stringify({ skip, limit, sort })}`, `in ${name} of ${dbName}`)

    const collection = db.collection(name)
    collection
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .toArray(function(err, result) {
        test.equal(err, null)

        Log(`Found the following ${result.length} records`)
        // console.dir(result)

        resultCB(result)
        doneCB(result)
      })
  }

  MongoDo(toDo, { dbName })
}

const findOne = function (
  query = {},
  resultCB = () => {},
  { name, dbName } = { name: collectionName, dbName: databaseName }
) {
  const toDo = (db, doneCB) => {
    Log('Prepare to find the query:', JSON.stringify(query), `in ${name} of ${dbName}`)

    const collection = db.collection(name)
    collection.findOne(query, {}, function(err, result) {
      test.equal(err, null)

			if (result) {
				Log(`Found record with filter: ${JSON.stringify(query)}`)
				// console.dir(result)
				resultCB(result)
			} else {
				Log('Not found any record')
				resultCB({message: 'Not found'})
			}
			doneCB(result)
    })
  }

  MongoDo(toDo, { dbName })
}

const deleteMany = function (
  query = {},
  resultCB = () => {},
  { name, dbName } = { name: collectionName, dbName: databaseName }
) {
  const toDo = (db, doneCB) => {
    Log('Prepare to delete with query:', JSON.stringify(query), `in ${name}`)

    const collection = db.collection(name)
    collection.deleteMany(query, { w: 1 }, function(err, result) {
      test.equal(err, null)

      Log(`Deleted the following ${result.length} records`, `in ${name} of ${dbName}`)

      resultCB(result)
      doneCB(result)
    })
  }

  MongoDo(toDo, { dbName })
}

const createIndex = function (
  fieldOrSpec = '' || {},
  resultCB = () => {},
  options = {},
  { name, dbName } = { name: collectionName, dbName: databaseName }
) {
  const toDo = (db, doneCB) => {
    Log(`Prepare to create Index for ${JSON.stringify(fieldOrSpec)} with options ${JSON.stringify(options)}`)

    const collection = db.collection(name)
    collection.createIndex(fieldOrSpec, options, function(err, indexName) {
      test.equal(err, null)

      Log(`Created Index for ${indexName} with options`, JSON.stringify(options))

      resultCB(indexName)
      doneCB(indexName)
    })
  }

  MongoDo(toDo, { dbName })
}

const updateMany = function (
  filter = {},
  update = {},
  options = {},
  resultCB = () => {},
  { name, dbName } = { name: collectionName, dbName: databaseName }
) {
  const toDo = (db, doneCB) => {
    Log(`Prepare to updateMany with filter ${JSON.stringify(filter)} and`, JSON.stringify(update))

    const collection = db.collection(name)
    collection.updateMany(filter, update, options, function(err, result) {
      test.equal(err, null)

      Log(`Update mathced ${result.mathcedCount} modified ${result.modifiedCount}`)

      resultCB(result)
      doneCB(result)
    })
  }

  MongoDo(toDo, { dbName })
}

const updateOne = function (
  filter = {},
  update = {},
  options = {},
  resultCB = () => {},
  { name, dbName } = { name: collectionName, dbName: databaseName }
) {
  const toDo = (db, doneCB) => {
    Log(`Prepare to updateOne with filter ${JSON.stringify(filter)} and`, JSON.stringify(update))

    const collection = db.collection(name)
    collection.updateOne(filter, update, options, function(err, result) {
      test.equal(err, null)

      Log(`Updated! matched ${result.n} modified ${result.nModified}`)

      resultCB(result)
      doneCB(result)
    })
  }

  MongoDo(toDo, { dbName })
}

const deleteOne = function (
  filter = {},
  options = {},
  resultCB = () => {},
  { name, dbName } = { name: collectionName, dbName: databaseName }
) {
  const toDo = (db, doneCB) => {
    Log(`Prepare to deleteOne with filter ${JSON.stringify(filter)} with options`, JSON.stringify(options))

    const collection = db.collection(name)
    collection.deleteOne(filter, options, function(err, result) {
      test.equal(err, null)

      Log(`Removed ${result.n} item!`)

      resultCB(result)
      doneCB(result)
    })
  }

  MongoDo(toDo, { dbName })
}

const count = function (
  query = {},
  resultCB = () => {},
  { name, dbName } = { name: collectionName, dbName: databaseName }
) {
  const toDo = (db, doneCB) => {
    Log(`Prepare to get count with query ${JSON.stringify(query)}`)

    const collection = db.collection(name)
    collection.count(query, function(err, result) {
      test.equal(err, null)

      Log(`Count result ${result} records!`)

      resultCB(result)
      doneCB(result)
    })
  }

  MongoDo(toDo, { dbName })
}

export default {
  Client: MongoClient,
	ObjectId: ObjectID,
  Do: MongoDo,
  version: '0.0.1',

  urlPrefix,
  collectionName,
  databaseName,
  test,

  insertMany,
  insertOne,
  find,
  findOne,
  deleteMany,
  createIndex,
  updateMany,
  updateOne,
  deleteOne,
  count,
}
