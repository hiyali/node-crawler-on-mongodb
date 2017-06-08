import fs from 'fs'

import { Log } from './index.js'

const pArg = process.argv
let withDevFile = false
if (pArg.length === 3 && pArg[2] === '--dev') {
  withDevFile = true
}

const getTargets = (targetsDir, callback) => {
  fs.readdir(targetsDir, function(err, fileList) {
    const targetList = []
    const fl = fileList
    if (err) {
      Log(err)
      return
    }

    for (var i = 0; i < fileList.length; i++) {
      const fileName = fileList[i]
      // Log('fileList['+ i +'] ' + fileName)

      if (fileName.charAt(0) === '.') continue // do not use hidden files

      if (withDevFile && fileName.endsWith('.dev.js')) {
        targetList.push(fileName)
      } else if (!fileName.endsWith('.back.js') && fileName.endsWith('.js')) { // for back files
        targetList.push(fileName)
      }
    }

    callback(targetList)
  })
}

export default getTargets
