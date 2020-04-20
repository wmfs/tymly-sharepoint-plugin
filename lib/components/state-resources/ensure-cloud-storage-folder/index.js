const _ = require('lodash')

class EnsureCloudStorageFolder {
  init (config, env) {
    this.folderPathTemplate = config.folderPath
    this.sharepoint = env.bootedServices.sharepoint
  }

  async run (event, context) {
    const compileFolderPath = _.template(this.folderPathTemplate)
    const folderPath = compileFolderPath(event)
    try {
      await this.sharepoint.ensureFolderPath(folderPath)
      context.sendTaskSuccess({ folderPath, url: process.env.SHAREPOINT_URL })
    } catch (e) {
      context.sendTaskFailure({ error: 'ENSURE_CLOUD_STORAGE_FOLDER_FAIL', cause: e.message })
    }
  }
}

module.exports = EnsureCloudStorageFolder
