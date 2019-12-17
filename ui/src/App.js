import React, { useState, useEffect } from "react"
import "./App.css"
import axios from "axios"
import throttle from "lodash/throttle"
import cookies from "browser-cookies"

const sendScore = throttle(async clicks => {
  const token = cookies.get("token")
  if (!token) {
    window.location = "/auth"
  }
  return axios.put(`/leaderboard/`, { clicks })
}, 5 * 1000)

const getLeaderBoard = async () => {
  const res = await axios.get("/leaderboard")
  return res.data
}

const Clicker = ({ name }) => {
  const [clicks, setClicks] = useState(0)
  useEffect(() => {
    ;(async () => {
      const leaderboard = await getLeaderBoard()
      const pos = leaderboard.find(l => l.name === name)
      if (pos) setClicks(pos.score)
    })()
  }, [name])
  const clickHandler = () => {
    const c = clicks + 1
    setClicks(c)
    sendScore(c)
  }
  return (
    <div style={{ marginBottom: "25px" }}>
      Clicks: {clicks}
      <button onClick={clickHandler}>Add more!</button>
    </div>
  )
}

const GetName = ({ onChange }) => {
  const username = cookies.get("username")
  if (username) {
    onChange(username)
  }
  return <a href="auth">Login</a>
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

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {scores.map(s => (
          <tr>
            <td>{s.name}</td>
            <td>{s.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
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
