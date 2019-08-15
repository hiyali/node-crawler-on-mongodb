'use strict'
import { Log/*, MongoDB*/ } from '../../lib'

const urlModel = 'http://sozcu.com.tr/kategori/{LIST_ID}'
let crawlConfList = [
  { id: 1, newsListId: 'gundem' },
  { id: 1, newsListId: 'yazarlar' },
]
const maxResultCount = 10
const listScrollHeight = 6800

const listTargetSelector = '.listed-cat-news .listed-box'
const listUrlSelector = '$(this).find("a").attr("href")'
const listTitleSelector = '$(this).find("h3").text()'
const listThumbnailSelector = '$(this).find("img").attr("src")'
const listContentSelector = '$(this).find("p").text()'

const targetSelector = '.detail-content > .detail-content-inner'
const titleSelector = '$(this).find(".news-detail-title h1").text()'
const contentSelector = '$(this).find(".content-element").html()'
const contentFilterRegex = /<p.*?<\/p>|<img.*?>/g // new RegExp(contentFilterRegex, 'g')
const thumbnailSelector = '$(this).find(".detail-news-img img").attr("src")'
const publishedAtSelector = '$(this).find(".date time").attr("datatime")'

const strExist = value => value && value.length > 0

const prepare = () => {
  return new Promise((resolve) => {
    // MongoDB.find({}, (results) => {
    //   crawlConfList = results
    //   Log(`prepare - Got ${crawlConfList.length} records`)
    //   // Log(`The first item.category is: ${crawlConfList[0].category}`)
    //   resolve(true)
    // }, { name: 'news-category', limit: '0' })
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

const getConf = () => {
  const urlConf = crawlConfList.shift()
  if (!urlConf) {
    return undefined
  }

  const url = urlModel.replace('{LIST_ID}', urlConf.newsListId)
  return {
    url,
    data: urlConf,
    dataMark: {
      categoryId: urlConf.id,
    },
    waitForSelector: {
      list: '.listed-cat-news .listed-box',
      item: '.detail-content > .detail-content-inner',
    },
    createIndexOption: {
      url: 1,
    },
  }
}

const parseListData = async ($) => {
  const listResultData = []
  const listInvalItemPosList = []

  await $(listTargetSelector).each(function(index) {
    const data = {
      url: eval(listUrlSelector),
      listTitle: eval(listTitleSelector),
      listThumbnail: eval(listThumbnailSelector),
      listContent: eval(listContentSelector),
      sortNum: index + 1,
    }
    if (strExist(data.url)) {
      listResultData.push(data)
    } else {
      listInvalItemPosList.push(index + 1)
    }
  })

  Log('The invalid list items position array: ', listInvalItemPosList.join(', '))
  return listResultData
}

const parseData = async ($, dataMark = {}) => {
  let resultData = undefined
  const invalItemPosList = []

  await $(targetSelector).each(function(index) {
    const htmlStr = eval(contentSelector)
    const matchArr = htmlStr.match(contentFilterRegex)
    const data = {
      title: eval(titleSelector),
      thumbnail: eval(thumbnailSelector),
      publishedAt: eval(publishedAtSelector),
    }
    if (strExist(data.title) && Array.isArray(matchArr)) {
      data.content = matchArr.join('')
      resultData = { ...data, ...dataMark }
    } else {
      invalItemPosList.push(index + 1)
    }
  })

  Log('The invalid items position array: ', invalItemPosList.join(', '))
  return resultData
}

export {
  prepare,
  getConf,
  parseListData,
  parseData,
  maxResultCount,
  listScrollHeight,
}
