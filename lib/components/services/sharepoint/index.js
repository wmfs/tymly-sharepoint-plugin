'use strict'

const Sharepoint = require('@wmfs/sharepoint')
const fs = require('node:fs')
const process = require('node:process')

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

    ensureAzurePortalAppRegistration()
    ensureCert()
    ensureAuthScope()
    await this.sharepoint.authenticate()
    await this.sharepoint.getWebEndpoint()
  }

  async ensureFolderPath (path) {
    if (this.disabled) return

    await this.sharepoint.authenticate()
    await this.sharepoint.createFolder(path)

    return {
      folderPath: path,
      url: this.sharepoint.siteUrl
    }
  }

  async listFolderContentsFromPath (path) {
    if (this.disabled) return

    await this.sharepoint.authenticate()
    return await this.sharepoint.getContents(path)
  }

  async deleteFile (path, fileName) {
    if (this.disabled) return

    await this.sharepoint.authenticate()
    return await this.sharepoint.deleteFile({ path, fileName })
  }

  async copyFileToRemotePath (localFilePath, remoteFolderPath, remoteFileName = null) {
    if (this.disabled) return

    const chunkSize = 65536

    const { size } = fs.statSync(localFilePath)
    const stream = fs.createReadStream(localFilePath, { highWaterMark: chunkSize })
    return this.sharepoint.createFileChunked({
      path: `${remoteFolderPath}`,
      fileName: remoteFileName,
      stream,
      fileSize: size,
      chunkSize
    })
  }
}

function ensureUrl () {
  if (process.env.SHAREPOINT_URL) {
    return process.env.SHAREPOINT_URL
  } else {
    bootOops('SHAREPOINT_URL is required.')
  }
}

function ensureAzurePortalAppRegistration () {
  if (process.env.SHAREPOINT_CLIENT_ID && process.env.SHAREPOINT_TENANT_ID) {
    return
  } else {
    bootOops('SHAREPOINT_CLIENT_ID and SHAREPOINT_TENANT_ID are required.')
  }
}

function ensureCert () {
  if (process.env.SHAREPOINT_CERT_FINGERPRINT && process.env.SHAREPOINT_CERT_PASSPHRASE && process.env.SHAREPOINT_CERT_PRIVATE_KEY_FILE) {
    return
  } else {
    bootOops('SHAREPOINT_CERT_FINGERPRINT, SHAREPOINT_CERT_PASSPHRASE and SHAREPOINT_CERT_PRIVATE_KEY_FILE are required.')
  }
}

function ensureAuthScope () {
  if (process.env.SHAREPOINT_AUTH_SCOPE) {
    return
  } else {
    bootOops('SHAREPOINT_AUTH_SCOPE is required.')
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
