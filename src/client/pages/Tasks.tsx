import React, { useContext, useState, useEffect } from "react";
import styled from "@emotion/styled";
import classNames from "classnames";
import { RouteComponentProps } from "@reach/router";

import { GameStateContext } from "../gameStateContext";
import { TimeSyncContext } from "../tick/TickContext";
import { Resources, ResourceType, Blueprints } from "@game";

import Log from "../components/cards/Log";
import ElementSpawn from "../components/sequencing/ElementSpawn";
import Fabricator from "../components/Fabricator";
import Resource from "../components/Resource";
import FabricatorPopup from "../components/FabricatorPopup";

import { Button } from "antd";

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
			<div className="section fabrication">
				<h1>Fabrication</h1>
				<div className="fabricators">
					{[...new Array(3)].map((_, i) => (
						<Fabricator key={i} active={i > 1} progress={30 * i} />
					))}
				</div>
				<div className="blueprints">
					<h2>Blueprints</h2>
					<div className="blueprint-search"></div>
					<div className="blueprint-list">
						{Object.entries(Blueprints).map(([key, blueprint]) => (
							<div className="blueprint" key={key}>
								<div className="blueprint__icon">
									<img src={blueprint.icon} alt="" />
								</div>
								<div className="blueprint__name">{blueprint.name}</div>
								<div className="blueprint__change">
									<div className="blueprint__cost resource__box">
										{blueprint.cost.map((cost) => (
											<div className="cost-resource">
												<img className="cost-resource__icon" src={Resources[cost.item].icon} />
												<div className="cost-resource__name">{Resources[cost.item].name}</div>
												<div className="cost-resource__count">{cost.count}</div>
											</div>
										))}
									</div>
									<div className="arrow">🡆</div>
									<div className="blueprint__yield resource__box">
										{blueprint.output.map((cost) => (
											<div className="cost-resource">
												<img className="cost-resource__icon" src={Resources[cost.item].icon} />
												<div className="cost-resource__name">{Resources[cost.item].name}</div>
												<div className="cost-resource__count">{cost.count}</div>
											</div>
										))}
									</div>
								</div>
								<FabricatorPopup blueprint={blueprint}>
									<Button className="blueprint__button">Assign</Button>
								</FabricatorPopup>
							</div>
						))}
					</div>
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
		"fabrication inventory";
	grid-template-columns: auto auto;
	grid-template-rows: 1fr auto;
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
	.section {
		display: grid;
	}
	.section h1 {
		grid-area: "header";
	}
	.section.fabrication {
		grid-template-areas:
			"header 		 header"
			"fabricators blueprints";
		grid-template-columns: 5fr 3fr;
		grid-template-rows: auto 1fr;
	}
	.fabricators {
		grid-area: fabricators;
	}
	.blueprints {
		grid-area: blueprints;
	}
	h2 {
		font-size: 1.6em;
		background: var(--black);
		color: var(--white);
		padding-left: 10px;
		margin: 0;
	}
	.blueprint {
		display: grid;
		grid-template-areas:
			"icon 	name 	 button"
			"change change change";
		grid-template-columns: 40px 1fr auto;
		grid-template-rows: 40px auto;
		padding: 5px;
		gap: 10px;
		font-family: "IBM Plex Mono", monospace;
	}
	.blueprint__icon {
		border: 2px solid var(--black);
		padding: 2px;
		position: relative;
	}
	.blueprint__icon:after {
		content: "";
		position: absolute;
		top: 5px;
		left: -3px;
		right: -3px;
		bottom: 5px;
		background: var(--white);
	}
	.blueprint__icon:before {
		content: "";
		position: absolute;
		top: -3px;
		left: 5px;
		right: 5px;
		bottom: -3px;
		background: var(--white);
	}
	.blueprint__icon img {
		background: var(--white);
		position: relative;
		z-index: 10;
	}
	.blueprint__name {
		font-size: 1.8em;
		text-transform: uppercase;
		color: var(--black);
		padding-top: 8px;
	}
	.blueprint__button {
		grid-area: button;
		align-self: end;
	}
	.blueprint__change {
		grid-area: change;
		display: flex;
		align-items: center;
	}
	.arrow {
		color: var(--black);
		margin: 0 8px;
	}
	.resource__box {
		background: rgba(0, 0, 0, 0.05);
		padding: 5px;
		flex: 1;
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
	}
	.cost-resource {
		/* display: flex; */
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 6px;
		color: var(--black);
		text-transform: lowercase;
	}
	.cost-resource img {
		height: 20px;
		width: 20px;
	}
	.cost-resource__count {
		margin-right: 4px;
		/* line-height: 20px; */
	}
`;

export default StyledApp;
