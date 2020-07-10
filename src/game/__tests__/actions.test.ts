import * as Actions from '../actions'


describe("actions", () => {
    type ACTION_TYPE = 'INC_COUNTER' | 'DEC_COUNTER'
    let actionQueue = Actions.createActionQueue<ACTION_TYPE>()

    const ACTION: Actions.Action<ACTION_TYPE> = {
        action: 'INC_COUNTER',
        timestamp: new Date(0)
    }

    beforeEach(() => {
        actionQueue = Actions.createActionQueue<ACTION_TYPE>()
    })

    describe('actionQueue', () => {
        test('should have 0 items', () => {
            expect(Actions.getActionQueue(actionQueue)).toEqual([])
        })

        test('should have one pushed item', () => {
            const result = Actions.pushActionQueue(actionQueue, ACTION)
            expect(Actions.getActionQueue(result)).toEqual([ACTION])
        })
    })

    describe('reduceActions', () => {

        const TIME_A = new Date(1)
        const TIME_B = new Date(2)
        
        interface HasTestCounter {
            testCounter: number
            timeline: Date[]
        }

        type TestGame = HasTestCounter & Actions.HasActionQueue<ACTION_TYPE>

        const INC_ACTION: Actions.Action<ACTION_TYPE> = {
            action: 'INC_COUNTER',
            timestamp: TIME_A
        }

        const DEC_ACTION : Actions.Action<ACTION_TYPE> = {
            action: "DEC_COUNTER",
            timestamp: TIME_B
        }

        const createGame = () => {
            return {
                ...Actions.createActionQueue(),
                testCounter: 0,
                timeline: [] as Date[]
            } as TestGame
        }

        const actionService: Actions.AbstractActionService<ACTION_TYPE, TestGame> = (game, action) => {
            if (action.action === 'INC_COUNTER') {
                return {
                    ...game,
                    testCounter: game.testCounter + 1,
                    timeline: [...game.timeline, action.timestamp]
                } as TestGame
            }
            else if (action.action === 'DEC_COUNTER') {
                return {
                    ...game,
                    testCounter: game.testCounter - 1,
                    timeline: [...game.timeline, action.timestamp]
                } as TestGame
            }
            throw new TypeError('Unknown Action type')
        }

        let game = createGame()

        beforeEach(() => {
            game = createGame()
        })

        test('it should reduce an empty queue', () => {
            const result = Actions.reduceActions({game, actionService, targetTime: TIME_A })
            expect(result.testCounter).toEqual(0)
        })

        test('it should reduce a single item queue', () => {
            const updatedGame = Actions.pushActionQueue(game, INC_ACTION)
            const result = Actions.reduceActions({game: updatedGame, actionService, targetTime: TIME_A})
            expect(result.testCounter).toEqual(1)
        })

        test('it should reduce a multi item queue', () => {
            const first = Actions.pushActionQueue(game, INC_ACTION)
            const second = Actions.pushActionQueue(first, INC_ACTION)
            const result = Actions.reduceActions({game: second, actionService, targetTime: TIME_B})
            
            expect(result.testCounter).toEqual(2)
        })

        test('it should handle multiple action type queue', () => {
            const first = Actions.pushActionQueue(game, INC_ACTION)
            const second = Actions.pushActionQueue(first, DEC_ACTION)
            const result = Actions.reduceActions({game: second, actionService, targetTime: TIME_B})
            
            expect(result.testCounter).toEqual(0)
        })

        test('it should reduce actions in date range', () => {
            const updatedGame = Actions.pushActionQueue(game, INC_ACTION)
            const result = Actions.reduceActions({game: updatedGame, actionService, targetTime: TIME_B})

            expect(result.testCounter).toEqual(1)
        })

        test('it should not reduce actions out of date range', () => {
            const updatedGame = Actions.pushActionQueue(game, DEC_ACTION)
            const result = Actions.reduceActions({game: updatedGame, actionService, targetTime: TIME_A})

            expect(result.testCounter).toEqual(0)
        })

        test('it should reduce actions in chronological order', () => {
            const first = Actions.pushActionQueue(game, DEC_ACTION)
            const second = Actions.pushActionQueue(first, INC_ACTION)
            const result = Actions.reduceActions({game: second, actionService, targetTime: TIME_B})
            
            expect(result.timeline).toEqual([INC_ACTION.timestamp, DEC_ACTION.timestamp])
        })

    })
})