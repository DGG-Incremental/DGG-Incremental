import { actionService, GameAction } from '../actionService'
import { Action, HasActionQueue } from '../../actions'
import { getResource } from '../../resource'

describe('actionService', () => {
    let game = jest.fn()

    beforeEach(() => game.mockRestore<>())

    const SCAVENGE_METAL: Action<GameAction> = {
        action: 'scavengeMetal',
        timestamp: new Date(0) 
    }

    describe('scavengeMetal', () => {
        test('it should add a metal', () => {
            const updated = actionService(game, SCAVENGE_METAL)
            expect(getResource(updated, 'metal')).toEqual(1)
        })
    })
})
