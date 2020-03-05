import React, { useState, useEffect } from "react"
import axios from "axios"

import './Leaderboard.css'


const getLeaderBoard = async () => {
	const res = await axios.get("https://dgg-clicker.herokuapp.com" + "/leaderboard") //TODO remove the redirect
	return res.data
}

interface LeaderboardProps {
	updateRate: number
}

const Leaderboard = ({ updateRate }: LeaderboardProps) => {
	const [state, setState] = useState({
		leaderboard: [] as any[],
		totals: {} as any
	})

	const update = async () => {
		const result = await getLeaderBoard()
		setState(result)
	}

	useEffect(() => {
		update()
		setInterval(update, updateRate)
	}, [])

	return (
		<div className="leaderboard">
			{state.leaderboard.map((player, i) => (
				<div key={i} className="leaderboard__player">
					<div className="leaderboard__name">{player.name}</div>
					<div className="leaderboard__score">{parseInt(player.yees) + parseInt(player.pepes)}</div>
				</div>
			))}
		</div>
	)
}
export default Leaderboard