const fastify = require('fastify')

async function mockSharepoint() {
  const app = fastify()

  app.get('/', {}, mockAuth)
  app.get('/_api/web', {}, mockSite)

  await app.listen(5000, 'localhost')

  console.log('Mock Sharepoint Listening')

  return app
}

const mockAuthString = 'NTLM TlRMTVNTUAACAAAADAAMADAAAAABAoEAASNFZ4mrze8AAAAAAAAAAGIAYgA8AAAARABPAE0AQQBJAE4AAgAMAEQATwBNAEEASQBOAAEADABTAEUAUgBWAEUAUgAEABQAZABvAG0AYQBpAG4ALgBjAG8AbQADACIAcwBlAHIAdgBlAHIALgBkAG8AbQBhAGkAbgAuAGMAbwBtAAAAAAA='
function mockAuth(request, reply) {
  reply.header('www-authenticate', mockAuthString)
  reply.status(401)
  reply.send()
} // mockAuth

function mockSite(request, reply) {
  reply.send({ d: {
      Id: "Mock",
      Iitle: "This is a Mock",
      Description: "For testing",
      Created: "By Jez",
      ServerRelativeUrl: "/mockaroo",
      LastItemUserModifiedDate: "Never"
    }})
}

module.exports = mockSharepoint
