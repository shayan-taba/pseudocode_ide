import React from "react";
import SkeletonLoader from "./skeleton_loader";
import { TestResultType } from "../../ide";

const TestCaseResult: React.FC<{
  testCaseIndex: number;
  result:TestResultType;
  isLast: boolean;
}> = ({ testCaseIndex, result, isLast }) => {
  const getStatusClass = () => {
    switch (result.status) {
      case "Pass":
        return "border-green-500 text-green-500";
      case "Fail":
        return "border-red-500 text-red-500";
      case "Syntax Error":
        return "border-yellow-500 text-yellow-500";
      case "Runtime Error":
        return "border-blue-500 text-blue-500";
      default:
        return "border-gray-300 text-gray-500";
    }
  };

  return (
    <div
      className={`border p-4 rounded-md mb-4 ${getStatusClass()}`}
    >
      <div className="font-bold">
        Test Case {testCaseIndex + 1}
        {isLast && <span className="text-gray-500 italic ml-2">(Hidden)</span>}
      </div>

      {result.status === "Pending" ? (
        <SkeletonLoader />
      ) : (
        <>
          {!isLast && (
            <>
              <div className="mt-2">
                <span className="font-medium">Input:</span>{" "}
                <code className="text-gray-700">
                  {JSON.stringify(result.input)}
                </code>
              </div>
              <div className="mt-2">
                <span className="font-medium">Expected Output:</span>{" "}
                <code className="text-gray-700">
                  {JSON.stringify(result.expected)}
                </code>
              </div>
            </>
          )}

          <div className="mt-2">
            <span className="font-medium">Actual Output:</span>{" "}
            <code className="text-gray-700">
              {JSON.stringify(result.actual)}
            </code>
          </div>
          <div className="mt-2">
            <span className="font-medium">Status:</span>{" "}
            <span className={getStatusClass()}>{result.status}</span>
          </div>
        </>
      )}
    </div>
  );
};

export default TestCaseResult;
