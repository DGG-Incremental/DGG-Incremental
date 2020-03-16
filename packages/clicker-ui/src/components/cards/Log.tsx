import React, { useRef, useEffect } from "react"
import moment from 'moment';
import styled from '@emotion/styled'
import { Card } from '../Card'
import { ReadFilled } from '@ant-design/icons'

import './Log.css'


const textLogEntry = ({ timestamp, text, className }: { timestamp: Date, text: string, className?: string }) => (
	<div className={"log-entry " + className}>
		<span className="log-entry__time">[{moment(timestamp).format("HH:mm:ss")}]</span>&nbsp;
		<span className="log-entry__text" dangerouslySetInnerHTML={{ __html: text }}></span>
	</div>
)

const TextLogEntry = styled(textLogEntry)`
  .log-entry__time {
    color: rgba(0,0,0,0.35);
  }
`

interface LogProps {
	entries: Array<{timestamp: Date, text: string}>
}
const Log = ({ entries }: LogProps) => {
	const logRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		// if (logRef && logRef.current) {
		//     let parent = logRef.current.parentNode as HTMLDivElement
		//     parent.scrollTop = parent.scrollHeight;
		//     // logRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
		//     console.log(logRef.current, logRef.current.offsetHeight);

		//     logRef.current.scrollIntoView({ block: 'end' })
		//     console.log(parent.scrollTop);
		// TODO Shouldn't have to use a timeout, but we do apparently
		setTimeout(() => {
			if (logRef && logRef.current) {
				let parent = logRef.current.parentNode as HTMLDivElement
				// if (parent.scrollTop === parent.scrollHeight) //TODO the log should only scroll to bottom when you're at the bottom
				parent.scrollTop = parent.scrollHeight;
			}
		}, 50)
		// }

	}, [entries])
	return (
		<Card title={<span><ReadFilled /> Log</span>}>
			<div className="card__body">
				{entries.map((entry, i) => <TextLogEntry key={i} {...entry} />)}
			</div>
		</Card>
	)
}
export default Log;