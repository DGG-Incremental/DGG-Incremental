import * as Game from '../../../shared/game'
import * as PlayerProfile from '../data/playerProfile'
import * as R from 'ramda'


export const syncPlayerGameState = async (
	name: string,
	actions: Game.Action[],
	syncTime: Date,
	version: number = 0
) => {
	const { game, lastSynced } = await PlayerProfile.getPlayerProfile(name) 
	const queued = Game.enqueueActions(actions, game)
	const synced = Game.progressState(lastSynced, syncTime, queued)
	return synced
};
