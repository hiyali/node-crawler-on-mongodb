import restify from 'restify'

import { Log, MongoDB } from './index.js'

const server = restify.createServer({
  name: 'HuntCrawlerApi',
  version: '0.0.1'
})
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

server.use(
  function crossOrigin (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    return next()
  }
)

/*
 * Tickets
 */
server.get('/api/tickets/count', function (req, res, next) {
  const query = req.params

  MongoDB.count(query, (result) => {
    res.charSet('utf-8')
    res.send({ count: result })
  })
  return next()
})
server.get('/api/tickets', function (req, res, next) {
  const query = req.params
  const options = JSON.parse(JSON.stringify(query))

  delete query['name']
  delete query['skip']
  delete query['limit']
  delete query['sort']

  MongoDB.find(query, (result) => {
    res.charSet('utf-8')
    res.send(result)
  }, options) // just use skip, limit, sort, name
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
    MongoDB.insertMany(bodyJson, (result) => {
      res.charSet('utf-8')
      res.send(result)
    })
  } else {
    res.send('Please send JSON list.')
  }
  // */
  return next()
})

server.put('/api/tickets', function (req, res, next) {
  const bodyJson = req.params
  let setData = { status: 1 }

  if (bodyJson['$set']) {
    setData = JSON.parse(bodyJson['$set'])
    delete bodyJson['$set']
  }

  MongoDB.updateMany(bodyJson, { $set: setData }, { w: 1 }, (result) => {
    res.charSet('utf-8')
    res.send(result)
  })
  // */
  return next()
})
server.put('/api/tickets/:id', function (req, res, next) {
	const ObjectId = MongoDB.ObjectId
  const bodyJson = req.params
  const id = bodyJson.id
  let setData = { status: 1 }

  if (bodyJson['$set']) {
    setData = JSON.parse(bodyJson['$set'])
    delete bodyJson['$set']
  }

  MongoDB.updateOne({ _id: new ObjectId(id) }, { $set: setData }, { w: 1 }, (result) => {
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

/*
 * Levels
 */
server.get('/api/levels/count', function (req, res, next) {
  const query = req.params

  MongoDB.count(query, (result) => {
    res.charSet('utf-8')
    res.send({ count: result })
  }, { name: 'levels' })
  return next()
})
server.get('/api/levels', function (req, res, next) {
  const query = req.params
  const options = JSON.parse(JSON.stringify(query))

  delete query['name']
  delete query['skip']
  delete query['limit']
  delete query['sort']

  MongoDB.find(query, (result) => {
    res.charSet('utf-8')
    res.send(result)
  }, { ...options, ...{ name: 'levels' }}) // just use skip, limit, sort, name
  return next()
})
server.get('/api/levels/:id', function (req, res, next) {
  const id = req.params.id
	const ObjectId = MongoDB.ObjectId
  MongoDB.findOne({ _id: new ObjectId(id) }, (result) => {
    res.charSet('utf-8')
    res.send(result)
  }, { name: 'levels' })
  return next()
})

server.post('/api/levels', function (req, res, next) {
  const bodyJson = req.params
  // res.send(bodyJson)

  if (bodyJson && bodyJson.hasOwnProperty('length')) {
    MongoDB.insertMany(bodyJson, (result) => {
      res.charSet('utf-8')
      res.send(result)
    }, { name: 'levels' })
  } else {
    res.send('Please send JSON list.')
  }
  // */
  return next()
})

server.put('/api/levels', function (req, res, next) {
  const bodyJson = req.params
  let setData = { status: 1 }

  if (bodyJson['$set']) {
    setData = JSON.parse(bodyJson['$set'])
    delete bodyJson['$set']
  }

  MongoDB.updateMany(bodyJson, { $set: setData }, { w: 1 }, (result) => {
    res.charSet('utf-8')
    res.send(result)
  }, { name: 'levels' })
  // */
  return next()
})
server.put('/api/levels/:id', function (req, res, next) {
	const ObjectId = MongoDB.ObjectId
  const bodyJson = req.params
  const id = bodyJson.id
  let setData = { status: 1 }

  if (bodyJson['$set']) {
    setData = JSON.parse(bodyJson['$set'])
    delete bodyJson['$set']
  }

  MongoDB.updateOne({ _id: new ObjectId(id) }, { $set: setData }, { w: 1 }, (result) => {
    res.charSet('utf-8')
    res.send(result)
  }, { name: 'levels' })
  // */
  return next()
})

server.del('/api/levels/:id', function (req, res, next) {
  const id = req.params.id
	const ObjectId = MongoDB.ObjectId
  MongoDB.deleteOne({ _id: new ObjectId(id) }, { w: 1 }, (result) => {
    res.charSet('utf-8')
    res.send(result)
  }, { name: 'levels' })
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
