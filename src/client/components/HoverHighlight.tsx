import React from "react"
import styled from '@emotion/styled'
import classNames from 'classnames'

const HoverHighlight: React.SFC<{ className?: string, active?: boolean, onClick?: () => void }> = ({ className, children, active, onClick }) => (
  <span onClick={onClick} className={classNames("hover-highlight", className, { active })}>
    <div className="hover-highlight__content">{children}</div>
    <div className="hover-highlight__highlight">{children}</div>
  </span>
)

export default styled(HoverHighlight)`
  position: relative;
  display: inline-block;
  cursor: pointer;
  .hover-highlight__highlight {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 100%;
    overflow: hidden;
    transition: all 0.15s ease; /*cubic-bezier(.16,.2,.19,.91);*/
    background: var(--white);
    color: var(--black);
  }
  &:hover .hover-highlight__highlight {
    right: 0;
  }
  &.active .hover-highlight__highlight {
    right: 0;
  }
`