import React, { createContext, useState, PropsWithChildren, useEffect, useContext } from "react";
import { getInitialState, syncGame } from "./store";
import { useInterval } from "./useInterval";
import { TimeSyncContext } from "./tick/TickContext";
import { Game, GameState } from "shared/game";
import cloneDeep from "lodash/cloneDeep";

interface IGameStateContext {
  game: Game;
  currentState: GameState;
  setGame(game: Game): void;
  error: Error | null;
}

export const GameStateContext = createContext<IGameStateContext>({
  game: new Game(),
  currentState: new Game().state,
  setGame: () => {},
  error: null,
});

interface GameStateProviderProps extends PropsWithChildren<{}> {}
export const GameStateProvider = ({ children }: GameStateProviderProps) => {
  const [game, _setGame] = useState(new Game());
  const [version, setVersion] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const timeSync = useContext(TimeSyncContext);

  // Calculated current state so each consumer doesn't trigger state calculations
  const [currentState, setCurrentState] = useState(game.getCurrentState());

  const setGame = (game: Game) => {
    const clone = cloneDeep(game);
    _setGame(clone);
    // Update the current state store
    setCurrentState(clone.getCurrentState());
  };

  useEffect(() => {
    getInitialState().then((data) => {
      if (data) {
        setGame(new Game(data.gameState));
        setVersion(data.version);
      } else {
        window.location.replace("/auth");
      }
    });
  }, []);

  useInterval(async () => {
    if (game.state.actions.length) {
      try {
        const synced = await syncGame({
          game,
          version,
          sentAt: new Date(timeSync.now()),
        });
        setGame(game.fastForward(synced.game));
        setVersion(synced.version);
        setError(null);
      } catch (err) {
        setError(err);
        console.error(err);
      }
    }
  }, 3 * 1000);

  useInterval(() => {
    setCurrentState(game.getCurrentState());
  }, 1000 / 10 /* 10 times a second */);

  const context: IGameStateContext = {
    game,
    currentState,
    setGame,
    error,
  };

  return <GameStateContext.Provider value={context}>{children}</GameStateContext.Provider>;
};
