/* eslint-env mocha */

const tymly = require('@wmfs/tymly')
const expect = require('chai').expect
const path = require('path')

describe('Sharepoint Service tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  before(function () {
    if (!(
      process.env.SHAREPOINT_URL &&
      process.env.SHAREPOINT_USERNAME &&
      process.env.SHAREPOINT_PASSWORD
    )) {
      console.log('Missing environment variables, skipping tests.')
      this.skip()
    }
  })

  let tymlyService, sharepointService

  it('should boot tymly', done => {
    tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './../lib')
        ]
      },
      (err, services) => {
        expect(err).to.eql(null)
        tymlyService = services.tymly
        sharepointService = services.sharepoint
        done()
      }
    )
  })

  it('should expect a cookie on the service', () => {
    expect(sharepointService.getCookie()).to.not.eql(null)
  })

  it('should get form digest value', async () => {
    const digest = await sharepointService.getFormDigest()
    expect(digest).to.not.eql(null)
  })

  it('should shut down Tymly', async () => {
    await tymlyService.shutdown()
  })
})
