import React, { useContext, useState } from "react"
import { Switch as AntSwitch } from 'antd';
import styled from '@emotion/styled'

export const Switch = styled(AntSwitch)`
  border-radius: 0;
  &:after {
    border-radius: 0;
  }
`