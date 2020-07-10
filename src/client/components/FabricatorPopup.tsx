import React from "react";
import { Popover } from "antd";
import { Blueprint } from "@game";
import styled from "@emotion/styled";

const FabricatorPopup: React.FC<{ blueprint: Blueprint; className?: string }> = ({
	blueprint,
	children,
	className,
}) => (
	<Popover
		placement="topLeft"
		align={{ offset: [0, 3] }}
		title={`Fabricate ${blueprint.name}`}
		overlayClassName={"fab-popup " + className}
		content={
			<div className="fab-popup__fabricators">
				{[...new Array(3)].map((_, i) => (
					<div className="fab-icon" key={i}>
						<div
							className="fab-icon__progress"
							style={{ top: `calc(${100 - 30 * i}% + 2px)` }}
						></div>
					</div>
				))}
			</div>
		}
	>
		{children}
	</Popover>
);

export default styled(FabricatorPopup)`
	.ant-popover-title {
		font-family: "IBM Plex Mono", monospace;
		background: var(--black);
		color: var(--white);
		text-transform: uppercase;
		padding: 3px 10px;
		min-height: auto;
	}
	.ant-popover-inner-content {
		padding: 6px 8px;
	}
	.fab-popup__fabricators {
		display: flex;
	}
	.fab-icon {
		width: 20px;
		height: 20px;
		border: 2px solid var(--black);
		padding: 2px;
		margin-right: 8px;
		position: relative;
	}
	.fab-icon__progress {
		background: var(--black);
		left: 2px;
		right: 2px;
		bottom: 2px;
		position: absolute;
	}
`;
