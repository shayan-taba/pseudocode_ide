// components/Output.tsx
import React, { Dispatch, SetStateAction, useState } from "react";

import {
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CommandLineIcon,
  CheckCircleIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";

interface ResultsProps {
  width: string;
  output: string[];
  isComplete: boolean;
  onClearOutput: () => void;
  expandResults: boolean;
  setExpandResults: Dispatch<React.SetStateAction<boolean>>;
  resultState: "outcome" | "output";
  toggleResultsState: () => void;
}

const Results: React.FC<ResultsProps> = ({
  width,
  output,
  isComplete,
  resultState,
  toggleResultsState,
  setExpandResults,
  expandResults,
  onClearOutput,
}) => {
  console.log(output);
  return (
    <div
      className={`container-els ${!expandResults ? "h-[100%]" : ""} ${width}`}
    >
      <div className="container-headings text-fuchsia-400">
        <div className="container-nav-box">
          <div
            className={`container-navs ${
              resultState !== "outcome" ? "inactive" : ""
            }`}
            onClick={toggleResultsState}
          >
            <h1>Outcome</h1>
            <CheckCircleIcon className="nav-icons" />
          </div>
          <div
            className={`container-navs ${
              resultState !== "output" ? "inactive" : ""
            }`}
            onClick={toggleResultsState}
          >
            <h1>Output</h1>
            <CommandLineIcon className="nav-icons" />
          </div>
        </div>
        <div className="container-utils-box">
          {resultState == "output" ? (
            <button onClick={onClearOutput} className={`nav-btns px-3 bg-rose-600 hover:bg-rose-700`}>
              <TrashIcon className="nav-icons" />
              Clear
            </button>
          ) : (
            ""
          )}
          <button
            onClick={() => setExpandResults(!expandResults)}
            className={`nav-btns`}
          >
            {expandResults ? (
              <ArrowsPointingOutIcon className="nav-icons" />
            ) : (
              <ArrowsPointingInIcon className="nav-icons" />
            )}
          </button>
        </div>
      </div>

      <div className="container-body">
        {resultState == "output" && (
          <>
            <pre
              className="text-white bg-zinc-950 p-2 scrollable-container rounded max-h-[275px] min-h-8"
              style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            >
              {output.join("\n")}
            </pre>
            {!isComplete && (
              <p className="text-yellow-200 mt-1">
                Waiting for Execution Completion
              </p>
            )}
            {isComplete &&
              (output.join("\n").includes("Code executed successfully.") ? (
                <p className="text-green-200 mt-1">Execution Completed</p>
              ) : (
                <p className="text-red-200 mt-1">
                  Error on Conversion to Python
                </p>
              ))}
          </>
        )}
        {resultState == "outcome" && <div></div>}
      </div>
    </div>
  );
};

export default Results;
