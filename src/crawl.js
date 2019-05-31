'use strict'

import { Run } from './lib'

// Import targets
import * as ytMusic from './targets-config/music.youtube.com.dev'

// Basic settings
const IS_DEV_MODE = process.argv.indexOf('--dev-mode') > -1

const RunConf = {
  postEndpoint: {
    list: 'http://localhost:5556/api/music',
    category: 'http://localhost:5556/api/category',
  },
  waitForTimeout: 20 * 1000,
  IS_DEV_MODE,
  CRAWL_ONCE_ITEM: process.argv.indexOf('--crawl-once-item') > - 1,
  DONT_SAVE_DATA: process.argv.indexOf('--dont-save-data') > -1,
}

// Run them
;(async () => {
  await Run(ytMusic, RunConf)
})()
