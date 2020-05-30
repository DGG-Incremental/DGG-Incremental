import React from "react"
import styled from '@emotion/styled'
import { keyframes, css } from '@emotion/core'
import classNames from 'classnames'

const LoadingBoxes: React.SFC<{className?: string, style?: object}> = ({className, style}) => (
  <span className={classNames("loading-boxes", className)} style={style}>
    <div className="loading-box"></div>
    <div className="loading-box"></div>
    <div className="loading-box"></div>
    <div className="loading-box"></div>
  </span>
)

const shrink = keyframes`
  0% {
    transform: scale(1)
  }
  5% {
    transform: scale(1)
  }
  15% {
    transform: scale(0.5)
  }
  35% {
    transform: scale(0.5)
  }
  45% {
    transform: scale(1)
  }
  50% {
    transform: scale(1)
  }
`

export default styled(LoadingBoxes)`
  display: inline-grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
  justify-items: center;
  align-items: center;
  width: 16px;
  height: 16px;
  vertical-align: 0.4em;
  .loading-box {
    width: 8px;
    height: 8px;
    background: var(--white);
    overflow: hidden;
  }
  .loading-box:nth-of-type(1) {
    animation: ${shrink} 4s ease infinite;
  }
  .loading-box:nth-of-type(2) {
    animation: ${shrink} 4s 0.25s ease infinite;
  }
  .loading-box:nth-of-type(4) {
    animation: ${shrink} 4s 0.5s ease infinite;
  }
  .loading-box:nth-of-type(3) {
    animation: ${shrink} 4s 0.75s ease infinite;
  }
`
