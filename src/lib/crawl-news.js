'use strict'
import puppeteer from 'puppeteer'
import devices from 'puppeteer/DeviceDescriptors'
import cheerio from 'cheerio'
import axios from 'axios'

import { Log, MongoDB } from './'

const postEndpoint = {
  list: 'http://localhost:5556/api/news',
  // category: 'http://localhost:5556/api/news-category',
}

const postResults = (results, endpoint) => {
  return new Promise((resolve, reject) => {
    axios.post(endpoint, results).then(resolve).catch(reject)
  })
}

const createMongoDBIndex = (createIndexOption) => new Promise((resolve) => { // , reject
  MongoDB.createIndex(createIndexOption, (result) => {
    Log('MongoDB result:', result)
    resolve(result)
  }, { unique: true, background: true })
})

const getSiteTarget = async (page, url, waitForSelector, waitForTimeout) => {
  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.waitForSelector(waitForSelector, { timeout: waitForTimeout })

  await page.waitFor(8 * 1000)

  const html = await page.content()
  // console.log(html)

  const $ = cheerio.load(html, { decodeEntities: false })
  return $
}

const CrawlNews = async ({ prepare, getConf, parseListData, parseData }, { waitForTimeout, IS_DEV_MODE, DONT_SAVE_DATA, CRAWL_ONCE_ITEM }) => {
  await prepare()

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  })
  const device = devices['iPad Pro']

  let conf = 'first time'
  let retryTimes = 5
  let retring = false
  // let deadLoopTimes = 100

  while (conf) {
    if (retring) {
      retring = false
    } else {
      conf = getConf()
    }
    if (!conf) break

    // deadLoopTimes--
    // if (deadLoopTimes < 1) {
    //   break
    // }

    // Testing {
    // // Do something
    // continue
    // } Testing

    if (conf.data.runMode === 'NEVER') {
      continue
    }

    if (CRAWL_ONCE_ITEM) {
      if (conf.data.runMode !== 'ONCE') {
        continue
      }
    } else {
      if (conf.data.runMode === 'ONCE') {
        continue
      }
    }

    Log('Start crawl to category:', conf.dataMark.category)

    const page = await browser.newPage()
    await page.emulate(device)
    await page.setCacheEnabled(false)

    Log('Prepare to open:', conf.url)
    const $target = await getSiteTarget(page, conf.url, conf.waitForSelector.list, waitForTimeout)
      .catch(err => {
        Log('Err - getSiteTarget: ', err);
        (async () => {
          await page.close()
        })()
        return 'retry'
      })

    if ($target === 'retry' && retryTimes > 0) {
      Log('Run: retring... ', retryTimes)
      retryTimes--
      retring = true
      continue // retry
    }

    const listResults = await parseListData($target)
    Log('List result length:', listResults.length)

    // -- each item
    const results = []
    let i = 0
    while(i < listResults.length) {
      const listItem = listResults[i]

      const $target = await getSiteTarget(page, listItem.url, conf.waitForSelector.item, waitForTimeout)
        .catch(err => { Log('Err - getSiteTarget: ', err) })

      const data = await parseData($target, { ...conf.dataMark, ...listItem })
      if (data) {
        results.push(data)
        console.log(data)
      }

      if (IS_DEV_MODE && i >= 1) {
        break
      }

      i++
    }

    if (!DONT_SAVE_DATA) {
      const postResultsSuccess = await postResults(results, postEndpoint.list).catch(err => Log('Err - postResults: ', err))
      if (postResultsSuccess) {
        await createMongoDBIndex(conf.createIndexOption)
      }
    }

    await page.close()
    Log('-'.repeat(66))

    if (IS_DEV_MODE) {
      break
    }
  }

  browser.close()
}

export default CrawlNews
