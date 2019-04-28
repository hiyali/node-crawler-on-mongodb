import { Log, MongoDB/* , GetTargets, ApiServer */ } from './lib'

// MongoDB.updateOne({ title: 'Trending' }, { $set: { title: 'U.S. Trending' } }, { w: 1 }, Log, { name: 'category' }) // */
MongoDB.updateMany({ page: 'top-charts1' }, { $set: { page: 'top-charts' } }, { w: 1 }, (result) => {
  Log(result)
}, { name: 'category' })

/*
const categoryListJson = [
  // latest/top-tracks
  {
    title:     'iTunes Top 100 (U.S.)',
    thumbnail: 'https://lh3.googleusercontent.com/q2W_j295X5-3TGaD4hDAoi60hOSEwIgVOkgP1XaQjdD_midOl_AUrwh5rt9HEPRCHNEQrT-VSA=s576',
    category:  'top-100-itunes-us',
    page: 'top-charts1',
  },
  {
    title:     'Billboard Hot',
    thumbnail: 'https://lh3.googleusercontent.com/q2W_j295X5-3TGaD4hDAoi60hOSEwIgVOkgP1XaQjdD_midOl_AUrwh5rt9HEPRCHNEQrT-VSA=s576',
    category:  'hot-100-billboard',
    page: 'top-charts1',
  },
  {
    title:     'The Official UK Top',
    thumbnail: 'https://lh3.googleusercontent.com/q2W_j295X5-3TGaD4hDAoi60hOSEwIgVOkgP1XaQjdD_midOl_AUrwh5rt9HEPRCHNEQrT-VSA=s576',
    category:  'top-100-official-uk',
    page: 'top-charts1',
  },
  {
    title:     'Top K-Pop Music',
    thumbnail: 'https://lh3.googleusercontent.com/q2W_j295X5-3TGaD4hDAoi60hOSEwIgVOkgP1XaQjdD_midOl_AUrwh5rt9HEPRCHNEQrT-VSA=s576',
    category:  'top-k-pop',
    page: 'top-charts1',
  },
  // top-100-world/top-100-us/top-tracks-turkey/trending-20-us/top-100-itunes-us/hot-100-billboard/top-100-official-uk/top-k-pop
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
