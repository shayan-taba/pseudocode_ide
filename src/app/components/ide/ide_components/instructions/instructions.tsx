// components/TaskDescription.tsx

import {
  HomeIcon,
  EyeSlashIcon,
  EyeIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";

import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

interface InstructionsProps {
  width: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  testCases: { input: string; output: string }[]; // Test case structure
  expandInstructions: boolean;
  setExpandInstructions: Dispatch<React.SetStateAction<boolean>>;
  instructionState: "task" | "solution";
  toggleInstructionState: () => void;
  inputType: any;
  outputType: any;
}

const Instructions: React.FC<InstructionsProps> = ({
  width,
  title,
  description,
  tags,
  difficulty,
  testCases,
  expandInstructions,
  setExpandInstructions,
  instructionState,
  toggleInstructionState,
  inputType,
  outputType,
}) => {
  const router = useRouter();

  return (
    <div className={`container-els divider ${width}`}>
      <div className="container-headings text-blue-400">
        <div className="container-nav-box">
          <div
            className={`container-navs ${
              instructionState != "task" ? "inactive" : ""
            }`}
            onClick={toggleInstructionState}
          >
            <h1>Task</h1>
            <BookOpenIcon className="nav-icons" />
          </div>
          <div
            className={`container-navs ${
              instructionState != "solution" ? "inactive" : ""
            }`}
            onClick={toggleInstructionState}
          >
            <h1>Solution</h1>
            <DocumentTextIcon className="nav-icons" />
          </div>
        </div>
        <div className="container-utils-box">
          <button
            onClick={() => setExpandInstructions(!expandInstructions)}
            className={`nav-btns`}
          >
            {expandInstructions ? (
              <ArrowsPointingOutIcon className="nav-icons" />
            ) : (
              <ArrowsPointingInIcon className="nav-icons" />
            )}
          </button>
        </div>
      </div>
      <div className={`container-body scrollable-container`}>
        {instructionState == "task" && (
          <div>
            <h2 className="text-4xl font-bold mb-4">{title}</h2>

            <h3 className="text-2xl font-semibold mb-2">Task</h3>
            <p className="text-base mb-4">{description}</p>

            {/*<h3 className="text-2xl font-semibold mb-2">Tags and Difficulty</h3>*/}
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

            <div className="mb-4">
              <h3 className="text-2xl font-semibold mb-3">
                Instructions
              </h3>
              <ul className="list-disc list-inside text-base space-y-2">
                <li>Enter your pseudocode in the editor.</li>
                <li>
                  Access the input for each test case using the variable{" "}
                  <code className="bg-slate-700 px-1 py-0.5 rounded">
                    TEST_CASE
                  </code>
                  .
                </li>
                <li>
                  Ensure your code outputs the result using{" "}
                  <code className="bg-slate-700 px-1 py-0.5 rounded">
                    output
                  </code>
                  .
                </li>
                <li>
                  Once ready, press <strong>Run Code</strong> to execute your
                  code and view results in the Outcome/Output panel.
                </li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold mb-2">
              Input and Output Types
            </h3>
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
                Note: Each "Test Case" follows the <strong>Input Type</strong>{" "}
                format, and your solution's output is validated against the{" "}
                <strong>Expected Output</strong>.
              </p>
            </div>

            {testCases.length > 0 && (
              <>
                <h3 className="text-2xl font-semibold mb-2 ">
                  Example Test Case
                </h3>
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
        )}
        {instructionState == "solution" && <></>}
      </div>
    </div>
  );
};

export default Instructions;
