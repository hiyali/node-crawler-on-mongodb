import path from 'path'
import childProc from 'child_process'
import phantomjs from 'phantomjs-prebuilt'
import fs from 'fs'

import { Log, GetTargets, MongoDB } from './lib'

const targetsDir = path.join(__dirname, 'targets')
const getTempFileAddr = function (targetFileName = '') {
  return path.join(__dirname, '../temp/' + targetFileName + '.result.txt')
}

// use MongoDB lib example
// MongoDB.find({ salam: 1 }, Log)
// MongoDB.insertMany([{ "salam": "dawran" }, { "dawran": "alim" }], Log)
// MongoDB.insertOne({ "phantomjs": "saved to mongodb" }, Log)
// MongoDB.deleteMany({ "url": { "$exists": false } }, Log) // 删除 url

let queuedTargetsList = []
const next = () => {
  return
  const length = queuedTargetsList.length
  if (length === 0) {
    Log('Queued done!')
    return
  }

  const fileName = queuedTargetsList.pop()
  Log(`target no.${length} (${fileName}) prepare run`)
  runTarget(fileName)
}
const targetsReady = function (targetsList) {
  Log('targetsList', targetsList)
  queuedTargetsList = targetsList
  next()
}
GetTargets(targetsDir, targetsReady)


const onTargetFinish = (existWith = null, tempFileAddr = null) => {
  if (existWith) {
    Log('Phantomjs exit with:', existWith)
  } else {
    Log('Phantomjs exit successfully')

    if (tempFileAddr && fs.existsSync(tempFileAddr)) {
      fs.readFile(tempFileAddr, 'utf8', (err, result) => {
        result = JSON.parse(result)

        let data = []
        if (typeof result === 'object' && result.hasOwnProperty('length')) {
          data = result
        } else {
          data = [{ result }]
        }
        MongoDB.insertMany(data, (result) => {
          Log(result)
        })
      })
    } else {
      Log(`File ${tempFileAddr} not found!`)
    }
  }
  setTimeout(() => {
    next()
  }, 100)
}



/* 1.
const runTarget = (fileName = 'example.back.js') => {
  const fileAddr = path.join(targetsDir, fileName)
  const tempFileAddr = getTempFileAddr(fileName)
  Log('Start run target: ', fileName)
  const targetProc = phantomjs.exec(fileAddr + ' ' + tempFileAddr)

  targetProc.stdout.pipe(process.stdout)
  targetProc.stderr.pipe(process.stderr)

  targetProc.on('exit', code => {
    onTargetFinish(code, tempFileAddr)
  })
}
// */


//* 2.
const runTarget = (fileName = 'example.back.js') => {
  const binPath = phantomjs.path
  const tempFileAddr = getTempFileAddr(fileName)
  const childArgs = [
    path.join(targetsDir, fileName),
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
