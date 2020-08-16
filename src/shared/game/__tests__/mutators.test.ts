import { createGame } from '../game'
import { mutateGame } from '../mutators'
import { getResource, addResource, setResource } from '../resource'
import { pipe, compose } from 'ramda'
import { getFabricatorSize, getFabricatorDetails } from '../fabricators/fabricators'
import { Game } from '../types'

describe('mutators', () => {
    let game = createGame()

    beforeEach(() => game = createGame())

    test('scavengeMetal', () => {
        const result = mutateGame('scavengeMetal', game)
        expect(getResource('metal', result)).toEqual(1)
    })

    test('craftWire', () => {
        const result = pipe<Game, Game, Game>(
            setResource('metal', 2),
            mutateGame('craftWire')
        )(game)
        expect(getResource('metal', result)).toEqual(0)
        expect(getResource('wire', result)).toEqual(1)
    })

    test('makeFabricator', () => {
        const result = mutateGame('makeFabricator', game)
        expect(getFabricatorSize(result)).toEqual(1)
    })

    test('setCraftWireFabricator', () => {
        const result = pipe<Game, Game, Game>(
            mutateGame('makeFabricator'),
            mutateGame({ action: 'setFabricator', blueprint: 'craftWire', index: 0 })
        )(game)

        expect(getFabricatorDetails(0, result)).toEqual({
            blueprint: 'craftWire',
            status: 'waiting',
            startTime: null,
            endTime: null,
        })
    })
})
