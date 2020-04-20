const _ = require('lodash')

class GetCloudStorageContents {
  init (config, env) {
    this.folderPathTemplate = config.folderPath
    this.sharepoint = env.bootedServices.sharepoint
  }

  async run (event, context) {
    const compileFolderPath = _.template(this.folderPathTemplate)
    const folderPath = compileFolderPath(event)
    try {
      const contents = await this.sharepoint.listFolderContentsFromPath(folderPath)
      context.sendTaskSuccess({ contents })
    } catch (e) {
      context.sendTaskFailure({ error: 'GET_CLOUD_STORAGE_CONTENTS_FAIL', cause: e.message })
    }
  }
}

module.exports = GetCloudStorageContents
