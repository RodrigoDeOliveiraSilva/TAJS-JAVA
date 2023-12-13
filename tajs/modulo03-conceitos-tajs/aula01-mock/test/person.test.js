import { it, describe, expect, jest } from "@jest/globals";
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
    it('should throw if the cpf is note present', () => {
      //Mock é a entrada necesaria para que o test funcione
      const mockInvalidPerson = {
        name: 'xuxa da silva',
        cpf: ''
      }

      expect(() => Person.validate(mockInvalidPerson))
        .toThrow(new Error("CPF is required"))

    })
    it('should not throw person is valid', () => {
      //Mock é a entrada necesaria para que o test funcione
      const mockInvalidPerson = {
        name: 'xuxa da silva',
        cpf: '44.555.66-25'
      }

      expect(() => Person.validate(mockInvalidPerson))
        .not
        .toThrow()

    })
  })
  describe('#format', () => {
    //parte do principio que os dados já foram validados.
    it("should format the person name and CPF", () => {
      //AAA
      //Arange = Prepara
      const mockPesonValid = {
        name: 'Xuxa da Silva',
        cpf: '111.222.333-44'
      }

      //Act = Executar 
      const formattedPerson = Person.format(mockPesonValid)

      //Assert = Validar
      const expected = {
        name: 'Xuxa',
        cpf: '11122233344',
        lastName: 'da Silva'
      }
      //Act = Executar    //Arange = Prepara    //Assert = Validar
      expect(formattedPerson).toStrictEqual(expected);
    })
  })
  describe('#save', () => {
    it('should throw if the person invalid', () => {
      //AAA
      //Arange - Preparar
      const MockPesonFormatInvalid = {
        name: 'Xuxa da Silva',
        cpf: '111.222.333-44'
      }

      // Act - Executar
      expect(() => Person.save(MockPesonFormatInvalid))    //Assert = Validar
        .toThrow(new Error(`cannot save invalid person: ${JSON.stringify(MockPesonFormatInvalid)}`))

    })
    it('should throw if the person valid', () => {
      //AAA
      //Arange - Preparar
      const MockPesonFormatvalid = {
        name: 'Xuxa da Silva',
        cpf: '111.222.333-44',
        lastName: 'da Silva'
      }

      // Act - Executar
      expect(() => Person.save(MockPesonFormatvalid))
        .not
        .toThrow()

    })
  })
  describe('#process', () => {
    it('should process a valid person', () => {
      //Não retestar o que já foi testado

      //checkpoints?
      //Testou - Caminho "A" ao caminho "C"  -> 'A'(Validate), 'B'(Format), 'C' (Save)
      //Agora - caminho C ao caminho D  -> 'D'(process)

      //Este métedo é últil quando:
      //Interações com Banco de Dados, API, Kafka e outros.

      //Mocks ?? São simulações de funções, utilizado no teste de comportamento.

      //AAA = Arange, Act, Assert

      //Arange

      const MockPersonValid = {
        name: 'xuxa da silva',
        cpf: '44.555.66-25'
      }

      //Expecionando o Validade e fazendo um Mock - Retornando true para essa função
      jest.spyOn(
        Person,
        Person.validate.name
      ).mockReturnValue()

      jest.spyOn(
        Person,
        Person.format.name
      ).mockReturnValue({
        name: 'Xuxa',
        cpf: '445556625',
        lastName: 'da Silva'
      })

      jest.spyOn(
        Person,
        Person.save.name
      ).mockReturnValue() 

      //Act
      const resultSave = Person.process(MockPersonValid);

      //Assert
      const expected = 'ok'

      expect(resultSave).toStrictEqual(expected)

    })
  })
})