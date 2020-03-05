import React from "react"
import { Card as AntCard } from 'antd';
import styled from '@emotion/styled'

export const Card = styled(AntCard)`
  box-shadow: var(--grey) 5px 5px;
  border-radius: 0;
  .ant-card-head {
    min-height: auto;
    background: var(--black);
    color: var(--white);
    text-transform: uppercase;
    font-weight: 300;
    padding: 0 15px;
  }
  .ant-card-head-title {
    padding: 5px 0;
  }
  .ant-card-body {
    padding: 0;
  }
  .ant-card-head {
    border-radius: 0;
  }
`