// Firstly, this component displays the results of each test-case.
// It has logical code to assess the overal status (e.g., pass, fail, error) from the test-cases.
// If users pass the challenge, it updates the local browser-storage.
// It also invokes componenets used to display each test-case.
// Secondly, this component allows users to view the raw command-line output of the Python-executed code of each test-case.
// This enable users to identify specific runtime/syntax errors and raw-outputs provided each test-case.
// In doing so, this component allows users to switch between viewing both functions.

import React, { Dispatch, use, useEffect, useRef, useState } from "react";

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
  output: string[];
  isComplete: boolean;
  onClearOutput: () => void;
  expandResults: boolean;
  setExpandResults: Dispatch<React.SetStateAction<boolean>>;
  resultState: "outcome" | "output";
  toggleResultsState: () => void;
  testResults: TestResultType[];
  setCompleteStatus: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  testInputsTypes: {
    name: string;
    type: string;
  }[];
}

const getStatusIcon = (status: string) => {
  if (status === "Pass")
    return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
  if (status.startsWith("Fail"))
    return <XCircleIcon className="h-5 w-5 text-yellow-200" />;
  if (status.includes("Error"))
    return <ExclamationCircleIcon className="h-5 w-5 text-red-300" />;
  return <ClockIcon className="h-5 w-5 text-gray-300 animate-pulse" />;
};

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

  useEffect(() => {
    if (preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [output, resultState]); // Runs whenever "output", "resultState" changes

  useEffect(() => {
    const allPassed = testResults.every((result) => result.status === "Pass");

    // Update localStorage with the completion status
    if (allPassed) {
      const saveResultStatus = (challengeId: number) => {
        // Check for the challenge ID in localStorage
        const key = `challenge-${challengeId}`;
        const existingData = localStorage.getItem(key);

        let updatedData = { status: allPassed, points: true }; // Sets to true

        if (existingData) {
          try {
            // Parse and update existing data
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

        // Save back to localStorage
        localStorage.setItem(key, JSON.stringify(updatedData));
      };

      saveResultStatus(id);

      setCompleteStatus(true);
    } else {
      setCompleteStatus(false);
    }
  }, [testResults, id]);

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
            {/*<span>Overall Outcome: </span>*/}
            <span>
              {
                allPassed
                  ? "Pass"
                  : hasErrors
                  ? "Error"
                  : hasMismatch
                  ? "Fail"
                  : null /*"Results"*/
              }
            </span>
          </div>
          <div className="text-sm">
            {allPassed && (
              <>
                All tests passed! ({passCount} test{passCount > 1 ? "s" : ""}{" "}
                passed)
              </>
            )}
            {hasErrors && (
              <>
                Syntax or runtime errors occurred in {errorCount} test case
                {errorCount > 1 ? "s" : ""}. Check the console for further
                details.
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
                {failCount} test case{failCount > 1 ? "s" : ""} did not match
                the expected result, or had multiple outputs. Click on test
                cases below for details.
              </>
            )}
            {!allPassed &&
              !hasErrors &&
              !hasMismatch &&
              "Run your code to see the results below."}
          </div>
        </div>
      </>
    );
  };

  const [errorCount, setErrorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const errorCases = testResults.filter((r) =>
      r.status.includes("Error")
    ).length;
    const hasPending = testResults.some((r) => r.status === "Pending");

    setErrorCount(errorCases);
    setIsLoading(output.length > 0 && hasPending);
  }, [testResults, output]);

  return (
    <div
      className={`container-els ${!expandResults ? "h-[100%]" : ""} ${width}`}
    >
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
          {resultState == "output" ? (
            <button
              onClick={onClearOutput}
              className={`nav-btns px-3 bg-rose-600 hover:bg-rose-700`}
            >
              <TrashIcon className="nav-icons" />
              <p className="hideSmallScreen">Clear</p>
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
            {
              isComplete && (
                <p className="text-green-200">Execution Completed</p>
              )
              /*(output.join("\n").includes("Code executed successfully.") ? (
                <p className="text-green-200">Execution Completed</p>
              ) : (
                <p className="text-red-200">Error on Conversion to Python</p>
              ))*/
            }
          </>
        )}
        {resultState == "outcome" && (
          <div className="mb-4 scrollable-container pr-4">
            <div>{summarizeTestResults()}</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {testResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    result.status.includes("Error") ? /*"animate-bounce"*/ "" : ""
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
