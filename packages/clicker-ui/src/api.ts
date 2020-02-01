import Axios from "axios"
import { GameState, Game } from "clicker-game/lib/game"

interface IApiResponseData {
  name: string
  version: number
  gameState: GameState
}

export const getInitialState = async () => {
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

interface syncGameOptions {
  game: Game
  version: number
  sentAt: Date
}
export const syncGame = async ({ game, version, sentAt }: syncGameOptions) => {
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
