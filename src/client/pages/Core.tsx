import React, { useContext, useState, useEffect } from "react";
import styled from "@emotion/styled";
import classNames from "classnames";
import { RouteComponentProps } from "@reach/router";

import { GameStateContext } from "../gameStateContext";
import { TimeSyncContext } from "../tick/TickContext";

import TestAnim from "../assets/ascii/test.json";
import useInterval from "@use-it/interval";

const Core = ({ className }: { className?: string } & RouteComponentProps) => {
	const { game, setGame, currentState } = useContext(GameStateContext);
	const timeSync = useContext(TimeSyncContext);
	const now = new Date(timeSync.now());
	const [frame, setFrame] = React.useState(0);

	useInterval(() => {
		setFrame((frame) => (frame + 1) % TestAnim.frames.length);
	}, 30);

	return (
		<div className={classNames("core", className)}>
			<div
				className="core-anim glow"
				dangerouslySetInnerHTML={{
					__html: TestAnim.frames[frame].replace(/\n/g, "<br>").replace(/\s/g, "&nbsp;"),
				}}
			></div>
		</div>
	);
};

export default styled(Core)`
	background: var(--black);
	color: var(--white);
	font-family: "IBM Plex Mono", monospace;
	height: 100%;
	display: flex;
	.core-anim {
		margin: 0 auto;
		align-self: center;
	}
	.glow {
		text-shadow: 0px 0px 25px rgba(255, 255, 255, 0.7);
		/* color: #fff;
		text-align: center;
		-webkit-animation: glow 3s ease-in-out infinite alternate;
		-moz-animation: glow 3s ease-in-out infinite alternate;
		animation: glow 3s ease-in-out infinite alternate; */
	}

	@keyframes glow {
		from {
			text-shadow: 0px 0px 20px rgba(255, 255, 255, 0.7);
		}
		to {
			text-shadow: 0px 0px 25px rgba(255, 255, 255, 0.9);
		}
	}
`;
