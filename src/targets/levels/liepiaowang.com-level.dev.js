const page = require('webpage').create()
const system = require('system')

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

const setLevelInfoFinish = function (status, info) {
	if (status === 'success') {
		phantom.exit(0)
	} else {
		Log('errorRRRRRR:' + JSON.stringify(info))
		phantom.exit(1)
	}
}

const setLevelInfo = function (status, data) {
	if (status === 'success') {
		var result = []
		data.forEach(function(date) {
			date.ticketLevels.forEach(function(level) {
				result.push({
					parent_ticket_id: _id,
				    date_step: date_step,
				    date_name: date.name
				    date_time: (new Date(date.showDateBegin)).getTime(),
				    name: level.name,
				    status: '出售中',
				    price: level.price,
				    real_price: level.highPrice ? level.highPrice : level.price
				})
			})
		})
		Log(JSON.stringify(result))

		page.onCallback = setLevelInfoFinish
	    Log('Prepare for save into the server: ' + postEndpoint)
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
		Log('error:' + data)
		phantom.exit(1)
	}
}

page.onLoadFinished = function () {
  page.includeJs('https://cdn.bootcss.com/jquery/1.12.4/jquery.js', function () {
    // get Result
    Log('Starts to getting result')

    const scenario_id = url.substring(url.lastIndexOf('_') + 1)


    page.onCallback = setLevelInfo

    page.evaluate(function (scenario_id) {
    	console.log('ajax start: http://m.liepiaowang.com/api/hunt/scenarios/app/' + scenario_id)
    	
	    $.ajax({
		    type: 'GET',
		    url: 'https://m.liepiaowang.com/api/hunt/scenarios/app/' + scenario_id,
		    contentType: 'application/json;charset=UTF-8',
		    dataType: 'json',
		    success: function (data) {
		    	return window.callPhantom('success', data.scenarioDates)
		    },
		    error: function (err) {
		    	return window.callPhantom('error', err)
		    }
	    })
	}, scenario_id)
  })
}



const openNextPage = function (options) {
  if (!options) {
    options = {}
  }

  // open it
  page.clearMemoryCache()
  const scenario_id = url.substring(url.lastIndexOf('_') + 1)
  const tempUrl = 'https://m.liepiaowang.com/app/home'

  Log('Start opening: ' + tempUrl)
  page.open(tempUrl, function (status) {
    Log('Status of ' + tempUrl + ': ' + status)
  })
}

openNextPage({ categoryBegin: true })