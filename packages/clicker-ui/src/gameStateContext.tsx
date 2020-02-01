import React, {
  createContext,
  useState,
  PropsWithChildren,
  useEffect,
  useContext
} from "react"
import { getInitialState, syncGame } from "./api"
import Game from "clicker-game"
import { useInterval } from "./useInterval"
import { TimeSyncContext } from "./tick/TickContext"

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
  const [game, setGame] = useState(new Game())
  const [version, setVersion] = useState(0)
  const [error, setError] = useState<Error | null>(null)
  const timeSync = useContext(TimeSyncContext)

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
