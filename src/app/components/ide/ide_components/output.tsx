// components/Output.tsx
import React from "react";

import "../ide_styles.css";

interface OutputProps {
  output: string[];
  userInput: string;
  waitingForInput: boolean;
  isComplete: boolean;
  outputWidth: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendInput: () => void;
}

const Output: React.FC<OutputProps> = ({
  output,
  userInput,
  waitingForInput,
  isComplete,
  outputWidth,
  onInputChange,
  onSendInput,
}) => {
  return (
    <>
      <div
        className={`outline-1 outline outline-gray-300 flex flex-col bg-slate-800 p-5 ${outputWidth}`}
      >
        <h2 className="text-xl font-bold mb-2">Raw Output</h2>
        <pre
          className="text-white bg-gray-900 p-2 scrollable-container rounded overflow-auto max-h-[33%]"
          style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
        >
          {output.join("\n")}
        </pre>
        {waitingForInput && (
          <div className="mt-4">
            <input
              type="text"
              value={userInput}
              onChange={onInputChange}
              placeholder="Enter input"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={onSendInput}
              className="w-full mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
            >
              Submit Input
            </button>
          </div>
        )}
        {isComplete && output.join("\n").includes("Code executed successfully.") && (
          <p className="text-green-200 mt-4">Execution Completed</p>
        )}
        {!isComplete && (
          <p className="text-yellow-200 mt-4">Waiting for Execution Completion</p>
        )}
        {isComplete && !output.join("\n").includes("Code executed successfully.") && (
          <p className="text-red-200 mt-4">Error on Conversion to Python</p>
        )}
        <h2 className="text-xl font-bold mb-2">Output Checks</h2>
      </div>
    </>
  );
};

export default Output;
