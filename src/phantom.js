const page = require('webpage').create()
const system = require('system')

if (system.args.length === 1) {
  console.log('Not given <URL>')
  phantom.exit()
}

const url = system.args[1]

Log = function (text) {
  const _D = new Date()
  const date = _D.getFullYear() + '/' + (_D.getMonth() + 1) + '/' + _D.getDate()
  const time = _D.getHours() + ':' + _D.getMinutes() + ':' + _D.getSeconds()
  const now = date + ' ' + time
  console.log(now, '      ', text)
}
// page.onConsoleMessage = function (msg, lineNum, sourceId) {}

page.onLoadFinished = function(status) {
  page.evaluate(function() {
    // input & click
    document.getElementById("input").value = "salam"
    document.getElementById("search-button").click()
    // page is redirecting.
  })

  page.onLoadFinished = function(status) {
    // get Result
    const result = page.evaluate(function () {
      const resultItems = document.getElementsByClassName("res-list")
      if (resultItems && resultItems.length > 0) {
        return resultItems[0].innerText
      }
      return null
    })
    Log(result)

    // Screenshot
    const path = "screenshot"
    const fileName = (new Date()).getTime()  + ".png"
    const file = path + "/" + fileName
    // page.render(file)
    Log('Screenshot saved: ' + file)

    // exit
    phantom.exit()
  }
}
page.open(url, function (status) {
  Log('Open in:' + url)
})
