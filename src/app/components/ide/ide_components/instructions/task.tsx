import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { TestResultType } from "../../ide";

interface TaskProps {
  id: number; // Task ID to fetch the completion status
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  testCases: { input: string; output: string }[]; // Test case structure
  inputType: any;
  outputType: any;
  inputName: string;
  testResults: TestResultType[];
  completeStatus: boolean | undefined;
}

const Task: React.FC<TaskProps> = ({
  id,
  title,
  description,
  tags,
  difficulty,
  testCases,
  inputType,
  outputType,
  inputName,
  testResults,
  completeStatus,
}) => {
  const [completionStatus, setCompletionStatus] = useState<{
    status: boolean;
    message: string;
  }>({ status: false, message: "Not Complete" });

  useEffect(() => {
    // Function to get the completion status from localStorage
    const fetchCompletionStatus = () => {
      const storedData = localStorage.getItem(`challenge-${id}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setCompletionStatus({
          status: parsedData.status,
          message: parsedData.status ? "Complete" : "Not Complete",
        });
      }
    };

    fetchCompletionStatus();
  },[completeStatus]);

  return (
    <div>
      <h2 className="text-4xl font-bold mb-4">{title}</h2>

      {/* Completion Status */}
      <div className="flex items-center gap-2 mb-4">
        {completionStatus.status ? (
          <CheckCircleIcon className="h-6 w-6 text-green-300" />
        ) : (
          <ExclamationCircleIcon className="h-6 w-6 text-red-300" />
        )}
        <span
          className={`text-lg font-medium ${
            completionStatus.status ? "text-green-300" : "text-red-300"
          }`}
        >
          Status: {completionStatus.message}
        </span>
      </div>

      <h3 className="text-2xl font-semibold mb-2">Task</h3>
      <p className="text-base mb-4">{description}</p>

      {/* Tags and Difficulty */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-sm font-semibold bg-blue-500 rounded-full"
          >
            {tag}
          </span>
        ))}
        <span
          key={difficulty}
          className="px-3 py-1 text-sm font-semibold bg-purple-500 rounded-full"
        >
          Difficulty: {difficulty}
        </span>
      </div>

      {/* Instructions */}
      <div className="mb-4">
        <h3 className="text-2xl font-semibold mb-3">Instructions</h3>
        <ul className="list-disc list-inside text-base space-y-2">
          <li>Enter your pseudocode in the editor.</li>
          <li>
            Access the input for each test case using the variable{" "}
            <code className="bg-slate-700 px-1 py-0.5 rounded">
              {inputName}
            </code>
            .
          </li>
          <li>
            Ensure your code outputs the result using{" "}
            <code className="bg-slate-700 px-1 py-0.5 rounded">output</code>.
          </li>
          <li>
            Once ready, press <strong>Run Code</strong> to execute your code and
            view results in the Outcome/Output panel.
          </li>
        </ul>
      </div>

      <h3 className="text-2xl font-semibold mb-2">Input and Output Types</h3>
      <div className="bg-slate-700 p-4 border rounded-xl mb-4">
        <p className="text-sm mb-2">
          <strong>Input Type:</strong>{" "}
          <span className="text-blue-300">{inputType}</span>
        </p>
        <p className="text-sm">
          <strong>Output Type:</strong>{" "}
          <span className="text-purple-300">{outputType}</span>
        </p>
        <p className="text-sm mt-2 text-gray-200">
          Note: Each "Test Case" follows the <strong>Input Type</strong> format,
          and your solution's output is validated against the{" "}
          <strong>Expected Output</strong>.
        </p>
      </div>

      {testCases.length > 0 && (
        <>
          <h3 className="text-2xl font-semibold mb-2 ">Example Test Case</h3>
          <div className="bg-slate-700 p-4 border rounded-2xl mb-4 shadow-sm">
            <p className="text-sm mb-2">
              <strong>Input:</strong>{" "}
              <span className="text-blue-300">
                {JSON.stringify(testCases[0].input)}
              </span>
            </p>
            <p className="text-sm">
              <strong>Expected Output:</strong>{" "}
              <span className="text-purple-300">
                {JSON.stringify(testCases[0].output)}
              </span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Task;
