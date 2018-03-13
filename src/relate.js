import distance from 'jaro-winkler' // leven

import { Log, GetTargets, MongoDB } from './lib'

(async () => {
  const mainSiteUrl = 'liepiaowang.com'
  let mainSiteRecordIndex = 0
  const mainSiteRecordCount = await new Promise((resolve, reject) => {
    MongoDB.count({ site_url: mainSiteUrl }, resolve, { name: 'tickets' })
  })
  Log(`Found ${mainSiteRecordCount} records`)

  const relatedSiteUrlList = ['piaoniu.com', 'tking.cn']
  let relatedSiteIndex

  /*
   * Main loop : mainTicketRecord one By one
   */
  const nextMainRecord = async () => {
    if (mainSiteRecordIndex >= mainSiteRecordCount) {
      return
    }

    const mainRecords = await new Promise((resolve, reject) => {
      MongoDB.find({ site_url: mainSiteUrl }, resolve, {
        name: 'tickets',
        sort: '{"_id":-1}',
        skip: mainSiteRecordIndex,
        limit: 1
      })
    })
    currentSiteRecordIndex++
    relatedSiteIndex = 0 // default

    nextRelatedSite(mainRecords[0])
  }

  /*
   * Second loop : relatedSiteLoop one By one (has mainTicketRecord)
   */
  const nextRelatedSite = async (mainRecord) => {
    if (relatedSiteIndex >= relatedSiteUrlList.length) {
      nextMainRecord()
      return
    }

    const site_url = relatedSiteUrlList[relatedSiteIndex]
    relatedSiteIndex++
    const relatedSiteRecordCount = await new Promise((resolve, reject) => {
      MongoDB.count({
        // TODO: related_ticket_id not null
        site_url
      }, resolve, { name: 'tickets' })
    })

    nextRelatedRecord(mainRecord, site_url, relatedSiteRecordCount)
  }

  /*
   * Third loop : relatedTicketRecord one By one
   */
  const nextRelatedRecord = async (mainRecord, site_url, relatedTicketRecord) => {
    let similarRecord
    let similarityNum
    for (let i = 0; i < relatedTicketRecord; i++) {
      const relatedRecords = await new Promise((resolve, reject) => {
        MongoDB.find({
          // TODO: related_ticket_id not null
          site_url
        }, resolve, {
          name: 'tickets',
          sort: '{"_id":-1}',
          skip: i,
          limit: 1
        })
      })
      const distanceResult = getDistance(mainRecord, relatedRecords[0])
      if (distanceResult.canUse && (!similarityNum || similarityNum > distanceResult.distance)) {
        similarityNum = distanceResult.num
        similarRecord = relatedRecords[0]
      }
    }

    if (similarRecord) {
      Log('Found that similar ticket, mainRecord.title: ' + mainRecord.title + ' / similarRecord.title: ' + similar.title)
      Log('mainRecord._id: ' + mainRecord._id + ' / similarRecord._id: ' + similar._id)
      const saveResult = await new Promise((resolve, reject) => {
        MongoDB.updateOne({ _id: new MongoDB.ObjectId(similarRecord._id) }, {
          $set: { related_ticket_id: mainRecord._id }
        }, { w: 1 }, resolve, { name: 'tickets' })
      })
      Log(saveResult)
    }

    nextRelatedSite()
  }

  /*
   * Get distance : one mainTicketRecord with one relatedTicketRecord
   */
  const getFieldsStr = (record) => {
    return record.title + record.location + record.date_time
  }
  const getDistance = (mainRecord, relatedRecord) => {
    const mainText = getFieldsStr(mainRecord)
    const relatedText = getFieldsStr(relatedRecord)
    const num = distance(mainText, relatedText)

    return {
      num,
      canUse: num > 0.5
    }
  }
})()
