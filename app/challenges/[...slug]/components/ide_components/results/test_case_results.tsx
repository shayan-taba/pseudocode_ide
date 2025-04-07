import React, { useState } from "react";
import SkeletonLoader from "./skeleton_loader";
import { TestResultType } from "../../ide";

const TestCaseResult: React.FC<{
  testCaseIndex: number;
  result: TestResultType;
  isLast: boolean;
  testInputsTypes: {
    name: string;
    type: string;
  }[];
}> = ({ testCaseIndex, result, isLast, testInputsTypes }) => {
  const getStatusClass = (typeClass: "border" | "text") => {
    switch (result.status) {
      case "Pass":
        return typeClass == "border" ? "border-green-300" : "text-green-300";
      case "Fail":
        return typeClass == "border" ? "border-yellow-300" : "text-yellow-300";
      case "Fail (Multiple Outputs)":
        return typeClass == "border" ? "border-yellow-300" : "text-yellow-300";
      case "Syntax Error":
        return typeClass == "border" ? "border-red-300" : "text-red-300";
      case "Runtime Error":
        return typeClass == "border" ? "border-red-300" : "text-red-300";
      case "Special Error":
        return typeClass == "border" ? "border-red-300" : "text-red-300";
      default:
        return typeClass == "border" ? "border-gray-300" : "text-gray-300";
    }
  };

  return (
    <div
      className={"border p-4 rounded-md mb-4" + " " + getStatusClass("border")}
    >
      <div className="font-bold underline underline-offset-3">
        {!isLast && `Test Case ${testCaseIndex + 1}`}
        {isLast && (
          <span className="">
            Test Case {testCaseIndex + 1} (Hidden Test Case)
          </span>
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
              <span className="font-bold">Outcome:</span>{" "}
              <span className={getStatusClass("text")}>{result.status}</span>
            </div>
          </div>

          <div className="mt-2 overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse border border-gray-700 text-sm text-gray-300">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 px-3 py-2">Field</th>
                  <th className="border border-gray-700 px-3 py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                {/* Input row(s) */}
                <tr>
                  <td className="border border-gray-700 px-3 py-2 align-top">
                    Input
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {isLast ? (
                      "Hidden"
                    ) : (
                      <div className="space-y-1">
                        {result.input.map((inputValue, index) => {
                          const variable = testInputsTypes[index];
                          return (
                            <div key={index}>
                              <span className="font-medium text-blue-300">
                                {variable.name}
                              </span>
                              {" = "}
                              {inputValue}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </td>
                </tr>

                {/* Expected Output */}
                <tr>
                  <td className="border border-gray-700 px-3 py-2">
                    Expected
                    <br />
                    Output
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {isLast
                      ? "Hidden"
                      : JSON.stringify(result.expected).length > 100
                      ? `${JSON.stringify(result.expected).slice(0, 100)}...`
                      : JSON.stringify(result.expected)}
                  </td>
                </tr>

                {/* Actual Output */}
                <tr>
                  <td className="border border-gray-700 px-3 py-2">
                    Actual
                    <br />
                    Output
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {isLast
                      ? "Hidden"
                      : result.actual[0]
                      ? JSON.stringify(result.actual[0]).length > 100
                        ? `${JSON.stringify(result.actual[0]).slice(0, 100)}...`
                        : JSON.stringify(result.actual[0])
                      : "None"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TestCaseResult;
