import React, { useState, useEffect, useRef } from "react"
import {useTransition, animated} from 'react-spring'
import "./App.css"
import axios from "axios"
import debounce from "lodash/debounce"
import cookies from "browser-cookies"
import Game from 'clicker-game'

function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
const getInitialState = async () => {
  try {
    const { data } = await axios.get("/me/state")
    return data.state
  } catch (err) {
    if (err.response.status === 404) {
      return undefined
    }
    throw err
  }
}

const getLeaderBoard = async () => {
  const res = await axios.get("/leaderboard")
  return res.data
}

const syncGame = async game => {
  try {
    const res = await axios.patch("/me/state", {
      actions: game.state.actions
    })
    return new Game(res.data.state)
  } catch (err) {
    if (err.response.status === 404) {
      window.location.replace("/auth")
    }
  }
}

const Clicker = ({ name }) => {
  const [game, setGame] = useState(new Game())

  useEffect(() => {
    getInitialState().then(state => {
      setGame(new Game(state))
    })
  }, [name])

  useInterval(async () => {
    if (game.state.actions.length) {
      const synced = await syncGame(game)
      setGame(game.fastForward(synced))
    }
  }, 3 * 1000)

  const clickHandler = async () => {
    game.click()
    setGame(new Game(game.state))
    // const synced = await syncGame(game)
    // const ff = game.fastForward(synced)
    // console.table([game.state, synced.state, ff.state])
    // setGame(ff)
  }

  const state = game.getCurrentState()
  return (
    <div style={{ margin: "25px", display: "flex" }}>
      COOMS: {state.score}
      <div
        style={{ display: "inline-block", marginLeft: "15px" }}
        className="emote COOMER"
        onClick={clickHandler}
      ></div>
    </div>
  )
}

const GetName = ({ onChange }) => {
  const username = cookies.get("username")
  if (username) {
    onChange(username)
  }
  return <a href="/auth">Login</a>
}

const Leaderboard = () => {
  const [scores, setScores] = useState([])

  const update = async () => {
    const result = await getLeaderBoard()
    setScores(result)
  }

  useEffect(() => {
    update()
    setInterval(update, 5 * 1000)
  }, [])

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Coom</th>
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
  const [showChat, setShowChat] = useState(true)
  const transitions = useTransition(showChat, null, {
    from: { width: '0px' },
    enter: { width: '300px' },
    leave: { width: '0px' },
    })
  return (
    <div className="App">
      <div className="clicker-main">
        {name ? <Clicker name={name} /> : <GetName onChange={setName} />}
        <Leaderboard />
        <button className="toggle-chat" onClick={() => setShowChat(s => !s)}>{showChat ? "Hide" : "Show"} Chat</button>
      </div>
      {transitions.map(({ item, key, props }) => item && <animated.div className="chat" key={key} style={props}>
        <iframe src="https://www.destiny.gg/embed/chat" frameborder="0" style={{height: '100%'}}></iframe>
      </animated.div>
      )}
    </div>
  )
}

export default App
