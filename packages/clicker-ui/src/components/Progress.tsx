import React from "react"
import { Progress as AntProgress } from 'antd';
import { ProgressProps } from 'antd/es/progress'
import styled from '@emotion/styled'
import { keyframes, css } from '@emotion/core'

interface AnimatedProgressProps extends ProgressProps {
  animated?: boolean
}
const AnimatedProgress = ({ animated, ...other }: AnimatedProgressProps) => <AntProgress {...other} />

const stripes = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 30px 0;
  }
`

export const Progress = styled(AnimatedProgress)`
  .ant-progress-inner {
    border-radius: 0;
    background-color: rgba(0,0,0,0.05)
  }
  .ant-progress-success-bg, .ant-progress-bg {
    border-radius: 0;
    background-color: var(--black);
  }
  ${props => props.animated ? css`
    .ant-progress-bg {
      animation: ${stripes} .4s linear infinite reverse;
      background: linear-gradient(-45deg, rgba(0,0,0,.75) 25%, rgba(0,0,0,0.65) 0,rgba(0,0,0,0.65) 50%, rgba(0,0,0,.75) 0, rgba(0,0,0,.75) 75%, rgba(0,0,0,0.65) 0);
      background-size: 30px 30px;
    }
  ` : ''}
`;