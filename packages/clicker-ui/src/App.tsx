import axios from "axios"
import cookies from "browser-cookies"
import Game, { GameState } from "clicker-game"
import maxBy from "lodash/maxBy"
import React, { useContext, useEffect, useState } from "react"
import { animated, useTransition } from "react-spring"
import "./App.css"
import { TickContext, TickProvider, TimeSyncContext } from "./tick/TickContext"
import { useInterval } from "./useInterval"
import { GameStateProvider, GameStateContext } from "./gameStateContext"

const getLeaderBoard = async () => {
  const res = await axios.get("/leaderboard")
  return res.data
}

interface ClickerProps {
  name: string
}

const Clicker = ({ name }: ClickerProps) => {
  const { game, setGame, error } = useContext(GameStateContext)
  const timeSync = useContext(TimeSyncContext)
  const pepeClickHandler = async () => {
    game.clickPepe(new Date(timeSync.now()))
    setGame(new Game(game.state))
  }

  const yeeClickHandler = async () => {
    game.clickYee(new Date(timeSync.now()))
    setGame(new Game(game.state))
  }

  const now = maxBy([new Date(timeSync.now()), game.state.lastSynced], d =>
    d.getTime()
  ) as Date // Avoids some de-sync issues
  const state = game.getStateAt(now)
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
        <p>{error ? error.toString(): null}</p>
      </div>
    </div>
  )
}

interface GetNameProps {
  onChange: (s: string) => void
}
const GetName = ({ onChange }: GetNameProps) => {
  const username = cookies.get("username")
  if (username) {
    onChange(username)
  }
  return <a href="/auth">Login</a>
}

const Leaderboard = () => {
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
    setInterval(update, 5 * 1000)
  }, [])

  return (
    <table className="leaderboard" style={{ borderSpacing: "15px 10px" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>
            <div className="emote YEE" style={{ margin: "auto" }}></div>
          </th>
          <th>
            <div className="emote PEPE" style={{ margin: "auto" }}></div>
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
          <tr key={s.name}>
            <td>{s.name}</td>
            <td>{s.yees} </td>
            <td>{s.pepes} </td>
            <td>
              {s.name === "Cake" ? <div className="emote SOY"></div> : null}
            </td>
            <td>
              {parseInt(s.yees) === parseInt(s.pepes) ? (
                <div
                  className="emote Shrugstiny"
                  style={{ margin: "auto" }}
                ></div>
              ) : parseInt(s.yees) > parseInt(s.pepes) ? (
                <div className="emote YEE" style={{ margin: "auto" }}></div>
              ) : (
                <div className="emote PEPE" style={{ margin: "auto" }}></div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function App() {
  const [name, setName] = useState<string | null>(null)
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
          <TickProvider>
            {name ? <Clicker name={name} /> : <GetName onChange={setName} />}
          </TickProvider>
        </div>
      </div>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div className="chat" key={key} style={props}>
              <iframe
                src="https://www.destiny.gg/embed/chat"
                frameBorder="0"
                style={{ height: "100%" }}
              ></iframe>
            </animated.div>
          )
      )}
    </div>
  )
}

export default () => (
  <TickProvider>
    <GameStateProvider>
      <App />
    </GameStateProvider>
  </TickProvider>
)
