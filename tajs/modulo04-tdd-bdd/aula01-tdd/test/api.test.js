import { it, expect, describe, beforeAll, afterAll, jest } from "@jest/globals";
import { server } from "../src/api.js";

describe("API User E2E Suite", () => {
  let _testServer
  let _testServerAddress
  beforeAll(async () => {
    jest.useFakeTimers({
      now: new Date('2024-01-26T00:00')
    })//Fake times for the current date do not affect the test result
    _testServer = server.listen();
    await waitForServerStatus(_testServer)
    const serveInfo = _testServer.address()
    _testServerAddress = `http://localhost:${serveInfo.port}`
  })
  afterAll(done => {
    server.closeIdleConnections();
    _testServer.close(done)
  })
  function waitForServerStatus(server) {
    return new Promise((resolve, reject) => {
      server.once('error', (err) => reject(err))
      server.once('listening', () => resolve())
    })
  }
  function createUser(data) {
    return fetch(`${_testServerAddress}/users`, {
      method: 'POST',
      body: JSON.stringify(data)
    })

   
  }
  async function findById(id) {
    return (await fetch(`${_testServerAddress}/users/${id}`)).json()
  }

  it("should thow an error internal when server is down", async () => {
    const response = await createUser({
      name: "Rodrigo Silva",
      birthDay: "invalid date" // invalid date
    })
    expect(response.status).toBe(500) // 500 - Internal Server Error
  }) 

  it("shouuld thow an error when registering a under-age user", async () => {
    const response = await createUser({
      name: "Rodrigo Silva",
      birthDay: "2011-01-01" // 10 anos
    })
    expect(response.status).toBe(400) // 400 - Bad Request
    const result = await response.json()
    expect(result.message).toBe('User must be 18yo older')
  })
  
  it("should register a new user with young-adult category", async () => {
    const expectedCategory = "young-adult" 
    const response = await createUser({
      name: "Rodrigo Silva",
      birthDay: "2000-01-01" // 21 anos
    })
    expect(response.status).toBe(201) // 201 - Created
    const resultId = (await response.json()).id
    expect(resultId).not.toBeUndefined()

    const user = await findById(resultId);
    expect(user.category).toBe(expectedCategory)
  })
  
  it("should register a new user with adult category", async () => {
    const expectedCategory = "adult" 
    const response = await createUser({
      name: "Rodrigo Silva",
      birthDay: "1990-01-01" // 31 anos
    })
    expect(response.status).toBe(201) // 201 - Created
    const resultId = (await response.json()).id
    expect(resultId).not.toBeUndefined()

    const user = await findById(resultId);
    expect(user.category).toBe(expectedCategory)
  })
  
  it("should register a new user with senior category", async () => {
    const expectedCategory = "senior" 
    const response = await createUser({
      name: "Rodrigo Silva",
      birthDay: "1960-01-01" // 61 anos
    })
    expect(response.status).toBe(201) // 201 - Created
    const resultId = (await response.json()).id
    expect(resultId).not.toBeUndefined()

    const user = await findById(resultId);
    expect(user.category).toBe(expectedCategory)
  })

}) 

/*
  --Error adolescente:
    -Usuarios de <= 17 anos
  --Jovens Adultros:
    -Usarios de 18-25 anos
  --Adultos
    -Usuarios de 26-50 anos
  --Idosos
    -Usuarios de >= 51
  
*/