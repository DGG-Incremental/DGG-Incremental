import React, { useContext, useState } from "react"

import "normalize.css/normalize.css"
import "./theme.less"
import "./App.css"

import cookies from "browser-cookies"
import moment from 'moment'
import classNames from 'classnames'

import apartment from "./apartment.jpg"
import factory from "./factory.jpg"
import { GameStateContext, GameStateProvider } from "./gameStateContext"
import grocery from "./grocery.jpg"
import { TimeSyncContext, TickProvider } from "./tick/TickContext"
import { GameLocation, locations } from "clicker-game/lib/locations"

import { Drawer, Empty } from 'antd'

import { Tabs, TabPane } from './components/Tabs'
import { Card } from './components/Card'
import { Switch } from './components/Switch'
import { HoverHighlight } from './components/HoverHighlight'
import { Progress } from './components/Progress'
import { Button } from './components/Button'
import LoadingBoxes from './components/LoadingBoxes'

import { useSpring, animated as a } from 'react-spring'

import { DeleteFilled, ToolFilled, ExperimentFilled, LayoutFilled, MehFilled, SmileFilled, FrownFilled, ReadFilled, AppstoreAddOutlined, GroupOutlined, MessageFilled} from '@ant-design/icons'
import styled from "@emotion/styled"

import somaImage from './skelington.svg'

interface GetNameProps {
  onChange: (s: string) => void
}
// const GetName = ({ onChange }: GetNameProps) => {
//   const username = cookies.get("username")
//   if (username) {
//     onChange(username)
//   }
//   return <a href="/auth">Login</a>
// }
const LOCATION_IMAGES: { [s: string]: string } = {
  Factory: factory,
  "Apartment Complex": apartment,
  "Grocery Store": grocery
}

const textLogEntry = ({ timestamp, text, className }: {timestamp: Date, text: string, className?: string}) => (
  <div className={"log-entry " + className}>
    <span className="log-entry__time">[{moment(timestamp).format("HH:mm:ss")}]</span>&nbsp;
    <span className="log-entry__text" dangerouslySetInnerHTML={{ __html: text }}></span>
  </div>
)

const TextLogEntry = styled(textLogEntry)`
  .log-entry__time {
    color: rgba(0,0,0,0.35);
  }
`

