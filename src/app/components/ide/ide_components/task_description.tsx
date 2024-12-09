// components/TaskDescription.tsx
import React from "react";

interface TaskDescriptionProps {
  taskWidth: string;
}
const TaskDescription: React.FC<TaskDescriptionProps> = ({ taskWidth }) => {
  return (
    <div
      className={`outline-2 outline outline-gray-300 flex flex-col bg-gray-800 ${taskWidth} p-5 overflow-y-auto`}
    >
      <h2 className="text-lg font-bold mb-2">Task Description</h2>
      <p>
        Enter pseudocode in the editor. Once ready, press "Run Code" to execute
        the code and see the output.
      </p>
    </div>
  );
};

export default TaskDescription;
