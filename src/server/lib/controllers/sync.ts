import PlayerGameState from 'lib/db/entity/PlayerGameState';
import { syncPlayerGameState } from 'lib/syncService';
import Joi from '@hapi/joi';
import { StateSyncSchema } from 'lib/validation';
import { getUserInfo } from 'lib/services/auth';

const getReqUser = async (req) => {
	if (process.env.NODE_ENV !== "development") {
		const token = req.cookies.token;
		return await getUserInfo(token);
	} else {
		return "TestUser";
	}
};

export const getState = async (req, res) => {
	const username = await getReqUser(req);
	if (!username) {
		res.statusCode = 404;
		res.send();
		return;
	}
	const gameState = await PlayerGameState.getOrCreate(username);
	res.send(gameState);
}

export const patchState = async (req, res) => {
	const username = await getReqUser(req);

	if (!username) {
        res.statusCode = 404;
		res.cookie("token", "", { maxAge: 0 });
		res.cookie("username", "", { maxAge: 0 });
		res.send({ message: "username not found", redirect: "/auth" });
		return;
	}

	try {
		const { actions, sentAt, version } = Joi.attempt(req.body, StateSyncSchema);
		const playerState = await syncPlayerGameState(username, actions, sentAt, version);
		res.send(playerState);
	} catch (err) {
		if (err instanceof Joi.ValidationError) {
			res.statusCode = 400;
			console.info(err);
			res.send(err.details);
		} else {
			res.statusCode = 500;
			console.error(err);
		}
		res.send();
	}
}