import { Log, MongoDB/* , GetTargets, ApiServer */ } from './lib'

/*
const categoryListJson = [
  {
    title:     'New',
    thumbnail: 'https://lh3.googleusercontent.com/ecmsF5xu5mZv_wNK4lIyXYDssLnhDWScFo-FyXUbtUnb8wfsYxjfE5iASeK-dTzdDfEJr8cbLM8=w544-h544-l90-rj',
    category:  'latest',
    page: 'home',
  },
  {
    title:     'Hot',
    thumbnail: 'https://lh3.googleusercontent.com/ecmsF5xu5mZv_wNK4lIyXYDssLnhDWScFo-FyXUbtUnb8wfsYxjfE5iASeK-dTzdDfEJr8cbLM8=w544-h544-l90-rj',
    category:  'top-tracks',
    page: 'home',
  },
  // latest/top-tracks
  {
    title:     'Worldwide Top',
    thumbnail: 'https://lh3.googleusercontent.com/q2W_j295X5-3TGaD4hDAoi60hOSEwIgVOkgP1XaQjdD_midOl_AUrwh5rt9HEPRCHNEQrT-VSA=s576',
    category:  'top-100-world',
    page: 'top-charts',
  },
  {
    title:     'UnitedStatus Top',
    thumbnail: 'https://lh3.googleusercontent.com/r9n7lePHjqZz_h-_YUOIqt60GCLLU0ULCClCJBzqlcdcSYhAiUNUAgD1qKq1imzLhzrKNay_x5Y=s576',
    category:  'top-100-us',
    page: 'top-charts',
  },
  {
    title:     'Turkey Top',
    thumbnail: 'https://lh3.googleusercontent.com/ecmsF5xu5mZv_wNK4lIyXYDssLnhDWScFo-FyXUbtUnb8wfsYxjfE5iASeK-dTzdDfEJr8cbLM8=w544-h544-l90-rj',
    category:  'top-tracks-turkey',
    page: 'top-charts',
  },
  {
    title:     'Trending',
    thumbnail: 'https://lh3.googleusercontent.com/1DG4Ft_LwkRjof9HeGClwkrVv7e2fy98KXVoP7aROUGl4vsKrOBtFopWdrz_oz4p6O7vQ1vUzQ=s576',
    category:  'trending-20-us',
    page: 'top-charts',
  },
  // top-100-world/top-100-us/top-tracks-turkey/trending-20-us
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
