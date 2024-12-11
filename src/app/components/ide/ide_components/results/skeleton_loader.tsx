import React from "react";

const SkeletonLoader: React.FC<{ input: any; expected: any; isLast: any }> = ({
  input,
  expected,
  isLast,
}) => (
  <div className="mt-2">
    <div className="flex items-center space-x-2 mb-2">
      {/* Status Section with Skeleton Loader */}
      <span className="font-bold">Status:</span>
      {/* Pulse animated skeleton */}
      <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
    </div>

    {false && // This is effectively being commented out and not displayed
      <>
        <div className="mt-2">
          {/* Input Section */}
          <span className="font-bold">Input:</span>{" "}
          <span className="text-gray-300">
            {!isLast
              ? JSON.stringify(input).length > 100
                ? `${JSON.stringify(input).slice(0, 100)}...`
                : JSON.stringify(input)
              : "hidden"}
          </span>
        </div>
        <div className="mt-2">
          {/* Expected Output Section */}
          <span className="font-bold">Expected Output:</span>{" "}
          <span className="text-gray-300">
            {!isLast
              ? JSON.stringify(expected).length > 100
                ? `${JSON.stringify(expected).slice(0, 100)}...`
                : JSON.stringify(expected)
              : "hidden"}
          </span>
        </div>
        <div className="mt-2">
          {/* Actual Output Section with Skeleton Loader */}
          <span className="font-bold">Actual Output:</span>{" "}
          <span className="text-gray-300">
            {!isLast ? (
              // Pulse skeleton loader
              <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
            ) : (
              "hidden"
            )}
          </span>
        </div>
        {/* Hidden Test Case Description */}
        {isLast && (
          <div className="mt-2 text-sm text-gray-500">
            The hidden test case is a special test case used to verify your
            solution. Its input and expected output are not displayed. You will
            only see whether your solution passes or fails for this case, but
            not the specific values being tested. This ensures a fair assessment
            of your code's correctness.
          </div>
        )}{" "}
      </>
    }
  </div>
);

export default SkeletonLoader;
