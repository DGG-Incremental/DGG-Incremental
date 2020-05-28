import Axios from "axios";
import { GameState, Game, SerializedGameState } from "@game";
import merge from "lodash/merge";
import { GenericAction } from "../game/actions";
import { GenericTaskState } from "../game/tasks";

interface ISyncResponse {
  name: string;
  version: number;
  gameState: GameState;
}

interface IApiResponseData {
  name: string;
  version: number;
  gameState: SerializedGameState;
}
const localStorage = window.localStorage;

const getApiState = async (): Promise<ISyncResponse | undefined> => {
  try {
    const res = await Axios.get("/me/state");
    const state = res.data as IApiResponseData;
    const parsedActions = state.gameState.actions.map((a: GenericAction<string>) => ({
      ...a,
      timestamp: new Date(a.timestamp),
    }));
    const parsedTaskStates = state.gameState.tasks.map((a: GenericTaskState<string>) => ({
      ...a,
      startTime: new Date(a.startTime),
    }));

    return merge(state, { gameState: { actions: parsedActions, tasks: parsedTaskStates } });
  } catch (err) {
    if (err.response.status === 404) {
      return undefined;
    }
    throw err.response.data;
  }
};

const getLocalState = (): ISyncResponse => {
  const s = localStorage.getItem("gameData") as string | null;
  if (s) {
    return JSON.parse(s);
  } else {
    const game = new Game();
    return {
      gameState: game.state,
      name: "LocalUser",
      version: 1,
    };
  }
};

interface syncGameOptions {
  game: Game;
  version: number;
  sentAt: Date;
}

const localSync = (options: syncGameOptions) => {
  const now = new Date();
  const state = options.game.getStateAt(now);
  state.lastSynced = now;
  state.actions = [];

  const gameData: ISyncResponse = {
    gameState: state,
    name: "LocalUser",
    version: options.version,
  };
  localStorage.setItem("gameData", JSON.stringify(gameData));
  return {
    game: new Game(state),
    version: options.version,
  };
};

const apiSync = async ({ game, version, sentAt }: syncGameOptions) => {
  try {
    const res = await Axios.patch("/me/state", {
      actions: game.state.actions,
      sentAt,
      version,
    });
    const data = res.data as ISyncResponse;
    return {
      game: new Game(data.gameState),
      version: data.version,
    };
  } catch (err) {
    if (err.response.status === 404) {
      window.location.replace("/auth");
    }
    throw err.response.data;
  }
};

export const syncGame = (options: syncGameOptions) => {
  if (process.env.REACT_APP_STORAGE_TYPE === "local") {
    return localSync(options);
  } else {
    return apiSync(options);
  }
};

export const getInitialState = async () => {
  console.log(process.env.REACT_APP_STORAGE_TYPE);
  if (process.env.REACT_APP_STORAGE_TYPE === "local") {
    return await getLocalState();
  } else {
    return await getApiState();
  }
};
