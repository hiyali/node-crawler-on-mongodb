const webpage = require('webpage')
const fs = require('fs')
const system = require('system')

const page = webpage.create()
const url = 'https://www.piaoniu.com/{CATEGORY_NAME}-all/hottest/p{PAGE_NUM}'
const siteUrl = 'piaoniu.com'

var categoryNameList = ['sh', 'bj', 'gz', 'sz', 'cd', 'cq', 'tj', 'hz', 'nj', 'wh', 'cs'] // 长沙 cs, 成都 cd ...
var currentPageNum = 1
var currentCategoryName = ''

const Log = function (text) {
  const _D = new Date()
  const date = _D.getFullYear() + '/' + (_D.getMonth() + 1) + '/' + _D.getDate()
  const time = _D.getHours() + ':' + _D.getMinutes() + ':' + _D.getSeconds()
  const now = date + ' ' + time
  console.log(now, '      ', text)
}

var postEndpoint = null
const postEndpointArgIdx = system.args.indexOf('--post-endpoint')
if (postEndpointArgIdx > -1 && system.args.length > postEndpointArgIdx + 1) {
  postEndpoint = system.args[postEndpointArgIdx + 1]
  Log('postEndpoint is: ' + postEndpoint)
} else {
  Log('The postEndpoint is not found!')
  phantom.exit(1)
}

page.settings.clearMemoryCaches = true
// page.viewportSize = { width: 1200, height: 1000 }

page.onConsoleMessage = function (msg, lineNum, sourceId) {
  Log(msg)
}

page.onLoadFinished = function (status) {
  page.includeJs('https://cdn.bootcss.com/jquery/1.12.4/jquery.js', function () {
    // get Result
    Log('Starts to getting result')
    var result = page.evaluate(function () {
      const lists = $('.results li')

      const resultData = []
      if (lists && lists.length > 0) {
        $(lists).each(function (index) {
          const priceContEl = $(this).find('.price-cont')
          if (priceContEl.text() && priceContEl.text() !== '') {
            resultData.push({
              title: $(this).find('.title a').text(),
              date_time: $(this).find('.time').text(),
              location: $(this).find('.venue').text(),
              status: priceContEl.text(),
              url: 'https://www.piaoniu.com' + $(this).find('>a').attr('href'),
              image_url: $(this).find('.poster').attr('src'),
              related_ticket_id: false,
              site_url: 'piaoniu.com' // siteUrl // can't used in evaluate function?
            })
          }
        })
        return resultData
      }
      return null
    })
    Log('Got result\'s length: ' + result.length)

    if (result && result.length > 0) {
      const supportArgs = {
        siteUrl: siteUrl,
        categoryName: currentCategoryName,
        pageNum: currentPageNum
      }
      Log('Prepare for save into the server: ' + postEndpoint)

      page.onCallback = function (onpOption, status, data) {
        Log('The onCallback function ' + status + ': ' + JSON.stringify(data))
        openNextPage(onpOption)
      }

      page.evaluate(function (postEndpoint, result, supportArgs) {
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
      }, postEndpoint, result, supportArgs)
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

  // FIXME: Below statement for test, delete currentPageNum >= 2 for normal total crawler
  if (currentPageNum >= 2 || options.categoryNext || options.categoryBegin) { // category next
    if (categoryNameList.length === 0) {
      Log('Finished for ' + siteUrl)
      phantom.exit(0)
    }
    currentCategoryName = categoryNameList.shift()
    currentPageNum = 1
  } else if (options.pageNext) { // page next
    currentPageNum++
  }

  // construct url
  const _url = url.replace('{CATEGORY_NAME}', currentCategoryName).replace('{PAGE_NUM}', currentPageNum)
  Log('Start opening: ' + _url)

  // open it
  page.clearMemoryCache()
  // page.close() // not working!

  setTimeout(function () {
    setTimeout(function () {
      page.open(_url, function (status) {
        Log('Status of ' + _url + ': ' + status)
      })
    }, 1)
  }, 500)
}

openNextPage({ categoryBegin: true })
