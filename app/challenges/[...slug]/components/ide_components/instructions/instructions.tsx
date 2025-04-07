// This component renders instructions on the challenge being viewed, its current completion status, and example-solutions.
// It relies on two sub-componenets to do so.
// This component enables users to switch between viewing those two sub-components.

import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/solid";

import {   BookOpenIcon, DocumentTextIcon } from "@heroicons/react/24/outline"

import { Dispatch, useEffect, useState } from "react";

import Task from "./task";
import Solution from "./solution";

interface InstructionsProps {
  id: number;
  width: string;
  title: string;
  description: string;
  hint: string;
  tags: string[];
  difficulty: string;
  testCases: { inputs: string[]; output: string }[]; // Test case structure
  expandInstructions: boolean;
  setExpandInstructions: Dispatch<React.SetStateAction<boolean>>;
  instructionState: "task" | "solution";
  toggleInstructionState: () => void;
  outputType: string;
  testInputsTypes: {
    name: string;
    type: string;
  }[];
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
  const [hintUsed, setHintUsed] = useState<boolean>(false);

  const [storedCompletionStatus, setStoredCompletionStatus] = useState({
    status: false,
    message: "Not Complete",
  });

  useEffect(() => {
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
    const key = `challenge-${id}`;
    const existingData = localStorage.getItem(key);

    if (existingData) {
      try {
        // Parse and update existing data
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
