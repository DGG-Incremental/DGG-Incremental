import React, { useContext, useState, useEffect } from "react"

import "normalize.css/normalize.css"
import "./theme.less"
import "./App.css"

import cookies from "browser-cookies"

import { GameStateContext, GameStateProvider } from "./gameStateContext"
import { TimeSyncContext, TickProvider } from "./tick/TickContext"
import { GameLocation } from "clicker-game/lib/locations"

import { Drawer, Modal } from 'antd'

import { Tabs, TabPane } from './components/Tabs'
import { Card } from './components/Card'
import { Switch } from './components/Switch'
import { HoverHighlight } from './components/HoverHighlight'
import Log from './components/cards/Log'
import Resources from './components/cards/Resources'
import Condition from './components/cards/Condition'

import Scavenge from './components/tabs/Scavenge'
import Upgrades from './components/tabs/Upgrades'
import Soma from './components/tabs/Soma'

import { useTransition, animated as a } from 'react-spring'

import { ToolFilled, ExperimentFilled, MessageFilled, DeleteFilled, ExclamationCircleOutlined } from '@ant-design/icons'

interface GetNameProps {
  onChange: (s: string) => void
}
const GetName = ({ onChange }: GetNameProps) => {
  const username = cookies.get("username")
  if (username) {
    onChange(username)
  }
  return <a href="/auth">login</a>
}

const logEntries = [
  { timestamp: new Date(), text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  { timestamp: new Date(), text: "Nam <b>hendrerit</b> facilisis velit in eleifend. Mauris volutpat, ipsum et convallis rutrum, justo augue molestie augue, ac elementum sapien erat ut urna. Pellentesque vitae felis fermentum mi sollicitudin mollis molestie aliquam ex." },
]

function App() {
  const [name, setName] = useState<string | null>(null)
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)
  const [showChat, setShowChat] = useState<boolean>(false)
  const { game, setGame } = useContext(GameStateContext)
  const timeSync = useContext(TimeSyncContext)
  const now = new Date(timeSync.now())
  
  useEffect(() => {
    if (!cookies.get("username") && process.env.REACT_APP_STORAGE_TYPE !== "local") {
      Modal.confirm ({
        title: 'You are not logged in',
        icon: <ExclamationCircleOutlined />,
        content: <span><a href='/auth'>Login</a> with dgg</span>,
        onOk() { location.href = '/auth'; }
      });
    }
  }, [])

  const transitions = useTransition(showChat, null, {
    from: { width: '0px', overflow: 'hidden' },
    enter: { width: '300px' },
    leave: { width: '0px' },
    unique: true,
  })

  const gameState = game.getStateAt(now);

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
    <div className="App">
      {console.log(gameState)}
      <Drawer visible={showLeaderboard}></Drawer>
      <div className="content">
        <div className="log">
          <Log entries={logEntries}/>
        </div>
        <div className="resources">
          <Resources scrap={gameState.scrap} food={gameState.food}/>
        </div>
        <div className="condition">
          <Condition hunger={gameState.hunger}/>
        </div>
        <div className="tabs">
          <Card style={{height: '100%'}}>
            <Tabs size="large">
              <TabPane tab={<HoverHighlight><div style={{ padding: '3px 5px' }}><DeleteFilled /> Scavenge</div></HoverHighlight>} key="scavenge">
                <Scavenge
                  locations={gameState.unlockedLocations}
                  currentLocation={gameState.currentLocation}
                  setLocation={setLocationHandler}
                  scavenge={scavengeHandler}
                  scavengeProgress={gameState.scavenge}
                />
              </TabPane>
              <TabPane tab={<HoverHighlight><div style={{ padding: '3px 5px' }}><ToolFilled /> Upgrades</div></HoverHighlight>} key="upgrades">
                <Upgrades upgrades={gameState.upgrades} playerResources={[{ name: 'food', count: gameState.food }, { name: 'scrap', count: gameState.scrap }]}/>
              </TabPane>
              {gameState.upgrades.find(upgrade => upgrade.name === 'Soma')?.owned &&
                <TabPane tab={<HoverHighlight><div style={{ padding: '3px 5px' }}><ExperimentFilled /> Soma</div></HoverHighlight>} key="soma">
                  <Soma/>
                </TabPane>
              }
            </Tabs>
          </Card>
        </div>
      </div>
      <div className="footer">
        {/* <Switch checkedChildren="話" unCheckedChildren="話" onChange={value => setShowChat(value)} /> */}
        <div style={{ gridArea: 'info', fontSize: '12px', padding: '0 10px', lineHeight: '22px' }}>dgg clicker [ 0.0.1alpha ]</div>
        <div style={{ gridArea: 'leaderboard', padding: '0 10px', }}><GetName onChange={name => { console.log(name) }}/></div>
        <div style={{ gridArea: 'chat' }}><Switch checkedChildren={<MessageFilled />} unCheckedChildren={<MessageFilled />} onChange={value => setShowChat(value)} /></div>
      </div>
      {transitions.map(({ item, key, props }) => item && <a.div key={key} style={props}>
        <iframe
          src="https://www.destiny.gg/embed/chat"
          style={{ height: "100%", }}
        ></iframe>
      </a.div>)}
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
