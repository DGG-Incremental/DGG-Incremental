import React, { useContext, useState, useEffect } from "react";
import cookies from "browser-cookies";
import styled from "@emotion/styled";
import classNames from "classnames";

import { GameStateContext, GameStateProvider } from "./gameStateContext";
import { TimeSyncContext, TickProvider } from "./tick/TickContext";
import { GameLocation } from "clicker-game/lib/locations";
import { Items, ResourceType } from "clicker-game/lib/items";

import { Drawer, Modal } from "antd";

import { Switch } from "./components/Switch";
import Log from "./components/cards/Log";
import ElementSpawn from "./components/sequencing/ElementSpawn";
import Fabricator from "./components/Fabricator";

import { useTransition, animated as a } from "react-spring";

import { ToolFilled, ExperimentFilled, ReadFilled, MessageFilled, DeleteFilled, ExclamationCircleOutlined } from "@ant-design/icons";

interface GetNameProps {
  onChange: (s: string) => void;
}
const GetName = ({ onChange }: GetNameProps) => {
  const username = cookies.get("username");
  if (username) {
    onChange(username);
  }
  return username ? <span>{username}</span> : <a href="/auth">login</a>;
};

const logEntries = [
  { timestamp: new Date(), text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  {
    timestamp: new Date(),
    text:
      "Nam <b>hendrerit</b> facilisis velit in eleifend. Mauris volutpat, ipsum et convallis rutrum, justo augue molestie augue, ac elementum sapien erat ut urna. Pellentesque vitae felis fermentum mi sollicitudin mollis molestie aliquam ex.",
  },
];

const App = ({ className }: { className?: string }) => {
  const [name, setName] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(false);
  const { game, setGame, currentState } = useContext(GameStateContext);
  const itemEntries = Object.entries(currentState.resources).map(([key, content]) => ({ ...Items[key as ResourceType], count: content?.count }));
  const timeSync = useContext(TimeSyncContext);
  const now = new Date(timeSync.now());

  useEffect(() => {
    if (!cookies.get("username") && process.env.REACT_APP_STORAGE_TYPE !== "local") {
      Modal.confirm({
        title: "You are not logged in",
        icon: <ExclamationCircleOutlined />,
        content: (
          <span>
            <a href="/auth">Login</a> with dgg
          </span>
        ),
        onOk() {
          location.href = "/auth";
        },
      });
    }
  }, []);

  const transitions = useTransition(showChat, null, {
    from: { width: "0px", overflow: "hidden" },
    enter: { width: "300px" },
    leave: { width: "0px" },
    unique: true,
  });

  return (
    <div className={classNames("app", className)}>
      <Drawer visible={showLeaderboard}></Drawer>
      <div className="content">
        <div className="log">
          <h1>
            <ElementSpawn state="spawn">Log</ElementSpawn>
          </h1>
          <ElementSpawn state="spawn" delay={0.2}>
            <Log entries={logEntries} />
          </ElementSpawn>
          {currentState.test}
          <button onClick={() => game.testAction(now)}>test</button>
          <button onClick={() => game.test2Action(now)}>test2</button>
        </div>
        <div className="inventory">
          <h1>
            <ElementSpawn state="spawn" delay={0.6}>
              Inventory
            </ElementSpawn>
          </h1>
          <ElementSpawn state="spawn" blockContent delay={0.3}>
            <div className="inventory__items">
              {[...new Array(currentState.itemSlots)].map((_, i) => {
                const item = itemEntries[i];
                return item ? (
                  <div key={i.toString() + (item?.name || "")} className="inventory__slot">
                    {item?.name}: {item?.count}
                  </div>
                ) : (
                  <div key={i} className="inventory__slot"></div>
                );
              })}
            </div>
          </ElementSpawn>
        </div>
        <div className="fabrication">
          <h1>
            <ElementSpawn state="spawn" delay={0.4}>
              Fabrication
            </ElementSpawn>
          </h1>
          <ElementSpawn state="spawn" blockContent delay={0.6}>
            <div className="fabricators">
              {[...new Array(3)].map((_, i) => (
                <Fabricator key={i} active={i > 1} progress={30 * i} />
              ))}
            </div>
          </ElementSpawn>
        </div>
        <div className="acquisition">
          <h1>
            <ElementSpawn state="spawn" delay={0.6}>
              Acquisition
            </ElementSpawn>
          </h1>
        </div>
      </div>
      <div className="footer">
        {/* <Switch checkedChildren="話" unCheckedChildren="話" onChange={value => setShowChat(value)} /> */}
        <div style={{ gridArea: "info", fontSize: "12px", padding: "0 10px", lineHeight: "22px" }}>dgg clicker [ 0.0.1alpha ]</div>
        <div style={{ gridArea: "leaderboard", padding: "0 10px" }}>
          <GetName onChange={setName} />
        </div>
        <div style={{ gridArea: "chat-switch" }}>
          <Switch checkedChildren={<MessageFilled />} unCheckedChildren={<MessageFilled />} onChange={(value) => setShowChat(value)} />
        </div>
      </div>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <a.div className="chat" key={key} style={props}>
              <iframe src="https://www.destiny.gg/embed/chat" style={{ height: "100%" }}></iframe>
            </a.div>
          )
      )}
    </div>
  );
};

const StyledApp = styled(App)`
  height: 100vh;
  background: var(--white);
  display: grid;
  grid-template-areas:
    "content chat"
    "footer footer";
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  column-gap: 20px;

  .footer {
    height: 50px;
    background: var(--black);
    color: var(--white);
    grid-area: footer;
    display: grid;
    grid-template-areas: "info leaderboard . chat-switch";
    grid-template-columns: auto auto 1fr 60px;
    align-content: center;
    justify-content: center;
  }

  .chat {
    grid-area: chat;
  }

  iframe {
    border: none;
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: "Roboto Mono", monospace;
    text-transform: uppercase;
    margin: 0 0 10px 0;
    font-weight: 700;
    font-size: 32px;
  }

  .content {
    grid-area: content;
    padding: 20px;
    display: grid;
    grid-template-areas:
      "sidebar log         acquisition"
      "sidebar inventory   acquisition"
      "sidebar fabrication acquisition"
      "logo    fabrication acquisition";
    grid-template-columns: 100px 1fr 1fr;
    grid-template-rows: 1fr auto auto 100px;
    gap: 20px;
  }
  .log {
    grid-area: log;
    max-width: 500px;
  }
  .inventory {
    grid-area: inventory;
    padding-bottom: 50px;
  }
  .inventory__items {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    grid-auto-rows: 100px;
    gap: 10px;
  }
  .inventory__slot {
    background: rgba(0, 0, 0, 0.05);
  }
  .fabrication {
    grid-area: fabrication;
    padding-bottom: 50px;
  }
  .fabricators {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    gap: 20px;
  }
  .acquisition {
    grid-area: acquisition;
  }
`;

export default () => (
  <TickProvider>
    <GameStateProvider>
      <StyledApp />
    </GameStateProvider>
  </TickProvider>
);
