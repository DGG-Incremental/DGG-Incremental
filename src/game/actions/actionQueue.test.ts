import { dateGen } from '../__tests__/helpers'
import { pipe, compose, map, __, reduce, repeat, flip } from 'ramda'
import { createGame } from '../game'
import { getActionQueueSize, enqueueAction, peekAction, dequeueAction } from './actionQueue'
import { Action } from '../types'


describe("actionQueue", () => {
    let game = createGame()

    beforeEach(() => {
        game = createGame()
    })

    const [BEGIN, TIME_A, TIME_B, END] = dateGen()
    const ACTION_A: Action = { type: 'scavengeMetal', timestamp: TIME_A }
    const ACTION_B: Action = { type: 'scavengeMetal', timestamp: TIME_B }

    test('should start empty', () => {
        expect(getActionQueueSize(game)).toBe(0)
    })

    describe('enqueueAction', () => {
        test('should increase queue size by one', () => {
            const result = enqueueAction(ACTION_A, game)
            expect(getActionQueueSize(result)).toBe(1)
        })

        test('should increase queue size by number of items pushed', () => {
            let result = reduce((game) => enqueueAction(ACTION_A, game), game, repeat('_', 5))
            expect(getActionQueueSize(result)).toBe(5)
        })
    })

    describe('peekAction', () => {
        test('should return undefined when empty queue', () => {
            expect(peekAction(game)).toBe(undefined)
        })

        test('should return the action when only one action in queue', () => {
            const result = enqueueAction(ACTION_A, game)
            expect(peekAction(result)).toBe(ACTION_A)
        })

        test('should return the oldest action when more than one action', () => {
            const result = reduce(flip(enqueueAction), game, [ACTION_B, ACTION_A])
            expect(peekAction(result)).toBe(ACTION_A)
        })
    })
    describe('dequeueAction', () => {
        test('should return undefined when empty queue', () => {
            expect(dequeueAction(game)).toEqual([undefined, game])
        })

        test('should remove the action when only one in queue', () => {
            const updated = enqueueAction(ACTION_A, game)
            const result = dequeueAction(updated)
            expect(result).toEqual([ACTION_A, game])
            expect(getActionQueueSize(result[1])).toBe(0)
        })

        test('should return the oldest action when more than one action', () => {
            const updated = reduce(flip(enqueueAction), game, [ACTION_B, ACTION_A])
            const result = dequeueAction(updated)
            expect(result[0]).toBe(ACTION_A)
            expect(getActionQueueSize(result[1])).toBe(1)
            expect(peekAction(result[1])).toEqual(ACTION_B)
        })
    })
})