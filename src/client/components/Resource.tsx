import React from "react";
import styled from "@emotion/styled";
import classNames from "classnames";

import { Tooltip } from "antd";

interface ResourceProps {
	className?: string;
	name: string;
	shortname: string;
	count: number;
	icon: string;
}

const Resource = ({ className, name, shortname, count, icon }: ResourceProps) => {
	return (
		<Tooltip title={name}>
			<div className={classNames("resource", className)}>
				<div className="resource__shortname">{shortname}</div>
				<div className="resource__count">{count}</div>
				<img src={icon} alt="" />
			</div>
		</Tooltip>
	);
};

export default styled(Resource)`
	border: 2px var(--black) solid;
	margin: 8px;
	position: relative;
	font-family: "IBM Plex Mono", monospace;
	color: var(--black);
	padding: 15px;
	.resource__count {
		position: absolute;
		bottom: -7px;
		left: 50%;
		transform: translateX(-50%);
		padding: 0 3px;
		line-height: 16px;
		background: #e9e8e6;
		/* font-size: 1.25em; */
		/* background: #f00; */
	}
	.resource__shortname {
		background: var(--black);
		color: var(--white);
		position: absolute;
		top: 0px;
		left: 0px;
		padding: 0 4px 0 3px;
		z-index: 10;
		border: 3px solid #e9e8e6;
		border-top: 0;
		border-left: 0;
	}
`;
