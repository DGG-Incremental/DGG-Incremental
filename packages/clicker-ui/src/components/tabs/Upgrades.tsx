import React from "react"
import styled from '@emotion/styled'
import classNames from 'classnames'
import { Upgrade as UpgradeInterface } from 'clicker-game/lib/upgrades'
import { Card } from '../Card'
import { RadioButton, RadioGroup } from '../Radio'

import { Empty } from 'antd'
import { AppstoreAddOutlined, GroupOutlined, UnorderedListOutlined, AppstoreFilled } from '@ant-design/icons'


function canAfford(playerResources: { name: string, count: number }[], cost: { resource: string, count: number } ) {
  let resource = playerResources.find(r => r.name === cost.resource);
  if (resource) {
    return resource.count < cost.count
  } else {
    return false;
  }
}

interface UpgradeDisplayInterface {
  name: string,
  description: string,
  cost: { resource: string, count: number }[],
  playerResources: { name: string, count: number }[],
  className?: string,
  purchaseUpgrade?: () => void
}
const upgrade = ({ name, description, cost, playerResources, className, purchaseUpgrade }: UpgradeDisplayInterface) => {
  const costAfford = cost.map(c => Object.assign({ afford: canAfford(playerResources, c) }, c))
  return (
    <div className={"upgrade " + className} onClick={purchaseUpgrade}>
      <h3 className="upgrade__name">{name}</h3>
      <div className="upgrade__description">{description}</div>
      <div className="upgrade__costs">{
        costAfford.map(c => <div className="upgrade__cost">
          <span className="cost__resource">{c.resource}</span>:
          <span className={classNames("cost__count", { "cant-afford": c.afford })}>{c.count}</span>
        </div>)
      }</div>
    </div>
  )
}

const Upgrade = styled(upgrade)`
    background: var(--white);
    margin: 10px;
    padding: 15px;
    border: var(--off-white) 1px solid;
    box-shadow: var(--grey) 0 0 0 0;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: pointer;
    &:hover {
      transform: translate(-5px, -5px);
      box-shadow: var(--grey) 5px 5px 0 0;
    }
    .cant-afford {
      color: #f35;
    }
  `

interface UpgradesProps {
  upgrades: UpgradeInterface[],
  playerResources: { name: string, count: number }[],
}
const Upgrades = ({ upgrades, playerResources }: UpgradesProps) => {
  return (
    <div className="upgrades" style={{ padding: '20px' }}>
      <Card headStyle={{ fontSize: '18px' }} style={{ marginBottom: '20px' }} title={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flex: 1 }}><AppstoreAddOutlined /> Construct Upgrades</span>
          <RadioGroup defaultValue="grid">
            <RadioButton value="list"><UnorderedListOutlined /></RadioButton>
            <RadioButton value="grid"><AppstoreFilled /></RadioButton>
          </RadioGroup>
        </span>}>
        <div className="upgrades__list">
          {upgrades.filter(u => !u.owned).length === 0 ?
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
            upgrades.filter(u => !u.owned).map((upgrade, i) => <Upgrade key={i} {...upgrade} playerResources={playerResources} />)}
        </div>
      </Card>
      <Card headStyle={{ fontSize: '18px' }} title={<span><GroupOutlined /> Owned Upgrades</span>}>
        <div className="upgrades__list">
          {upgrades.filter(u => u.owned).length === 0 ?
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
            upgrades.filter(u => u.owned).map((upgrade, i) => <Upgrade key={i} {...upgrade} playerResources={playerResources} />)}
        </div>
      </Card>
    </div>
  )
}
export default Upgrades;