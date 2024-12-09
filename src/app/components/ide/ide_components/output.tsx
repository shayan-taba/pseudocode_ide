// components/Output.tsx
import React from "react";

import "../ide_styles.css"

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
        className={`outline-2 outline outline-gray-300 flex flex-col bg-gray-800 p-5 ${outputWidth}`}
      >
        <h2 className="text-xl font-bold mb-2">Raw Output</h2>
        <pre
          className="text-white p-4 scrollable-container rounded overflow-auto max-h-[33%]"
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
        {isComplete && (
          <p className="text-green-200 mt-4">Execution Completed</p>
        )}
      </div>
      
    </>
  );
};

export default Output;
