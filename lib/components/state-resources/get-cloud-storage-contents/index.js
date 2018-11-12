class GetCloudStorageContents {
  init (config, env, cb) {
    cb(null)
  }

  run (event, context) {
    console.log('Running GetCloudStorageContents')
    context.sendTaskSuccess()
  }
}

module.exports = GetCloudStorageContents
