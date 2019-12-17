const APP_ID = process.env.DGG_OATH_ID
const APP_SECRET = process.env.DGG_OATH_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI 

const { Buffer } = require("buffer")
const axios = require("axios")
const crypto = require("crypto")
const uuid = require("uuid/v4")

const hash = val =>
  crypto
    .createHash("sha256")
    .update(val)
    .digest("hex")
const encode = val => Buffer.from(val).toString("base64")

const secret = hash(APP_SECRET)

const CHALLENGES = {}
const USERS = {}

function getOauthRedirect() {
  const code_verifier = encode(uuid())
  const code_challenge = encode(hash(code_verifier + secret))
  const state = uuid()
  CHALLENGES[state] = code_verifier
  return `https://www.destiny.gg/oauth/authorize?response_type=code&client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&code_challenge=${code_challenge}`
}

function getCodeVerifier(state) {
	return CHALLENGES[state]
}

async function getUserInfo(token) {
	if(USERS[token]) {
		return USERS[token]
	}
	const {data} = await axios.get('https://www.destiny.gg/api/userinfo?token='+token)
	const {username} = data
	USERS[token] = username
	return username	
}

module.exports = {
	getOauthRedirect,
	getCodeVerifier,
	getUserInfo
}