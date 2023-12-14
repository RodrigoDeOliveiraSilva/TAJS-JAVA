import { it, expect, describe, beforeEach, jest } from "@jest/globals";
import Service from "../src/service.js";
import fs from 'node:fs/promises'
import crypto from 'node:crypto'
import fsSync from 'node:fs'

describe('Service Test Suite', () => {
  let _service
  const filename = 'testfile.ndjson'


  describe('#read -Stubs', () => {
     //Usar o beforeEach para gerar comportamentos padrões ao iniciar os testes
    beforeEach(() => {
      
      _service = new Service({ filename })
    })
    it('should return an empty array if the file is empty', async () => {
      //Arange, Act, Assert
      //Arange - Preparar => Spies
      jest.spyOn(
        fs,
        fs.readFile.name
      ).mockResolvedValue('')
      //Act - Executar
      const result = await _service.read()
      //Assert - Verificar
      expect(result).toEqual([])

    })
    it('should return an empty array if there is not the file', async () => {
      //Arange, Act, Assert
      //Arange - Preparar => Spies
      _service.filename = ''
      jest.spyOn(
        fsSync,
        'existsSync'
      ).mockResolvedValue(false)
      //Act - Executar
      const result = await _service.read()
      //Assert - Verificar
      expect(result).toEqual([])
    })
    it('should return users without password if file contains users', async () => {
      //Arange, Act, Assert
 
      //Arrange - Preparar => Moks
      const dbData = [
        {
          username: 'user1',
          password: 'pas1',
          createdAt: new Date().toISOString()
        },
        {
          username: 'user2',
          password: 'pas2',
          createdAt: new Date().toISOString()
        }
      ]

      const fileContents = dbData
        .map(item => JSON.stringify(item).concat('\n')).join('')
      //Retornar valor original do objeto -> para não retornar [] no read()
      jest.spyOn(
        fsSync,
        'existsSync'
      ).mockResolvedValue(true)
      
      // Mocked readFile, do tipo Spies
      jest.spyOn(
        fs,
        "readFile"
      ).mockResolvedValue(fileContents)

      //act
      const result = await _service.read()

      //Assert
      const expected = dbData.map(({ password, ...rest }) => ({ ...rest }))

      expect(result).toEqual(expected)


    })
  })
  describe('#create - Spies', () => {
    const MOCK_HASH_PWD = 'HASHED_PWD'
    //Usar o beforeEach para gerar comportamentos padrões ao iniciar os testes
    beforeEach(() => {
      jest.spyOn(
        crypto,
        crypto.createHash.name
      ).mockReturnValue({
          update: jest.fn().mockReturnThis(),
          digest: jest.fn().mockReturnValue(MOCK_HASH_PWD)
        })

      jest.spyOn(
        fs,
        fs.appendFile.name
      ).mockResolvedValue()

      _service = new Service({ filename })
    })

    it('should call appendFile with the right params', async () => {
      //AAA - Arange, Act, Assert

      //Arange - Mock-> Stubs
      const MocStubsdatCreatedAt = new Date().toISOString()
      jest.spyOn(
        Date.prototype,
        Date.prototype.toISOString.name
      ).mockReturnValue(MocStubsdatCreatedAt)


      const mockInputUser = {
        username: 'user1',
        password: 'pas1'
      }

      //Act
      const result = await _service.create(mockInputUser)
      
      // Assert
      expect(crypto.createHash).toHaveBeenCalledWith('sha256')
      expect(crypto.createHash).toHaveBeenCalledTimes(1)

      const MockhashExpected = crypto.createHash('sha256');
      expect(MockhashExpected.update).toHaveBeenCalledWith(mockInputUser.password)
      expect(MockhashExpected.digest).toHaveBeenCalledWith('hex')

      const expected = JSON.stringify({
        ...mockInputUser,
        password: MOCK_HASH_PWD,
        createdAt: MocStubsdatCreatedAt
      }).concat('\n')

      expect(fs.appendFile).toHaveBeenCalledWith(filename, expected)
    })

  })
})