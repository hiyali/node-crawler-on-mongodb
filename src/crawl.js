'use strict'

import { CrawlMusic, CrawlNews } from './lib'

// Import targets
// -- music
import * as ytMusic from './rules/music/music.youtube.com'
// -- news
import * as ruleNews from './rules/news'

// Basic settings
const CrawlConf = {
  WAIT_FOR_TIMEOUT: 20 * 1000,
  IS_DEV_MODE: process.argv.indexOf('--dev-mode') > -1,
  CRAWL_ONCE_ITEM: process.argv.indexOf('--crawl-once-item') > - 1,
  DONT_SAVE_DATA: process.argv.indexOf('--dont-save-data') > -1,
}

// CrawlMusic them
;(async () => {
  if (process.argv.indexOf('--crawl-music') > -1) {
    await CrawlMusic(ytMusic, CrawlConf)
  }

  if (process.argv.indexOf('--crawl-news') > -1) {
    await CrawlNews(ruleNews, CrawlConf)
  }
})()
