import React, { useContext, useState, useEffect } from "react";
import styled from "@emotion/styled";
import classNames from "classnames";
import { RouteComponentProps } from "@reach/router";

import { GameStateContext } from "../gameStateContext";
import { TimeSyncContext } from "../tick/TickContext";
import { Resources, ResourceType } from "@game";

import Log from "../components/cards/Log";
import ElementSpawn from "../components/sequencing/ElementSpawn";
import Fabricator from "../components/Fabricator";
import Resource from "../components/Resource";

const logEntries = [
	{ timestamp: new Date(), text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
	{
		timestamp: new Date(),
		text:
			"Nam <b>hendrerit</b> facilisis velit in eleifend. Mauris volutpat, ipsum et convallis rutrum, justo augue molestie augue, ac elementum sapien erat ut urna. Pellentesque vitae felis fermentum mi sollicitudin mollis molestie aliquam ex.",
	},
];

const Tasks = ({ className }: { className?: string } & RouteComponentProps) => {
	const { game, setGame, currentState } = useContext(GameStateContext);
	const resourceEntries = Object.entries(currentState.resources).map(([key, content]) => ({
		...Resources[key as ResourceType],
		count: content,
	}));
	const timeSync = useContext(TimeSyncContext);
	const now = new Date(timeSync.now());

	return (
		<div className={classNames("tasks", className)}>
			<div className="log">
				<h1>
					<ElementSpawn state="spawn">Log</ElementSpawn>
				</h1>
				<ElementSpawn state="spawn" delay={0.2}>
					<Log entries={logEntries} />
				</ElementSpawn>
			</div>
			<div className="inventory">
				<h1>Inventory</h1>
				<div className="inventory__items">
					{[...new Array(currentState.itemSlots)].map((_, i) => {
						const resource = resourceEntries[i];
						return resource ? (
							<div key={i.toString() + (resource?.name || "")} className="inventory__slot">
								<Resource {...resource} />
							</div>
						) : (
							<div key={i} className="inventory__slot"></div>
						);
					})}
				</div>
			</div>
			<div className="fabrication">
				<h1>Fabrication</h1>
				<div className="fabricators">
					{[...new Array(3)].map((_, i) => (
						<Fabricator key={i} active={i > 1} progress={30 * i} />
					))}
				</div>
			</div>
			<div className="acquisition">
				<h1>Acquisition</h1>
			</div>
		</div>
	);
};

const StyledApp = styled(Tasks)`
	height: 100%;
	grid-area: content;
	padding: 20px;
	display: grid;
	grid-template-areas:
		"log         acquisition"
		"inventory   acquisition"
		"fabrication acquisition"
		"fabrication acquisition";
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr auto auto 100px;
	gap: 20px;
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
		display: grid;
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

export default StyledApp;
