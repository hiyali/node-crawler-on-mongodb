import fs from 'fs'

import { Log } from './index.js'

let justGetDevFile = false
if (process.argv.indexOf('--just-get-dev-file') > -1) {
  justGetDevFile = true
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

      if (justGetDevFile && fileName.endsWith('.dev.js')) {
        targetList.push(fileName)
      } else if (!fileName.endsWith('.back.js') && fileName.endsWith('.js')) { // for back files
        targetList.push(fileName)
      }
    }

    callback(targetList)
  })
}

export default getTargets
