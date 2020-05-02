import Joi from '@hapi/joi'
import axios from "axios"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import path from "path"
import "reflect-metadata"
import timesyncServer from 'timesync/server'
import { createConnection } from 'typeorm'
import { getCodeVerifier, getOauthRedirect, getUserInfo } from "./auth"
import PlayerGameState from './db/entity/PlayerGameState'
import { syncPlayerGameState } from "./syncService"

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
  try {
    const [totals, leaderboard] = await Promise.all([
      PlayerGameState.getTotals(),
      PlayerGameState.getLeaderboard()
    ])
    res.send({ totals, leaderboard })
  } catch (err) {
    res.statusCode = 500
    return
  }
})

const getReqUser = async req => {
  if (process.env.NODE_ENV !== 'development') {
    const token = req.cookies.token
    return await getUserInfo(token)
  }
  else {
    return 'TestUser'
  }
}

app.put("/leaderboard/", async (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return null
  }
  return await getUserInfo(token)
})

app.get("/me/state", async (req, res) => {
  const username = await getReqUser(req)
  if (!username) {
    res.statusCode = 404
    res.send()
    return
  }
  const gameState = await PlayerGameState.getOrCreate(username)
  res.send(gameState)
})


const statePatchBodySchema = Joi.object({
  actions: Joi.array().items(Joi.object({
    timestamp: Joi.date(),
    action: Joi.string()
  }))
    .required(),
  sentAt: Joi.date().required(),
  version: Joi.number().integer().required()
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
    const { actions, sentAt, version } = Joi.attempt(req.body, statePatchBodySchema)
    const playerState = await syncPlayerGameState(username, actions, sentAt, version)
    res.send(playerState)

  } catch (err) {
    if (err instanceof Joi.ValidationError) {
      res.statusCode = 400
      console.info(err)
      res.send(err.details)
    } else {
      res.statusCode = 500
      console.error(err)
    }
    res.send()
  }

})

createConnection()
app.use('/timesync', timesyncServer.requestHandler)

export default app
  .listen(port, () => console.log(`Example app listening on port ${port}!`))
