'use strict'

const spauth = require('node-sp-auth')

class SharepointService {
  async boot (options, callback) {
    this.cookie = null

    await this.setCookie()

    callback(null)
  }

  async setCookie () {
    const url = process.env.SHAREPOINT_URL
    const username = process.env.SHAREPOINT_USERNAME
    const password = process.env.SHAREPOINT_PASSWORD

    if (!username && !password && !url) {
      throw new Error('Sharepoint username, password and url environment variables are required.')
    }

    const { headers } = await spauth.getAuth(url, { username, password })
    this.cookie = headers.Cookie
  }

  async getCookie () {
    return this.cookie
  }

  async getFullFolderUrl () {}

  async getFormDigest () {}

  async ensureFolderPath () {}

  async listFolderContentsFromPath () {}
}

module.exports = {
  serviceClass: SharepointService
}
