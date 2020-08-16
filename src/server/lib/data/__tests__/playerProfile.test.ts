import * as redis from 'redis-mock'
jest.mock('redis', () => redis)

import Redis from '../redis'
import * as Game from '../../../../shared/game'
import { getPlayerProfile } from '../playerProfile'



describe('playerProfile', () => {
    const game = Game.createGame()

    const setupRedis = async () => {
        await Redis.flushall()
        await Promise.all([
            Redis.set('profile:citizenthayne', JSON.stringify(game))
        ])
    }

    beforeEach(async () => await setupRedis())
    describe('getPlayerProfile', () => {
        test('should return null when username does not exist', async () => {
            const result = await getPlayerProfile('doesNotExist')
            expect(result).toBe(null)
        })

        test('should return stored game', async () => {
            const result = await getPlayerProfile('citizenthayne')
            expect(result).toEqual(game)
        })
    })

})