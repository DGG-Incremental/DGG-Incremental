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
	upgrades: [];
}

const constructMap: (Construct | null)[][] = [
	[
		{ type: ConstructType.unexcavated, upgrades: [] },
		null,
		{ type: ConstructType.excavated, upgrades: [] },
	],
	[
		{ type: ConstructType.unexcavated, upgrades: [] },
		{ type: ConstructType.unexcavated, upgrades: [] },
		{ type: ConstructType.unexcavated, upgrades: [] },
	],
	[
		null,
		{ type: ConstructType.unexcavated, upgrades: [] },
		{ type: ConstructType.unexcavated, upgrades: [] },
	],
	[
		{ type: ConstructType.unexcavated, upgrades: [] },
		{ type: ConstructType.unexcavated, upgrades: [] },
		{ type: ConstructType.unexcavated, upgrades: [] },
		{ type: ConstructType.unexcavated, upgrades: [] },
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
						{level.map((construct) =>
							construct ? (
								<div
									className="construct-space construct"
									style={{
										borderStyle: construct.type === ConstructType.excavated ? "dashed" : "solid",
									}}
								>
									{construct?.type}
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
	.level {
		display: flex;
		padding: 20px 0;
		justify-content: center;
	}
	.construct-space {
		flex: 1;
		height: 100px;
		text-align: center;
		max-width: 200px;
		margin: 20px;
	}
	.construct {
		border: 4px var(--black) solid;
	}
`;
