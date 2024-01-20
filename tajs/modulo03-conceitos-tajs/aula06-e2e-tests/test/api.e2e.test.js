import { it, expect, describe, jest, beforeAll, afterAll } from "@jest/globals";
import server from "../src/server";

function waitForServerStatus(Server) {
  return new Promise((resolve, reject) => {
    server.once('error', (err) => reject(err))
    server.once('listening', () => resolve())
  })
}


describe('E2E Test Suite', () => {
  describe('E2e Tests for Server in a non-test env', () => {
    it('should start server with PORT 4000', async () => {
      const PORT = 4000;
      process.env.NODE_ENV = 'production';
      process.env.PORT = PORT;
      jest
      .spyOn(
        console,
        console.log.name
      )

      const { default: server } = await import('../src/index.js');
      await waitForServerStatus(server)
      const serveInfo = server.address()
     expect(serveInfo.port).toBe(PORT)
     expect(console.log).toHaveBeenCalledWith(
      `Server running at ${serveInfo.address}:${serveInfo.port}`
      )
    return new Promise(resolve => server.close(resolve))
    })
  })

  describe('E2E Tests for Server', () => {
    let _testServer
    let _testServerAddress
    beforeAll(async () => {
      process.env.NODE_ENV = 'test';
      const { default: server } = await import('../src/index.js');
      _testServer = server.listen();
      await waitForServerStatus(_testServer)

      const serveInfo = _testServer.address()
      _testServerAddress = `http://localhost:${serveInfo.port}`
    })
    //afterAll(done => _testServer.close(done))

    it('should return 404 for unsupported routes', async () => {
      const response = await fetch(`${_testServerAddress}/unsupportedRoute`, {
        method: 'POST'
      })
      expect(response.status).toBe(404)
    })

    it('should return 400 and missing field message when body is invalid CPF', async () => {
      const invalidPersonCPF = { name: 'Rodrigo Silva' }
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPersonCPF)
      })
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.validationError).toEqual('CPF is required')
    })

    it('should return 400 and missing field message when body is invalid name', async () => {
      const invalidPersonCPF = { cpf: '123.123.123-12' }
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(invalidPersonCPF)
      })
      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.validationError).toEqual('Name is required')
    })

    it('should return 200',async () => {
      const validPerson = { name: 'Rodrigo Silva', cpf: '123.123.123-12' }
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(validPerson)
      })
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toEqual('ok')
    }) 

    it('should return 500, internal server error', async () => {
      const validPerson = { name: 'Rodrigo Silva', cpf: 123 }
      const response = await fetch(`${_testServerAddress}/persons`, {
        method: 'POST',
        body: JSON.stringify(validPerson)
      })
      expect(response.status).toBe(500)
   
    })

  })
})