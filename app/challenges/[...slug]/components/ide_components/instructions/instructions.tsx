// This component renders instructions on the challenge being viewed, its current completion status, and example-solutions.
// It relies on two sub-components to do so.
// This component enables users to switch between viewing those two sub-components.

import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";

import { BookOpenIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

import { Dispatch, useEffect, useState } from "react";

import Task from "./task";
import Solution from "./solution";

interface InstructionsProps {
  // Props define all the necessary data to display the challenge instructions and solution
  id: number;
  width: string;
  title: string;
  description: string;
  hint: string;
  tags: string[];
  difficulty: string;
  testCases: { inputs: string[]; output: string }[];
  expandInstructions: boolean;
  setExpandInstructions: Dispatch<React.SetStateAction<boolean>>;
  instructionState: "task" | "solution";
  toggleInstructionState: () => void;
  outputType: string;
  testInputsTypes: { name: string; type: string }[];
  exampleSolution: string;
  completeStatus: boolean | undefined;
}

const Instructions: React.FC<InstructionsProps> = ({
  id,
  width,
  title,
  description,
  hint,
  tags,
  difficulty,
  testCases,
  expandInstructions,
  setExpandInstructions,
  instructionState,
  toggleInstructionState,
  outputType,
  testInputsTypes,
  exampleSolution,
  completeStatus,
}) => {
  const [hintUsed, setHintUsed] = useState<boolean>(false); // Track if hint has been used

  const [storedCompletionStatus, setStoredCompletionStatus] = useState({
    status: false,
    message: "Not Complete",
  });

  useEffect(() => {
    // On mount or completion status change, retrieve and update completion status from localStorage
    const fetchCompletionStatus = () => {
      const storedData = localStorage.getItem(`challenge-${id}`);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setStoredCompletionStatus({
          status: parsedData.status,
          message: parsedData.status ? "Complete" : "Not Complete",
        });
      }
    };

    fetchCompletionStatus();
  }, [completeStatus, id]);

  useEffect(() => {
    // On mount or hint usage change, check if a hint was previously used
    const key = `challenge-${id}`;
    const existingData = localStorage.getItem(key);

    if (existingData) {
      try {
        const parsedData = JSON.parse(existingData);
        if (parsedData.hintUsed == true) {
          setHintUsed(true);
        } else {
          setHintUsed(false);
        }
      } catch (err) {
        console.error("Error parsing localStorage data: ", err);
      }
    }
  }, [hintUsed]);

  return (
    <div className={`container-els divider ${width}`}>
      <div className="container-headings text-blue-400">
        <div className="container-nav-box">
          {/* Toggle buttons for switching between Task and Solution views */}
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
          {/* Button to expand or collapse the instructions pane */}
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

      {/* Render task or solution based on current state */}
      <div className={`container-body scrollable-container`}>
        {instructionState == "task" && (
          <Task
            id={id}
            outputType={outputType}
            testCases={testCases}
            title={title}
            description={description}
            hint={hint}
            difficulty={difficulty}
            tags={tags}
            testInputsTypes={testInputsTypes}
            storedCompletionStatus={storedCompletionStatus}
            hintUsed={hintUsed}
          />
        )}
        {instructionState == "solution" && (
          <Solution
            setHintUsed={setHintUsed}
            storedCompletionStatus={storedCompletionStatus}
            exampleSolution={exampleSolution}
            id={id}
          />
        )}
      </div>
    </div>
  );
};

export default Instructions;
