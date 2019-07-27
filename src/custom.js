import { Log, MongoDB/* , GetTargets, ApiServer */ } from './lib'

/*
MongoDB.findOne({ aim: 'crawler-conf' }, (result) => {
  result.data.forEach((item) => {
    Log(item.id, item.category)
    if (!item.runMode) {
      MongoDB.updateOne({ category: item.category }, { $set: { playlistId: item.id } }, { w: 1 }, Log, { name: 'category' })
    } else {
      MongoDB.updateOne({ category: item.category }, { $set: { playlistId: item.id, runMode: item.runMode } }, { w: 1 }, Log, { name: 'category' })
    }
  })
}, { name: 'config' })
// */

/*
const baseUrl = 'https://s3.us-east-2.amazonaws.com/music-of-pomm/cate/'

MongoDB.find({ page: 'top-charts' }, (result) => {
  result.forEach((item) => {
    const imageUrl = baseUrl + item.category + '.jpg'
    Log(imageUrl)
    MongoDB.updateOne({ title: item.title }, { $set: { thumbnail: imageUrl } }, { w: 1 }, Log, { name: 'category' })
  })
  Log(result.length)
}, { name: 'category' })
// */

// MongoDB.deleteOne({ page: 'home1' }, { w: 1 }, Log, { name: 'category' })
// MongoDB.updateOne({ page: 'home1' }, { $set: { page: 'home' } }, { w: 1 }, Log, { name: 'category' }) // */
/*
MongoDB.updateMany({ page: 'top-charts1' }, { $set: { page: 'top-charts' } }, { w: 1 }, (result) => {
  Log(result)
}, { name: 'category' }) // */

/*
const categoryListJson = [
  {
    title: 'Timeless Dinner Music & Calm New Pop Hits',
    thumbnail: 'https://lh3.googleusercontent.com/q2W_j295X5-3TGaD4hDAoi60hOSEwIgVOkgP1XaQjdD_midOl_AUrwh5rt9HEPRCHNEQrT-VSA=s576',
    category:  'timeless-calm-pop',
    page: 'home1',
    sortNum: 17,
  },
]

MongoDB.insertMany(categoryListJson, Log, { name: 'category' }) // */
/*
MongoDB.insertOne({ aim: 'game-list', desc: 'For API', data: [
  {
    'name': '2048',
    'thumbnail': 'https://games.instamusic.xyz/2048/thumbnail.png',
    'showADFirst': false,
    'url': 'https://games.instamusic.xyz/2048/'
  },
  {
    'name': '1010',
    'thumbnail': 'https://games.instamusic.xyz/1010/thumbnail.jpg',
    'showADFirst': true,
    'url': 'https://games.instamusic.xyz/1010/'
  },
  {
    'name': 'Sudoku',
    'thumbnail': 'https://games.instamusic.xyz/sudoku/thumbnail.png',
    'showADFirst': true,
    'url': 'https://sudoku.jull.dev/'
  }
] }, Log, { name: 'config' }) // */

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
