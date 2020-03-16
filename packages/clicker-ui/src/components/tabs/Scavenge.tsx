import React from "react"
import styled from '@emotion/styled'
import classNames from 'classnames'

import { Card } from '../Card'
import { TabPane } from '../Tabs'
import { Progress } from '../Progress'
import { Button } from '../Button'
import LoadingBoxes from '../LoadingBoxes'

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
  locations: GameLocation[]
  currentLocation: GameLocation | null,
  setLocation: (location: GameLocation | null) => void
  scavenge: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
const Scavenge = ({ locations, currentLocation, setLocation, scavenge }: ScavengeProps) => {
  return (
    <div className="tab__scavenge">
      <div className="locations">
        {locations.map((location, i) => <Location
          key={i}
          changeLocation={() => setLocation(location)}
          here={currentLocation?.name === location.name}
          name={location.name}
          info={location.info} />)}
      </div>
      <hr />
      <div className="current-location">
        <Card headStyle={{ fontSize: '18px' }} style={{ maxWidth: '400px' }} title={<div><LoadingBoxes /> Scavenging</div>}>
          <div className="card__body">
            <Progress percent={50} />
          </div>
        </Card>
        <Button style={{ marginTop: '20px' }} type='primary' onClick={scavenge}>Scrounge</Button>
      </div>
    </div>
  )
}
export default Scavenge;