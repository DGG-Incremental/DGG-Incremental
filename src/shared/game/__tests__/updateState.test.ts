import progressState from '../updateState'
import { createGame } from '../game'
import { dateGen } from './helpers'
import { Action, Game } from '../types'
import { enqueueAction, peekAction } from '../actions/actionQueue'
import { pipe, tap } from 'ramda'
import * as Resources from '../resource'
import * as Fabricators from '../fabricators'

describe('updateState', () => {
    let game = createGame()
    const [a, b, c, d] = dateGen(10*1000)
    const SCAVENGE_METAL: Action = {
        timestamp: c,
        type: 'scavengeMetal'
    }

    beforeEach(() => game = createGame())
    test('it should return the same state when passed two of the same timestamps', () => {
        const result = progressState(a, a, game)
        expect(result).toEqual(game)
    })

    test('it should mutate game with action when it is in time-bound', () => {
        const result = pipe<Game, Game, Game>(
            enqueueAction(SCAVENGE_METAL),
            progressState(a, c)
        )(game)
        expect(Resources.getResource('metal', result)).toEqual(1)
        expect(peekAction(result)).toEqual(undefined)
    })

    test('it should not mutate game with action when it is in not time-bound', () => {
        const result = pipe<Game, Game, Game>(
            enqueueAction(SCAVENGE_METAL),
            progressState(a, b)
        )(game)
        expect(Resources.getResource('metal', result)).toEqual(0)
        expect(peekAction(result)).toEqual(SCAVENGE_METAL)
    })

    test('it should mutate game with all actions when they are in time-bound', () => {
        const result = pipe<Game, Game, Game>(
            enqueueAction(SCAVENGE_METAL),
            progressState(a, c)
        )(game)
        expect(Resources.getResource('metal', result)).toEqual(1)
        expect(peekAction(result)).toEqual(undefined)
    })
    test('it should apply fabricators', () => {
        const result = pipe<Game, Game, Game, Game, Game>(
            Resources.setResource('metal', 2),
            Fabricators.addFabricator,
            Fabricators.setFabricator(0, 'craftWire'),
            progressState(a, d)
        )(game)
        expect(Resources.getResource('metal', result)).toEqual(0)
        expect(Resources.getResource('wire', result)).toEqual(1)
        expect(peekAction(result)).toEqual(undefined)
    })
})