'use strict'
import { Log, MongoDB } from '../lib'

const strExist = value => value && value.length > 0

let targetConfList = []
const crawlConfList = {}
let crawlConf = undefined

const prepare = () => {
  return new Promise((resolve) => {
    Log('prepare targetConfList & crawlConfList')
    MongoDB.find({}, (results) => {
      results.forEach((targetConf) => {
        targetConf.data.forEach((tcc) => { // targetCategoryConf
          targetConfList.push({
            crawlConfId: targetConf.crawlConfId,
            desc: targetConf.desc,
            name: targetConf.name,
            runMode: targetConf.runMode,
            updatedTime: targetConf.updatedTime,

            id: tcc.id,
            title: tcc.title,
            url: tcc.url,
            thumbnail: tcc.thumbnail,
          })
        })
      })
      resolve(true)
    }, { name: 'news_site', limit: '0', dbName: 'news' })
  })
}

const getCrawlConf = (ccid) => {
  return new Promise((resolve) => {
    Log(`prepare crawl_conf ${ccid}`)
    MongoDB.findOne({ aim: ccid }, (result) => {
      crawlConfList[ccid] = result.data
      resolve(result.data)
    }, { name: 'crawl_conf', dbName: 'news' })
  })
}

const getConf = async () => {
  const conf = targetConfList.shift()
  if (!conf) {
    return undefined
  }
  const ccid = conf.crawlConfId

  crawlConf = crawlConfList[ccid]
  if (crawlConf == undefined) {
    crawlConf = await getCrawlConf(ccid)
  }

  return {
    url: conf.url,
    data: conf,
    dataMark: {
      categoryId: conf.id,
    },
    waitForSelector: {
      list: crawlConf.listTargetSelector,
      item: crawlConf.targetSelector,
    },
  }
}

const parseListData = async ($) => {
  const cc = crawlConf
  const listResultData = []
  const listInvalItemPosList = []

  await $(cc.listTargetSelector).each(function(index) {
    const data = {
      url: eval(cc.listUrlSelector),
      listTitle: eval(cc.listTitleSelector),
      listThumbnail: eval(cc.listThumbnailSelector),
      listContent: eval(cc.listContentSelector),
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
  const cc = crawlConf
  let resultData = undefined
  const invalItemPosList = []

  await $(cc.targetSelector).each(function(index) {
    const htmlStr = eval(cc.contentSelector)
    const matchArr = htmlStr.match(new RegExp(cc.contentFilterRegex, 'g'))
    const data = {
      title: eval(cc.titleSelector),
      thumbnail: eval(cc.thumbnailSelector),
      publishedAt: eval(cc.publishedAtSelector),
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
}
