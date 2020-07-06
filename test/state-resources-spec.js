/* eslint-env mocha */

const tymly = require('@wmfs/tymly')
const expect = require('chai').expect
const path = require('path')
const mockSharepoint = require('./mock-sharepoint-server')

const ENSURE_FOLDER_STATE_MACHINE = 'test_ensureFolder_1_0'
const GET_CONTENTS_STATE_MACHINE = 'test_getContents_1_0'

describe('Sharepoint State Resources tests', function () {
  this.timeout(process.env.TIMEOUT || 5000)

  let mockServer = null
  let tymlyService, statebox

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
        ],
        blueprintPaths: [
          path.resolve(__dirname, 'fixtures/test-blueprint')
        ]
      }
    )

    tymlyService = services.tymly
    statebox = services.statebox
  })

  it('ensure folder state machine', async () => {
    const execDesc = await statebox.startExecution(
      {
        uprn: '12345'
      },
      ENSURE_FOLDER_STATE_MACHINE,
      { sendResponse: 'COMPLETE', userId: 'test-user' }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(execDesc.ctx.folderPath).to.eql('Shared Documents/General/12345')
    expect(execDesc.ctx.url).to.eql('http://localhost:5000')
    expect(mockServer.folder).to.equal('/mock/Shared Documents/General/12345')
  })

  it('get contents state machine', async () => {
    const execDesc = await statebox.startExecution(
      {
        uprn: '54321'
      },
      GET_CONTENTS_STATE_MACHINE,
      { sendResponse: 'COMPLETE', userId: 'test-user' }
    )

    expect(execDesc.status).to.eql('SUCCEEDED')
    expect(mockServer.folder).to.equal('/mock/Shared Documents/General/54321')
  })

  after('shut down Tymly', async () => {
    await mockServer.close()
    await tymlyService.shutdown()
  })
})
