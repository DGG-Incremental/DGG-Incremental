import * as redis from 'redis-mock'
jest.mock('redis', () => redis)

import Redis from '../redis'
import * as Game from '../../../../shared/game'
import { getPlayerProfile, setPlayerProfile, PlayerProfile } from '../playerProfile'



describe('playerProfile', () => {
    const profile: PlayerProfile = {
        game: Game.createGame(),
        lastSynced: new Date(2)
    }

    const setupRedis = async () => {
        await Redis.flushall()
        await Promise.all([
            Redis.set('profile:citizenthayne', JSON.stringify(profile))
        ])
    }

    beforeEach(async () => await setupRedis())

    describe('getPlayerProfile', () => {
        test('should return starting profile when username does not exist', async () => {
            const result = await getPlayerProfile('newPlayer')
            expect(result).toEqual({
                game: Game.createGame(),
                lastSynced: new Date(0)
            })
        })

        test('should return stored game', async () => {
            const result = await getPlayerProfile('citizenthayne')
            expect(result).toEqual(profile)
        })
    })

    describe('setPlayerProfile', () => {
        test('should set value in redis with username key', async () => {
            const date = new Date(1)
            const game = Game.setResource('metal', 1, Game.createGame())
            await setPlayerProfile('roboticwater', date, game)
            const result = await Redis.get('profile:roboticwater')
            expect(result).toEqual(JSON.stringify({
                game, 
                lastSynced: date
            }))
        })
    })

})