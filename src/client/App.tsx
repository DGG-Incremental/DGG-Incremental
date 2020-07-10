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

const NavLink: React.FC<{ to: string }> = ({ to, children }) => (
	<Link to={to} getProps={({ isCurrent }) => ({ className: isCurrent ? "active" : "" })}>
		{children}
	</Link>
);

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
			<div className="overlay"></div>
			<Drawer visible={showLeaderboard}></Drawer>
			<div className="links">
				<NavLink to="/">Home</NavLink>
				<NavLink to="/constructs">Constructs</NavLink>
				<NavLink to="/computer">Computer</NavLink>
				<NavLink to="/core">Core</NavLink>
				<NavLink to="/map">Map</NavLink>
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
		"links links"
		"content chat"
		"footer footer";
	grid-template-columns: 1fr auto;
	grid-template-rows: 30px 1fr auto;
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
		font-size: 24px;
		cursor: pointer;
		padding-top: 6px;
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
	.links {
		grid-area: links;
		align-self: center;
		/* display: grid;
		grid-template-columns: 40px;
		grid-template-rows: repeat(auto-fill, 40px);
		align-items: center;
		justify-items: center;
		gap: 20px;
		padding: 20px; */
	}
	.links a {
		/* background: var(--black); */
		position: relative;
		transition: opacity 0.2s ease;
		margin: 0 10px;
	}
	.links a:after {
		position: absolute;
		/* content: ""; */
		top: 0;
		bottom: 0;
		left: -20px;
		right: calc(100% + 20px);
		background: var(--black);
		opacity: 0.15;
		transition: opacity 0.2s ease, right 0.2s ease;
	}
	.links a:hover,
	.links a.active {
		opacity: 1;
	}
	.links a:hover:after,
	.links a.active:after {
		right: calc(100%);
		opacity: 1;
	}
	img {
		width: 100%;
		height: 100%;
	}
`;

export default () => (
	<TickProvider>
		<GameStateProvider>
			<StyledApp />
		</GameStateProvider>
	</TickProvider>
);
