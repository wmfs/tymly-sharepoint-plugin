const _ = require('lodash')

class GetCloudStorageContents {
  init (config, env, cb) {
    this.folderPathTemplate = config.folderPath
    cb(null)
  }

  run (event, context) {
    console.log('Running GetCloudStorageContents')

    const compliedFolderPath = _.template(this.folderPathTemplate)
    const folderPath = compliedFolderPath(event)
    console.log('>>>', folderPath)

    context.sendTaskSuccess()
  }
}

module.exports = GetCloudStorageContents
