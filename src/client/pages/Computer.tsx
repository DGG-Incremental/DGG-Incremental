import React, { useContext, useState, useEffect } from "react";
import styled from "@emotion/styled";
import classNames from "classnames";
import { RouteComponentProps } from "@reach/router";
import moment from "moment";

import { GameStateContext } from "../gameStateContext";
import { TimeSyncContext } from "../tick/TickContext";

import { Table } from "antd";

interface File {
	name: string;
	size: number;
}

interface Download extends File {
	downloaded: number;
	added: Date;
	status: "idle" | "downloading" | "completed";
}

interface FileEntry extends File {
	timestamp: Date;
}

const Computer = ({ className }: { className?: string } & RouteComponentProps) => {
	const { game, setGame, currentState } = useContext(GameStateContext);
	const timeSync = useContext(TimeSyncContext);
	const now = new Date(timeSync.now());

	const [downloads, setDownloads] = useState<(Download & { key: number })[]>([
		{ key: 1, name: "test", size: 1024, downloaded: 0, status: "idle", added: new Date() },
		{ key: 2, name: "foo", size: 51200, downloaded: 0, status: "idle", added: new Date(0) },
	]);
	const [harddrive, setHarddrive] = useState<(FileEntry & { key: number })[]>([
		{ key: 1, name: "bar", size: 128, timestamp: new Date() },
		{ key: 2, name: "floop", size: 8192, timestamp: new Date(0) },
	]);

	return (
		<div className={classNames("computer", className)}>
			<div className="stats">
				<div className="bandwidth"></div>
				<div className="storage"></div>
			</div>
			<div className="downloads">
				<Table<Download> dataSource={downloads} pagination={false}>
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
						render={(text, record, index) => moment(text).format("MM/DD/YY HH:MM:SS")}
						sorter={(a, b) => a.added.valueOf() - b.added.valueOf()}
					/>
				</Table>
			</div>
			{/* <div className="harddrive">
				<Table<FileEntry>
					dataSource={harddrive}
					pagination={false}
					expandable={{
						expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.name}</p>,
					}}
				>
					<Table.Column<FileEntry>
						title="Name"
						key="name"
						dataIndex="name"
						showSorterTooltip={false}
						sorter={(a, b) => a.name.localeCompare(b.name)}
					/>
					<Table.Column<FileEntry>
						title="Size"
						key="size"
						dataIndex="size"
						width="10%"
						showSorterTooltip={false}
						sorter={(a, b) => a.size - b.size}
					/>
					<Table.Column<FileEntry>
						title="Timestamp"
						key="timestamp"
						dataIndex="timestamp"
						width="15%"
						showSorterTooltip={false}
						render={(text, record, index) => moment(text).format("MM/DD/YY HH:MM:SS")}
						sorter={(a, b) => a.timestamp.valueOf() - b.timestamp.valueOf()}
					/>
				</Table>
			</div> */}
			<div className="code">
				<div className="projects"></div>
				<div className="project-details"></div>
			</div>
		</div>
	);
};

export default styled(Computer)`
	background: var(--black);
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
	}
	.stats {
		grid-area: stats;
	}
	.code {
		grid-area: code;
		display: grid;
		grid-template-areas: "projects details";
		grid-template-columns: 2fr 5fr;
	}
	.projects {
		grid-area: projects;
	}
	.project-details {
		grid-area: details;
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
