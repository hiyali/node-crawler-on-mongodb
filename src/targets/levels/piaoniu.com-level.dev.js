const webpage = require('webpage')
const system = require('system')

const page = webpage.create()

const Log = function (text) {
  const _D = new Date()
  const date = _D.getFullYear() + '/' + (_D.getMonth() + 1) + '/' + _D.getDate()
  const time = _D.getHours() + ':' + _D.getMinutes() + ':' + _D.getSeconds()
  const now = date + ' ' + time
  console.log(now, '      ', text)
}

var postEndpoint = null
var url = null
var _id = null
var date_step = null

Log('\n')
const postEndpointArgIdx = system.args.indexOf('--post-endpoint')
if (postEndpointArgIdx > -1 && system.args.length > postEndpointArgIdx + 1) {
  postEndpoint = system.args[postEndpointArgIdx + 1]
  Log('postEndpoint is: ' + postEndpoint)
} else {
  Log('The postEndpoint is not found!')
  phantom.exit(1)
}
const date_stepArgIdx = system.args.indexOf('--level-date_step')
if (date_stepArgIdx > -1 && system.args.length > date_stepArgIdx + 1) {
  date_step = system.args[date_stepArgIdx + 1]
  Log('date_step is: ' + date_step)
} else {
  Log('The date_step is not found!')
  phantom.exit(1)
}
const _idArgIdx = system.args.indexOf('--ticket-_id')
if (_idArgIdx > -1 && system.args.length > _idArgIdx + 1) {
  _id = system.args[_idArgIdx + 1]
  Log('_id is: ' + _id)
} else {
  Log('The _id is not found!')
  phantom.exit(1)
}
const urlArgIdx = system.args.indexOf('--url')
if (urlArgIdx > -1 && system.args.length > urlArgIdx + 1) {
  url = system.args[urlArgIdx + 1]
  Log('url is: ' + url)
} else {
  Log('The url is not found!')
  phantom.exit(1)
}

// --------------------
// The logic of getting level's data is here
// --------------------

function waitFor (testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
  start = new Date().getTime(),
  condition = false,
  interval = setInterval(function() {
    if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
      // If not time-out yet and condition not yet fulfilled
      condition = (typeof(testFx) === 'string' ? eval(testFx) : testFx()) //< defensive code
    } else {
      if(!condition) {
        // If condition still not fulfilled (timeout but condition is 'false')
        Log('\'waitFor()\' timeout')
        phantom.exit(1)
      } else {
        // Condition fulfilled (timeout and/or condition is 'true')
        Log('\'waitFor()\' finished in ' + (new Date().getTime() - start) + 'ms.')
        //< Do what it's supposed to do once the condition is fulfilled
        typeof(onReady) === 'string' ? eval(onReady) : onReady()
        //< Stop this interval
        clearInterval(interval)
      }
    }
  }, 2 * 1000) //< repeat check every 250ms
}

page.settings.clearMemoryCaches = true
// page.viewportSize = { width: 1200, height: 1000 }

page.onConsoleMessage = function (msg/*, lineNum, sourceId */) {
  Log(msg)
}

page.onLoadFinished = function () {
  page.includeJs('https://cdn.bootcss.com/jquery/1.12.4/jquery.js', function () {
    // waitFor first data is arrived
    waitFor(function () {
      return page.evaluate(function () {
        const countList = $('.ticket-info .b2c-num-picker .item')
        console.log('----------- countList.length', countList.length)
        return countList.length > 0 ? true : false
      })
    }, function () {
      page.onCallback = function (status, result) {
        Log('The onCallback function ' + status + ': ' + JSON.stringify(result))

        Log('Got result\'s length: ' + result.length)

        if (result && result.length > 0) {
          Log('Prepare for save into the server: ' + postEndpoint)

          page.onCallback = function (status, data) {
            Log('The onCallback function ' + status + ': ' + JSON.stringify(data))
            phantom.exit(0)
          }

          page.evaluate(function (postEndpoint, result) {
            $.ajax({
              type: 'POST',
              url: postEndpoint,
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              data: JSON.stringify(result),
              success: function (data) {
                return window.callPhantom('success', data)
              },
              error: function (err) {
                return window.callPhantom('error', err)
              }
            })
          }, postEndpoint, result)
        } else {
          Log('Information not enough, result is empty')
          phantom.exit(0)
        }
      }

      // get Result
      Log('Starts to getting result')
      page.evaluate(function (_id, date_step) {
        const resultData = []
        const ticketArea = $('.ticket-info')[0]
        console.log('------------ $(ticketArea).text()', $(ticketArea).text())
        const eventList = $(ticketArea).find('.events-picker .item')
        console.log('------------ eventList.length', eventList.length)

        $(eventList).each(function () {
          const event = this
          $(event).click()

          const retryEvent = function (retryEventTimes) {
            // wait for have some item of levelList
            const levelList = $(ticketArea).find('.ticket-category .item')
            console.log('------------ levelList.length', levelList.length)
            if ((!levelList || levelList.length === 0) && retryEventTimes > 0) {
              setTimeout(function () {
                retryEvent(retryEventTimes--)
              }, 330)
              return
            }

            $(levelList).each(function () {
              const level = this
              $(level).click()

              const retryLevel = function (retryLevelTimes) {
                // wait for have some item of countList
                const countList = $(ticketArea).find('.b2c-num-picker .item')
                if ((!countList || countList.length === 0) && retryLevelTimes > 0) {
                  setTimeout(function () {
                    retryLevel(retryLevelTimes--)
                  }, 200)
                  return
                }

                resultData.push({
                  parent_ticket_id: _id,
                  date_step: date_step,
                  date_time: $(event).text(),
                  name: $(level).text(),
                  status: $(ticketArea).find('.btn-submit').text(), // FIXME: for another status
                  price: parseInt($(level).text()),
                  real_price: $(ticketArea).find('.price').text(),
                })
              }
              retryLevel(5)
            }) // levelList each
          }
          retryEvent(3)
        }) //eventList each done
        setTimeout(function () {
          window.callPhantom('success', resultData)
        }, 200)
      }, _id, date_step)
    }, 10 * 1000)
  })
}

// Open it
page.clearMemoryCache()
// page.close() // not working!
Log('Start opening: ' + url)
page.open(url, function (status) {
  Log('Status of ' + url + ': ' + status)
})