const logEntries = [
  { timestamp: new Date(), text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { timestamp: new Date(), text: "Nam <b>hendrerit</b> facilisis velit in eleifend. Mauris volutpat, ipsum et convallis rutrum, justo augue molestie augue, ac elementum sapien erat ut urna. Pellentesque vitae felis fermentum mi sollicitudin mollis molestie aliquam ex." },
]

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

function App() {
  const [name, setName] = useState<string | null>(null)
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)
  const [showChat, setShowChat] = useState<boolean>(false)
  const { game, setGame } = useContext(GameStateContext)
  const timeSync = useContext(TimeSyncContext)
  const now = new Date(timeSync.now())
  

  const { width } = useSpring({
    width: showChat ? '300px' : '0px',
    config: { mass: 1, tension: 1000, friction: 100 }
  })

  const gameState = game.getStateAt(now);
  const { currentLocation } = gameState

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

  const leaveLocation = () => setLocationHandler(null)

  const resource: React.SFC<{ resource: string, count: number, className?: string }> = ({ resource, count, className }) => (
    <tr className={className}>
      <td>{resource}:</td>
      <td>{count}</td>
      <td></td>
    </tr>
  )
  const Resource = styled(resource)`
    
  `

  const upgrade = ({ name, info, className, purchaseUpgrade }: { name: string, info: string, className?: string, purchaseUpgrade?: () => void }) => (
    <div className={"upgrade " + className} onClick={purchaseUpgrade}>
      <h3 className="upgrade__name">{name}</h3>
      <div className="upgrade__info">{info}</div>
    </div>
  )

  const Upgrade = styled(upgrade)`
    background: var(--off-white);
    margin: 10px;
    padding: 15px;
    box-shadow: var(--grey) 5px 5px 0 0;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: pointer;
    &:hover {
      transform: translate(-5px, -5px);
      box-shadow: var(--grey) 10px 10px 0 0;
    }
  `

  
  return (
    <div className="App">
      <Drawer></Drawer>
      <div className="content">
        <div className="log">
          <Card headStyle={{ fontSize: '18px' }} title={<span><ReadFilled /> Log</span>}>
            <div className="card__body">
              {logEntries.map((entry, i) => <TextLogEntry key={i} {...entry}/>)}
            </div>
          </Card>
        </div>
        <div className="resources">
          <Card headStyle={{ fontSize: '18px' }} title={<span><LayoutFilled /> Resources</span>}>
            <div className="card__body">
              <table className="resources__table">
                <tbody>
                  <Resource resource={'Scrap'} count={gameState.scrap} />
                  <Resource resource={'Food'} count={gameState.food} />
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        <div className="condition">
          <Card headStyle={{ fontSize: '18px' }} title={<span>{gameState.hunger > 0.3 ? gameState.hunger > 0.7 ? <SmileFilled /> : <MehFilled /> : <FrownFilled />} Condition</span>}>
            <div className="card__body">
              <h4>Hunger</h4>
              <Progress percent={gameState.hunger * 100}/>
            </div>
          </Card>
        </div>
        <div className="tabs">
          <Card style={{height: '100%'}}>
            <Tabs size="large">
              <TabPane tab={<HoverHighlight><div style={{ padding: '3px 5px' }}><DeleteFilled /> Scavenge</div></HoverHighlight>} key="1">
                <div className="locations">
                  {gameState.unlockedLocations.map((location, i) => <Location
                    key={i}
                    changeLocation={() => setLocationHandler(location)}
                    here={currentLocation?.name === location.name}
                    name={location.name}
                    info={location.info} />)}
                </div>
                <hr/>
                <div className="current-location">
                  <div className="scavenge">
                    <Progress percent={50} />
                    <div style={{ textTransform: 'uppercase' }}>Scavenging <LoadingBoxes /></div>
                  </div>
                  <Button type='primary' onClick={scavengeHandler}>Scrounge</Button>
                </div>
              </TabPane>
              <TabPane tab={<HoverHighlight><div style={{ padding: '3px 5px' }}><ToolFilled /> Upgrades</div></HoverHighlight>} key="2">
                <div className="upgrades" style={{padding: '20px'}}>
                  <Card headStyle={{ fontSize: '18px' }} style={{ marginBottom: '20px' }} title={<span><AppstoreAddOutlined /> Construct Upgrades</span>}>
                    <div className="upgrades__list">
                      {gameState.upgrades.filter(u => !u.owned).length === 0 ?
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                        gameState.upgrades.filter(u => !u.owned).map((upgrade, i) => <Upgrade key={i} name={upgrade.name} info={upgrade.description} />)}
                    </div>
                  </Card>
                  <Card headStyle={{ fontSize: '18px' }} title={<span><GroupOutlined /> Owned Upgrades</span>}>
                    <div className="upgrades__list">
                      {gameState.upgrades.filter(u => u.owned).length === 0 ?
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                        gameState.upgrades.filter(u => u.owned).map((upgrade, i) => <Upgrade key={i} name={upgrade.name} info={upgrade.description} />)}
                    </div>
                  </Card>
                </div>
              </TabPane>
              {gameState.upgrades.find(upgrade => upgrade.name === 'Soma') && <TabPane tab={<HoverHighlight><div style={{ padding: '3px 5px' }}><ExperimentFilled /> Soma</div></HoverHighlight>} key="3">
                <img src={somaImage} style={{maxWidth: '300px', margin: '0 auto', display: 'block' }} alt=""/>
              </TabPane>}
            </Tabs>
          </Card>
        </div>
      </div>
      <div className="footer">
        {/* <Switch checkedChildren="話" unCheckedChildren="話" onChange={value => setShowChat(value)} /> */}
        <Switch checkedChildren={<MessageFilled />} unCheckedChildren={<MessageFilled />} onChange={value => setShowChat(value)} />
      </div>
      <a.div style={{ width }} className="chat">chat</a.div>
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
