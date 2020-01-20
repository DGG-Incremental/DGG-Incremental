import React, { createContext, useState, ReactNode, useContext, ReactElement } from "react"
import {create as TimeSync} from "timesync"
import useInterval from "@use-it/interval"
console.log({TimeSync})

export const TimeSyncContext = createContext(TimeSync({ server: "/timesync" }))
export const TickContext = createContext(Date.now())

interface Props {
  children(tick: number): ReactNode
}
export const TickProvider = ({ children }: Props) => {

  const [tick, setTick] = useState(Date.now())
  const timesync = useContext(TimeSyncContext)

  useInterval(() => {
    setTick(timesync.now())
  }, 100)

  return children(tick) as ReactElement<any>
}
