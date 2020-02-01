import axios from "axios"
import cookies from "browser-cookies"
import maxBy from "lodash/maxBy"
import React, { useContext, useState } from "react"
import apartment from "./apartment.jpg"
import "./App.css"
import Leaderboard from "./components/Leaderboard"
// import Log from "./components/Log"
import factory from "./factory.jpg"
import { GameStateContext, GameStateProvider } from "./gameStateContext"
import grocery from "./grocery.jpg"
import { TickProvider, TimeSyncContext } from "./tick/TickContext"
import { GameLocation } from "clicker-game/lib/game"

const getLeaderBoard = async () => {
  const res = await axios.get("/leaderboard")
  return res.data
}

interface ClickerProps {
  name: string
}

// const Clicker = ({ name }: ClickerProps) => {
//   const { game, setGame, error } = useContext(GameStateContext)
//   const timeSync = useContext(TimeSyncContext)
//   const pepeClickHandler = async () => {
//     game.clickPepe(new Date(timeSync.now()))
//     setGame(new Game(game.state))
//   }

//   const yeeClickHandler = async () => {
//     game.clickYee(new Date(timeSync.now()))
//     setGame(new Game(game.state))
//   }

//   const now = maxBy([new Date(timeSync.now()), game.state.lastSynced], d =>
//     d.getTime()
//   ) as Date // Avoids some de-sync issues
//   const state = game.getStateAt(now)
//   return (
//     <div>
//       <div
//         style={{
//           margin: "25px",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center"
//         }}
//       >
//         <div style={{ display: "inline-block", margin: "15px" }}>
//           <div className="emote YEE" onClick={yeeClickHandler}></div>
//           <div>{state.yees}</div>
//         </div>
//         <div>VS</div>
//         <div style={{ display: "inline-block", margin: "15px" }}>
//           <div className="emote PEPE" onClick={pepeClickHandler}></div>
//           <div>{state.pepes}</div>
//         </div>
//       </div>
//       <div className="errors">
//         <p>{error ? error.toString(): null}</p>
//       </div>
//     </div>
//   )
// }

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

// const testEntries = [
//   new Event(EventType.login, "test"),
//   new Event(
//     EventType.login,
//     "Lorem ipsum <b>dolor</b> sit amet, <font color='Red'>consectetur</font> adipiscing elit."
//   ),
//   new Event(
//     EventType.login,
//     "Donec ut nunc vehicula nulla molestie porta quis ac nisl. Ut malesuada pretium nisl, et vehicula nisi placerat a."
//   ),
//   new Event(EventType.login, "test"),
//   new Event(
//     EventType.login,
//     "Maecenas <em>eleifend</em> malesuada commodo. Suspendisse potenti. Duis sagittis dapibus arcu ac volutpat. Nulla ac mi id urna ornare eleifend at et est. Vivamus placerat, felis nec varius ullamcorper, urna massa ultricies mauris, a tristique leo libero a nibh. Fusce consequat vehicula sodales."
//   ),
//   new Event(EventType.login, "test"),
//   new Event(EventType.login, "test"),
//   new Event(EventType.login, "test"),
//   new Event(EventType.login, "test")
// ]
const LOCATION_IMAGES: { [s: string]: string } = {
  Factory: factory,
  "Apartment Complex": apartment,
  "Grocery Store": grocery
}

function App() {
  const [name, setName] = useState<string | null>(null)
  const gameContext = useContext(GameStateContext)
  const gameState = gameContext.game.getCurrentState()
  const timeSync = useContext(TimeSyncContext)
  const { currentLocation } = gameState

  const setLocationHandler = (location: GameLocation) => {
    gameContext.game.goToLocation(location, new Date(timeSync.now()))
    gameContext.setGame(gameContext.game)
  }

  return (
    <div className="App">
      <div className="modules">
        <div className="modules__column">
          {/* <Log entries={testEntries} /> */}
          <Leaderboard updateRate={5000} />
        </div>
        <div className="modules__column"></div>
      </div>
      <div className="map">
        {currentLocation === null && (
          <div className="location-list">
            {gameState.locations.map((location, i) => (
              <button
                key={i}
                className="location-list__location"
                onClick={() => setLocationHandler(location)}
              >
                <h2>{location.name}</h2>
                <div className="location-list__hover">
                  <h2>{location.name}</h2>
                </div>
                <div className="location-list__info">{location.info}</div>
              </button>
            ))}
          </div>
        )}
        {currentLocation !== null && (
          <div
            className="location"
            style={{
              backgroundImage: `url(${LOCATION_IMAGES[currentLocation.name]}`
            }}
          ></div>
        )}
        <div
          className={
            "location-menu" + (currentLocation === null ? "" : " active")
          }
        >
          <h2>
            {currentLocation !== null ? currentLocation.name : "Transient"}
          </h2>
          <div className="location-menu__content">
            <div className="location-menu__description">
              {location !== null
                ? currentLocation.description
                : "You aren't currently at a location"}
            </div>
            <div className="location-menu__progress">
              <div className="location-menu__progress-bar"></div>
            </div>
            <button
              className="location-menu__leave"
              onClick={() => setLocationHandler(gameState.locations[0])}
            >
              Leave
            </button>
          </div>
        </div>
      </div>
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
