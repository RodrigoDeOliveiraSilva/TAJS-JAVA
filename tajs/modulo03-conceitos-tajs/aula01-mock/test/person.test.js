import { it, describe, expect } from "@jest/globals";
import Person from "../src/person";

describe("#Person Suite", () => {

  describe('#validate', () => {
    it('should throw if the name is note present', () => {
      //Mock é a entrada necesaria para que o test funcione
      const mockInvalidPerson = {
        name: '',
        cpf: '44.555.66-25'
      }

      expect(() => Person.validate(mockInvalidPerson))
        .toThrow(new Error("Name is required"))

    })
  })
})