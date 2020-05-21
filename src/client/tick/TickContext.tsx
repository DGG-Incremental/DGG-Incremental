import useInterval from "@use-it/interval"
import toInteger from "lodash/toInteger"
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  PropsWithChildren,
  useEffect
} from "react"
import { create as TimeSync } from "timesync"

export const TimeSyncContext = createContext(TimeSync({ server: "/timesync" }))
export const TickContext = createContext(Date.now())

export const TickProvider = ({ children }: PropsWithChildren<{}>) => {
  const [tick, setTick] = useState(Date.now())
  const timesync = useContext(TimeSyncContext)

  useInterval(() => {
    setTick(timesync.now())
  }, 100)

  useEffect(() => {
    timesync.sync()
  }, [])

  // Sometimes the ticks are decimals and for simplicity, keep them ints
  const wholeTick = toInteger(tick)
  return (
    <TickContext.Provider value={wholeTick}>{children}</TickContext.Provider>
  )
}
