// This component displays the results of individual test cases and allows the user
// to toggle between viewing the test results and raw command-line output from the Python-executed code.
// It assesses the overall status (Pass, Fail, Error) of the test cases and updates the local storage if all tests pass.
// Additionally, it provides a detailed view of each test case's execution output and the associated runtime/syntax errors.

import React, { Dispatch, useEffect, useRef, useState } from "react";

import {
  TrashIcon,
  CheckCircleIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import {
  CheckCircleIcon as CheckCircleIconOutline,
  CommandLineIcon,
} from "@heroicons/react/24/outline";
import TestCaseResult from "./test_case_results";
import { TestResultType } from "../../ide";
import Link from "next/link";

interface ResultsProps {
  id: number;
  width: string;
  output: string[]; // Stores the raw output of the Python code
  isComplete: boolean; // Indicates whether the execution is completed
  onClearOutput: () => void; // Function to clear the output view
  expandResults: boolean; // Determines if the results should be expanded
  setExpandResults: Dispatch<React.SetStateAction<boolean>>; // Function to toggle expand results state
  resultState: "outcome" | "output"; // Tracks whether the results or output are currently visible
  toggleResultsState: () => void; // Toggles between outcome and output views
  testResults: TestResultType[]; // List of results for each individual test case
  setCompleteStatus: React.Dispatch<React.SetStateAction<boolean | undefined>>; // Updates the completion status of the test cases
  testInputsTypes: {
    name: string;
    type: string;
  }[]; // Defines the input types for each test case
}

// Helper function to determine the status icon based on the result status
const getStatusIcon = (status: string) => {
  if (status === "Pass") return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
  if (status.startsWith("Fail")) return <XCircleIcon className="h-5 w-5 text-yellow-200" />;
  if (status.includes("Error")) return <ExclamationCircleIcon className="h-5 w-5 text-red-300" />;
  return <ClockIcon className="h-5 w-5 text-gray-300 animate-pulse" />;
};

// Main component displaying results and raw output of test cases
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
  testInputsTypes,
}) => {
  const preRef = useRef<HTMLPreElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Scroll to the latest output when it changes
  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [output, resultState]);

  // Update the completion status and save to localStorage if all tests pass
  useEffect(() => {
    const allPassed = testResults.every((result) => result.status === "Pass");

    if (allPassed) {
      const saveResultStatus = (challengeId: number) => {
        const key = `challenge-${challengeId}`;
        const existingData = localStorage.getItem(key);

        let updatedData = { status: allPassed, points: true };

        if (existingData) {
          try {
            const parsedData = JSON.parse(existingData);
            updatedData = {
              ...parsedData,
              status: allPassed,
              points: parsedData && !parsedData.hintUsed ? true : false,
            };
          } catch (err) {
            console.error("Error parsing localStorage data: ", err);
          }
        }

        localStorage.setItem(key, JSON.stringify(updatedData));
      };

      saveResultStatus(id);
      setCompleteStatus(true);
    } else {
      setCompleteStatus(false);
    }
  }, [testResults, id]);

  // Summarizes the results by calculating counts for passes, failures, and errors
  const summarizeTestResults = () => {
    const passCount = testResults.filter(
      (result) => result.status === "Pass"
    ).length;
    const errorCount = testResults.filter((result) =>
      result.status.includes("Error")
    ).length;
    const failCount = testResults.filter(
      (result) =>
        (result.status === "Fail" && result.actual !== result.expected) ||
        result.status === "Fail (Multiple Outputs)"
    ).length;

    const allPassed = passCount === testResults.length;
    const hasErrors = errorCount > 0;
    const hasMismatch = failCount > 0;

    return (
      <>
        <div
          className={`p-4 rounded-xl mb-4 ring-1 ring-inset ${
            allPassed
              ? "bg-green-900/30 text-green-200 ring-green-600/40"
              : hasErrors
              ? "bg-red-900/30 text-red-200 ring-red-600/40"
              : hasMismatch
              ? "bg-yellow-900/30 text-yellow-200 ring-yellow-600/40"
              : "bg-slate-800 text-slate-100 ring-slate-600/30"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-lg mb-1">
            {allPassed && <CheckCircleIcon className="h-5 w-5" />}
            {hasErrors && <ExclamationCircleIcon className="h-5 w-5" />}
            {hasMismatch && <XCircleIcon className="h-5 w-5" />}
            <span>
              {allPassed
                ? "Pass"
                : hasErrors
                ? "Error"
                : hasMismatch
                ? "Fail"
                : null}
            </span>
          </div>
          <div className="text-sm">
            {allPassed && (
              <>
                All tests passed! ({passCount} test{passCount > 1 ? "s" : ""} passed)
              </>
            )}
            {hasErrors && (
              <>
                Syntax or runtime errors occurred in {errorCount} test case{errorCount > 1 ? "s" : ""}.
                <br />
                Refer to the{" "}
                <Link
                  className="text-blue-300 underline hover:text-blue-500 transition-colors"
                  href="/documentation"
                >
                  Documentation
                </Link>
                .
              </>
            )}
            {hasMismatch && (
              <>
                {failCount} test case{failCount > 1 ? "s" : ""} did not match the expected result.
              </>
            )}
            {!allPassed && !hasErrors && !hasMismatch && "Run your code to see the results below."}
          </div>
        </div>
      </>
    );
  };

  // Tracks error count and loading state for the output section
  const [errorCount, setErrorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const errorCases = testResults.filter((r) => r.status.includes("Error")).length;
    const hasPending = testResults.some((r) => r.status === "Pending");

    setErrorCount(errorCases);
    setIsLoading(output.length > 0 && hasPending);
  }, [testResults, output]);

  return (
    <div className={`container-els ${!expandResults ? "h-[100%]" : ""} ${width}`}>
      <div className="container-headings text-violet-400">
        <div className="container-nav-box">
          <div
            className={`container-navs ${
              resultState !== "outcome" ? "inactive" : ""
            }`}
            onClick={toggleResultsState}
          >
            <h1>Results</h1>
            <CheckCircleIconOutline className="nav-icons" />
          </div>
          <div
            className={`container-navs ${
              resultState !== "output" ? "inactive" : ""
            } relative`}
            onClick={toggleResultsState}
          >
            <h1>Output</h1>
            <CommandLineIcon className="nav-icons" />
            {isLoading && (
              <span className="absolute top-[0%] left-[110%]">
                <ClockIcon className="h-4 w-4 text-yellow-400 animate-pulse" />
              </span>
            )}
            {errorCount > 0 && !isLoading && (
              <span className="absolute top-[0%] left-[110%] bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {errorCount}
              </span>
            )}
          </div>
        </div>
        <div className="container-utils-box">
          {resultState === "output" && (
            <button
              onClick={onClearOutput}
              className={`nav-btns px-3 bg-rose-600 hover:bg-rose-700`}
            >
              <TrashIcon className="nav-icons" />
              <p className="hideSmallScreen">Clear</p>
            </button>
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
        {resultState === "output" && (
          <>
            <pre
              ref={preRef}
              className="text-white bg-slate-950 p-2 scrollable-container rounded min-h-8"
              style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            >
              {output.join("\n")}
            </pre>
            {!isComplete && (
              <>
                <p>
                  Waiting for execution to complete. Possible reasons include:
                </p>
                <ul className="list-disc list-inside">
                  <li>The code has not been run.</li>
                  <li>No pseudocode was provided.</li>
                  <li>The pseudcode contains an infinite loop.</li>
                </ul>
              </>
            )}
            {isComplete && <p className="text-green-200">Execution Completed</p>}
          </>
        )}
        {resultState === "outcome" && (
          <div className="mb-4 scrollable-container pr-4">
            <div>{summarizeTestResults()}</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {testResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    result.status.includes("Error") ? "" : ""
                  }
                  ${
                    selectedIndex === index
                      ? "bg-violet-500 text-white"
                      : "bg-slate-700 text-zinc-300 hover:bg-slate-600"
                  }`}
                >
                  {getStatusIcon(result.status)}
                  {index === testResults.length - 1
                    ? "Hidden Test Case"
                    : `Test Case ${index + 1}`}
                </button>
              ))}
            </div>

            <div className="w-full">
              <TestCaseResult
                testCaseIndex={selectedIndex}
                result={testResults[selectedIndex]}
                isLast={selectedIndex === testResults.length - 1}
                testInputsTypes={testInputsTypes}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
