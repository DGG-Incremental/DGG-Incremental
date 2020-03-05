import React from "react"
import styled from '@emotion/styled'

const hoverHighlight: React.SFC<{className?: string}> = ({ className, children }) => (
  <div className={"hover-highlight " + className}>
    <div className="hover-highlight__content">{children}</div>
    <div className="hover-highlight__highlight">{children}</div>
  </div>
)



export const HoverHighlight = styled(hoverHighlight)`
  position: relative;
  .hover-highlight__highlight {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 100%;
    overflow: hidden;
    transition: right 0.15s ease; /*cubic-bezier(.16,.2,.19,.91);*/
    background: var(--white);
    color: var(--black);
  }
  &:hover .hover-highlight__highlight {
    right: 0;
  }
`