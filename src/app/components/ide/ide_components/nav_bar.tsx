// components/NavBar.tsx
import React from "react";
import {
  HomeIcon,
  EyeSlashIcon,
  EyeIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

interface NavbarProps {
  taskVisible: boolean;
  outputVisible: boolean;
  taskWidth: string;
  outputWidth: string;
  showOutput: boolean;
  showTask: boolean;
  onToggleTask: () => void;
  onToggleOutput: () => void;
  onRun: () => void;
  onClearOutput: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  taskVisible,
  outputVisible,
  taskWidth,
  outputWidth,
  showOutput,
  showTask,
  onToggleTask,
  onToggleOutput,
  onRun,
  onClearOutput,
}) => {
  const router = useRouter();
  return (
    <nav className="flex items-center justify-between bg-gray-800 text-white">
      <div className={`nav-els ${taskWidth != "hidden" ? taskWidth : "pr-6"}`}>
        <h1 className="text-xl font-bold">Task</h1>
        <div className="flex !mr-4">
          <button
            onClick={() => router.push("/challenges")}
            className="nav-btns"
          >
            <HomeIcon className="nav-icons" />
          </button>
          <button onClick={() => onToggleTask()} className={`nav-btns`}>
            {showTask ? (
              <EyeIcon className="nav-icons" />
            ) : (
              <EyeSlashIcon className="nav-icons" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`nav-els gap-2 ${
          "flex-grow" /*editorW != "hidden" ? editorW: "w-4/5"*/
        }`}
      >
        <h1 className="text-xl font-bold">Pseudocode</h1>

        <div className="flex !mr-4">
          <button
            onClick={onRun}
            className="nav-btns bg-emerald-600 hover:bg-emerald-700"
          >
            <PlayIcon className="nav-icons" />
            Run
          </button>
        </div>
      </div>

      <div className={`nav-els ${outputWidth != "hidden" ? outputWidth : ""}`}>
        <h1 className="text-xl font-bold">Output</h1>

        <div className="flex !mr-4">
          <button onClick={() => onClearOutput()} className="nav-btns">
            <TrashIcon className="nav-icons" />
          </button>
          <button
            onClick={() => onToggleOutput()}
            className={`nav-btns ${showOutput ? "" : ""}`}
          >
            {showOutput ? (
              <EyeIcon className="nav-icons" />
            ) : (
              <EyeSlashIcon className="nav-icons" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
