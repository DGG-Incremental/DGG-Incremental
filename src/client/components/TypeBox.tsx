import React, { useState, useEffect, useContext } from "react";
import styled from "@emotion/styled";
import classNames from "classnames";

interface gradedChar {
	char: string;
	incorrect: boolean;
}

const TypeBox = ({ className, target }: { className?: string; target?: string }) => {
	const [gradedInput, setGradedInput] = useState<gradedChar[]>();
	const [input, setInput] = useState<string>("");

	useEffect(() => {
		setGradedInput(gradeInput(input));
	}, [input]);

	const gradeInput = (input: string) => {
		return input.split("").map((char, i) => ({ char, incorrect: char !== target?.charAt(i) }));
	};

	return (
		<div className={classNames("type-box", className)}>
			<div className="target">{target}</div>
			<div className="input">
				<input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
				<div className="graded-input">
					{gradedInput?.map(({ char, incorrect }, i) => (
						<span key={i} className={classNames({ incorrect })}>
							{char}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default styled(TypeBox)`
	span.incorrect {
		background: #ff1100;
	}
	input {
		font-family: inherit;
		border: none;
		font-size: inherit;
		/* color: #0000; */
		padding: 0;
		width: 100%;
		caret-color: var(--black);
	}
	.input {
		position: relative;
	}
	.graded-input {
		position: absolute;
		top: 0;
		color: var(--black);
		display: flex;
		span {
			width: 1ch;
		}
		span:after {
			content: ".";
			visibility: hidden;
		}
	}
`;
