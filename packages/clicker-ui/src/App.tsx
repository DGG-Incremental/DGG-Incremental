import React, { useState, useEffect, useRef } from "react"
import Game, { GameState, Location, Event, EventType } from "clicker-game"
import factory from './factory.jpg';
import grocery from './grocery.jpg';
import apartment from './apartment.jpg';

import Log from './components/Log';
import Leaderboard from './components/Leaderboard';

import "./App.css"
import { min } from "moment";

const testEntries = [
  new Event(EventType.login, "test"),
  new Event(EventType.login, "Lorem ipsum <b>dolor</b> sit amet, <font color='Red'>consectetur</font> adipiscing elit."),
  new Event(EventType.login, "Donec ut nunc vehicula nulla molestie porta quis ac nisl. Ut malesuada pretium nisl, et vehicula nisi placerat a."),
  new Event(EventType.login, "test"),
  new Event(EventType.login, "Maecenas <em>eleifend</em> malesuada commodo. Suspendisse potenti. Duis sagittis dapibus arcu ac volutpat. Nulla ac mi id urna ornare eleifend at et est. Vivamus placerat, felis nec varius ullamcorper, urna massa ultricies mauris, a tristique leo libero a nibh. Fusce consequat vehicula sodales."),
  new Event(EventType.login, "test"),
  new Event(EventType.login, "test"),
  new Event(EventType.login, "test"),
  new Event(EventType.login, "test"),
]



function App() {
  const [name, setName] = useState<string | null>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const possibleLocations = [
    new Location("Factory", "The Factory is a place", "The rusted carcases of old machines huddle around the concrete floor.", factory), 
    new Location("Apartment Complex", "Test", "", apartment), 
    new Location("Grocery Store", "Test", "", grocery)
  ]
  return (
    <div className="App">
      <div className="modules">
        <div className="modules__column">
          <Log entries={testEntries} />
          <Leaderboard updateRate={5000} />
        </div>
        <div className="modules__column">
        </div>
      </div>
      <div className="map">
        {location === null && <div className="location-list">
          {possibleLocations.map((location, i) => (
            <button key={i} className="location-list__location" onClick={() => setLocation(location)}>
              <h2>{location.name}</h2>
              <div className="location-list__hover"><h2>{location.name}</h2></div>
              <div className="location-list__info">{location.info}</div>
            </button>
          ))}
        </div>}
        {location !== null && (
          <div className="location" style={{backgroundImage: `url(${location.image}`}}></div>
        )}
        <div className={"location-menu" + (location === null ? '' : " active")}>
          <h2>{location !== null ? location.name : 'Transient'}</h2>
          <div className="location-menu__content">
            <div className="location-menu__description">
              {location !== null ? location.description : "You aren't currently at a location"}
            </div>
            <div className="location-menu__progress">
              <div className="location-menu__progress-bar"></div>
            </div>
            <button className="location-menu__leave" onClick={() => setLocation(null)}>Leave</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
