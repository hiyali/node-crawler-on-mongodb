const webpage = require('webpage')
const fs = require('fs')
const system = require('system')

const page = webpage.create()
const url = 'https://search.damai.cn/search.html?order=3'

const Log = function (text) {
  const _D = new Date()
  const date = _D.getFullYear() + '/' + (_D.getMonth() + 1) + '/' + _D.getDate()
  const time = _D.getHours() + ':' + _D.getMinutes() + ':' + _D.getSeconds()
  const now = date + ' ' + time
  console.log(now, '      ', text)
}

var tempFileAddr = null
const configExampleIndex = system.args.indexOf('--temp-file')
if (configExampleIndex > -1 && system.args.length > configExampleIndex + 1) {
  const tempFileAddr = system.args[configExampleIndex]
  Log('tempFileAddr: ' + tempFileAddr)
}

// page.onConsoleMessage = function (msg, lineNum, sourceId) {}

page.onLoadFinished = function (status) {
  const Log = function (text) {
    const _D = new Date()
    const date = _D.getFullYear() + '/' + (_D.getMonth() + 1) + '/' + _D.getDate()
    const time = _D.getHours() + ':' + _D.getMinutes() + ':' + _D.getSeconds()
    const now = date + ' ' + time
    console.log(now, '      ', text)
  }

  page.includeJs('https://cdn.bootcss.com/jquery/1.12.4/jquery.js', function() {
    // get Result
    Log('Starts to getting result')
    const result = page.evaluate(function () {
      const lists = $('#content_list li')
      console.log('lists.length: ' + lists.length)

      const resultData = []
      if (lists && lists.length > 0) {
        $(lists).each(function (index) {
          const titleEl = $(this).find('h3')
          if (titleEl.text() && titleEl.text() !== '') {
            resultData.push({
              title: titleEl.text(),
              time: $(this).find('.search_txt_time').text(),
              location: $(this).find('.search_txt_site_icon').text(),
              price: $(this).find('em').text(),
              url: titleEl.find('a').attr('href')
            })
          }
        })
        return resultData
      }
      return null
    })
    Log('Get result: ' + result)

    if (result && tempFileAddr) {
      Log('Prepare writen in file: ' + tempFileAddr)
      fs.write(tempFileAddr, JSON.stringify(result), 'w')
    } else {
      Log('Information not enough, tempFileAddr or result is empty')
    }

    // exit
    phantom.exit()
  })
}

Log('Start opening: ' + url)
page.open(url, function (status) {
  Log('Status: ' + status)
})
