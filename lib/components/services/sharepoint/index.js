'use strict'

const Sharepoint = require('@wmfs/sharepoint')

class SharepointService {
  async boot (options) {
    const url = ensureUrl()
    if (url === 'DISABLED') {
      this.disabled = true
      options.messages.info('Sharepoint Plugin Disabled')
      return
    } // if ...

    this.sharepoint = new Sharepoint(url)

    const { username, password } = ensureCreds()
    await this.sharepoint.authenticate(username, password)

    await this.sharepoint.getWebEndpoint()
  }

  async ensureFolderPath (path) {
    if (this.disabled) return

    const { username, password } = ensureCreds()
    await this.sharepoint.authenticate(username, password)
    await this.sharepoint.createFolder(path)
  }

  async listFolderContentsFromPath (path) {
    if (this.disabled) return

    const { username, password } = ensureCreds()
    await this.sharepoint.authenticate(username, password)
    const contents = await this.sharepoint.getContents(path)
    return contents
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
