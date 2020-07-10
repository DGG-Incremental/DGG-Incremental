import React, { useContext, useState, useEffect } from "react";
import styled from "@emotion/styled";
import classNames from "classnames";
import { RouteComponentProps } from "@reach/router";

import { GameStateContext } from "../gameStateContext";
import { TimeSyncContext } from "../tick/TickContext";
import { Resources, ResourceType } from "@game";

enum ConstructType {
	unexcavated = "unexcavated",
	excavated = "excavated",
	computerMainframe = "computerMainframe",
}

interface Construct {
	type: ConstructType;
	digDifficulty: number;
	upgrades: [];
}

const constructMap: (Construct | null)[][] = [
	[
		{ type: ConstructType.excavated, upgrades: [], digDifficulty: 1 },
		null,
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 1 },
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 1 },
	],
	[
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 2 },
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 2 },
		null,
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 2 },
	],
	[
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 3 },
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 3 },
		null,
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 2 },
	],
	[
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 4 },
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 4 },
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 4 },
		{ type: ConstructType.unexcavated, upgrades: [], digDifficulty: 4 },
	],
];

const Constructs = ({ className }: { className?: string } & RouteComponentProps) => {
	const { game, setGame, currentState } = useContext(GameStateContext);
	const timeSync = useContext(TimeSyncContext);
	const now = new Date(timeSync.now());

	return (
		<div className={classNames("constructs", className)}>
			<div className="levels">
				{constructMap.map((level) => (
					<div className="level">
						<div className="connection"></div>
						{level.map((construct) =>
							construct ? (
								<div
									className="construct-space construct"
									style={{
										borderStyle: construct.type === ConstructType.excavated ? "dashed" : "solid",
									}}
								>
									{/* {construct?.type} */}
								</div>
							) : (
								<div className="construct-space blank"></div>
							)
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default styled(Constructs)`
	display: grid;
	grid-template-areas: ". levels .";
	grid-template-columns: 1fr auto 1fr;
	.levels {
		grid-area: levels;
	}
	.level {
		display: flex;
		padding: 10px 0;
		gap: 20px;
	}
	.construct-space {
		height: 130px;
		width: 130px;
		text-align: center;
		justify-self: center;
		font-size: 20px;
		margin: 0 5px;
	}
	.construct {
		border: 3px var(--black) solid;
	}
`;
