import express from "express"
import cookieParser from "cookie-parser"
import _ from "lodash"
import bodyParser from "body-parser"
import cors from "cors"
import path from "path"
import axios from "axios"
import { getOauthRedirect, getCodeVerifier, getUserInfo } from "./auth"
import { getLeaderboard, getGameState, setGameState, getTotals } from "./store"
import Game from "clicker-game"

const app = express()
const port = process.env.PORT || 3001

const APP_ID = process.env.DGG_OATH_ID
const REDIRECT_URI = process.env.REDIRECT_URI

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, process.env.STATIC_ASSET_DIR)))
}

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/auth", (req, res) => {
  res.redirect(getOauthRedirect())
})

app.get("/oauth", async (req, res) => {
  const { code, state } = req.query
  const code_verifier = getCodeVerifier(state)
  try {
    const { data } = await axios.get("https://www.destiny.gg/oauth/token", {
      params: {
        grant_type: "authorization_code",
        code,
        client_id: APP_ID,
        redirect_uri: REDIRECT_URI,
        code_verifier
      }
    })
    const username = await getUserInfo(data.access_token)
    res.cookie("username", username)
    res.cookie("token", data.access_token)
    res.redirect("/")
  } catch (err) {
    res.statusCode = 500
    res.send()
  }
})

const MEMES = {
  MrMouton: -74.02
}

app.get("/leaderboard", async (req, res) => {
  const [totals, leaderboard] = await Promise.all([
    getTotals(),
    getLeaderboard()
  ])
  res.send({ totals, leaderboard })
})

const getReqUser = async req => {
  const token = req.cookies.token
  return await getUserInfo(token)
}

app.put("/leaderboard/", async (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return null
  }
  try {
    return await getUserInfo(token)
  }
  catch (err) {
    res.statusCode = 500
    res.send()
  }
})

app.get("/me/state", async (req, res) => {
  const username = await getReqUser(req)
  if (!username) {
    res.statusCode = 404
    res.send()
    return
  }
  const { state, lastSynced } = await getGameState(username)
  res.send({ state: { ...state, lastSynced } })
})

app.patch("/me/state", async (req, res) => {
  const username = await getReqUser(req)
  if (!username) {
    res.statusCode = 404
    res.cookie("token", "", { maxAge: 0 })
    res.cookie("username", "", { maxAge: 0 })
    res.send({ message: "username not found", redirect: "/auth" })
    return
  }

  try {
    const { actions, sentAt } = Joi.attempt(req.body, syncActionsRequestSchema)
    await queueActions(username, actions, sentAt)
    res.statusCode = 202 // Accepted
    res.send()
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      res.statusCode = 400
      res.send({ errors: error })
    } else {
      res.statusCode = 500
      console.error(error)
      res.send()
    }
  }
})


const syncGameState = async (name, newActions, timestamp) => {
  const { state, lastSynced } = await getGameState(name)
  const { actions, syncTime } = Joi.attempt({ lastSynced, actions: newActions, syncTime: timestamp }, gameSyncValidationSchema)
  console.log(newActions)
  const game = new Game({
    ...state,
    actions
  })

  game.validate()

  const newState = game.getStateAt(syncTime)
  console.log(newState)
  await setGameState(name, newState, syncTime)
  return newState
}


const SYNCS = {}

const batchAndSyncGameState = async (name, actions, syncTime) => {
  let currentSync = SYNCS[name]

  if (!currentSync) {
    const queue = actions
    currentSync = {
      queue,
      timestamp: syncTime,
    }
    currentSync.promise = new Promise((res, rej) => {
      setTimeout(async () => {
        try {
          const currentSync = SYNCS[name]
          delete SYNCS[name]
          const state = await syncGameState(name, currentSync.queue, currentSync.timestamp)
          res({ newState: state, lastSynced: currentSync.timestamp })
        } catch (err) {
          rej(err)
        }
      }, 0)
    })
    SYNCS[name] = currentSync
    return currentSync.promise
  }
  else {
    currentSync.timestamp = _.max([currentSync.timestamp, syncTime])
    actions.forEach(a => currentSync.queue.push(a))
    return currentSync.promise
  }


}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))