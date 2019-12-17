if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}
const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const cookieParser = require("cookie-parser")
const _ = require("lodash")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const axios = require("axios")
const { getOauthRedirect, getCodeVerifier, getUserInfo } = require("./src/auth")
const { getLeaderBoard, dbUp, setLeaderBoard } = require("./src/store")

dbUp()

const APP_ID = process.env.DGG_OATH_ID
const REDIRECT_URI = process.env.REDIRECT_URI

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../ui/build")))
// app.use('/app', proxy('localhost:3001/'));

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
	MrMouton: -74.02,
	Destiny: '2/7',
}
app.get("/leaderboard", async (req, res) => {
	const leaderboard = await getLeaderBoard()
	res.send(
		[
			..._.map(MEMES, (score, name) => ({name, score})),
			...leaderboard.filter(l => !_.keys(MEMES).includes(l.name)), 
		]
	)	
})

// app.get("/leaderboard/:name", (req, res) => {
//   res.send({ clicks: LEADERBOARD[req.params.name] })
// })

app.put("/leaderboard/", async (req, res) => {
  const token = req.cookies.token
  if (!token) {
    res.statusCode = 404
    res.send()
  }
  const username = await getUserInfo(token)
  let score
  try {
    score = parseInt(req.body.clicks)
  } catch (err) {
    res.statusCode = 420
    res.send("Get fucked")
    return
  }
  await setLeaderBoard(username, score)
  res.send()
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
