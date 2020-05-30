import React, { useContext, useState } from "react"
import { Radio as AntRadio } from 'antd';
import styled from '@emotion/styled'

export const RadioGroup = styled(AntRadio.Group)`
  .ant-radio-button-wrapper {
    border-radius: 0;
    border-color: var(--white);
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    background: var(--black);
    color: var(--white);
    border: 1px solid var(--white);
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
    background-color: var(--white);
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within {
    box-shadow: none;
  }
`

export const RadioButton = styled(AntRadio.Button)`
  
`