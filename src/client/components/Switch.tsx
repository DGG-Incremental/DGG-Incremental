import React, { useContext, useState } from "react"
import { Switch as AntSwitch } from 'antd';
import styled from '@emotion/styled'

export const Switch = styled(AntSwitch)`
  border-radius: 0;
  background: var(--white);
  &:after {
    border-radius: 0;
    background: var(--black);
  }
  .ant-switch-inner {
    color: var(--black);
  }
`