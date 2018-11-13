const _ = require('lodash')

class GetCloudStorageContents {
  init (config, env, cb) {
    this.folderPathTemplate = config.folderPath
    this.sharepoint = env.bootedServices.sharepoint
    cb(null)
  }

  async run (event, context) {
    console.log('Running GetCloudStorageContents')

    const compileFolderPath = _.template(this.folderPathTemplate)
    const folderPath = compileFolderPath(event)
    try {
      const contents = await this.sharepoint.listFolderContentsFromPath(folderPath)
      context.sendTaskSuccess({ contents, folderPath })
    } catch (e) {
      context.sendTaskFailure({ error: 'GET_CLOUD_STORAGE_CONTENTS_FAIL', cause: e.message })
    }
  }
}

module.exports = GetCloudStorageContents
