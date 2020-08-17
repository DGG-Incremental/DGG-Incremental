import * as redis from 'redis-mock'

jest.mock('redis', () => redis)
const playerProfile = jest.genMockFromModule('../playerProfile') as any

module.exports = playerProfile