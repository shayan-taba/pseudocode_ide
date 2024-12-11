// components/Output.tsx
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CommandLineIcon,
  CheckCircleIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";
import TestCaseResult from "./test_case_results";
import { TestResultType } from "../../ide";

interface ResultsProps {
  width: string;
  output: string[];
  isComplete: boolean;
  onClearOutput: () => void;
  expandResults: boolean;
  setExpandResults: Dispatch<React.SetStateAction<boolean>>;
  resultState: "outcome" | "output";
  toggleResultsState: () => void;
  testResults: TestResultType[];
  testCases: { input: any; output: any }[];
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
  testResults,
}) => {
  const preRef = useRef<HTMLPreElement>(null);

  console.log("here", testResults);
  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [output, resultState]); // Runs whenever "output", "resultState" changes

  const summarizeTestResults = () => {
    const allPassed = testResults.every((result) => result.status === "Pass");
    const hasErrors = testResults.some(
      (result) =>
        result.status.includes("Error") ||
        result.status === "Fail (Multiple Outputs)"
    );
    const hasMismatch = testResults.some(
      (result) => result.status === "Fail" && result.actual !== result.expected
    );

    if (allPassed) {
      return <span className="text-green-300">All tests passed!</span>;
    } else if (hasErrors) {
      return (
        <span className="text-red-300">
          Syntax or runtime errors occurred on at least one "Test Case". Check the
          output console for details on the error and to see on which Test
          Case(s) this occurred.
        </span>
      );
    } else if (hasMismatch) {
      return (
        <span className="text-yellow-300">
          No errors occurred, but the output wasn't expected on at least one
          "Test Case". Click on "Show Details" for further information in any of
          the failed "Test Cases" below.
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className={`container-els ${!expandResults ? "h-[100%]" : ""} ${width}`}
    >
      <div className="container-headings text-purple-400">
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
            <button
              onClick={onClearOutput}
              className={`nav-btns px-3 bg-rose-600 hover:bg-rose-700`}
            >
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
              ref={preRef}
              className="text-white bg-zinc-950 p-2 scrollable-container rounded min-h-8"
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
        {resultState == "outcome" && (
          <div className="pr-4 rounded-md scrollable-container">
            <div className="summary mb-4 text-lg">{summarizeTestResults()}</div>
            {testResults.map((result, index) => (
              <TestCaseResult
                key={index}
                testCaseIndex={index}
                result={result}
                isLast={index === testResults.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
