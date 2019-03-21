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

const postResults = (result, postEndpoint) => {
  return new Promise((resolve, reject) => {
    axios
      .post(postEndpoint, result)
      .then(resolve)
      .catch(reject)
  })
}

const createMongoDBIndex = (createIndexColumn) => new Promise((resolve, reject) => {
  MongoDB.createIndex(createIndexColumn, (result) => {
    Log('MongoDB result:', result)
    resolve(result)
  }, { unique: true, background: true, w: 1, dropDups: true })
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

const Run = async ({ getConf, parseData }, { postEndpoint, waitForTimeout, RUN_ONCE, DONT_SAVE_DATA }) => {
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

  let conf = getConf()
  while (conf) {
    Log('Getting crawl with conf.url:', conf.url)

    const page = await browser.newPage()
    await page.emulate(device)
    // await page.setUserAgent(localDevice.userAgent)
    // await page.setViewport(localDevice.viewport)

    const $target = await getSiteTarget(page, conf.url, conf.waitForSelector, waitForTimeout)
    const result = await parseData($target, conf.dataMark)
    Log('Result length:', result.length)

    if (!DONT_SAVE_DATA) {
      const success = await postResults(result, postEndpoint).catch(err => Log('Err - postResults: ', err))
      if (success) {
        await createMongoDBIndex(conf.createIndexColumn)
      }
    }

    // await page.screenshot({path: 'example.png'})
    // Test the background page as you would any other page.
    await page.close()
    Log('-'.repeat(66))

    if (RUN_ONCE) {
      break
    }

    conf = getConf()
  }

  browser.close()
}

export default Run
