import { createGame } from '../../game'
import { serializeGame } from '../serializeGame'

describe('serializeGame', () => {
    test('should ...', () => {
        const result = serializeGame(createGame())
        expect(typeof result).toBe('string')
    })
})