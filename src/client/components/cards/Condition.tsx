import React from "react"
import { Card } from '../Card'
import { Progress } from '../Progress'
import { SmileFilled, MehFilled, FrownFilled  } from '@ant-design/icons'

import './Condition.css'

interface ConditionProps {
  hunger: number,
}
const Condition = ({ hunger }: ConditionProps) => {
  return (
    <Card title={<span>{hunger > 0.3 ? hunger > 0.7 ? <SmileFilled /> : <MehFilled /> : <FrownFilled />} Condition</span>}>
      <div className="card__body">
        <h4>Hunger</h4>
        <Progress percent={hunger * 100} />
      </div>
    </Card>
  )
}
export default Condition;