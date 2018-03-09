import path from 'path'
import childProc from 'child_process'
import phantomjs from 'phantomjs-prebuilt'

import { Log, GetTargets, MongoDB } from './lib'

const targetsDir = path.join(__dirname, 'targets/levels');

(async () => {
  // Global variables
  const date_step = '20180309_1' // FIXME: this must comes from cli
  let targetsCount
  let queuedTargetsList = []
  let currentFileName
  let currentSiteRecordCount
  let currentSiteUrl
  let currentSiteRecordIndex

  // Prepare variables
  queuedTargetsList = await new Promise((resolve, reject) => {
    GetTargets(targetsDir, resolve)
  })
  targetsCount = queuedTargetsList.length
  Log('queuedTargetsList', queuedTargetsList)

  const nextFile = async () => {
    currentFileName = queuedTargetsList.shift()

    // If done
    if (currentFileName === undefined) {
      Log('MongoDB prepare to createIndex for remove the repetition!')
      const result = await new Promise((resolve, reject) => {
        /*
         * Create Indexes for levels
         * ====
         * date_step + parent_ticket_id + date_time + name is unique
         */
        MongoDB.createIndex(
          { 'date_step': 1, 'parent_ticket_id': 1, 'date_time': 1, 'name': 1 },
          resolve,
          { unique: true, background: true, w: 1, dropDups: true },
          'levels'
        )
      })
      Log(result)
      Log('Queued done!')
      return
    }

    // Prepare to run record
    Log(`Target no.${targetsCount - queuedTargetsList.length} (${currentFileName}) preparing to run`)
    currentSiteUrl = currentFileName.replace('-level.js', '').replace('-level.dev.js', '')
    currentSiteRecordCount = await new Promise((resolve, reject) => {
      MongoDB.count({ site_url: currentSiteUrl }, resolve, { name: 'tickets' })
    })
    Log(`Found ${currentSiteRecordCount} records`)
    // FIXME: test for 3 records blow
    currentSiteRecordCount = currentSiteRecordCount > 3 ? 3 : currentSiteRecordCount
    currentSiteRecordIndex = 0

    // Run record
    nextRecord()
  }

  const nextRecord = async () => {
    // If done
    if (currentSiteRecordIndex >= currentSiteRecordCount) {
      nextFile()
      return
    }

    // Prepare to run target file
    const records = await new Promise((resolve, reject) => {
      MongoDB.find({ site_url: currentSiteUrl }, resolve, {
        name: 'tickets',
        sort: '{"_id":-1}',
        skip: currentSiteRecordIndex,
        limit: 1
      })
    })
    currentSiteRecordIndex++

    // Run target
    Log(`Prepare to run record ${currentSiteRecordIndex} of ${currentSiteRecordCount}`)
    runTarget(records[0], nextRecord)
  }

  const runTarget = async (ticketRecord, callback) => {
    // Prepare to run phantom target
    const binPath = phantomjs.path
    const childArgs = [
      path.join(targetsDir, currentFileName),
      '--post-endpoint', // The server's end point that to save results
      'http://crawler_docker_container:5555/api/levels',
      '--url',
      ticketRecord.url,
      '--ticket-_id',
      ticketRecord._id,
      '--level-date_step',
      date_step,
      '--load-images=yes' // for improve the performance
    ]
    Log('Start run target for ticket._id: ', ticketRecord._id)

    // Waiting for phantom targets working done
    const exitWithErr = await new Promise((resolve, reject) => {
      childProc.execFile(binPath, childArgs, function(err, stdout, stderr) {
        Log('Stdout: ', stdout)
        Log('StdErr: ', stderr)

        resolve(err)
      })
    })
    Log('Phantomjs exit with:', exitWithErr ? exitWithErr : 'successfully')

    // Excute callback
    setTimeout(() => {
      callback()
    }, 100)
  }

  // Run whole thing
  nextFile()
})()
