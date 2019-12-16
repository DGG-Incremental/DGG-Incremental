import React, { useState, useEffect } from "react"
import "./App.css"
import axios from "axios"
import throttle from "lodash/throttle"

const setScore = throttle(async (name, clicks) => {
  return axios.put(`/leaderboard/${name}`, { clicks })
}, 5 * 1000)

const getLeaderBoard = async () => {
	const res = await axios.get('/leaderboard')
	return res.data
}

const Clicker = ({ name }) => {
  const [clicks, setClicks] = useState(0)

  const clickHandler = () => {
    const c = clicks + 1
    setClicks(c)
    setScore(name, c)
  }
  return (
    <div style={{marginBottom: '25px'}}>
      Clicks: {clicks}
      <button onClick={clickHandler}>Add more!</button>
    </div>
  )
}

const GetName = ({ onChange }) => {
  const [name, setName] = useState("")
  return (
    <form onSubmit={() => onChange(name)}>
      <label>Enter Name: </label>
      <input value={name} onChange={e => setName(e.target.value)}></input>
      <input type="submit" value="Submit" />
    </form>
  )
}

const Leaderboard = () => {
	const [scores, setScores] = useState([])
	const update = async () => {
			const result = await getLeaderBoard()	
			setScores(result)	
	}
	useEffect(() => {
		update()
		setInterval(update, 1 * 1000)
	}, [])

	return <table>
		<th>
			<td>Name</td>
			<td>Score</td>
		</th>
		{scores.map(s => <tr>
			<td>{s[0]}</td>
			<td>{s[1]}</td>
		</tr>)}
	</table>
}

function App() {
  const [name, setName] = useState(null)
  return (
    <div className="App">
      {name ? <Clicker name={name} /> : <GetName onChange={setName} />}
      <Leaderboard />
    </div>
  )
}

export default App
