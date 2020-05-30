import React from "react"
import { Button as AntButton } from 'antd';
import styled from '@emotion/styled'


export const Button = styled(AntButton)`
  border-radius: 0;
  &.ant-btn-primary {
    background-color: var(--black);
    border-color: var(--black);
  }
`