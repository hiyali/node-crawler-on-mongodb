const webpage = require('webpage')
const fs = require('fs')
const system = require('system')

const page = webpage.create()
const url = 'https://www.so.com'

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

  Log('Start inputing and clicking')
  page.evaluate(function () {
    // input & click
    document.getElementById("input").value = "salam"
    document.getElementById("search-button").click()
    // page is redirecting.
  })

  page.onLoadFinished = function (status) {
    // get Result
    Log('Starts to getting result')
    const result = page.evaluate(function () {
      const resultItems = document.getElementsByClassName("res-list")
      if (resultItems && resultItems.length > 0) {
        return resultItems[0].innerText
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

    /*
    // Screenshot
    const shotDir = "screenshot/"
    const fileName = (new Date()).getTime()  + ".png"
    const file = shotDir + fileName
    page.render(file)
    Log('Screenshot saved: ' + file)
    // */

    // exit
    phantom.exit()
  }
}

Log('Start opening: ' + url)
page.open(url, function (status) {
  Log('Status: ' + status)
})
