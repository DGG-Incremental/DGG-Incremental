import * as R from 'ramda'
import * as Joi from 'joi'
import * as Game from '../../game'
import { serializeGame } from '../serializeGame'
import { deserializeGame } from '../deserializeGame'


describe('deserializeGame', () => {
    let game = Game.createGame()
    beforeEach(() => game = Game.createGame())

    const testValidString = (testName: string, str: string, expected: Object, strict: boolean = false) => {
        test(testName, () => {
            const { game, success, error } = deserializeGame(str)

            expect(error).toEqual(null)
            expect(success).toEqual(true)
            strict ?
                expect(game).toEqual(expected) :
                expect(game).toMatchObject(expected)
        })
    }

    const testInvalidString = (str: string) => {
        test(`should return error with bad string: \`${str}\``, () => {
            const { success, error } = deserializeGame(str)
            expect(success).toEqual(false)
            expect(error).not.toEqual(null)
        })
    }

    const badStrings = [
        '',
        'a',
        '{}',
    ]
    R.forEach(testInvalidString, badStrings)

    testValidString('should serialize empty game', JSON.stringify(game), {
        actionQueue: [],
        fabricators: [],
        resources: {
            metal: 0,
            wire: 0
        }
    }, true)

    testValidString('should serialize actions',
        R.pipe(
            Game.enqueueAction({ timestamp: new Date(0), type: 'craftWire' }),
            JSON.stringify
        )(game),
        { actionQueue: [{ type: 'craftWire', timestamp: new Date(0) }] }
    )

    testValidString('should serialize fabricators',
        R.pipe(
            Game.addFabricator,
            Game.setFabricator(0, 'test'),
            Game.startFabricator(0, new Date(0), new Date(1)),
            JSON.stringify
        )(game),
        { fabricators: [{ blueprint: 'test', startTime: new Date(0), endTime: new Date(1) }] }
    )

})