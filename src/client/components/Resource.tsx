import React from "react";
import styled from "@emotion/styled";
import classNames from "classnames";

import { Tooltip } from "antd";

interface ResourceProps {
  className?: string;
  name: string;
  shortname: string;
  count: number;
  icon: string;
}

const Resource = ({ className, name, shortname, count, icon }: ResourceProps) => {
  return (
    <Tooltip title={name}>
      <div className={classNames("resource", className)}>
        <div className="resource__shortname">{shortname}</div>
        <div className="resource__count">{count}</div>
      </div>
    </Tooltip>
  );
};

export default styled(Resource)`
  border: 2px var(--black) solid;
  margin: 8px;
  position: relative;
  font-family: "IBM Plex Mono", monospace;
  color: var(--black);
  .resource__count {
    position: absolute;
    bottom: -7px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 4px;
    background: #e9e8e6;
    /* background: #f00; */
  }
  .resource__shortname {
    background: var(--black);
    color: var(--white);
    position: absolute;
    top: -2px;
    left: -1px;
    padding: 0 3px;
  }
`;
