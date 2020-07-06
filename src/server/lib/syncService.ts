import { Game, locations, Action, ActionType } from "@game";
import PlayerGameState from "./db/entity/PlayerGameState";
import Joi from "@hapi/joi";
import { SyncSchema } from './validation';

const ActionSchema = Joi.object().keys({
	action: Joi.string().valid(...Object.values(ActionType)),
	timestamp: Joi.date()
		.when("#lastSync", { is: Joi.exist(), then: Joi.date().greater(Joi.ref("#lastSync")) })
		.when("#sentAt", { is: Joi.exist(), then: Joi.date().less(Joi.ref("#sentAt")) }),
});

const GoToLocationSchema = ActionSchema.keys({
	location: Joi.object().valid(...Object.values(locations)),
});

export const syncPlayerGameState = async (
	name: string,
	actions: Action[],
	syncTime: Date,
	version: number
) => {
	const playerState = await PlayerGameState.getOrCreate(name);
	const lastSync =
		process.env.NODE_ENV !== "development" ? playerState.gameState.lastSynced : new Date(0);
	Joi.assert(
		{
			actions,
			version,
		},
		SyncSchema,
		{
			context: {
				lastSync,
				sentAt: syncTime,
				version: playerState.version,
			},
		}
	);
	const game = new Game(playerState.gameState);
	game.state.actions = actions;
	game.validate();
	const newState = game.getStateAt(syncTime);
	playerState.gameState = newState;
	playerState.version = version + 1;

	return await playerState.save();
};
