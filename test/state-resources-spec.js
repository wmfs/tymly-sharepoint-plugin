/* eslint-env mocha */

const tymly = require('@wmfs/tymly')
const expect = require('chai').expect
const path = require('path')

const ENSURE_FOLDER_STATE_MACHINE = 'test_ensureFolder_1_0'
const GET_CONTENTS_STATE_MACHINE = 'test_getContents_1_0'

describe('Sharepoint State Resources tests', function () {
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

  let tymlyService, statebox

  it('should boot tymly', done => {
    tymly.boot(
      {
        pluginPaths: [
          path.resolve(__dirname, './../lib')
        ],
        blueprintPaths: [
          path.resolve(__dirname, 'fixtures/test-blueprint')
        ]
      },
      (err, services) => {
        expect(err).to.eql(null)
        tymlyService = services.tymly
        statebox = services.statebox
        done()
      }
    )
  })

  it('ensure folder state machine', async () => {
    const execDesc = await statebox.startExecution(
      {
        uprn: '1234'
      },
      ENSURE_FOLDER_STATE_MACHINE,
      { sendResponse: 'COMPLETE', userId: 'test-user' }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
  })

  it('get contents state machine', async () => {
    const execDesc = await statebox.startExecution(
      {
        uprn: '1234'
      },
      GET_CONTENTS_STATE_MACHINE,
      { sendResponse: 'COMPLETE', userId: 'test-user' }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
  })

  it('should shut down Tymly', async () => {
    await tymlyService.shutdown()
  })
})
