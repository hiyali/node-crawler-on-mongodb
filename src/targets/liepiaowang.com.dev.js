const page = require('webpage').create()
const system = require('system')
const siteUrl = 'liepiaowang.com'
const search_url = 'http://m.liepiaowang.com/api/hunt/scenarios/inSale'
const url = 'http://m.liepiaowang.com/app/home'

var IS_DEV_MODE = false
if (system.args.indexOf('--dev-mode') > -1) {
  IS_DEV_MODE = true
}

const length_per_page = 20
var current_page = 0

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

const saveScenarioList = function (status, scenarioList) {
	if (scenarioList.length === 0) {
		phantom.exit(0)
	}
	const result = []
	scenarioList.forEach(function(scenario) {
		result.push({
			is_pivotal: true, // hunt ticket's information is pivotal
            related_ticket_id: null,
            title: scenario.name,
            date_time: scenario.showDateInfo,
            status: '出售中',
            location: scenario.placeName,
            url: 'https://m.liepiaowang.com/app/scenario_c2c_buy_' + scenario.id,
            image_url: scenario.headImgUrl,
            site_url: siteUrl
		})
	})
	page.onCallback = openNextPage
	Log('Prepare for save into the server: ' + postEndpoint)
    page.evaluate(function (postEndpoint, result) {
      $.ajax({
        type: 'POST',
        url: postEndpoint,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(result),
        success: function (data) {
          return window.callPhantom('success')
        },
        error: function (err) {
          return window.callPhantom('error')
        }
      })
    }, postEndpoint, result)
}

page.onLoadFinished = function (status) {
	page.includeJs('https://cdn.bootcss.com/jquery/1.12.4/jquery.js', function () {
		openNextPage()
	})
}

const openNextPage = function () {
	if (IS_DEV_MODE && current_page >= 2) { // city next
	    phantom.exit(0)
    } else {
	    page.onCallback = saveScenarioList

		const _url = search_url + '?page=' + current_page + '&size=' + length_per_page
	    Log('ajax start: ' + _url)

		current_page++
	    page.evaluate(function (_url) {
	        $.ajax({
	          type: 'GET',
	          url: _url,
	          contentType: 'application/json; charset=utf-8',
	          dataType: 'json',
	          success: function (data) {
	            return window.callPhantom('success', data)
	          },
	          error: function (err) {
	            return window.callPhantom('error', err)
	          }
	        })
	    }, _url)
    }
}

const openWebPage = function () {
    page.open(url, function (status) {
    	Log('Status of ' + url + ': ' + status)
    })
}

openWebPage()