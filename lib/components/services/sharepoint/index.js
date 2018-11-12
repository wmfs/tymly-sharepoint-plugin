'use strict'

const debug = require('debug')('@wmfs/tymly-sharepoint-plugin')

class SharepointService {
  boot (options, callback) {
    callback(null)
  }
}

module.exports = {
  serviceClass: SharepointService
}
