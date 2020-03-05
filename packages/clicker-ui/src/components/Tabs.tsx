import React from "react"
import { Tabs as AntTabs } from 'antd';
import styled from '@emotion/styled'

export const Tabs = styled(AntTabs)`
  .ant-tabs-nav-wrap {
    background: var(--black);
    color: var(--white);
    padding: 0 20px;
    text-transform: uppercase;
    font-weight: 300;
  }
  .ant-tabs-bar {
    border: none;
  }
  .ant-tabs-nav .ant-tabs-tab-active {
    color: var(--white);
    font-weight: 300;
  }
  .ant-tabs-ink-bar {
    background-color: var(--white);
    height: 6px;
  }
  .ant-tabs-large-bar .ant-tabs-tab {
    padding: 10px 0;
  }
  .ant-tabs-nav .ant-tabs-tab:hover {
    color: currentColor;
  }
`


export const TabPane = AntTabs.TabPane