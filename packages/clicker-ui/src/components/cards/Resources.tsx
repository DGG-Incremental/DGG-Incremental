import React, { useContext } from "react"
import styled from '@emotion/styled'
import { Card } from '../Card'
import { LayoutFilled } from '@ant-design/icons'

import './Resources.css'

import { GameStateContext } from "../../gameStateContext"
import { TimeSyncContext } from "../../tick/TickContext"


const resource: React.SFC<{ resource: string, count: number, unit: string, className?: string }> = ({ resource, count, unit, className }) => (
  <tr className={className}>
    <td>{resource}:</td>
    <td>{count}{unit}</td>
    <td></td>
  </tr>
)
const Resource = styled(resource)`
    
  `

interface ResourcesProps {
}
const Resources = ({ }: ResourcesProps) => {
  const { game, setGame, currentState } = useContext(GameStateContext)
  const timeSync = useContext(TimeSyncContext)

  return (
    <Card title={<span><LayoutFilled /> Resources</span>}>
      <div className="card__body">
        <table className="resources__table">
          <tbody>
            <Resource resource='Scrap' count={currentState.scrap} unit="g" />
            <Resource resource='Food' count={currentState.food} unit="g" />
          </tbody>
        </table>
      </div>
    </Card>
  )
}
export default Resources