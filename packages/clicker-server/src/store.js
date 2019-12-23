import _ from "lodash"
// import redis from "redis"
import { promisifyAll } from "bluebird"
import Postgres from "pg"

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
dbClient.connect().then(dbUp)

export const getLeaderboard = async () => {
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
}

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
  const result = await dbClient.query(
    `
		SELECT state, lastSynced
		FROM game_state
		WHERE name = $1
	`,
    [name]
  )
  if (result.rows.length) {
    return {
      state: result.rows[0].state,
      lastSynced: result.rows[0].lastsynced
    }
  }
  return {
    state: {},
    lastSynced: new Date(0)
  }
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
