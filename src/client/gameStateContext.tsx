import React, { createContext, useState, PropsWithChildren, useEffect, useContext } from "react";
import { getInitialState, syncGame } from "./store";
import { useInterval } from "./utilities/useInterval";
import { TimeSyncContext } from "./tick/TickContext";
import { Game, GameState } from "@game";
import cloneDeep from "lodash/cloneDeep";
import cookies from 'browser-cookies'

interface IGameStateContext {
	game: Game;
	currentState: GameState;
	setGame(game: Game): void;
	error: Error | null;
}

export const GameStateContext = createContext<IGameStateContext>({
	game: new Game(),
	currentState: new Game().state,
	setGame: () => { },
	error: null,
});

interface GameStateProviderProps extends PropsWithChildren<{}> { }
export const GameStateProvider = ({ children }: GameStateProviderProps) => {
	const [game, _setGame] = useState(new Game());
	const [version, setVersion] = useState(0);
	const [error, setError] = useState<Error | null>(null);
	const timeSync = useContext(TimeSyncContext);
	const [syncSocket] = useState(new WebSocket('ws://' + window.location.hostname + '/wss/sync'))
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
				window.location.replace("/api/auth");
			}
		});

		syncSocket.addEventListener('open', () => console.log('Connected to Sync Socket'))
		syncSocket.addEventListener('message', ({ data }) => {
			const { event, state, version } = JSON.parse(data)
			console.log('Received data from wss: ', { event, state, version })
			setVersion(version)
			setCurrentState(state)
		})
		syncSocket.addEventListener('error', (event) => {
			console.error('Error when syncing')
			console.error(event)
		})
		return () => syncSocket.close()
	}, []);

	useInterval(async () => {
		if (game.state.actions.length) {
			try {
				syncSocket.send(JSON.stringify({
					token: cookies.get('jwt'),
					actions: game.state.actions,
					version,
					sentAt: new Date(timeSync.now())
				}))
			} catch (err) {
				setError(err);
				console.error(err);
			}
		}
	}, 3 * 1000);

	const context: IGameStateContext = {
		game,
		currentState,
		setGame,
		error,
	};

	return <GameStateContext.Provider value={context}>{children}</GameStateContext.Provider>;
};
