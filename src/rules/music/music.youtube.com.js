'use strict'
import { Log, MongoDB } from '../../lib'

const siteUrl = 'music.youtube.com'
const urlModel = 'https://music.youtube.com/playlist?list={LIST_ID}'
let urlConfList = []
const targetSelector = '#contents.ytmusic-playlist-shelf-renderer .ytmusic-playlist-shelf-renderer'
const thumbnailSelector = '#header #img'

const strExist = value => value && value.length > 0

const prepare = () => {
  return new Promise((resolve) => {
    MongoDB.find({}, (results) => {
      urlConfList = results
      Log(`prepare - Got ${urlConfList.length} records`)
      // Log(`The first item.category is: ${urlConfList[0].category}`)
      resolve(true)
    }, { name: 'category', limit: '0' })
  })
}

const getConf = () => {
  const urlConf = urlConfList.shift()
  if (!urlConf) {
    return undefined
  }

  const url = urlModel.replace('{LIST_ID}', urlConf.playlistId)
  return {
    url,
    data: urlConf,
    dataMark: {
      siteUrl,
      category: urlConf.category,
    },
    waitForSelector: '#contents',
    createIndexOption: {
      category: 1,
      dateStep: -1,
      sortNum: 1,
      videoId: 1,
    },
  }
}

const parseData = async ($, dataMark = {}) => {
  const resultData = []
  const invalItemPosList = []

  await $(targetSelector).each(function(index) {
    const thumbnail = $(this).find('.yt-img-shadow').attr('src').split('?')[0]
    const data = {
      thumbnail,
      title: $(this).find('.title').text(),
      artist: $(this).find('.secondary-flex-columns yt-formatted-string:first-child').text().replace('\n', ''),
      // time: $(this).find('> :last-child yt-formatted-string').text().replace('\n', ''), // not appear in iPad...
      videoId: thumbnail ? thumbnail.split('/')[4] : '',
      sortNum: index + 1,
    }
    if (thumbnail.indexOf('jpg') > -1 && strExist(data.videoId) && strExist(data.title)) {
      resultData.push({ ...data, ...dataMark })
    } else {
      invalItemPosList.push(index + 1)
    }
  })

  Log('The invalid items position list: ', invalItemPosList.join(', '))
  return resultData
}

const getThumbnail = async ($) => {
  return await $(thumbnailSelector).attr('src')
}

export {
  prepare,
  getConf,
  parseData,
  getThumbnail,
}
