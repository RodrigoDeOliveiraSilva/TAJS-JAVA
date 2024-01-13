import { it, expect, describe, beforeEach, jest } from "@jest/globals";
import Task from "../src/task.js";
import { setTimeout } from 'node:timers/promises';

describe('Task Test Suite', () => {
  let _logMock 
  let _task
  beforeEach(() => {
    _logMock = jest.spyOn(console, console.log.name).mockImplementation()
    _task = new Task()
  })

  it.skip('shoul only ryn taks taht are due without fake timers (slow)', async () => {
    
    //AAA = Arragne, act, assert
    //Arrange
    const tasks = [{
      name: 'taks-Will-Run-In-5-Secs',
      dueAt: new Date(Date.now() + (5e3)), // 5s
      fn: jest.fn()
    },
    {
      name: 'task-Will-Run-In-10-Secs',
      dueAt: new Date(Date.now() + (1e4)), // 10s
      fn: jest.fn()
    },
    {
      name: 'taks-Will-Run-In-20-Secs',
      dueAt: new Date(Date.now() + (15e3)), // 15s
      fn: jest.fn()
    }]
    //Act
    _task.save(tasks.at(0))
    _task.save(tasks.at(1))
    _task.save(tasks.at(2))
 
    _task.run(200) // 200ms

    await setTimeout(2e4) // 20s

    expect(tasks.at(0).fn).toHaveBeenCalled()
    expect(tasks.at(1).fn).toHaveBeenCalled()
    expect(tasks.at(2).fn).toHaveBeenCalled()
    //nowSpy.mockRestore() 
  },
  //Configurar para o jest Aguardar 30 segundos nesse test
  3e4
  )

  it('shoul only ryn taks taht are due with fake timers (fast)', async () => {
    jest.useFakeTimers()
    //AAA = Arragne, act, assert
    //Arrange
    const tasks = [{
      name: 'taks-Will-Run-In-5-Secs',
      dueAt: new Date(Date.now() + (5e3)), // 5s
      fn: jest.fn()
    },
    {
      name: 'task-Will-Run-In-10-Secs',
      dueAt: new Date(Date.now() + (1e4)), // 10s
      fn: jest.fn()
    },
    {
      name: 'taks-Will-Run-In-20-Secs',
      dueAt: new Date(Date.now() + (15e3)), // 15s
      fn: jest.fn()
    }]
    //Act
    _task.save(tasks.at(0))
    _task.save(tasks.at(1))
    _task.save(tasks.at(2))
 
    _task.run(200) // 200ms

    //Ninguem deve ser executado ainda
    jest.advanceTimersByTime(4e3) // 4s
    expect(tasks.at(0).fn).not.toHaveBeenCalled()
    expect(tasks.at(1).fn).not.toHaveBeenCalled()
    expect(tasks.at(2).fn).not.toHaveBeenCalled()
    
    //Somente a primeira tarefa deve ser executada
    jest.advanceTimersByTime(2e3) // 2s
    expect(tasks.at(0).fn).toHaveBeenCalled()
    //Somente a segunda tarefa deve ser executada
    jest.advanceTimersByTime(4e3) // 4s
    expect(tasks.at(1).fn).toHaveBeenCalled()
    //Somente a terceira tarefa deve ser executada
    jest.advanceTimersByTime(10e3) // 10s
    expect(tasks.at(2).fn).toHaveBeenCalled()

    jest.useRealTimers()
  })
})