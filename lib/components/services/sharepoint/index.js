'use strict'

const Sharepoint = require('@wmfs/sharepoint')
const fs = require('fs')

class SharepointService {
  async boot (options) {
    const cloudstorage = cloudstorageService(options)
    cloudstorage.registerProvider(this, 'sharepoint')

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

    return {
      folderPath: path,
      url: this.sharepoint.url
    }
  }

  async listFolderContentsFromPath (path) {
    if (this.disabled) return

    const { username, password } = ensureCreds()
    await this.sharepoint.authenticate(username, password)
    const contents = await this.sharepoint.getContents(path)
    return contents
  }

  async deleteFile (path, fileName) {
    if (this.disabled) return

    const { username, password } = ensureCreds()
    await this.sharepoint.authenticate(username, password)
    const fileInfo = await this.sharepoint.deleteFile({ path, fileName })
    return fileInfo
  }

  async copyFileToRemotePath (localFilePath, remoteFolderPath, remoteFileName = null) {
    if (this.disabled) return

    const { size } = fs.statSync(localFilePath)
    const stream = fs.createReadStream(localFilePath, { highWaterMark: 1024 * 2 })
    return this.sharepoint.createFileChunked({
      path: `${remoteFolderPath}`,
      fileName: remoteFileName,
      stream,
      fileSize: size,
      chunkSize: 1024 * 2
    })
  }
}

function ensureUrl () {
  if (process.env.SHAREPOINT_URL) {
    return process.env.SHAREPOINT_URL
  } else {
    bootOops('Sharepoint URL environment variable is required.')
  }
}

function ensureCreds () {
  if (process.env.SHAREPOINT_USERNAME && process.env.SHAREPOINT_PASSWORD) {
    return {
      username: process.env.SHAREPOINT_USERNAME,
      password: process.env.SHAREPOINT_PASSWORD
    }
  } else {
    bootOops('Sharepoint Username and Password environment variables are required.')
  }
}

function cloudstorageService (options) {
  const cloudstorage = options.bootedServices && options.bootedServices.cloudstorage

  if (!cloudstorage) bootOops('Can\'t find cloudstorage in bootedServices.')
  if (!cloudstorage.registerProvider) bootOops('cloudstorage doesn\'t have registerProvider method')

  return options.bootedServices.cloudstorage
} // cloudstorageService

function bootOops (msg) {
  throw new Error(`Can not boot sharepoint. ${msg}`)
} // bootOops

module.exports = {
  serviceClass: SharepointService,
  bootAfter: ['cloudstorage']
}
