'use strict'

const axios = require('axios')
const spauth = require('node-sp-auth')

class SharepointService {
  async boot (options, callback) {
    this.headers = null
    this.site = null

    await this.setCookie()
    await this.getSiteDetails()

    callback(null)
  }

  async setCookie () {
    const url = ensureUrl()
    const creds = ensureCreds()

    const { headers } = await spauth.getAuth(url, creds)
    this.headers = {
      ...headers,
      Accept: 'application/json;odata=verbose'
    }
  }

  async getCookie () {
    return this.headers.Cookie
  }

  async getSiteDetails () {
    const url = ensureUrl()
    const { data } = await axios.get(`${url}/_api/web`, { headers: this.headers })
    const site = data.d
    this.site = {
      id: site.Id,
      title: site.Title,
      description: site.Description,
      created: site.Created,
      serverRelativeUrl: site.ServerRelativeUrl,
      lastModified: site.LastItemUserModifiedDate
    }
  }

  async getFormDigest () {
    const url = ensureUrl()

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

  async listFolderContentsFromPath (path) {
    const url = ensureUrl()
    const get = type => {
      return axios.get(
        `${url}/_api/web/GetFolderByServerRelativeUrl('${this.site.serverRelativeUrl}${path}')/${type}`,
        { headers: this.headers }
      )
    }

    const folders = await get('Folders')
    const files = await get('Files')

    return [...folders.data.d.results, ...files.data.d.results]
  }
}

function ensureUrl () {
  if (process.env.SHAREPOINT_URL) {
    return process.env.SHAREPOINT_URL
  } else {
    throw new Error('Sharepoint URL environment variable is required.')
  }
}

function ensureCreds () {
  if (process.env.SHAREPOINT_USERNAME && process.env.SHAREPOINT_PASSWORD) {
    return {
      username: process.env.SHAREPOINT_USERNAME,
      password: process.env.SHAREPOINT_PASSWORD
    }
  } else {
    throw new Error('Sharepoint Username and Password environment variables are required.')
  }
}

module.exports = {
  serviceClass: SharepointService,
  bootBefore: ['statebox']
}
