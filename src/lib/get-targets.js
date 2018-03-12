import fs from 'fs'

import { Log } from './index.js'

let IS_DEV_MODE = false
if (process.argv.indexOf('--dev-mode') > -1) {
  IS_DEV_MODE = true
}

const getTargets = (targetsDir, callback) => {
  fs.readdir(targetsDir, function(err, fileList) {
    const targetList = []
    if (err) {
      Log(err)
      return
    }

    for (var i = 0; i < fileList.length; i++) {
      const fileName = fileList[i]
      // Log('fileList['+ i +'] ' + fileName)

      if (fileName.charAt(0) === '.') continue // do not use hidden files

      if (IS_DEV_MODE && fileName.endsWith('.dev.js')) {
        targetList.push(fileName)
      } else if (!fileName.endsWith('.back.js') && fileName.endsWith('.js')) { // for back files
        targetList.push(fileName)
      }
    }

    callback(targetList)
  })
}

export default getTargets
