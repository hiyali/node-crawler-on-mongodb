import { ApiServer } from './lib'

ApiServer.server.get('/test/:name', function (req, res, next) {
  res.send(req.params)
  return next()
})

ApiServer.run()
