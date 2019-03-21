'use strict'

import { Run } from './lib'

// Import targets
import * as ytMusic from './targets-config/music.youtube.com.dev'

// Basic settings
const IS_DEV_MODE = process.argv.indexOf('--dev-mode') > -1

const RunConf = {
  postEndpoint: 'http://localhost:5556/api/music',
  waitForTimeout: 10 * 1000,
  RUN_ONCE: IS_DEV_MODE === true,
  DONT_SAVE_DATA: process.argv.indexOf('--dont-save-data') > -1,
}

// Run them
;(async () => {
  await Run(ytMusic, RunConf)
})()
