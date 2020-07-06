import PlayerGameState from 'lib/db/entity/PlayerGameState';

export const getLeaderBoard  = async (req, res) => {
	try {
		const [totals, leaderboard] = await Promise.all([
			PlayerGameState.getTotals(),
			PlayerGameState.getLeaderboard(),
		]);
		res.send({ totals, leaderboard });
	} catch (err) {
		res.statusCode = 500;
		return;
	}
}

