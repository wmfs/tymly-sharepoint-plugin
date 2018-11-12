const _ = require('lodash')

class EnsureCloudStorageFolder {
  init (config, env, cb) {
    this.folderPathTemplate = config.folderPath
    cb(null)
  }

  run (event, context) {
    console.log('Running EnsureCloudStorageFolder')

    const compileFolderPath = _.template(this.folderPathTemplate)
    const folderPath = compileFolderPath(event)
    console.log('>>>', folderPath)

    context.sendTaskSuccess()
  }
}

module.exports = EnsureCloudStorageFolder
