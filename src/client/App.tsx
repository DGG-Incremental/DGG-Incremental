import React, { useContext, useState, useEffect } from "react";
import cookies from "browser-cookies";
import styled from "@emotion/styled";
import classNames from "classnames";

import { Router, Link } from "@reach/router";
import Tasks from "./pages/Tasks";
import Constructs from "./pages/Constructs";
import Computer from "./pages/Computer";
import Core from "./pages/Core";

import { GameStateContext, GameStateProvider } from "./gameStateContext";
import { TimeSyncContext, TickProvider } from "./tick/TickContext";
import { GameLocation, Resources, ResourceType } from "@game";

import { Drawer, Modal } from "antd";

import { Switch } from "./components/Switch";
import Log from "./components/cards/Log";
import ElementSpawn from "./components/sequencing/ElementSpawn";
import Fabricator from "./components/Fabricator";
import Resource from "./components/Resource";

import { useTransition, animated as a } from "react-spring";

import { MessageFilled, ExclamationCircleOutlined } from "@ant-design/icons";

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
	const resourceEntries = Object.entries(currentState.resources).map(([key, content]) => ({
		...Resources[key as ResourceType],
		count: content,
	}));
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
			<div className="sidebar">
				<Link to="/">Tasks</Link>
				<Link to="/constructs">Constructs</Link>
				<Link to="/computer">Computer</Link>
				<Link to="/core">AI Core</Link>
			</div>
			<div className="content">
				<Router style={{ height: "100%" }}>
					<Tasks path="/" />
					<Constructs path="/constructs" />
					<Computer path="/computer" />
					<Core path="/core" />
				</Router>
			</div>
			<footer className="footer">
				{/* <Switch checkedChildren="話" unCheckedChildren="話" onChange={value => setShowChat(value)} /> */}
				<div style={{ gridArea: "info", fontSize: "12px", padding: "0 10px", lineHeight: "22px" }}>
					dgg clicker [ 0.0.1alpha ]
				</div>
				<div style={{ gridArea: "leaderboard", padding: "0 10px" }}>
					<GetName onChange={setName} />
				</div>
				<div
					className={classNames("chat-toggle", { active: showChat })}
					onClick={(value) => setShowChat(!showChat)}
				>
					<MessageFilled />
				</div>
			</footer>
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
		"sidebar content chat"
		"footer  footer footer";
	grid-template-columns: 100px 1fr auto;
	grid-template-rows: 1fr auto;
	.footer {
		height: 50px;
		background: var(--black);
		color: var(--white);
		grid-area: footer;
		display: grid;
		grid-template-areas: "info leaderboard . chat-toggle";
		grid-template-columns: auto auto 1fr 60px;
		align-items: center;
		justify-items: center;
	}

	.chat {
		grid-area: chat;
		background: var(--black);
	}

	.chat-toggle {
		grid-area: chat-toggle;
		height: 50px;
		text-align: center;
		font-size: 30px;
		cursor: pointer;
		padding-top: 1px;
		width: 100%;
	}

	.chat-toggle.active {
		color: var(--black);
		background: var(--white);
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
	.sidebar {
		display: grid;
		grid-template-columns: 80px;
		grid-template-rows: repeat(auto-fill, 80px);
		/* text-align: center; */
		align-items: center;
		justify-items: center;
		gap: 10px;
		padding: 10px;
	}
	.sidebar a {
		/* background: var(--black); */
	}
`;

export default () => (
	<TickProvider>
		<GameStateProvider>
			<StyledApp />
		</GameStateProvider>
	</TickProvider>
);
