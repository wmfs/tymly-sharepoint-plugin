/* eslint-env mocha */

const tymly = require('@wmfs/tymly')
const expect = require('chai').expect
const path = require('path')

describe('startup tests', function () {
  this.timeout(process.env.TIMEOUT || 10000)

  let services

  it('refuse to boot if SHAREPOINT_URL has not been set', () => {
    try {
      tymly.boot(
        {
          pluginPaths: [
            path.resolve(__dirname, './../lib'),
            require.resolve('@wmfs/tymly-cloudstorage-plugin')
          ]
        }
      )
    } catch (err) {
      expect(err.message).to.be.eql('Error: Error booting sharepoint: Can not boot sharepoint. SHAREPOINT_URL is required.')
    }
  })

  it('boot tymly if SHAREPOINT_URL is set to DISABLED', async () => {
    process.env.SHAREPOINT_URL = 'DISABLED'

    services = await tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './../lib'),
          require.resolve('@wmfs/tymly-cloudstorage-plugin')
        ]
      }
    )
  })

  after('shut down tymly', async () => {
    await services.tymly.shutdown()
  })
})
