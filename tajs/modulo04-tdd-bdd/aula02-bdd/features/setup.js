import {Given} from '@cucumber/cucumber'
import { server } from '../../aula01-tdd/src/api.js'

let _testServer
let _testServerAddress

function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
      server.once('error', (err) => reject(err))
      server.once('listening', () => resolve())
    })
  } 

Given('I have a running server', async function () {
    _testServer = server.listen();

    await waitForServerStatus(_testServer)

    const serveInfo = _testServer.address()
    _testServerAddress = `http://localhost:${serveInfo.port}`
})
