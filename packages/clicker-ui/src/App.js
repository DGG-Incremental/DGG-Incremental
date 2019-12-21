import React, { useState, useEffect, useRef } from "react"
import { useTransition, animated } from "react-spring"
import "./App.css"
import maxBy from "lodash/maxBy"
import axios from "axios"
import debounce from "lodash/debounce"
import cookies from "browser-cookies"
import Game from "clicker-game"

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
    throw err.response.data
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
    throw err.response.data
  }
}

const Clicker = ({ name }) => {
  const [game, setGame] = useState(new Game())
  const [errors, setErrors] = useState([])

  useEffect(() => {
    getInitialState().then(state => {
      setGame(new Game(state))
    })
  }, [name])

  useInterval(async () => {
    if (game.state.actions.length) {
      try {
        const synced = await syncGame(game)
        setGame(game.fastForward(synced))
      } catch (err) {
        setErrors([err])
      }
    }
  }, 3 * 1000)

  const pepeClickHandler = async () => {
    game.clickPepe()
    setGame(new Game(game.state))
  }

  const yeeClickHandler = async () => {
    game.clickYee()
    setGame(new Game(game.state))
  }

  const now = maxBy([new Date(), game.state.lastSynced], d => d.getTime()) // Avoids some de-sync issues
  const state = game.getCurrentState(now)
  return (
    <div>
      <div
        style={{
          margin: "25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div style={{ display: "inline-block", margin: "15px" }}>
          <div className="emote YEE" onClick={yeeClickHandler}></div>
          <div>{state.yees}</div>
        </div>
        <div>VS</div>
        <div style={{ display: "inline-block", margin: "15px" }}>
          <div className="emote PEPE" onClick={pepeClickHandler}></div>
          <div>{state.pepes}</div>
        </div>
      </div>
      <div className="errors">
        {errors.map(e => (
          <p>{e}</p>
        ))}
      </div>
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
  const [state, setState] = useState({
    leaderboard: [],
    totals: {}
  })

  const update = async () => {
    const result = await getLeaderBoard()
    setState(result)
  }

  useEffect(() => {
    update()
    setInterval(update, 5 * 1000)
  }, [])

  return (
    <table className="leaderboard" style={{ borderSpacing: "15px 10px" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>
            <div class="emote YEE" style={{ margin: "auto" }}></div>
          </th>
          <th>
            <div class="emote PEPE" style={{ margin: "auto" }}></div>
          </th>
        </tr>
        <tr>
          <th>Total</th>
          <th>{state.totals.yees}</th>
          <th>{state.totals.pepes}</th>
          <th></th>
          <th>
            {parseInt(state.totals.pepes) === parseInt(state.totals.yees)
              ? ""
              : parseInt(state.totals.pepes) > parseInt(state.totals.yees)
              ? "Pepe"
              : "Yee"}
          </th>
        </tr>
      </thead>
      <tbody>
        {state.leaderboard.map(s => (
          <tr>
            <td>{s.name}</td>
            <td>{s.yees} </td>
            <td>{s.pepes} </td>
            <td>
              {s.name === "cake" ? <div className="emote SOY"></div> : null}
            </td>
            <td>
              {parseInt(s.yees) === parseInt(s.pepes) ? (
                <div class="emote Shrugstiny" style={{ margin: "auto" }}></div>
              ) : parseInt(s.yees) > parseInt(s.pepes) ? (
                <div class="emote YEE" style={{ margin: "auto" }}></div>
              ) : (
                <div class="emote PEPE" style={{ margin: "auto" }}></div>
              )}
            </td>
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
    from: { right: "-300px" },
    enter: { right: "0px" },
    leave: { right: "-300px" }
  })
  return (
    <div className="App">
      <div className="topbar">
        <button className="toggle-chat" onClick={() => setShowChat(s => !s)}>
          {showChat ? "Hide" : "Show"} Chat
        </button>
      </div>

      <div className="clicker-main">
        <Leaderboard />
        <div className="center">
          {name ? <Clicker name={name} /> : <GetName onChange={setName} />}
        </div>
      </div>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div className="chat" key={key} style={props}>
              <iframe
                src="https://www.destiny.gg/embed/chat"
                frameborder="0"
                style={{ height: "100%" }}
              ></iframe>
            </animated.div>
          )
      )}
    </div>
  )
}

export default App
