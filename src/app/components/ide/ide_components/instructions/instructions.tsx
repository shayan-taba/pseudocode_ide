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
  instructionState: string;
  toggleInstructionState: () => void;
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
  toggleInstructionState
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
      <div className={`container-body overflow-y-auto`}>
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-sm mb2">{description}</p>
        {/* Tags - Styled as badges */}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2 mb-2">
          <span
            key={difficulty}
            className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full"
          >
            {difficulty}
          </span>
        </div>
        <p className="text-sm mb2">
          Enter pseudocode in the editor. Once ready, press "Run Code" to
          execute the code and see the output.
        </p>
      </div>
    </div>
  );
};

export default Instructions;
