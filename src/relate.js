import distance from 'jaro-winkler' // leven

import { Log, GetTargets, MongoDB } from './lib'

(async () => {
  const mainSiteUrl = 'liepiaowang.com'
  let mainSiteRecordIndex = 0
  const mainSiteRecordCount = await new Promise((resolve, reject) => {
    MongoDB.count({
      human_matched: { $ne: true },
      site_url: mainSiteUrl
    }, resolve, { name: 'tickets' })
  })
  Log(`Found ${mainSiteRecordCount} records`)

  const relatedSiteUrlList = ['piaoniu.com', 'tking.cn']
  let relatedSiteIndex
  let matchedRelatedSiteNum

  /*
   * Main loop : mainTicketRecord one By one
   */
  const nextMainRecord = async () => {
    //     if (mainSiteRecordIndex >= 1) { // FIXME: for test
    //       return
    //     }
    if (mainSiteRecordIndex >= mainSiteRecordCount) {
      return
    }

    const mainRecords = await new Promise((resolve, reject) => {
      MongoDB.find({
        // _id: new MongoDB.ObjectId('5aa8943edb90e25cd6edde5d'), // FIXME: delete
        human_matched: { $ne: true },
        site_url: mainSiteUrl
      }, resolve, {
        name: 'tickets',
        sort: '{"_id":-1}',
        skip: mainSiteRecordIndex,
        limit: 1
      })
    })
    mainSiteRecordIndex++
    relatedSiteIndex = 0 // default
    matchedRelatedSiteNum = 0

    nextRelatedSite(mainRecords[0])
  }
  nextMainRecord()

  /*
   * Second loop : relatedSiteLoop one By one (has mainTicketRecord)
   */
  const nextRelatedSite = async (mainRecord) => {
    if (relatedSiteIndex >= relatedSiteUrlList.length) {
      // save the mainRecord is auto_matched already
      if (matchedRelatedSiteNum === relatedSiteUrlList.length) {
        MongoDB.updateMany({
          _id: new MongoDB.ObjectId(mainRecord._id)
        }, { $set: { auto_matched: true } }, { w: 1 }, (result) => {
          Log(result)
        }, { name: 'tickets' })
      }

      nextMainRecord()
      return
    }

    const site_url = relatedSiteUrlList[relatedSiteIndex]
    relatedSiteIndex++
    const relatedSiteRecordCount = await new Promise((resolve, reject) => {
      MongoDB.count({
        related_ticket_id: { $in: [ '', null, false ] },
        site_url
      }, resolve, { name: 'tickets' })
    })

    allRelatedRecord(mainRecord, site_url, relatedSiteRecordCount)
  }

  /*
   * Third loop : relatedTicketRecord one By one
   */
  const allRelatedRecord = async (mainRecord, site_url, relatedTicketRecord) => {
    let similarRecord
    let similarityNum
    for (let i = 0; i < relatedTicketRecord; i++) {
      const relatedRecords = await new Promise((resolve, reject) => {
        MongoDB.find({
          related_ticket_id: { $in: [ '', null, false ] },
          site_url
        }, resolve, {
          name: 'tickets',
          sort: '{"_id":-1}',
          skip: i,
          limit: 1
        })
      })
      if (relatedRecords.length === 0) {
        Log('The allRelatedRecord function is fucked up, site_url: ' + site_url + ' / i:' + i)
        return
      }

      const distanceResult = getDistance(mainRecord, relatedRecords[0])
      if (distanceResult.canUse && (!similarityNum || distanceResult.num > similarityNum)) {
        similarityNum = distanceResult.num
        similarRecord = relatedRecords[0]
      }
    }

    Log('The mainRecord._id: ' + mainRecord._id + '(' + mainRecord.title + ') for allRelatedRecord')
    if (similarRecord) {
      Log('Found! the similarityNum: ' + similarityNum)
      Log('The similarRecord._id: ' + similarRecord._id + '(' + similarRecord.title + ')')
      const saveResult = await new Promise((resolve, reject) => {
        MongoDB.updateOne({ _id: new MongoDB.ObjectId(similarRecord._id) }, {
          $set: { related_ticket_id: mainRecord._id }
        }, { w: 1 }, resolve, { name: 'tickets' })
      })
      Log(saveResult)

      matchedRelatedSiteNum++
    }

    nextRelatedSite(mainRecord)
  }

  /*
   * Get distance : one mainTicketRecord with one relatedTicketRecord
   */
  const getDistance = (mainRecord, relatedRecord) => {
    const titleNum = distance(mainRecord.title, relatedRecord.title)
    const locationNum = distance(mainRecord.location, relatedRecord.location)
    const date_timeNum = distance(mainRecord.date_time, relatedRecord.date_time)

    const avrageNum = titleNum * 0.6 + locationNum * 0.25 + date_timeNum * 0.15
    return {
      num: avrageNum,
      canUse: avrageNum > 0.7
    }
  }
})()
