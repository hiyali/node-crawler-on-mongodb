import path from 'path'
import childProc from 'child_process'
import phantomjs from 'phantomjs-prebuilt'
import fs from 'fs'

import { Log, GetTargets, MongoDB, ApiServer } from './lib'

const dontSaveData = process.argv.indexOf('--dont-save-data') > -1 ? true : false
const dontGetTargets = process.argv.indexOf('--dont-get-targets') > -1 ? true : false
const dontRunApi = process.argv.indexOf('--dont-run-api') > -1 ? true : false

const targetsDir = path.join(__dirname, 'targets')
const getTempFileAddr = function (targetFileName = '') {
  return path.join(__dirname, '../temp/' + targetFileName + '.result.txt')
}

// use MongoDB lib example
// MongoDB.find({ salam: 1 }, Log)
// MongoDB.insertMany([{ "salam": "dawran" }, { "dawran": "alim" }], Log)
// MongoDB.insertOne({ "phantomjs": "saved to mongodb" }, Log)
// MongoDB.deleteMany({ "url": { "$exists": false } }, Log) // 删除没有 url 字段的记录


if (dontRunApi) {
  Log('Api server not run')
} else {
  ApiServer.run()
}


let queuedTargetsList = []
const next = () => {
  const length = queuedTargetsList.length
  if (length === 0) {
    Log('MongoDB prepare to createIndex for remove the repetition!')
    MongoDB.createIndex('url', (result) => {
      Log(result)
    }, { unique: true, background: true, w: 1, dropDups: true })

    Log('Queued done!')
    return
  }

  const fileName = queuedTargetsList.pop()
  Log(`Target no.${length} (${fileName}) prepare run`)
  runTarget(fileName)
}


const targetsReady = function (targetsList) {
  Log('targetsList', targetsList)
  queuedTargetsList = targetsList
  next()
}
if (dontGetTargets) {
  Log(`Not get targets`)
} else {
  GetTargets(targetsDir, targetsReady)
}


const onTargetFinish = (existWith = null, tempFileAddr = null) => {
  if (existWith) {
    Log('Phantomjs exit with:', existWith)
  } else {
    Log('Phantomjs exit successfully')

    if (!tempFileAddr) {
      Log(`Variable tempFileAddr is not defined`)
    } else if (dontSaveData) {
      Log(`File ${tempFileAddr} not be saving to DB...`)
    } else if (fs.existsSync(tempFileAddr)) {
      fs.readFile(tempFileAddr, 'utf8', (err, tempData) => {
        tempData = JSON.parse(tempData)

        if (typeof tempData === 'object' && tempData.hasOwnProperty('length')) {
          MongoDB.insertMany(tempData, (result) => {
            Log(result)
          })
        } else {
          MongoDB.insertOne(tempData, (result) => {
            Log(result)
          })
        }
      })
    } else {
      Log(`File ${tempFileAddr} not found!`)
    }
  }
  setTimeout(() => {
    next()
  }, 100)
}


//* 1.
const runTarget = (fileName = 'example.back.js') => {
  const binPath = phantomjs.path
  const tempFileAddr = getTempFileAddr(fileName)
  const childArgs = [
    path.join(targetsDir, fileName),
    '--temp-file',
    tempFileAddr
  ]
  // Log('Start run target: ', fileName)
  childProc.execFile(binPath, childArgs, function(err, stdout, stderr) {
    Log('Stdout: ', stdout)
    Log('StdErr: ', stderr)

    onTargetFinish(err, tempFileAddr)
  })
}
// */



/* 2.
const runTarget = (fileName = 'example.back.js') => {
  const fileAddr = path.join(targetsDir, fileName)
  const tempFileAddr = getTempFileAddr(fileName)
  Log('Start run target: ', fileName)
  const targetProc = phantomjs.exec(fileAddr + ' --temp-file ' + tempFileAddr)

  targetProc.stdout.pipe(process.stdout)
  targetProc.stderr.pipe(process.stderr)

  targetProc.on('exit', code => {
    onTargetFinish(code, tempFileAddr)
  })
}
// */
