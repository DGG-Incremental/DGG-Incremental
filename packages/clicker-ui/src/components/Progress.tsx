import React from "react"
import { Progress as AntProgress } from 'antd';
import styled from '@emotion/styled'

export const Progress = styled(AntProgress)`
  .ant-progress-inner {
    border-radius: 0;
  }
  .ant-progress-success-bg, .ant-progress-bg {
    border-radius: 0;
    background-color: var(--black);
  }
`