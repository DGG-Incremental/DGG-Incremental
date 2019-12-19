import { Client } from "pg"
import _ from "lodash"

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: true
})

try {
  client.connect()
} catch (err) {
  console.error("Error starting db client: ")
  console.error(err)
}

export const dbUp = async () => {
  return new Promise((res, rej) => {
    client.query(
      `
	CREATE TABLE IF NOT EXISTS leaderboard (
		name varchar(255) PRIMARY KEY,
		score integer,
		lastSynced timestamp
	);
	`,
      (err, val) => {
        if (err) {
          return rej(err)
        }
        res(val)
      }
    )
  })
}

export const getLeaderBoard = async () => {
  return new Promise((res, rej) => {
    client.query(
      `SELECT name, score FROM leaderboard ORDER BY score DESC, name ASC LIMIT 50`,
      (err, results) => {
        if (err) return rej(err)
        res(results.rows)
      }
    )
  })
}

export const getScore = async name => {
  const result = await client.query(
    `
		SELECT score from leaderboard
		where name = $1
	`,
    [name]
  )

  if (result.rows.length) {
    return result.rows[0].score
  } else {
    return 0
  }
}

export const setScore = async (name, score, lastSynced) => {
  await client.query(
    `
			INSERT INTO leaderboard (name, score, lastSynced)
			VALUES ($1, $2, $3)
			ON CONFLICT (name)
			DO
				UPDATE SET score = $2, lastSynced = $3;
		`,
    [name, score, lastSynced]
  )
}

// const getOauthChallenge = async state => {}

// const setOauthChallenge = async (state, challenge) => {}

// const getUserInfo = async token => {}

// export default {
//   dbUp,
//   getScore,
//   setScore,
//   getLeaderBoard,
//   setLeaderBoard: setScore
// }
