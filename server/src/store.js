const { Client } = require("pg")
const _ = require("lodash")

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: true
})

client.connect()

const dbUp = async () => {
  return new Promise((res, rej) => {
    client.query(
      `
	CREATE TABLE IF NOT EXISTS leaderboard (
		name varchar(255) PRIMARY KEY,
		score integer
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

const getLeaderBoard = async () => {
  return new Promise((res, rej) => {
    client.query(
      `SELECT name, score FROM leaderboard ORDER BY score DESC`,
      (err, results) => {
		if (err) return rej(err)
		console.log(results.rows)
        res(results.rows)
      }
    )
  })
}

const setLeaderBoard = async (name, score) => {
  await client.query(
    `
			INSERT INTO leaderboard (name, score)
			VALUES ($1, $2)
			ON CONFLICT (name)
			DO
				UPDATE SET score = $2;
		`,
    [name, score]
  )
}

// const getOauthChallenge = async state => {}

// const setOauthChallenge = async (state, challenge) => {}

// const getUserInfo = async token => {}
module.exports = {
  dbUp,
  getLeaderBoard,
  setLeaderBoard
}
