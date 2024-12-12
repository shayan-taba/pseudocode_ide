import React, { useState } from "react";
import SkeletonLoader from "./skeleton_loader";
import { TestResultType } from "../../ide";

const TestCaseResult: React.FC<{
  testCaseIndex: number;
  result: TestResultType;
  isLast: boolean;
}> = ({ testCaseIndex, result, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false); // For collapsing the input/expected output
  const [isHovered, setIsHovered] = useState(false); // For hover effects to show more details

  const handleExpandToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleHoverOut = () => {
    setIsHovered(false);
  };

  console.log(testCaseIndex);

  const getStatusClass = (typeClass: "border" | "text") => {
    switch (result.status) {
      case "Pass":
        return typeClass == "border" ? "border-green-300" : "text-green-300";
      case "Fail":
        return typeClass == "border" ? "border-red-300" : "text-red-300";
      case "Syntax Error":
        return typeClass == "border" ? "border-yellow-300" : "text-yellow-300";
      case "Runtime Error":
        return typeClass == "border" ? "border-yellow-300" : "text-yellow-300";
      case "Special Error":
        return typeClass == "border" ? "border-yellow-300" : "text-yellow-300";
      default:
        return typeClass == "border" ? "border-gray-300" : "text-gray-300";
    }
  };

  return (
    <div
      className={
        "border w-ma p-4 rounded-md mb-4" + " " + getStatusClass("border")
      }
    >
      <div className="font-bold underline underline-offset-3">
        {!isLast && `Test Case ${testCaseIndex + 1}`}
        {isLast && (
          <span className="">Test Case {testCaseIndex + 1} (Hidden Test Case)</span>
        )}
      </div>

      {result.status === "Pending" ? (
        <SkeletonLoader
          input={result.input}
          expected={result.expected}
          isLast={isLast}
        />
      ) : (
        <>
          <div className="mt-2 flex justify-between items-center">
            <div>
              <span className="font-bold">Status:</span>{" "}
              <span className={getStatusClass("text")}>{result.status}</span>
            </div>

            {/* Toggle button to expand/collapse details */}
            <button
              onClick={handleExpandToggle}
              className="text-lg underline text-blue-300 w-[30%] text-right"
            >
              {isExpanded ? "Hide Details" : "Show Details"}
            </button>
          </div>

          <div className={`mt-2 ${isExpanded ? "" : "hidden"}`}>
            {
              <>
                {isLast && (
                  <p className="text-justify">
                    The hidden test case is a special test case used to verify
                    your solution. Its input and expected output are not
                    displayed. You will only see whether your solution passes or
                    fails for this case, but not the specific values being
                    tested. This ensures a fair assessment of your code's
                    correctness.
                  </p>
                )}
                <div className="mt-2">
                  <span className="font-bold">Input:</span>{" "}
                  <span className="text-gray-300">
                    {!isLast &&
                      (JSON.stringify(result.input).length > 100
                        ? `${JSON.stringify(result.input).slice(0, 100)}...`
                        : JSON.stringify(result.input))}
                    {isLast && "hidden"}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="font-bold">Expected Output:</span>{" "}
                  <span className="text-gray-300">
                    {!isLast &&
                      (JSON.stringify(result.expected).length > 100
                        ? `${JSON.stringify(result.expected).slice(0, 100)}...`
                        : JSON.stringify(result.expected))}
                    {isLast && "hidden"}
                  </span>
                </div>
              </>
            }

            <div className="mt-2">
              <span className="font-bold">Actual Output:</span>{" "}
              <span className="text-gray-300">
                {!isLast &&
                  (JSON.stringify(result.actual).length > 100
                    ? `${JSON.stringify(result.actual[0]).slice(0, 100)}...`
                    : result.actual[0]
                    ? JSON.stringify(result.actual[0])
                    : "None")}
                {isLast && "hidden"}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TestCaseResult;
