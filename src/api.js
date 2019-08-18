import { ApiServer, MongoDB } from './lib'

const { exec } = require('child_process')
let CRAWLING = false

ApiServer.server.get('/test/:name', function (req, res, next) {
  res.send(req.params)
  return next()
})

ApiServer.server.put('/api/category', function (req, res, next) {
  const bodyJson = req.params
  const category = bodyJson.category
  const thumbnail = bodyJson.thumbnail
  let setData = {}

  if (thumbnail) {
    setData = { thumbnail }
  }

  MongoDB.updateOne({ category }, { $set: setData }, { w: 1 }, (result) => {
    res.charSet('utf-8')
    res.send(result)
  }, { name: 'category', dbName: 'youtubeMusic' })
  // */
  return next()
})

ApiServer.server.get('/once', function (req, res, next) {
  res.charSet('utf-8')

  if (CRAWLING) {
    res.send('Crawling... try after 1 minute')
    return next()
  }
  CRAWLING = true
  setTimeout(() => {
    CRAWLING = false
  }, 60 * 1000)
  res.send('Crawl and sync will take a few minutes...')

  exec('/home/ubuntu/pmm/crawler/src/sh/crawl_once.sh', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`Once excuted with: ${err}`)
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
  })

  return next()
})

ApiServer.run()
