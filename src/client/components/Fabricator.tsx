import React, { useState } from "react";
import styled from "@emotion/styled";
import classNames from "classnames";

import { keyframes } from "@emotion/core";

const Fabricator = ({
	className,
	active,
	progress,
}: {
	className?: string;
	active?: boolean;
	progress?: number;
}) => {
	return (
		<div className={classNames("fabricator", className, { active })}>
			<div className="housing">
				<div className="item-container">
					<div className="item" style={{ height: (progress || 0) + "%" }}></div>
				</div>
				<div className="actuator" style={{ bottom: ((progress || 0) * 0.85 + 3 || "3") + "%" }}>
					<div className="extruder"></div>
				</div>
			</div>
			<div className="base"></div>
		</div>
	);
};

const print = keyframes`
  from, to {
    left: 5%;
  }
  50% {
    left: 95%;
  }
`;

export default styled(Fabricator)`
	display: inline-block;
	cursor: pointer;
	.housing {
		width: 100px;
		height: 100px;
		box-sizing: border-box;
		border: var(--black) 2px solid;
		position: relative;
		display: grid;
		padding: 15% 6% 0% 6%;
	}
	.base {
		width: 100%;
		height: 20px;
		background: var(--black);
	}
	.item {
		overflow: hidden;
		align-self: end;
	}
	.actuator {
		height: 2px;
		left: 0;
		right: 0;
		position: absolute;
		background: var(--black);
	}
	.extruder {
		background: var(--black);
		width: 4px;
		height: 8px;
		position: absolute;
		left: 5%;
		bottom: -1px;
		transform: translateX(-50%);
		animation: ${print} 1s ease infinite paused;
	}
	.extruder:after {
		content: "";
		position: absolute;
		bottom: -2px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 2px solid transparent;
		border-right: 2px solid transparent;
		border-top: 2px solid var(--black);
	}
	&.active .extruder {
		animation-play-state: running;
	}
	&:hover .item-container {
		background: #1111;
	}
`;
