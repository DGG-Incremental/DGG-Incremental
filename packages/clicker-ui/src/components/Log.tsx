import React, { useRef, useEffect } from "react"
// import { Event, EventType } from "clicker-game"
import moment from 'moment';

import './Log.css'
import Module from './Module'

declare global {
    interface Window { test: any; }
}

window.test = window.test || {};

interface LogProps {
    entries: Array<Event>
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
        <Module className="log" title="Text Log">
            <div ref={logRef} className="log__entries">
                {entries.map((entry, i) => (
                    <div className="log__entry" key={i}>
                        {/* <span className="log__timestamp">[{moment(entry.timestamp).format("HH:mm:ss")}]</span>
                        <span className="log__text"
                            dangerouslySetInnerHTML={{
                                __html: entry.text
                            }}></span> */}
                    </div>
                ))}
            </div>
        </Module>
    )
}
export default Log;