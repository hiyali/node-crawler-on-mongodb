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
    res.send(result)
  })
  return next()
})

server.get('/test/:name', function (req, res, next) {
  res.send(req.params)
  return next()
})

server.listen(5555, function () {
  Log(`${server.name} listening at ${server.url}`)
})

export default server
