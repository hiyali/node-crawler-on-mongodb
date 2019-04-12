import { ApiServer, MongoDB } from './lib'

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
  }, { name: 'category' })
  // */
  return next()
})

ApiServer.run()
