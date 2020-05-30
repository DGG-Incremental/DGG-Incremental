import React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/core";
import classNames from "classnames";

const reveal = keyframes`
  0% {
    right: calc(100% + 3px);
    left: -3px;
  }

  50% {
    right: -3px;
    left: -3px;
  }

  100% {
    left: calc(100% + 3px);
    right: -3px;
  }
`;
const reveal_content = keyframes`
  0% {
    opacity: 0;
    pointer-events: none;
  }

  49% {
    opacity: 0;
    pointer-events: none;
  }

  50% {
    opacity: 1;
    pointer-events: auto;
  }

  100% {
    opacity: 1;
    pointer-events: auto;
  }
`;

interface ElementSpawnProps {
  state?: "idle" | "spawn" | "spawned";
  delay?: number;
  className?: string;
  blockContent?: boolean;
}

const ElementSpawn: React.SFC<ElementSpawnProps> = ({ className, children, state = "idle" }) =>
  state === "spawned" ? (
    <div className={classNames("text-spawn", className, state)}>{children}</div>
  ) : (
    <div className={classNames("text-spawn", className, state)}>
      <div className="text-spawn__content">{children}</div>
      <div className="text-spawn__cover"></div>
    </div>
  );

export default styled<React.SFC, ElementSpawnProps>(ElementSpawn)`
  position: relative;
  display: ${({ blockContent }) => (blockContent ? "block" : "inline-block")};
  .text-spawn__content {
    opacity: 0;
    pointer-events: none;
  }
  .text-spawn__cover {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 100%;
    overflow: hidden;
    background: var(--black);
  }
  &.spawn .text-spawn__cover {
    animation: ${reveal} 1.1s cubic-bezier(0.74, 0.01, 0.28, 1) forwards;
    animation-delay: ${({ delay }) => delay || 0}s;
  }
  &.spawn .text-spawn__content {
    animation: ${reveal_content} 1.1s cubic-bezier(0.74, 0.01, 0.28, 1) forwards;
    animation-delay: ${({ delay }) => delay || 0}s;
  }
`;
