/* eslint-env mocha */

const tymly = require('@wmfs/tymly')
const expect = require('chai').expect
const path = require('path')

describe('Sharepoint tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

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

  it('should shut down Tymly', async () => {
    await tymlyService.shutdown()
  })
})
