import _ from "lodash"
import PlayerGameState from './db/entity/PlayerGameState'
// import redis from "redis"
// import { promisifyAll } from "bluebird"
import Postgres from "pg"
import { getConnection } from "typeorm"

// promisifyAll(redis)

const dbClient = new Postgres.Client({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: true
})

// const redisClient = redis.createClient()

export const dbUp = async () => {
  try {
    await dbClient.query(
      `
	  CREATE TABLE IF NOT EXISTS game_state (
		  name varchar(255) PRIMARY KEY,
		  state jsonb NOT NULL,
		  lastSynced timestamp NOT NULL
	  );
	  `
    )
  } catch (err) {
    console.error("Failed to bring DP up: ")
    console.error(err)
  }
}

// export const createPlayerGamestate = async name => {
//   const state = new PlayerGameState()
//   state.name = name
//   state.gameState = {pepes: 0, yees: 0}
//   state.lastSynced = new Date()
//   state.save({reload: true})
//   return state
// }

export const getLeaderboard = _.memoize(async () => {
  console.log('getting leaderboard')
  const results = await dbClient.query(`
	select
		name,
		state->>'yees' as yees,
		state->>'pepes' as pepes
	from
		game_state
	order by
		(cast(state->>'yees' as int) + cast(state->>'pepes' as int)) desc
	limit 50
	`)
  return results.rows
}, () => parseInt(Date.now() / (5 * 1000)))  // ttl: 5 seconds

export const getTotals = async () => {
  const result = await dbClient.query(`
	select
		sum(cast(state->>'pepes' as int)) as pepes,
		sum(cast(state->>'yees' as int)) as yees
	from
		game_state
	`)
  return result.rows[0]
}

export const getGameState = async name => {
  return await PlayerGameState.findOne(name)
}

export const setGameState = async (name, state, lastSynced) => {
  await dbClient.query(
    `
		INSERT INTO game_state (name, state, lastSynced)
		VALUES ($1, $2, $3)
		ON CONFLICT (name)
		DO
			UPDATE SET state = $2, lastSynced = $3
	`,
    [name, state, lastSynced]
  )
}
