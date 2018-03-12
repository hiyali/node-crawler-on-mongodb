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

page.settings.clearMemoryCaches = true
// page.viewportSize = { width: 1200, height: 1000 }

page.onConsoleMessage = function (msg/*, lineNum, sourceId */) {
  Log(msg)
}

const pushResultsCB = function (status, result) {
  Log('The pushResultsCB function status: ' + result)
  phantom.exit(result === 'success' ? 0 : 1)
}

const getLevelsCB = function (status, data, isLastOne, event) {
  Log('The getLevelsCB status: ' + status + ' / got data length: ' + data.length)

  const resultData = []
  data.forEach(function (level) {
    resultData.push({
      parent_ticket_id: _id,
      date_step: date_step,
      date_time: event.specification,
      name: level.specification,
      status: level.status, // TODO: for another status
      price: level.originPrice,
      real_price: level.lowPrice
    })
  })

  if (isLastOne) {
    page.onCallback = pushResultsCB

    Log('Prepare for save into the server: ' + postEndpoint)
    page.evaluate(function (postEndpoint, result) {
      $.ajax({
        type: 'POST',
        url: postEndpoint,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(result),
        success: function (data) {
          return window.callPhantom({ pageNext: true }, 'success', data)
        },
        error: function (err) {
          return window.callPhantom({ pageNext: true }, 'error', err)
        }
      })
    }, postEndpoint, resultData)
  }
}

const getEventsCB = function (status, data) {
  Log('The getEventsCB status: ' + status + ' / got data length: ' + data.length)

  if (data.events.length && data.events.length > 0) {
    data.events.forEach(function (event, index) {
      page.onCallback = getLevelsCB

      page.evaluate(function (event, isLastOne) {
        $.ajax({
          type: 'GET',
          url: 'https://www.piaoniu.com/api/v1/ticketCategories.json?b2c=true&eventId=' + event.id,
          contentType: 'application/json; charset=utf-8',
          success: function (_data) {
            return window.callPhantom('success', _data, isLastOne, event)
          },
          error: function (err) {
            return window.callPhantom('error', err, isLastOne, event)
          }
        })
      }, event, index === data.events.length - 1)
    })
  } else {
    Log('Information not enough, data is empty')
    // TODO: we can update ticket info here
    phantom.exit(0)
  }
}

page.onLoadFinished = function () {
  page.includeJs('https://cdn.bootcss.com/jquery/1.12.4/jquery.js', function () {
    page.onCallback = getEventsCB

    // get Result
    const splittedUrl = url.split('/')
    const activityId = splittedUrl[splittedUrl.length - 1]
    page.evaluate(function (activityId) {
      $.ajax({
        type: 'GET',
        url: 'https://www.piaoniu.com/api/v1/activities/' + activityId + '.json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
          return window.callPhantom('success', data)
        },
        error: function (err) {
          return window.callPhantom('error', err)
        }
      })
    }, activityId)
  })
}

// Open it
page.clearMemoryCache()
// page.close() // not working!
Log('Start opening: ' + url)
page.open(url, function (status) {
  Log('Status of ' + url + ': ' + status)
})
