import * as Game from '../../../../shared/game'
import * as Sync from '../sync'
import * as PlayerProfile from '../../data/playerProfile'

jest.mock('../../data/playerProfile')

describe('syncService', () => {
    const game = Game.createGame()
    const actionTime = new Date(0)
    const syncTime = new Date(1)

    describe('syncPlayerGameState', () => {
        test('should return empty game when syncing no actions to new profile', async () => {
            const result = await Sync.syncPlayerGameState('newProfile', [], actionTime)
            expect(result).toEqual(game)
        })

        test('should return updated game when syncing single action to new profile', async () => {
            const result = await Sync.syncPlayerGameState('newProfile', [{ timestamp: actionTime, type: 'scavengeMetal' }], syncTime)
            expect(Game.getResource('metal', result)).toEqual(1)
        })

    })
})