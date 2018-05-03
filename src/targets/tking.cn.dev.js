const page = require('webpage').create()
const system = require('system')
const siteUrl = 'www.tking.cn'
const url = 'https://www.tking.cn/list/'

var IS_DEV_MODE = false
if (system.args.indexOf('--dev-mode') > -1) {
  IS_DEV_MODE = true
}

const city_list = [
	{"cityOID":3101,"cityName":"上海"}, 
	{"cityOID":1101,"cityName":"北京"}, 
	{"cityOID":4401,"cityName":"广州"},
	{"cityOID":4403,"cityName":"深圳"},
	{"cityOID":6101,"cityName":"西安"}
]

const length_per_page = 10
var current_city = {}
var current_offset = 0

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

page.onLoadFinished = function (status) {
	page.includeJs('https://cdn.bootcss.com/jquery/1.12.4/jquery.js', function() {
		const result = page.evaluate(function () {
			const lists = $('.list-page-content .shows-container .show-items')
			const resultData = []
		    if (lists && lists.length > 0) {
		        $(lists).each(function (index) {
		        	const titleEl = $(this).find('.show-name').text()
		        	var city_name = titleEl.substring(titleEl.indexOf('【') + 1, titleEl.indexOf('】') - 1)
			        if (titleEl && titleEl !== '') {
				        resultData.push({
				            title: titleEl,
				            city_name: city_name,
				            date_time: $(this).find('.show-time').text(),
				            status: $(this).find('.selling').text(),
				            location: $(this).find('.show-addr').text(),
				            url: 'https://www.tking.cn' + $(this).attr('href'),
				            image_url: $(this).find('img').src,
				            site_url: 'tking.cn'
			            })
			        }
		    	})
		    	return resultData
			}
			return null
		})

		if (result && result.length > 0) {
		    const supportArgs = {
		        siteUrl: siteUrl,
		        current_city: current_city,
		        offset: current_offset
		    }
	        Log('Prepare for save into the server: ' + postEndpoint)

	        page.onCallback = function (onpOption, status, data) {
		        Log('The onCallback function ' + status + ': ' + JSON.stringify(data))
		        if (data.insertedIds.length === length_per_page) {
		        	openNextPage()
		        } else {
		        	openNextCity()
		        }
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
	      openNextCity()
	    }
	})
}

const openNextPage = function () {
    // FIXME: Below statement for test, delete current_offset >= length_per_page * 2 for normal total crawler
    if (IS_DEV_MODE && current_offset >= length_per_page * 2) { // city next
	    openNextCity()
    } else { // page next
    	// construct url
	    const _url = url + '?offset=' + current_offset + '&length=' + length_per_page
    	current_offset += length_per_page
	    Log('Start opening: ' + _url)
	    // open it
	    page.open(_url, function (status) {
	    	Log('Status of ' + _url + ': ' + status)
	    })
    }
}

const openNextCity = function() {
	if (city_list.length === 0) {
        Log('Finished for ' + siteUrl)
        phantom.exit(0)
    }
    current_city = city_list.shift()
    current_offset = 0

    phantom.addCookie({
	    name: 'site_city',
	    value: encodeURIComponent(JSON.stringify(current_city)),
	    domain: '.tking.cn'
	})
	openNextPage()
}

openNextCity()