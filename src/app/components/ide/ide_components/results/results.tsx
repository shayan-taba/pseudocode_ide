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
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import TestCaseResult from "./test_case_results";
import { TestResultType } from "../../ide";
import { consoleLight } from "@uiw/codemirror-themes-all";

interface ResultsProps {
  id: number;
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
  setCompleteStatus: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

const Results: React.FC<ResultsProps> = ({
  id,
  width,
  output,
  isComplete,
  resultState,
  toggleResultsState,
  setExpandResults,
  expandResults,
  onClearOutput,
  testResults,
  setCompleteStatus,
}) => {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [output, resultState]); // Runs whenever "output", "resultState" changes

  useEffect(() => {
    console.log("setting local data to pass");
    const allPassed = testResults.every((result) => result.status === "Pass");

    // Update localStorage with the completion status
    if (allPassed) {
      localStorage.setItem(
        `challenge-${id}`,
        JSON.stringify({ status: allPassed })
      );
      setCompleteStatus(true);
    } else {
      setCompleteStatus(false);
    }
  }, [testResults, id]);

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

    return (
      <>
        <div className="flex flex-col">
          {allPassed && (
            <>
              <div className="text-green-300 w-[100%] items-center flex flex-row gap-2 font-bold">
                Overall Status: Pass
                {/*<CheckCircleIcon className="h-5 w-5 mr-2" />*/}{" "}
              </div>
              <span className="text-green-300">All tests passed!</span>
            </>
          )}

          {hasErrors && (
            <>
              <div className="text-yellow-300 w-[100%] items-center flex flex-row gap-2 font-bold">
                Overall Status: Error
                {/*<ExclamationCircleIcon className="h-5 w-5 mr-2" />*/}{" "}
              </div>
              <span className="text-yellow-300">
                Syntax or runtime errors occurred on at least one "Test Case".
                Check the output console for details on the error and to see on
                which Test Case(s) this occurred.
              </span>
            </>
          )}
          {hasMismatch && (
            <>
              <div className="text-red-300 w-[100%] items-center flex flex-row gap-2 font-bold">
                Overall Status: Fail
                {/*<XCircleIcon className="h-5 w-5 mr-2" />*/}{" "}
              </div>
              <span className="text-red-300">
                No errors occurred, but the output wasn't expected on at least
                one "Test Case". Click on "Show Details" for further information
                in any of the failed "Test Cases" below.
              </span>
            </>
          )}
          {!allPassed && !hasErrors && !hasMismatch && (
            <p className="text-lg font-bold">
              Run your code to see the results below.
            </p>
          )}
        </div>
      </>
    );
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
              <p className="text-yellow-200">
                Waiting for Execution Completion
              </p>
            )}
            {isComplete &&
              (output.join("\n").includes("Code executed successfully.") ? (
                <p className="text-green-200">Execution Completed</p>
              ) : (
                <p className="text-red-200">Error on Conversion to Python</p>
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
