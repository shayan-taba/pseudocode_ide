import React from "react";

const SkeletonLoader: React.FC<{ input: any; expected: any; isLast: boolean }> = ({
  input,
  expected,
  isLast,
}) => {
  const skeletonBar = "h-4 bg-gray-600 animate-pulse rounded";

  return (
    <>
      <div className="mt-2 flex justify-between items-center">
        <div>
          <span className="font-bold">Outcome:</span>{" "}
          <span className="text-gray-400 animate-pulse">Waiting...</span>
        </div>
        <div
          role="status"
          className="w-6 h-6 text-gray-200 animate-spin fill-gray-600 dark:text-gray-600 dark:fill-gray-300"
        >
       
          <span className="sr-only">Loading...</span>
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
            {/* Input row */}
            <tr>
              <td className="border border-gray-700 px-3 py-2 align-top">Input</td>
              <td className="border border-gray-700 px-3 py-2">
                {isLast ? (
                  "Hidden"
                ) : (
                  <div className="space-y-1">
                    {input.map((_val: any, i: number) => (
                      <div key={i} className={skeletonBar + " w-48"} />
                    ))}
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
                {isLast ? "Hidden" : <div className={skeletonBar + " w-48"} />}
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
                {isLast ? "Hidden" : <div className={skeletonBar + " w-48"} />}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isLast && (
        <div className="mt-2 text-sm text-gray-500">
          The hidden test case is a special test case used to verify your
          solution. Its input and expected output are not displayed. You will
          only see whether your solution passes or fails for this case, but
          not the specific values being tested. This ensures a fair assessment
          of your code&apos;s correctness.
        </div>
      )}
    </>
  );
};

export default SkeletonLoader;
