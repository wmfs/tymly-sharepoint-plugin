class EnsureCloudStorageFolder {
  init (config, env, cb) {
    cb(null)
  }

  run (event, context) {
    console.log('Running EnsureCloudStorageFolder')
    context.sendTaskSuccess()
  }
}

module.exports = EnsureCloudStorageFolder
