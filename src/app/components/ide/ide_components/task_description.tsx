// components/TaskDescription.tsx
import React from "react";

interface TaskDescriptionProps {
  taskWidth: string;
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  testCases: { input: string; output: string }[]; // Test case structure
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({
  taskWidth,
  title,
  description,
  tags,
  difficulty,
  testCases,
}) => {
  return (
    <div
      className={`outline-1 outline outline-gray-300 flex flex-col bg-slate-800 ${taskWidth} p-5 overflow-y-auto`}
    >
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
        Enter pseudocode in the editor. Once ready, press "Run Code" to execute
        the code and see the output.
      </p>
    </div>
  );
};

export default TaskDescription;
