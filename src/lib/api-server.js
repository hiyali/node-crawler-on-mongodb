import restify from 'restify'

import { Log, MongoDB } from './index.js'

const server = restify.createServer({
  name: 'HuntCrawlerApi',
  version: '0.0.1'
})
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())


server.get('/api/tickets', function (req, res, next) {
  MongoDB.find(req.params, (result) => {
    res.charSet('utf-8')
    res.send(result)
  })
  return next()
})
server.get('/api/tickets/:id', function (req, res, next) {
  const id = req.params.id
	const ObjectId = MongoDB.ObjectId
  MongoDB.findOne({ _id: new ObjectId(id) }, (result) => {
    res.charSet('utf-8')
    res.send(result)
  })
  return next()
})

server.post('/api/tickets', function (req, res, next) {
  const bodyJson = req.params
  // res.send(bodyJson)

  if (bodyJson && bodyJson.hasOwnProperty('length')) {
    MongoDB.insertMany(req.params, (result) => {
      res.charSet('utf-8')
      res.send(result)
    })
  } else {
    res.send('Please send JSON list.')
  }
  // */
  return next()
})

server.put('/api/tickets/handled', function (req, res, next) {
  const bodyJson = req.params
  // res.send(bodyJson)

  MongoDB.updateMany(bodyJson, { $set: { handled: true } }, { w: 1 }, (result) => {
    res.charSet('utf-8')
    res.send(result)
  })
  // */
  return next()
})
server.put('/api/tickets/handled/:id', function (req, res, next) {
  const id = req.params.id
	const ObjectId = MongoDB.ObjectId

  MongoDB.updateOne({ _id: new ObjectId(id) }, { $set: { handled: true } }, { w: 1 }, (result) => {
    res.charSet('utf-8')
    res.send(result)
  })
  // */
  return next()
})

server.del('/api/tickets/:id', function (req, res, next) {
  const id = req.params.id
	const ObjectId = MongoDB.ObjectId
  MongoDB.deleteOne({ _id: new ObjectId(id) }, { w: 1 }, (result) => {
    res.charSet('utf-8')
    res.send(result)
  })
  return next()
})

server.get('/test/:name', function (req, res, next) {
  res.send(req.params)
  return next()
})

const run = () => {
  server.listen(5555, function () {
    Log(`${server.name} listening at ${server.url}`)
  })
}

export default {
  run,
  server
}
