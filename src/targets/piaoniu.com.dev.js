const webpage = require('webpage')
const fs = require('fs')
const system = require('system')

const page = webpage.create()

const url = 'https://www.piaoniu.com/{CATEGORY_NAME}-all/hottest/p{PAGE_NUM}'
var categoryNameList = ['cs', 'cd'] // FIXME: for test, 长沙 cs, 成都 cd
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

// page.onConsoleMessage = function (msg, lineNum, sourceId) {}

page.onLoadFinished = function (status) {
  page.includeJs('https://cdn.bootcss.com/jquery/1.12.4/jquery.js', function () {
    // get Result
    Log('Starts to getting result')
    const result = page.evaluate(function () {
      const lists = $('.results li')

      const resultData = []
      if (lists && lists.length > 0) {
        $(lists).each(function (index) {
          const priceEl = $(this).find('.sale-price .strong')
          if (priceEl.text() && priceEl.text() !== '') {
            resultData.push({
              title: $(this).find('.title a').text(),
              time: $(this).find('.time').text(),
              location: $(this).find('.venue').text(),
              price: priceEl.text(),
              url: 'https://www.piaoniu.com' + $(this).find('>a').attr('href')
            })
          }
        })
        return resultData
      }
      return null
    })
    Log('Get result: ' + result)

    if (result && result.length > 0) {
      const _postUrl = postEndpoint + '?siteUrl=piaoniu.com&categoryName=' + currentCategoryName + '&pageNum=' + currentPageNum
      Log('Prepare for save into the server: ' + _postUrl)

      const postPage = webpage.create()
      postPage.open(_postUrl, 'post', result, function (status) {
        Log('Server save args: ' + currentCategoryName + ' / ' + currentPageNum)
        if (status === 'success') {
          Log('Saved success!')
          openNextPage({ pageNext: true })
        } else {
          Log('Something wrong!')
          openNextPage({ pageNext: true }) // can use 'retry' here?
        }
      })
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

  // FIXME: Below statement for test, delete currentPageNum > 3 for normal total crawler
  if (currentPageNum >= 3 || options.categoryNext || options.categoryBegin) { // category next
    if (categoryNameList.length === 0) {
      Log('Finished for piaoniu.com')
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
  page.open(_url, function (status) {
    Log('Status of ' + _url + ': ' + status)
  })
}

openNextPage({ categoryBegin: true })
