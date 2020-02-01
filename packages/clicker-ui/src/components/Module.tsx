import React, { FunctionComponent } from "react"
import { Event, EventType } from "clicker-game"
import moment from 'moment';

import './Module.css'

interface ModuleProps {
    className: string
    title: string
}
export const Module: FunctionComponent<ModuleProps> = ({ className, title, children }) => {
    return (
        <div className={"module " + className}>
            <h2>{title}</h2>
            <div className="module__content">{children}</div>
        </div>
    )
}
export default Module;