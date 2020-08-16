import Redis from './redis'
import * as Serial from '../../../shared/serial'

export const getPlayerProfile = async (username: string) => {
    const data = await Redis.get(`profile:${username}`)
    if(data) {
        return Serial.deserializeGame(data)!.game
    }
    return null
}
