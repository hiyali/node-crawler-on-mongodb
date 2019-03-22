import { Log, MongoDB/* , GetTargets, ApiServer */ } from './lib'

// MongoDB.deleteMany({ 'videoId': { '$exists': true } }, Log) // clear !!!

/*
MongoDB.Client.connect(MongoDB.url, function (err, db) {
  if (err) {
    Log(err)
    return
  }

  MongoDB.test.equal(null, err)
  Log('MongoClient connected correctly to server')

  db.collection(MongoDB.collectionName).dropIndexes()
  db.close()
}) // */

/*
// use MongoDB lib example
MongoDB.find({ salam: 1 }, Log)
MongoDB.insertMany([{ 'salam': 'dawran' }, { 'dawran': 'alim' }], Log)
MongoDB.insertOne({ 'phantomjs': 'saved to mongodb' }, Log)
MongoDB.deleteMany({ 'url': { '$exists': false } }, Log)
MongoDB.updateMany({}, { $set: { status: 0 } }, { w: 1 }, (result) => {
  Log(result)
})
// */
