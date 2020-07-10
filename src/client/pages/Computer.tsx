import React, { useContext, useState } from "react";
import styled from "@emotion/styled";
import classNames from "classnames";
import { RouteComponentProps } from "@reach/router";

import { GameStateContext } from "../gameStateContext";
import { TimeSyncContext } from "../tick/TickContext";

import { Table } from "antd";
import TypeBox from "../components/TypeBox";

interface File {
	name: string;
	size: number;
	id: string;
}

interface Download extends File {
	downloaded: number;
	added: Date;
	status: "idle" | "downloading" | "completed";
}

interface FileEntry extends File {
	timestamp: Date;
}

interface Project {
	file: File;
	progress: number;
}

const Computer = ({ className }: { className?: string } & RouteComponentProps) => {
	const { game, setGame, currentState } = useContext(GameStateContext);
	const timeSync = useContext(TimeSyncContext);
	const now = new Date(timeSync.now());

	const [downloads, setDownloads] = useState<Download[]>([
		{ id: "a1b2c3", name: "test", size: 1024, downloaded: 0, status: "idle", added: new Date() },
		{ id: "d3g9s0", name: "foo", size: 51200, downloaded: 0, status: "idle", added: new Date(0) },
	]);

	const projects: Project[] = [
		{ file: { id: "d3g9s0", name: "Test Project", size: 51200 }, progress: 0 },
		{ file: { id: "l3f6g2", name: "Another Thing", size: 51200 }, progress: 25 },
	];

	return (
		<div className={classNames("computer", className)}>
			<div className="stats">
				<div className="bandwidth"></div>
				<div className="storage"></div>
			</div>
			<div className="downloads">
				<div className="title">Downloads</div>
				<Table<Download> dataSource={downloads} pagination={false} rowKey={(record) => record.id}>
					<Table.Column<Download>
						title="Name"
						key="name"
						dataIndex="name"
						showSorterTooltip={false}
						sorter={(a, b) => a.name.localeCompare(b.name)}
					/>
					<Table.Column<Download>
						title="Size"
						key="size"
						dataIndex="size"
						width="10%"
						showSorterTooltip={false}
						sorter={(a, b) => a.size - b.size}
					/>
					<Table.Column<Download>
						title="Added"
						key="added"
						dataIndex="added"
						width="200px"
						showSorterTooltip={false}
						render={(date) =>
							new Intl.DateTimeFormat("en-US", {
								year: "2-digit",
								month: "2-digit",
								day: "2-digit",
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
								hour12: false,
							}).format(date)
						}
						sorter={(a, b) => a.added.valueOf() - b.added.valueOf()}
					/>
				</Table>
			</div>
			<div className="code">
				<div className="title">Projects</div>
				<div className="projects">
					{projects.map((project, i) => (
						<div className="project" key={i}>
							<div className="project__name">{project.file.name}</div>
							<div className="project__progress">{project.progress}%</div>
							<div className="project__id">{project.file.id}</div>
						</div>
					))}
				</div>
				<div className="project-details">
					<TypeBox target="test sentence" />
				</div>
			</div>
		</div>
	);
};

export default styled(Computer)`
	background: var(--black);
	color: var(--white);
	font-family: "IBM Plex Mono", monospace;
	height: 100%;
	display: grid;
	grid-template-areas:
		"code  downloads"
		"stats stats";
	grid-template-columns: 1fr 1fr;
	grid-template-rows: 1fr 500px;
	gap: 20px;
	padding: 20px;
	.downloads {
		grid-area: downloads;
		position: relative;
		border: 2px solid var(--white);
	}
	.stats {
		grid-area: stats;
	}
	.code {
		grid-area: code;
		display: grid;
		grid-template-areas: "projects details";
		grid-template-columns: 2fr 5fr;
		position: relative;
		border: 2px solid var(--white);
	}
	.title {
		background: var(--black);
		position: absolute;
		top: -13px;
		left: 10px;
		padding: 0 5px;
	}
	.projects {
		grid-area: projects;
		padding: 12px;
		border-right: 2px solid var(--white);
	}
	.project-details {
		grid-area: details;
		padding: 12px;
	}
	.project {
		padding: 5px;
		cursor: pointer;
		display: grid;
		grid-template-areas:
			"name name"
			"progress id";
		grid-template-columns: 1fr auto;
	}
	.project__name {
		grid-area: name;
	}
	.project__progress {
		grid-area: progress;
	}
	.project__id {
		grid-area: id;
		opacity: 0.45;
	}
	.project:hover {
		background: var(--white);
		color: var(--black);
	}

	.ant-table {
		background: none;
		color: var(--white);
		font-family: "IBM Plex Mono", monospace;
	}
	.ant-table-thead th {
		background: none;
		color: var(--white);
		border: none;
		text-transform: uppercase;
	}
	.ant-table-column-sorters {
		padding: 10px;
	}
	.ant-table-tbody > tr > td {
		padding: 5px 10px;
		border: none;
		transition: background 0.08s ease, color 0.08s ease;
	}
	.ant-table-tbody > tr.ant-table-row:hover > td {
		color: var(--black);
	}
	.ant-table-column-sort {
		background: none;
	}
	.ant-table-thead th.ant-table-column-has-sorters:hover {
		background: none;
	}
	.ant-table-column-sort .ant-table-column-sorter-up.active,
	.ant-table-column-sorter-down.active {
		color: var(--white);
	}
	.ant-table-column-sort .ant-table-column-sorter-up:not(.active),
	.ant-table-column-sort .ant-table-column-sorter-down:not(.active) {
		opacity: 0;
	}
	tr.ant-table-expanded-row > td {
		background: none;
		color: var(--white);
		/* border-top: 2px solid var(--white); */
	}
`;
