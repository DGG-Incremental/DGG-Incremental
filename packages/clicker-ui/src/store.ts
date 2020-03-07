import Axios from "axios"
import { GameState, Game } from "clicker-game/lib/game"

interface IApiResponseData {
  name: string
  version: number
  gameState: GameState
}
const localStorage = window.localStorage

const getApiState = async () => {
  try {
    const res = await Axios.get("/me/state")
    return res.data as IApiResponseData
  } catch (err) {
    if (err.response.status === 404) {
      return undefined
    }
    throw err.response.data
  }
}

const getLocalState = (): IApiResponseData => {
  const s = localStorage.getItem("gameData") as string | null
  if (s) {
    return JSON.parse(s)
  } else {
    const game = new Game()
    return {
      gameState: game.state,
      name: "LocalUser",
      version: 1
    }
  }
}

interface syncGameOptions {
  game: Game
  version: number
  sentAt: Date
}


const localSync = (options: syncGameOptions) => {
  const gameData: IApiResponseData = {
    gameState: options.game.state,
    name: 'LocalUser',
    version: options.version
  }
  localStorage.setItem('gameData', JSON.stringify(gameData))
  return {
    game: options.game,
    version: options.version
  }
}

const apiSync = async ({ game, version, sentAt }: syncGameOptions) => {
  try {
    const res = await Axios.patch("/me/state", {
      actions: game.state.actions,
      sentAt,
      version
    })
    const data = res.data as IApiResponseData
    return {
      game: new Game(data.gameState),
      version: data.version
    }
  } catch (err) {
    if (err.response.status === 404) {
      window.location.replace("/auth")
    }
    throw err.response.data
  }
}

export const syncGame = (options: syncGameOptions) => {
  if (process.env.REACT_APP_STORAGE_TYPE === "local") {
    return localSync(options)
  } else {
    return apiSync(options)
  }
}

export const getInitialState = async () => {
  console.log(process.env.REACT_APP_STORAGE_TYPE)
  if (process.env.REACT_APP_STORAGE_TYPE === "local") {
    return await getLocalState()
  } else {
    return await getApiState()
  }
}
