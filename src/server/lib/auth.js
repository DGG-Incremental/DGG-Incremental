import { Buffer } from "buffer"
import axios from "axios"
import crypto from "crypto"
import uuid from "uuid/v4"

const APP_ID = process.env.DGG_OATH_ID
const APP_SECRET = process.env.DGG_OATH_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI


const hash = val =>
  crypto
    .createHash("sha256")
    .update(val)
    .digest("hex")
const encode = val => Buffer.from(val).toString("base64")

const CHALLENGES = {}

export const getOauthRedirect = () => {
  const code_verifier = encode(uuid())
  const code_challenge = encode(hash(code_verifier + hash(APP_SECRET)))
  const state = uuid()
  CHALLENGES[state] = code_verifier
  return `https://www.destiny.gg/oauth/authorize?response_type=code&client_id=${APP_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=${state}&code_challenge=${code_challenge}`
}

export const getCodeVerifier = state => {
  return CHALLENGES[state]
}

const USER_INFO = {}

export const getUserInfo = async token => {
  if (USER_INFO[token]) {
    return USER_INFO[token]
  }
  const { data } = await axios.get(
    "https://www.destiny.gg/api/userinfo?token=" + token
  )
  const { username } = data
  USER_INFO[token] = username
  return username
}
