const fastify = require('fastify')

const mockServer = {
  folder: null
}

async function mockSharepoint() {
  const app = fastify()

  app.get('/', {}, auth)
  app.get('/_api/web', {}, site)
  app.post('/_api/contextinfo', {}, contextInfo)
  app.post('/_api/web/folders', {}, folders)
  app.get('/_api/web/*', {}, folderContents)

  await app.listen(5000, 'localhost')

  console.log('Mock Sharepoint Listening')

  mockServer.close = () => app.close()

  return mockServer
}

const mockAuthString = 'NTLM TlRMTVNTUAACAAAADAAMADAAAAABAoEAASNFZ4mrze8AAAAAAAAAAGIAYgA8AAAARABPAE0AQQBJAE4AAgAMAEQATwBNAEEASQBOAAEADABTAEUAUgBWAEUAUgAEABQAZABvAG0AYQBpAG4ALgBjAG8AbQADACIAcwBlAHIAdgBlAHIALgBkAG8AbQBhAGkAbgAuAGMAbwBtAAAAAAA='
function auth(request, reply) {
  reply.header('www-authenticate', mockAuthString)
  reply.status(401)
  reply.send()
} // mockAuth

function site(request, reply) {
  reply.send({ d: {
      Id: "Mock",
      Iitle: "This is a Mock",
      Description: "For testing",
      Created: "By Jez",
      ServerRelativeUrl: "/mock/",
      LastItemUserModifiedDate: "Never"
    }})
} // site

function contextInfo(request, reply) {
  reply.send({ d: {
    GetContextWebInformation: {
      FormDigestValue: 'trousers'
    }
  }})
} // contextInfo

function folders(request, reply) {
  mockServer.folder = request.body.ServerRelativeUrl
  reply.status(200).send()
} // folders

function folderContents(request, reply) {
  const desired = request.params['*']
  const type = desired.split('/').slice(-1)[0]

  mockServer.folder = desired.replace('GetFolderByServerRelativeUrl(\'', '').replace(`')/${type}`, '')

  reply.send({ d: {
    results: []
  }})
} // folderContents

module.exports = mockSharepoint
