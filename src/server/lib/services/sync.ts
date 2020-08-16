import * as Game from '../../../shared/game'
import { getPlayerProfile } from '../playerProfile'


export const syncPlayerGameState = async (
	name: string,
	actions: Game.Action[],
	syncTime: Date,
	version: number
) => {
	const playerState = await PlayerGameState.getOrCreate(name);
	const lastSync =
		process.env.NODE_ENV !== "development" ? playerState.gameState.lastSynced : new Date(0);
	const game = new Game(playerState.gameState);
	game.state.actions = actions;
	game.validate();
	const newState = game.getStateAt(syncTime);
	playerState.gameState = newState;
	playerState.version = version + 1;

	return await playerState.save();
};
