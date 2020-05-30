import React, { useRef, useEffect } from "react";
import moment from "moment";
import styled from "@emotion/styled";

const textLogEntry = ({ timestamp, text, className }: { timestamp: Date; text: string; className?: string }) => (
  <div className={"log-entry " + className}>
    <span className="log-entry__time">[{moment(timestamp).format("HH:mm:ss")}]</span>&nbsp;
    <span className="log-entry__text" dangerouslySetInnerHTML={{ __html: text }}></span>
  </div>
);

const TextLogEntry = styled(textLogEntry)`
  .log-entry__time {
    color: rgba(0, 0, 0, 0.35);
  }
`;

interface LogProps {
  entries: Array<{ timestamp: Date; text: string }>;
}
const Log = ({ entries }: LogProps) => {
  const logRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(() => {
      if (logRef && logRef.current) {
        let parent = logRef.current.parentNode as HTMLDivElement;
        parent.scrollTop = parent.scrollHeight;
      }
    }, 50);
  }, [entries]);
  return (
    <div className="card__body">
      {entries.map((entry, i) => (
        <TextLogEntry key={i} {...entry} />
      ))}
    </div>
  );
};

export default styled(Log)`
  .log__timestamp {
    margin-right: 5px;
    color: #9a9a9a;
  }

  .log__entries {
    padding: 5px 10px 15px 10px;
  }
`;
