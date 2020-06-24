import React, { useContext, useState, useEffect } from "react";
import styled from "@emotion/styled";
import classNames from "classnames";
import { RouteComponentProps } from "@reach/router";

import { GameStateContext } from "../gameStateContext";
import { TimeSyncContext } from "../tick/TickContext";

const Core = ({ className }: { className?: string } & RouteComponentProps) => {
	const { game, setGame, currentState } = useContext(GameStateContext);
	const timeSync = useContext(TimeSyncContext);
	const now = new Date(timeSync.now());

	return <div className={classNames("core", className)}></div>;
};

export default styled(Core)`
	background: var(--black);
	height: 100%;
`;
