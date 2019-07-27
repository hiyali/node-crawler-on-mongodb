'use strict'
import puppeteer from 'puppeteer'
import devices from 'puppeteer/DeviceDescriptors'
import cheerio from 'cheerio'
import axios from 'axios'

import { Log, MongoDB } from './'

/*
const localDevice = {
  viewport: {
    width: 1920,
    height: 1080,
  },
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Safari/537.36',
} // */

const postListResults = (results, listEndpoint) => {
  return new Promise((resolve, reject) => {
    axios.post(listEndpoint, results).then(resolve).catch(reject)
  })
}

const updateCategoryData = (data, categoryEndpoint) => {
  return new Promise((resolve, reject) => {
    axios.put(categoryEndpoint, data).then(resolve).catch(reject)
  })
}

const getDateStepName = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hour = now.getHours() + 1
  const minute = now.getMinutes()
  const second = now.getSeconds()

  const getTwoBits = (num) => {
    if (num >= 10) {
      return num
    } else {
      return '0' + num
    }
  }

  return `${year}${getTwoBits(month)}${getTwoBits(day)}_${getTwoBits(hour)}${getTwoBits(minute)}${getTwoBits(second)}` // 20180309_170305
}

const createMongoDBIndex = (createIndexOption) => new Promise((resolve) => { // , reject
  MongoDB.createIndex(createIndexOption, (result) => {
    Log('MongoDB result:', result)
    resolve(result)
  }, { unique: true, background: true })
})

async function scrollPageToBottom(page, scrollStep = 250, scrollDelay = 100) {
  const lastPosition = await page.evaluate(
    async (step, delay) => {
      const getScrollHeight = (element) => {
        const { scrollHeight, offsetHeight, clientHeight } = element
        return Math.max(scrollHeight, offsetHeight, clientHeight)
      }

      const position = await new Promise((resolve) => {
        let count = 0
        const intervalId = setInterval(() => {
          const { body } = document
          const availableScrollHeight = getScrollHeight(body)

          window.scrollBy(0, step)
          count += step

          if (count >= availableScrollHeight) {
            clearInterval(intervalId)
            resolve(count)
          }
        }, delay)
      })

      return position
    },
    scrollStep,
    scrollDelay,
  )
  return lastPosition
}

const getSiteTarget = async (page, url, waitForSelector, waitForTimeout) => {
  await page.goto(url, { waitUntil: 'networkidle2' })
  // await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.3.1.js' })
  await page.waitForSelector(waitForSelector, { timeout: waitForTimeout })

  const lastPosition = await scrollPageToBottom(page).catch(err => Log('Err - scrollPageToBottom: ', err))
  Log('The page scrolling lastPosition: ', lastPosition)
  await page.waitFor(8 * 1000)
  // await page.waitForXPath('//xpath', 10 * 1000)

  const html = await page.content()
  // console.log(html)

  // const result = await page.evaluate(()=>{
  // 	return $('#contents.ytmusic-playlist-shelf-renderer .ytmusic-playlist-shelf-renderer')
  // })
  const $ = cheerio.load(html)
  return $
}

const Run = async ({ prepare, getConf, parseData, getThumbnail }, { postEndpoint, waitForTimeout, IS_DEV_MODE, DONT_SAVE_DATA, CRAWL_ONCE_ITEM }) => {
  await prepare()

  // const { width, height } = localDevice.viewport
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // `--window-size=${ width },${ height }`
    ],
  })
  const device =
    // devices['Kindle Fire HDX landscape']
    devices['iPad Pro']

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
    // await page.setUserAgent(localDevice.userAgent)
    // await page.setViewport(localDevice.viewport)

    Log('Prepare to open:', conf.url)
    const $target = await getSiteTarget(page, conf.url, conf.waitForSelector, waitForTimeout)
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

    const dateStep = getDateStepName()
    const results = await parseData($target, { ...conf.dataMark, ...{ dateStep }})
    Log('Result length:', results.length)

    if (!DONT_SAVE_DATA) {
      const postListSuccess = await postListResults(results, postEndpoint.list).catch(err => Log('Err - postListResults: ', err))
      if (postListSuccess) {
        await createMongoDBIndex(conf.createIndexOption)

        if (conf.data.page !== 'top-charts') {
          const thumbnail = await getThumbnail($target).catch(err => Log('Err - postListResults: ', err))
          if (thumbnail) {
            Log('Prepare to call updateCategoryData with:', thumbnail)
            await updateCategoryData({ thumbnail, category: conf.dataMark.category }, postEndpoint.category)
              .catch(err => Log('Err - postCategoryResults: ', err))
          }
        }
      }
    }

    // await page.screenshot({path: 'example.png'})
    // Test the background page as you would any other page.
    await page.close()
    Log('-'.repeat(66))

    if (IS_DEV_MODE) {
      break
    }
  }

  browser.close()
}

export default Run
