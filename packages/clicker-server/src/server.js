import express from 'express';
import cookieParser from 'cookie-parser';
import _ from 'lodash';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import axios from 'axios';
import { getOauthRedirect, getCodeVerifier, getUserInfo } from './auth';
import { dbUp, getLeaderBoard, getScore, setScore } from './store';
import Game from 'clicker-game'



const app = express()
const port = process.env.PORT || 3001
dbUp()

const APP_ID = process.env.DGG_OATH_ID
const REDIRECT_URI = process.env.REDIRECT_URI

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "../clicker-ui/build")))
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
  const leaderboard = await getLeaderBoard()
  res.send([
    ...leaderboard.filter(l => !_.keys(MEMES).includes(l.name)),
    ..._.map(MEMES, (score, name) => ({ name, score }))
  ])
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
  return await getUserInfo(token)
})

app.get("/me/state", async (req, res) => {
  const username = await getReqUser(req)
  if (!username) {
    res.statusCode = 404
    res.send()
    return
  }
  const initialScore = await getScore(username)
  res.send({ state: { initialScore } })
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
  const initialScore = await getScore(username)
  const game = new Game({
    initialScore,
    actions: req.body.actions
  })
  try {
    game.validate()
  } catch (err) {
    res.statusCode = 400
    res.send("Invalid state")
    return
  }
  const newScore = game.getCurrentState().score
  const lastSynced = new Date()
  await setScore(username, newScore, lastSynced)
  res.send({ state: { initialScore: newScore, lastSynced } })
  console.log('Sent game state to ' + username)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
