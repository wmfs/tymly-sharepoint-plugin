/* eslint-env mocha */

const tymly = require('@wmfs/tymly')
const expect = require('chai').expect
const path = require('path')
const mockSharepoint = require('./mock-sharepoint-server')

describe('Sharepoint Service tests', function () {
  //this.timeout(process.env.TIMEOUT || 5000)

  let mockServer = null
  let tymlyService, sharepointService

  before('boot tymly', async () => {
    mockServer = await mockSharepoint()

    process.env.SHAREPOINT_URL = 'http://localhost:5000'
    process.env.SHAREPOINT_USERNAME = 'test'
    process.env.SHAREPOINT_PASSWORD = 'test123'

    const services = await tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './../lib'),
          require.resolve('@wmfs/tymly-cloudstorage-plugin')
        ]
      }
    )

    tymlyService = services.tymly
    sharepointService = services.sharepoint
  })

  it('check the service has been set up', () => {
    expect(sharepointService.sharepoint.url).to.eql(process.env.SHAREPOINT_URL)
    expect(sharepointService.sharepoint.headers.Authorization.split(' ')[0]).to.eql('NTLM')
  })

  after('shut down Tymly', async () => {
    await mockServer.close()
    await tymlyService.shutdown()
  })
})
