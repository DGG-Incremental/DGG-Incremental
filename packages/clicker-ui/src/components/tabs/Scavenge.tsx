import React, { useContext } from "react"
import styled from '@emotion/styled'
import classNames from 'classnames'

import { Card } from '../Card'
import { TabPane } from '../Tabs'
import { Progress } from '../Progress'
import { Button } from '../Button'
import LoadingBoxes from '../LoadingBoxes'

import { GameStateContext, GameStateProvider } from "../../gameStateContext"
import { TimeSyncContext, TickProvider } from "../../tick/TickContext"

import { GameLocation } from "clicker-game/lib/locations"

const location = ({ name, info, className, changeLocation, here, disabled }: { name: string, info: string, className?: string, changeLocation: Function, here?: boolean, disabled?: boolean }) => (
  <div className={classNames("location", className, { disabled, here })} onClick={e => changeLocation()}>
    <h3 className="location__name">{name}</h3>
    <div className="location__info">{info}</div>
  </div>
)

const Location = styled(location)`
  background: var(--off-white);
  margin: 10px;
  padding: 15px;
  box-shadow: var(--grey) 5px 5px 0 0;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  cursor: pointer;
  &:hover {
    transform: translate(-5px, -5px);
    box-shadow: var(--grey) 10px 10px 0 0;
  }
  &.here {
    cursor: auto; 
  }
  &.here:hover {
    transform: none;
    box-shadow: var(--grey) 5px 5px 0 0;
  }
  &:after {
    content: 'You are here';
    position: absolute;
    top: calc(100% - 10px);
    right: 0;
    background: var(--black);
    color: var(--white);
    padding: 5px 8px;
    opacity: 0;
    transition: opacity 0.25s ease, top 0.25s ease;
  }
  &.here:after {
    opacity: 1;
    top: calc(100% - 20px);
  }
`

interface ScavengeProps {

}
const Scavenge = ({ }: ScavengeProps) => {
  const { game, setGame, currentState } = useContext(GameStateContext)
  const timeSync = useContext(TimeSyncContext)

  const setLocationHandler = (location: GameLocation | null) => {
    console.log("location change:", location)
    const time = new Date(timeSync.now())
    game.goToLocation(location, time)
    setGame(game)
  }

  const scavengeHandler = () => {
    const time = new Date(timeSync.now())
    game.scavenge(time);
    setGame(game)
  }

  return (
    <div className="tab__scavenge">
      <div className="locations">
        {currentState.unlockedLocations.map((location, i) => <Location
          key={i}
          changeLocation={() => setLocationHandler(location)}
          here={currentState.currentLocation?.name === location.name}
          name={location.name}
          info={location.info} />)}
      </div>
      <hr />
      <div className="current-location">
        <Card headStyle={{ fontSize: '18px' }} style={{ maxWidth: '400px' }} title={<div><LoadingBoxes /> Scavenging</div>}>
          <div className="card__body">
            <Progress percent={parseFloat((currentState.scavenge * 100).toFixed(0))} />
          </div>
        </Card>
        <Button style={{ marginTop: '20px' }} type='primary' onClick={scavengeHandler}>Scrounge</Button>
      </div>
    </div>
  )
}
export default () => (
  <TickProvider>
    <GameStateProvider>
      <Scavenge />
    </GameStateProvider>
  </TickProvider>
)