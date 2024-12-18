// components/Output.tsx
import React, { Dispatch, useEffect, useRef } from "react";

import {
  TrashIcon,
  CommandLineIcon,
  CheckCircleIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";
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
              <div className="text-red-300 w-[100%] items-center flex flex-row gap-2 font-bold">
                Overall Status: Error
                {/*<ExclamationCircleIcon className="h-5 w-5 mr-2" />*/}{" "}
              </div>
              <span className="text-red-300">
                Syntax or runtime errors occurred on at least one &quot;Test
                Case&quot;. Check the output console for details on the error
                and to see on which Test Case(s) this occurred.
                <br />
                <br />
                Refer to the{" "}
                <Link
                  className="text-blue-300 underline hover:text-blue-500"
                  href={"/documentation"}
                >
                  Documentation
                </Link>{" "}
                to understand the potential runtime and syntax errors.
              </span>
            </>
          )}
          {hasMismatch && (
            <>
              <div className="text-yellow-300 w-[100%] items-center flex flex-row gap-2 font-bold">
                Overall Status: Fail
                {/*<XCircleIcon className="h-5 w-5 mr-2" />*/}{" "}
              </div>
              <span className="text-yellow-300">
                No errors occurred, but the output wasn&apos;t expected on at
                least one &quot;Test Case&quot;. Click on &quot;Show
                Details&quot; for further information in any of the failed
                &quot;Test Cases&quot; below.
              </span>
            </>
          )}
          {!allPassed && !hasErrors && !hasMismatch && (
            <p className="text-lg font-bold">
              Run your code to see the results below. For more information, go
              to <em>"output"</em>.
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
              className="text-white bg-zinc-950 p-2 scrollable-container rounded min-h-8"
              style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            >
              {output.join("\n")}
            </pre>
            {!isComplete && (
              <p className="text-yellow-200">
                Waiting for Execution Completion - either no output has been
                given or the code hasn't been run.
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
                testInputsTypes={testInputsTypes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
