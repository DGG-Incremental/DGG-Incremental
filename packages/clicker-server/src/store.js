import _ from "lodash"
import redis from 'redis'
import {promisifyAll} from 'bluebird'

promisifyAll(redis);



const client = redis.createClient()

export const getLeaderBoard = async () => {
	const raw = await client.zrangeAsync('leaderboard', -2, -1, 'withscores')
	return _(raw)
		.chunk(2)
		.reverse()
		.map(([name, score]) => ({name, score}))
		.value()
}

export const getGameState = async name => {
	console.log('Got game state: ', await client.getAsync(`gamestate:${name}`))
  return JSON.parse(await client.getAsync(`gamestate:${name}`))
}

export const setGameState = async (name, state) => {
	console.log('Setting state: ', state)
	await Promise.all([
		client.setAsync(`gamestate:${name}`, JSON.stringify(state)),
		client.zaddAsync('leaderboard', state.initialScore, name)
	])
	return
}

