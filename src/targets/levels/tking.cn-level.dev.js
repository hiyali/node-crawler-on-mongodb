const page = require('webpage').create()
const system = require('system')
const siteUrl = 'https://www.tking.cn'

var scenario_date_list = []
var current_scenario_date = {}

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
const urlArgIdx = system.args.indexOf('--url')
if (urlArgIdx > -1 && system.args.length > urlArgIdx + 1) {
  url = system.args[urlArgIdx + 1]
  Log('url is: ' + url)
} else {
  Log('The url is not found!')
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
const date_stepArgIdx = system.args.indexOf('--level-date_step')
if (date_stepArgIdx > -1 && system.args.length > date_stepArgIdx + 1) {
  date_step = system.args[date_stepArgIdx + 1]
  Log('date_step is: ' + date_step)
} else {
  Log('The date_step is not found!')
  phantom.exit(1)
}

page.settings.clearMemoryCaches = true

page.onConsoleMessage = function (msg/*, lineNum, sourceId */) {
  Log(msg)
}

const setLevelInfo = function (status, levelList) {
	if (status === 'success') {
		var result = []
		levelList.forEach(function(level) {
			result.push({
				parent_ticket_id: _id,
			    date_step: date_step,
			    date_name: current_scenario_date.sessionName,
			    date_time: current_scenario_date.showTime_long,
			    name: level.originalPrice + level.comments,
			    status: level.tickets.length > 0 ? '出售中' : '无票',
			    price: level.originPrice,
			    real_price: level.salePrice
			})
		})
		page.onCallback = openNextDate

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
	} else {
		Log('error:' + dateList)
		phantom.exit(1)
	}
}

const openNextDate = function(status){
	if (status === 'error') {
		phantom.exit(1)
	}
	if (scenario_date_list.length === 0) {
		phantom.exit(0)
	}

	current_scenario_date = scenario_date_list.shift()
	var date_ajax_url = 'https://www.tking.cn/showapi/pub/showSession/' 
		+ current_scenario_date.showSessionOID + '/seatplans/sale?time=' 
		+ Math.round(new Date()) + '&src=web'

	page.onCallback = setLevelInfo

	page.evaluate(function (url) {
		$.ajax({
		    type: 'GET',
		    url: url,
		    contentType: 'application/json;charset=utf-8',
		    dataType: 'json',
		    success: function (data) {
		    	return window.callPhantom('success', data.result.data)
		    },
		    error: function (err) {
		    	return window.callPhantom('error', err)
		    }
	    })
	}, date_ajax_url)
}

const setDateList = function(status, dateList) {
	if (status === 'success') {
		scenario_date_list = dateList.result.data
		openNextDate('success')
	} else {
		Log('error:' + dateList)
		phantom.exit(1)
	}
}

page.onLoadFinished = function () {
  page.includeJs('https://cdn.bootcss.com/jquery/1.12.4/jquery.js', function () {
    // get Result
    Log('Starts to getting result')

    const timestamp = Math.round(new Date())
    const scenario_id = url.substring(url.lastIndexOf('/'))

    page.onCallback = setDateList
    page.evaluate(function (timestamp, scenario_id) {
    	console.log('ajax start: ' + 'https://www.tking.cn/showapi/pub/show/' + scenario_id + '/sessionone?time=' + timestamp + '&src=web&sessionOID=')
	    $.ajax({
		    type: 'GET',
		    url: 'https://www.tking.cn/showapi/pub/show/' + scenario_id + '/sessionone?time=' + timestamp + '&src=web&sessionOID=',
		    contentType: 'application/json;charset=utf-8',
		    dataType: 'json',
		    success: function (data) {
		    	return window.callPhantom('success', data)
		    },
		    error: function (err) {
		    	return window.callPhantom('error', err)
		    }
	    })
	}, timestamp, scenario_id)
  })
}



const openNextPage = function (options) {
  if (!options) {
    options = {}
  }

  // open it
  page.clearMemoryCache()
  // page.close() // not working!

  Log('Start opening: ' + url)
  page.open(url, function (status) {
    Log('Status of ' + url + ': ' + status)
  })
}

openNextPage({ categoryBegin: true })