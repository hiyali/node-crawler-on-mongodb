'use strict'
import { Log } from '../lib'

const siteUrl = 'music.youtube.com'
const urlModel = 'https://music.youtube.com/playlist?list={LIST_ID}'
const urlConfList = [
// home
  { id: 'PLFgquLnL59alcyTM2lkWJU34KtfPXQDaX', category: 'top-tracks' },
  { id: 'PLFgquLnL59alkIbVx9idhCZ0oRQGV5C29', category: 'latest' },

  { id: 'PLFgquLnL59am8hdnKF-SBlyBi2s83mz9e', category: 'brazil-latest' },
  { id: 'PLFgquLnL59alW3xmYiWRaoz0oM3H17Lth', category: 'us-latest' },
  { id: 'RDCLAK5uy_lBGRuQnsG37Akr1CY4SxL0VWFbPrbO4gs', category: 'hip-hop-and-r-b' },
  { id: 'RDCLAK5uy_kmPRjHDECIcuVwnKsx2Ng7fyNgFKWNJFs', category: 'pop' },
  { id: 'RDCLAK5uy_lJ8xZWiZj2GCw7MArjakb6b0zfvqwldps', category: 'country' },
  { id: 'RDCLAK5uy_kLWIr9gv1XLlPbaDS965-Db4TrBoUTxQ8', category: 'edh' },
  { id: 'RDCLAK5uy_kuEc3lB_I49bqnoy24kbjutvsiOi9ZQe0', category: 'alternative' },
  { id: 'RDCLAK5uy_k5vcGRXixxemtzK1eKDS7BeHys7mvYOdk', category: 'rock' },
  { id: 'RDCLAK5uy_m0Nsi5Jnn_g6qbvc7fywPRhEv1qN0PcMM', category: 'indie' },
  { id: 'RDCLAK5uy_lOAAW-PX5XUed76iQefCxkOXd6m6ZvyiM', category: 'latin' },
  { id: 'RDCLAK5uy_mBG8rnC5wMKo61Jn5c18C6_NoYsuQ2HRI', category: 'regional-mexican' },
  { id: 'RDCLAK5uy_nH_fdBVCcbNaVwi_tmZajZRq-ekddiuFY', category: 'pop-meets-country' },
  { id: 'RDCLAK5uy_n64_P7t3MmbTu7jziSk48DL-oRWO98CPE', category: 'electronic' },
  { id: 'RDCLAK5uy_nWEJYv-Uz64iDaI_cc9ink9grqEpQViPc', category: 'go-slower' },

// top-charts
  { id: 'PL4fGSI1pDJn5kI81J1fYWK5eZRl1zJ5kM', category: 'top-100-world' },
  { id: 'PLFgquLnL59anX9MlB94jIg69rR6FyzqQP', category: 'trending-20-us' },
  { id: 'PL4fGSI1pDJn69On1f-8NAvX_CYlx7QyZc', category: 'top-100-us' },
  { id: 'PLFgquLnL59an-05S-d-D1md6qdfjC0GOO', category: 'top-tracks-turkey' },

  { id: 'PLJhKEt4Hct7X5ox53HIqxCHRdhghj581o', category: 'top-100-itunes-us' },
  { id: 'PLD7SPvDoEddZUrho5ynsBfaI7nqhaNN5c', category: 'hot-100-billboard' },
  { id: 'PLywWGW4ILrvpqqkgKRV8jpZMaUPohQipP', category: 'top-100-official-uk' },
  { id: 'PL4QNnZJr8sRNKjKzArmzTBAlNYBDN2h-J', category: 'top-k-pop' },
]
const targetSelector = '#contents.ytmusic-playlist-shelf-renderer .ytmusic-playlist-shelf-renderer'

const strExist = value => value && value.length > 0

const getConf = () => {
  const urlConf = urlConfList.shift()
  if (!urlConf) {
    return undefined
  }

  const url = urlModel.replace('{LIST_ID}', urlConf.id)
  return {
    url,
    dataMark: {
      siteUrl,
      category: urlConf.category,
    },
    waitForSelector: '#contents',
    createIndexOption: {
      category: 1,
      dateStep: -1,
      sortNum: 1,
      videoId: 1,
    },
  }
}

const parseData = async ($, dataMark = {}) => {
  const resultData = []
  await $(targetSelector).each(function(index) {
    const thumbnail = $(this).find('.yt-img-shadow').attr('src').split('?')[0]
    const data = {
      thumbnail,
      title: $(this).find('.title').text(),
      artist: $(this).find('.secondary-flex-columns yt-formatted-string:first-child').text().replace('\n', ''),
      // time: $(this).find('> :last-child yt-formatted-string').text().replace('\n', ''), // do'nt appear in iPad...
      videoId: thumbnail ? thumbnail.split('/')[4] : '',
      sortNum: index + 1,
    }
    if (thumbnail.indexOf('jpg') > -1 && strExist(data.videoId) && strExist(data.title)) {
      resultData.push({ ...data, ...dataMark })
    } else {
      Log('The invalidated item position: ', index + 1)
    }
  })
  return resultData
}

export {
  getConf,
  parseData,
}
