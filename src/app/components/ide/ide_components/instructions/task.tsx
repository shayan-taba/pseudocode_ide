import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";

import {ExclamationCircleIcon} from "@heroicons/react/24/outline";

interface TaskProps {
  id: number; // Task ID to fetch the completion status
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  testCases: { inputs: string[]; output: string }[]; // Test case structure
  outputType: any;
  completeStatus: boolean | undefined;
  testInputsTypes: {
    name: string;
    type: string;
  }[];
}
const Task: React.FC<TaskProps> = ({
  id,
  title,
  description,
  tags,
  difficulty,
  testCases,
  outputType,
  completeStatus,
  testInputsTypes,
}) => {
  const [completionStatus, setCompletionStatus] = useState({
    status: false,
    message: "Not Complete",
  });

  const [sections, setSections] = useState({
    task: true,
    instructions: false,
    inputOutput: false,
    exampleTestCase: false,
  });

  useEffect(() => {
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
  }, [completeStatus, id]);

  type SectionKeys =
    | "task"
    | "instructions"
    | "inputOutput"
    | "exampleTestCase";

  const toggleSection = (section: SectionKeys) => {
    setSections((prev) => {
      // Close all sections first, then toggle the selected section
      const newSections = Object.keys(prev).reduce((acc, key) => {
        acc[key as SectionKeys] = false; // Close all sections
        return acc;
      }, {} as Record<SectionKeys, boolean>);

      newSections[section] = !prev[section]; // Toggle the selected section
      return newSections;
    });
  };

  return (
    <div>
      <div className="flex flex-col">
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
          {completionStatus.message}
          </span>
        </div>
      </div>

      {/*<h3 className="text-2xl font-semibold mb-2">Task</h3>*/}
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

      {/* Instructions Section */}
      <div className="mb-4">
        <div
          className="acccordion"
          onClick={() => toggleSection("instructions")}
        >
          <h3 className="text-2xl font-semibold">Instructions</h3>
          {sections.instructions ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
        {sections.instructions && (
          <ul className="list-disc list-inside text-base mt-2 space-y-2 bg-slate-700 border rounded-xl p-4">
            <li>Enter your pseudocode in the editor.</li>
            <li>
              Access the input for each test case:
              <ul className="list-disc list-inside pl-6 mt-1 space-y-1 text-sm">
                {testInputsTypes.map((input, key) => (
                  <li key={key}>
                    <code className="bg-slate-800 px-1 py-0.5 rounded text-white">
                      {input.name}
                    </code>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              Ensure your code outputs the expected result using{" "}
              <code className="bg-slate-700 px-1 py-0.5 rounded">output</code>.
            </li>
            <li>
              Once ready, press <strong>Run Code</strong> to execute your code
              and view results in the Outcome/Output panel.
            </li>
          </ul>
        )}
      </div>

      {/* Input and Output Types Section */}
      <div className="mb-4">
        <div
          className="acccordion"
          onClick={() => toggleSection("inputOutput")}
        >
          <h3 className="text-2xl font-semibold">Input and Output Types</h3>
          {sections.inputOutput ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
        {sections.inputOutput && (
          <div className="bg-slate-700 p-4 border rounded-xl mt-2 space-y-4">
            {testInputsTypes.map((input, index) => (
              <div
                key={index}
                className="p-3 bg-slate-800 border border-slate-600 rounded-lg"
              >
                <p className="text-sm">
                  <strong className="block text-gray-200 mb-1">
                    Variable:
                  </strong>
                  <span className="text-blue-300">{input.name}</span>
                </p>
                <p className="text-sm mt-2">
                  <strong className="block text-gray-200 mb-1">Type:</strong>
                  <span className="text-blue-300">{input.type}</span>
                </p>
              </div>
            ))}
            <div className="p-3 bg-slate-800 border border-slate-600 rounded-lg">
              <p className="text-sm">
                <strong className="block text-purple-300 mb-1">
                  Output Type:
                </strong>
                <span className="text-purple-300">{outputType}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Example Test Case Section */}
      {testCases.length > 0 && (
        <div className="mb-4">
          <div
            className="acccordion"
            onClick={() => toggleSection("exampleTestCase")}
          >
            <h3 className="text-2xl font-semibold">Example Test Case</h3>
            {sections.exampleTestCase ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </div>

          {sections.exampleTestCase && (
            <div className="bg-slate-700 p-4 border rounded-xl mt-2 space-y-4">
              {/* Displaying each input variable with its value and type */}
              {testCases[0].inputs.map((inputValue, index) => (
                <div
                  key={index}
                  className="p-3 bg-slate-800 border border-slate-600 rounded-lg"
                >
                  <p className="text-sm">
                    <strong className="block text-gray-200 mb-1">
                      Variable:
                    </strong>
                    <span className="text-blue-300">
                      {testInputsTypes[index].name}
                    </span>
                  </p>
                  <p className="text-sm mt-2">
                    <strong className="block text-gray-200 mb-1">
                      Input Value:
                    </strong>
                    <span className="text-blue-300">
                      {/*JSON.stringify(*/ inputValue /*)*/}
                    </span>
                  </p>
                  <p className="text-sm mt-2">
                    <strong className="block text-gray-200 mb-1">Type:</strong>
                    <span className="text-blue-300">
                      {testInputsTypes[index].type}
                    </span>
                  </p>
                </div>
              ))}

              {/* Displaying the expected output */}
              <div className="p-3 bg-slate-800 border border-slate-600 rounded-lg">
                <p className="text-sm">
                  <strong className="block text-purple-300 mb-1">
                    Expected Output:
                  </strong>
                  <span className="text-purple-300">
                    {JSON.stringify(testCases[0].output)}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Task;
