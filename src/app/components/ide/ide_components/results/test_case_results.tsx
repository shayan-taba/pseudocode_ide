// TestCaseResult.tsx
import React from "react";
import SkeletonLoader from "./skeleton_loader";

const TestCaseResult: React.FC<{
  testCaseIndex: number;
  result: { 
    status: string; 
    actual: string[]; 
    expected: any; 
    input: any 
  };
  isLast: boolean;
}> = ({ testCaseIndex, result, isLast }) => {
  return (
    <div
      className={`border p-4 rounded-md mb-4 ${
        result.status === "passed"
          ? "border-green-500"
          : result.status === "failed"
          ? "border-red-500"
          : result.status === "syntax error"
          ? "border-yellow-500"
          : result.status === "runtime error"
          ? "border-blue-500"
          : "border-gray-300"
      }`}
    >
      <div className="font-bold">
        Test Case {testCaseIndex + 1}
        {isLast && <span className="text-gray-500 italic ml-2">(Hidden)</span>}
      </div>

      {result.status === "pending" ? (
        <SkeletonLoader />
      ) : (
        <>
          {!isLast && (
            <>
              <div className="mt-2">
                <span className="font-medium">Input:</span>{" "}
                <span className="text-gray-700">
                  {JSON.stringify(result.input)}
                </span>
              </div>
              <div className="mt-2">
                <span className="font-medium">Expected Output:</span>{" "}
                <span className="text-gray-700">
                  {JSON.stringify(result.expected)}
                </span>
              </div>
            </>
          )}

          <div className="mt-2">
            <span className="font-medium">Actual Output:</span>{" "}
            <span className="text-gray-700">
              {JSON.stringify(result.actual)}
            </span>
          </div>
          <div className="mt-2">
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`${
                result.status === "passed"
                  ? "text-green-500"
                  : result.status === "failed"
                  ? "text-red-500"
                  : result.status === "syntax error"
                  ? "text-yellow-500"
                  : "text-blue-500"
              }`}
            >
              {result.status}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default TestCaseResult;
