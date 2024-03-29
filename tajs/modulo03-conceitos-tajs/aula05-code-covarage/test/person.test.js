import { it, expect, describe } from "@jest/globals";
import mapPerson from "../src/person.js";

describe('Person Test Suite', () => {
    describe('happy path', () => {
        it('should map person', () => {
            const personStr = '{"name":"rodrigo","age":29}'
            const personOBJ = mapPerson(personStr)
            expect(personOBJ).toEqual({
                name: 'rodrigo',
                age: 29,
                createdAt: expect.any(Date)
            })
        })
    })
    describe('what coverage doesnt tell you', () => {
        it('should not map person given invalid JSON string', () => {
            const personStr = '{"name":"rodrigo'
            expect(()=> mapPerson(personStr))
            .toThrow('Unexpected end of JSON input')
        }) 
        it('should not map person given invalid JSON data', () => {
            const personStr = '{}'
            const personOBJ = mapPerson(personStr)
            expect(personOBJ).toEqual({
                name: undefined,
                age: undefined,
                createdAt: expect.any(Date)
            }) 
        }) 
    })
})