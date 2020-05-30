import React from 'react';
import styled from '@emotion/styled'
import classNames from 'classnames'

interface PowerProps {
  className?: string
  columns: number
  maxPower: number
  powerAllocation: {
    label: string
    usage: number
    color: string
  }[]
}
const Power = ({ className, columns, maxPower, powerAllocation }: PowerProps) => {
  return (
    <div className={classNames("power-indicator", className)}>
      {powerAllocation.map(allocation => [...new Array(allocation.usage)].map((pip, i) => <div key={allocation.label + i} className="power-pip" style={{background: allocation.color}}></div>))}
      {/* {[...new Array(maxPower / columns)].map(row => 
        [...new Array(columns)].map(col => <div key={row + ',' + col} className="power-pip"></div>))} */}
    </div>
  );
}

export default styled(Power)`
  border: 2px solid var(--black);
  padding: 4px;
  /* height: 100%; */
  height:  ${props => 11 * props.maxPower / props.columns}px;
  width: 100px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap-reverse;
  align-content: flex-start;
  flex-direction: row-reverse;
  .power-pip {
    width: ${props => 1 / props.columns * 100}%;
    /* padding-bottom: ${props => 1 / props.columns * 100}%; */
    height:  11px;
    transition: all 0.15s ease;
  }
  /* grid-template-columns: repeat(${(props => props.columns)}, 1fr);
  grid-template-rows: repeat(auto-fill, 11px); */
`