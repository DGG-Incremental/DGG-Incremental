import React from "react"
import styled from '@emotion/styled'
import { Upgrade as UpgradeInterface } from 'clicker-game/lib/upgrades'
import { Card } from '../Card'

import { Empty } from 'antd'
import { AppstoreAddOutlined, GroupOutlined } from '@ant-design/icons'

const upgrade = ({ name, info, className, purchaseUpgrade }: { name: string, info: string, className?: string, purchaseUpgrade?: () => void }) => (
  <div className={"upgrade " + className} onClick={purchaseUpgrade}>
    <h3 className="upgrade__name">{name}</h3>
    <div className="upgrade__info">{info}</div>
  </div>
)

const Upgrade = styled(upgrade)`
    background: var(--white);
    margin: 10px;
    padding: 15px;
    box-shadow: var(--grey) 5px 5px 0 0;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: pointer;
    &:hover {
      transform: translate(-5px, -5px);
      box-shadow: var(--grey) 10px 10px 0 0;
    }
  `

interface UpgradesProps {
  upgrades: UpgradeInterface[],
}
const Upgrades = ({ upgrades }: UpgradesProps) => {
  return (
    <div className="upgrades" style={{ padding: '20px' }}>
      <Card headStyle={{ fontSize: '18px' }} style={{ marginBottom: '20px' }} title={<span><AppstoreAddOutlined /> Construct Upgrades</span>}>
        <div className="upgrades__list">
          {upgrades.filter(u => !u.owned).length === 0 ?
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
            upgrades.filter(u => !u.owned).map((upgrade, i) => <Upgrade key={i} name={upgrade.name} info={upgrade.description} />)}
        </div>
      </Card>
      <Card headStyle={{ fontSize: '18px' }} title={<span><GroupOutlined /> Owned Upgrades</span>}>
        <div className="upgrades__list">
          {upgrades.filter(u => u.owned).length === 0 ?
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
            upgrades.filter(u => u.owned).map((upgrade, i) => <Upgrade key={i} name={upgrade.name} info={upgrade.description} />)}
        </div>
      </Card>
    </div>
  )
}
export default Upgrades;