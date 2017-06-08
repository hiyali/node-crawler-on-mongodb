import path from 'path'
import childProcess from 'child_process'
import phantomjs from 'phantomjs-prebuilt'

import { Log, GetTargets, MongoDB } from './lib'

const binPath = phantomjs.path
const targetsDir = path.join(__dirname, 'targets')

// use MongoDB lib example
// MongoDB.find({ salam: 1 }, Log)
// MongoDB.insertMany([{ "salam": "dawran" }, { "dawran": "alim" }], Log)
// MongoDB.insertOne({ "phantomjs": "saved to mongodb" }, Log)

const targetsReady = function (targetsList) {
  Log('targetsList', targetsList)
  targetsList.forEach((fileName, index) => {
    Log(`target no.${index + 1} (${fileName}) prepare run`)
    runTarget(fileName)
  })
}
GetTargets(targetsDir, targetsReady)

//* 1.
const runTarget = (fileName = 'example.back.js') => {
  const fileAddr = path.join(targetsDir, fileName)
  // Log('Start run target: ', fileName)
  const targetProc = phantomjs.exec(fileAddr)

  targetProc.stdout.pipe(process.stdout)
  targetProc.stderr.pipe(process.stderr)

  targetProc.on('message', message => {
    Log('Message:', message)
  })
  targetProc.on('exit', code => {
    Log('Phantomjs exit')
  })
}

// */

/* 2.
const runTarget = (fileName = 'example.back.js') => {
  const childArgs = [ path.join(targetsDir, fileName) ]
  // Log('Start run target: ', fileName)
  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    Log('Error: ', err)
    Log('Stdout: ', stdout)
    Log('StdErr: ', stderr)
  })
}
// */
