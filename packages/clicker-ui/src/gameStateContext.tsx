import React, {
  createContext,
  useState,
  PropsWithChildren,
  useEffect,
  useContext
} from "react"
import { getInitialState, syncGame } from "./store"
import { useInterval } from "./useInterval"
import { TimeSyncContext } from "./tick/TickContext"
import { Game } from "clicker-game/lib/game"
import cloneDeep from 'lodash/cloneDeep'

interface IGameStateContext {
  game: Game
  setGame(game: Game): void
  error: Error | null
}

export const GameStateContext = createContext<IGameStateContext>({
  game: new Game(),
  setGame: () => {},
  error: null
})

interface GameStateProviderProps extends PropsWithChildren<{}> {}
export const GameStateProvider = ({ children }: GameStateProviderProps) => {
  const [game, _setGame] = useState(new Game())
  const [version, setVersion] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const timeSync = useContext(TimeSyncContext)

  const setGame = (game: Game) => {
    _setGame(cloneDeep(game))
  }

  useEffect(() => {
    getInitialState().then(data => {
      if (data) {
        setGame(new Game(data.gameState))
        setVersion(data.version)
      } else {
        window.location.replace("/auth")
      }
    })
  }, [])

  useInterval(async () => {
    if (game.state.actions.length) {
      try {
        const synced = await syncGame({
          game,
          version,
          sentAt: new Date(timeSync.now())
        })
        setGame(game.fastForward(synced.game))
        setVersion(synced.version)
        setError(null)
      } catch (err) {
        setError(err)
        console.error(err)
      }
    }
  }, 3 * 1000)

  const context: IGameStateContext = {
    game,
    setGame,
    error
  }

  return (
    <GameStateContext.Provider value={context}>
      {children}
    </GameStateContext.Provider>
  )
}
