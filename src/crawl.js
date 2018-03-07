import path from 'path'
import childProc from 'child_process'
import phantomjs from 'phantomjs-prebuilt'
import fs from 'fs'

import { Log, GetTargets, MongoDB } from './lib'

// const dontSaveData = process.argv.indexOf('--dont-save-data') > -1 ? true : false
const targetsDir = path.join(__dirname, 'targets')
/* const getTempFileAddr = function (targetFileName = '') {
  return path.join(__dirname, '../temp/' + targetFileName + '.result.txt')
} // */

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


const onTargetFinish = (exitWithErr = null) => {
  if (exitWithErr) {
    Log('Phantomjs exit with:', exitWithErr)
  } else {
    Log('Phantomjs exit successfully')
  }

  setTimeout(() => {
    next()
  }, 100)
}


//* 1.
const runTarget = (fileName = 'example.back.js') => {
  const binPath = phantomjs.path
  const childArgs = [
    path.join(targetsDir, fileName),
    '--post-endpoint', // The server's end point that to save results
    'http://crawler_docker_container:5555/api/tickets',
    '--load-images=yes' // for improve the performance
  ]

  // Log('Start run target: ', fileName)
  childProc.execFile(binPath, childArgs, function(err, stdout, stderr) {
    Log('Stdout: ', stdout)
    Log('StdErr: ', stderr)

    onTargetFinish(err)
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
