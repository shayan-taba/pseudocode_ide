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

import Task from "./task";
import Solution from "./solution";
import { TestResultType } from "../../ide";

interface InstructionsProps {
  id: number;
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
  inputName: string;
  exampleSolution: string;
  testResults: TestResultType[];
  completeStatus: boolean | undefined;
}

const Instructions: React.FC<InstructionsProps> = ({
  id,
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
  inputName,
  exampleSolution,
  testResults,
  completeStatus,
}) => {
  const router = useRouter();

  const CopyToClipboard = () => {
    const [message, setMessage] = useState("");
    const [showWarning, setShowWarning] = useState(false);

    const copyText = (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setMessage("Text copied to clipboard!");
          setTimeout(() => setMessage(""), 2000); // Clear message after 2 seconds
        })
        .catch((err) => {
          setMessage("Failed to copy text!");
          console.error("Error copying text: ", err);
        });
    };
  };

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
            difficulty={difficulty}
            tags={tags}
            inputName={inputName}
            inputType={inputType}
            testResults={testResults}
            completeStatus={completeStatus}
          />
        )}
        {instructionState == "solution" && (
          <Solution exampleSolution={exampleSolution} />
        )}
      </div>
    </div>
  );
};

export default Instructions;
