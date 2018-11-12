'use strict'

const axios = require('axios')
const spauth = require('node-sp-auth')

class SharepointService {
  async boot (options, callback) {
    this.headers = null

    await this.setCookie()

    callback(null)
  }

  async setCookie () {
    const url = process.env.SHAREPOINT_URL
    const username = process.env.SHAREPOINT_USERNAME
    const password = process.env.SHAREPOINT_PASSWORD

    if (!username && !password && !url) {
      throw new Error('Sharepoint Username, Password and URL environment variables are required.')
    }

    const { headers } = await spauth.getAuth(url, { username, password })
    this.headers = {
      ...headers,
      Accept: 'application/json;odata=verbose'
    }
  }

  async getCookie () {
    return this.headers.Cookie
  }

  async getFormDigest () {
    const url = process.env.SHAREPOINT_URL

    if (!url) {
      throw new Error('Sharepoint URL environment variable is required.')
    }

    const { data } = await axios({
      method: 'post',
      url: `${url}/_api/contextinfo`,
      headers: {
        ...this.headers
      }
    })

    return data.d.GetContextWebInformation.FormDigestValue
  }

  async getFullFolderUrl () {}

  async ensureFolderPath () {}

  async listFolderContentsFromPath () {}
}

module.exports = {
  serviceClass: SharepointService
}
