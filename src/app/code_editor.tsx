"use client";

import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>(""); // Editor content
  const [output, setOutput] = useState<string[]>([]); // Accumulated output
  const [userInput, setUserInput] = useState<string>(""); // User input
  const [waitingForInput, setWaitingForInput] = useState<boolean>(false); // Input request state
  const [isComplete, setIsComplete] = useState<boolean>(false); // Script completion state
  const [isDescriptionOpen, setDescriptionOpen] = useState<boolean>(true); // Collapsible description state
  const [isCodeEditorOpen, setCodeEditorOpen] = useState<boolean>(true); // Collapsible code editor state

  // Helper function to fetch data from the backend
  const fetchFromBackend = async (input: string) => {
    if (code.trim()) {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudocode: code, userInput: input }), // Pass pseudocode and input
      });

      const data = await response.json();
      handleBackendResponse(data);
    }
  };

  // Handle changes in the editor
  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  // Start code execution
  const handleRunCode = async () => {
    setOutput([]); // Clear previous output
    setWaitingForInput(false); // Reset input state
    setIsComplete(false); // Reset completion state
    await fetchFromBackend(""); // Start execution with no input
  };

  // Send user input to the backend
  const handleSendInput = async () => {
    setWaitingForInput(false); // Hide input box while backend processes
    await fetchFromBackend(userInput); // Send user input to backend
    setUserInput(""); // Clear input field
  };

  // Process response from the backend
  const handleBackendResponse = (data: any) => {
    if (data.output) {
      setOutput((prev) => [...prev, data.output]); // Append new output
    }

    setWaitingForInput(data.requestingInput); // Update input request state
    setIsComplete(data.isComplete); // Update completion state
  };

  // Continuously poll the backend until the process is complete
  useEffect(() => {
    if (!waitingForInput && !isComplete) {
      const interval = setInterval(async () => {
        await fetchFromBackend(""); // Poll backend with no additional input
      }, 500); // Adjust polling interval as needed (500ms here)
      return () => clearInterval(interval); // Clear polling interval when done
    }
  }, [waitingForInput, isComplete]);

  return (
    <div className="p-[3vw] min-h-screen bg-gray-900 text-white flex flex-col p-4 space-y-4">
      <h1 className="text-3xl text-center font-bold mb-4">Pseudocode Editor</h1>

      {/* Left Collapsible Section: Task Description */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Task Description</h2>
        <button
          onClick={() => setDescriptionOpen(!isDescriptionOpen)}
          className="text-sm text-blue-400 hover:text-blue-600"
        >
          {isDescriptionOpen ? "Hide" : "Show"} Description
        </button>
      </div>
      {isDescriptionOpen && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <p>Write your pseudocode here for the given task.</p>
        </div>
      )}

      {/* Middle Collapsible Section: Pseudocode Editor */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Pseudocode Editor</h2>
        <button
          onClick={() => setCodeEditorOpen(!isCodeEditorOpen)}
          className="text-sm text-blue-400 hover:text-blue-600"
        >
          {isCodeEditorOpen ? "Hide" : "Show"} Editor
        </button>
      </div>
      {isCodeEditorOpen && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <CodeMirror
            value={code}
            height="300px"
            extensions={[python()]}
            theme={oneDark}
            onChange={handleEditorChange}
          />
          <button
            onClick={handleRunCode}
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={waitingForInput}
          >
            Run Code
          </button>
        </div>
      )}

      {/* Output Section */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl">Output:</h3>
        <pre className="bg-gray-900 p-4 rounded-lg overflow-auto">
          {output.join("\n")}
        </pre>

        {waitingForInput && (
          <div className="mt-4">
            <h3 className="text-xl">Enter Input:</h3>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter input"
              className="mt-2 p-2 bg-gray-700 rounded-lg text-white w-full"
            />
            <button
              onClick={handleSendInput}
              className="mt-2 w-full bg-emerald-700 text-white py-2 rounded-lg hover:bg-emerald-800"
            >
              Submit Input
            </button>
          </div>
        )}

        {isComplete && (
          <div className="mt-4">
            <h3 className="text-xl">Execution Completed</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
