import { it, expect, describe, beforeEach, jest } from "@jest/globals";
import Service from "../src/service.js";
import fs from 'node:fs/promises'
import fsSync from 'node:fs'

describe('Service Test Suite', () => {
  let _service

  const filename = 'testfile.ndjson'
  beforeEach(() => {
    _service = new Service({ filename })
  })
  describe('#read', () => {
    it('should return an empty array if the file is empty', async () => {
      jest.spyOn(
        fsSync,
        'existsSync'
      ).mockResolvedValue(true)

      jest.spyOn(
        fs,
        fs.readFile.name
      ).mockResolvedValue('')

      const result = await _service.read()
      expect(result).toEqual([])

    })
    it('should return an empty array if there is not the file', async () => {
      jest.spyOn(
        fsSync,
        'existsSync'
      ).mockResolvedValue(false)

      const result = await _service.read()
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

      jest.spyOn(
        fsSync,
        'existsSync'
      ).mockResolvedValue(true)

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
})