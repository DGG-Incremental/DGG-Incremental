import { getResource, setResource, addResource } from '../resource'
import { createGame } from '../game'

describe("game", () => {
    let game = createGame()

    beforeEach(() => {
        game = createGame()
    })

    describe('creation', () => {
        test('should start with no game', () => {
            expect(getResource('metal', game)).toEqual(0)
            expect(getResource('wire', game)).toEqual(0)
        })
    })

    describe('setResource', () => {
        test('should set resource to 0', () => {
            const result = setResource('wire', 0, game)
            expect(getResource('wire', result)).toEqual(0)
        })

        test('should set resource to 1', () => {
            const result = setResource('wire', 1, game)
            expect(getResource('wire', result)).toEqual(1)
        })

        test('should set resource to any number', () => {
            const result = setResource('wire', 10, game)
            expect(getResource('wire', result)).toEqual(10)
        })
    })

    describe('addResource', () => {
        test('shoud not change resource when adding 0', () => {
            const result = addResource('metal', 0, game)
            expect(getResource('metal', result)).toBe(0)
        })
        test('shoud add one resource', () => {
            const result = addResource('metal', 1, game)
            expect(getResource('metal', result)).toBe(1)
        })
        test('shoud any number of resources', () => {
            const result = addResource('metal', 2, game)
            expect(getResource('metal', result)).toBe(2)
        })
    })

})
