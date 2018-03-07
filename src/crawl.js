import path from 'path'
import childProc from 'child_process'
import phantomjs from 'phantomjs-prebuilt'
import fs from 'fs'

import { Log, GetTargets, MongoDB } from './lib'

const dontSaveData = process.argv.indexOf('--dont-save-data') > -1 ? true : false

const targetsDir = path.join(__dirname, 'targets')
const getTempFileAddr = function (targetFileName = '') {
  return path.join(__dirname, '../temp/' + targetFileName + '.result.txt')
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
  Log(`Target no.${length} (${fileName}) preparing to run`)
  runTarget(fileName)
}


const targetsReady = function (targetsList) {
  Log('targetsList', targetsList)
  queuedTargetsList = targetsList
  next()
}
GetTargets(targetsDir, targetsReady)


const onTargetFinish = (exitWithErr = null, tempFileAddr = null) => {
  if (exitWithErr) {
    Log('Phantomjs exit with:', exitWithErr)
  } else {
    Log('Phantomjs exit successfully')

    if (!tempFileAddr) {
      Log(`Variable tempFileAddr is not defined`)
    } else if (dontSaveData) {
      Log(`File ${tempFileAddr} not be saving to DB...`)
    } else if (fs.existsSync(tempFileAddr)) {
      /*
       * Change the save logic to post results.
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
      // */
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
    '--load-images=yes', // for improve the performance
    '--post-endpoint', // The server's end point that to save results
    'http://crawler_docker_container:5555/api/tickets',
    // 'http://crawler_docker_container:8000/',
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
