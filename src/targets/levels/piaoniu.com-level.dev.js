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
const postEndpointArgIdx = system.args.indexOf('--post-endpoint')
if (postEndpointArgIdx > -1 && system.args.length > postEndpointArgIdx + 1) {
  postEndpoint = system.args[postEndpointArgIdx + 1]
  Log('postEndpoint is: ' + postEndpoint)
} else {
  Log('The postEndpoint is not found!')
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
const _idArgIdx = system.args.indexOf('--_id')
if (_idArgIdx > -1 && system.args.length > _idArgIdx + 1) {
  _id = system.args[_idArgIdx + 1]
  Log('_id is: ' + _id)
} else {
  Log('The _id is not found!')
  phantom.exit(1)
}

page.settings.clearMemoryCaches = true
// page.viewportSize = { width: 1200, height: 1000 }

page.onConsoleMessage = function (msg/*, lineNum, sourceId */) {
  Log(msg)
}

page.onLoadFinished = function () {
  page.includeJs('https://cdn.bootcss.com/jquery/1.12.4/jquery.js', function () {
    // get Result
    Log('Starts to getting result')
    var result = page.evaluate(function (_id, date_step) {
      const lists = $('.results li')

      const resultData = []
      if (lists && lists.length > 0) {
        $(lists).each(function () {
          const priceContEl = $(this).find('.price-cont')
          if (priceContEl.text() && priceContEl.text() !== '') {
            resultData.push({
              parent_ticket_id: _id,
              date_step: date_step,
              date_time: $(this).find('.time').text(),
              name: $(this).find('>a').attr('href'),
              status: $(this).find('.poster').attr('src'),
              price: priceContEl.text(),
              real_price: 'piaoniu.com',
            })
          }
        })
        return resultData
      }
      return null
    }, _id, date_step)
    Log('Got result\'s length: ' + result.length)

    if (result && result.length > 0) {
      Log('Prepare for save into the server: ' + postEndpoint)

      page.onCallback = function (onpOption, status, data) {
        Log('The onCallback function ' + status + ': ' + JSON.stringify(data))
        openNextPage(onpOption)
      }

      page.evaluate(function (postEndpoint, result/*, supportArgs */) {
        $.ajax({
          type: 'POST',
          url: postEndpoint,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          data: JSON.stringify(result),
          // data: JSON.stringify(Object.assign(supportArgs, { data: result })),
          success: function (data) {
            return window.callPhantom({ pageNext: true }, 'success', data)
          },
          error: function (err) {
            return window.callPhantom({ pageNext: true }, 'error', err)
          }
        })
      }, postEndpoint, result)
    } else {
      Log('Information not enough, result is empty')
      openNextPage({ categoryNext: true })
    }
  })
}

const openNextPage = function (options) {
  if (!options) {
    options = {}
  }

  // open it
  page.clearMemoryCache()
  // page.close() // not working!

  setTimeout(function () {
    setTimeout(function () {
      Log('Start opening: ' + url)
      page.open(url, function (status) {
        Log('Status of ' + url + ': ' + status)
      })
    }, 1)
  }, 500)
}

openNextPage({ categoryBegin: true })
