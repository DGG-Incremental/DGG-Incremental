import Redis from './redis'
import * as Game from '../../../shared/game'
import * as Serial from '../../../shared/serial'
import * as Joi from 'joi'


export interface PlayerProfile {
    game: Game.Game
    lastSynced: Date
}

const PlayerProfileSchema = Joi.object({
    game: Serial.GameSchema,
    lastSynced: Joi.date()
})


export const getPlayerProfile = async (username: string): Promise<PlayerProfile> => {
    const data = await Redis.get(`profile:${username}`)
    console.log({data})
    if(!data) {
        return {
            game: Game.createGame(),
            lastSynced: new Date(0)
        }
    }

    return Joi.attempt(JSON.parse(data), PlayerProfileSchema) as PlayerProfile
}


export const setPlayerProfile = async (username: string, syncTime: Date, game: Game.Game) => {
    const data = JSON.stringify({
        game,
        lastSynced: syncTime
    })
    await Redis.set(`profile:${username}`, data)   
}