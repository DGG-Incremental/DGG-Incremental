import React from "react"
import styled from '@emotion/styled'
import { Card } from '../Card'
import { LayoutFilled } from '@ant-design/icons'

import './Resources.css'




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
  scrap: number,
  food: number,
}
const Resources = ({ scrap, food }: ResourcesProps) => {
  return (
    <Card title={<span><LayoutFilled /> Resources</span>}>
      <div className="card__body">
        <table className="resources__table">
          <tbody>
            <Resource resource={'Scrap'} count={scrap} unit="g" />
            <Resource resource={'Food'} count={food} unit="g" />
          </tbody>
        </table>
      </div>
    </Card>
  )
}
export default Resources;