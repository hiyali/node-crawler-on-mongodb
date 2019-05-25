import { Log, MongoDB/* , GetTargets, ApiServer */ } from './lib'

MongoDB.deleteOne({ page: 'home1' }, { w: 1 }, Log, { name: 'category' })
// MongoDB.updateOne({ title: 'Trending' }, { $set: { title: 'U.S. Trending' } }, { w: 1 }, Log, { name: 'category' }) // */
/*
MongoDB.updateMany({ page: 'top-charts1' }, { $set: { page: 'top-charts' } }, { w: 1 }, (result) => {
  Log(result)
}, { name: 'category' }) // */

/*
const categoryListJson = [
  {
    title: 'Go Slower',
    thumbnail: 'https://lh3.googleusercontent.com/q2W_j295X5-3TGaD4hDAoi60hOSEwIgVOkgP1XaQjdD_midOl_AUrwh5rt9HEPRCHNEQrT-VSA=s576',
    category:  'go-slower',
    page: 'home1',
    sortNum: 16,
  },
]

MongoDB.insertMany(categoryListJson, Log, { name: 'category' }) // */

// MongoDB.deleteMany({ 'videoId': { '$exists': true } }, Log) // clear !!!

/*
MongoDB.Client.connect(MongoDB.url, function (err, db) {
  if (err) {
    Log(err)
    return
  }

  MongoDB.test.equal(null, err)
  Log('MongoClient connected correctly to server')

  db.collection(MongoDB.collectionName).dropIndex({
    category: 1,
    dateStep: 1,
    sortNum: 1,
    videoId: 1,
  })

  db.collection(MongoDB.collectionName).createIndex({
      category: 1,
      dateStep: -1,
      sortNum: 1,
      videoId: 1,
  }, { unique: true, background: true }, (err, indexName) => {
      Log(`Created Index for ${indexName} with`)
  })

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
