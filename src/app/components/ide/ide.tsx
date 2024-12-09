"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./ide_components/nav_bar";
import TaskDescription from "./ide_components/task_description";
import Editor from "./ide_components/editor";
import Output from "./ide_components/output";

import "./ide_styles.css";
// pages/code-editor.tsx

interface IDEProps {
  title: string;
  description: string;
  tags: string[];
  difficulty: string;
  testCases: { input: any; output: any }[]; // Test case structure
}

const IDE: React.FC<IDEProps> = ({
  title,
  description,
  tags,
  difficulty,
  testCases,
}) => {
  const [code, setCode] = useState<string>("");
  const [output, setOutput] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [waitingForInput, setWaitingForInput] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const [showTask, setShowTask] = useState<boolean>(true);
  const [showEditor, setShowEditor] = useState<boolean>(true); // Toggle Editor
  const [showOutput, setShowOutput] = useState<boolean>(true);

  const [taskWidthState, setTaskWidthState] = useState<string>("w-[22%]");
  const [editorWidthState, setEditorWidthState] = useState<string>("w-[50%]");
  const [outputWidthState, setOutputWidthState] = useState<string>("w-[28%]");

  const [testIndex, setTestIndex] = useState<number>(0);

  useEffect(() => {
    console.log('hayo',testIndex != -1 ? testCases[testIndex].input : undefined)
    if (!testCases) {
      setTestIndex(-1) // -1 means playground mode
    }
  }, []);

  // Calculate widths dynamically
  const getSectionWidths = () => {
    const visibleSections = [showTask, showEditor, showOutput].filter(
      Boolean
    ).length;
    if (visibleSections === 3)
      return {
        taskWidth: "w-[27%]",
        editorWidth: "w-[43%]",
        outputWidth: "w-[30%]",
      };
    if (visibleSections === 2) {
      if (!showTask)
        return {
          taskWidth: "hidden",
          editorWidth: "w-[60%]",
          outputWidth: "w-[40%]",
        };
      if (!showOutput)
        return {
          taskWidth: "w-1/3",
          editorWidth: "w-2/3",
          outputWidth: "hidden",
        };
      return { taskWidth: "w-1/5", editorWidth: "w-3/5", outputWidth: "w-1/5" };
    }
    if (visibleSections === 1) {
      if (showTask)
        return {
          taskWidth: "w-full",
          editorWidth: "hidden",
          outputWidth: "hidden",
        };
      if (showEditor)
        return {
          taskWidth: "hidden",
          editorWidth: "w-full",
          outputWidth: "hidden",
        };
      return {
        taskWidth: "hidden",
        editorWidth: "hidden",
        outputWidth: "w-full",
      };
    }
    return {
      taskWidth: "hidden",
      editorWidth: "hidden",
      outputWidth: "hidden",
    };
  };

  useEffect(() => {
    console.log("Values", showTask, showEditor, showOutput);
    const { taskWidth, editorWidth, outputWidth } = getSectionWidths();

    setTaskWidthState(taskWidth);
    setEditorWidthState(editorWidth);
    setOutputWidthState(outputWidth);
  }, [showTask, showEditor, showOutput]);

  const fetchFromBackend = async (input: string, run: boolean) => {
    if (code.trim()) {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudocode: code,
          userInput: input,
          run: run,
          test_case_input: testIndex != -1 ? testCases[testIndex].input : undefined
        }),
      });

      const data = await response.json();
      handleBackendResponse(data);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleRunCode = async () => {
    setOutput([]); // Clear previous output
    setWaitingForInput(false); // Reset input state
    setIsComplete(false); // Reset completion state
    await fetchFromBackend("", true); // Start execution with no input
  };

  const handleSendInput = async () => {
    setWaitingForInput(false); // Hide input box while backend processes
    await fetchFromBackend(userInput, false); // Send user input to backend
    setUserInput(""); // Clear input field
  };

  const handleBackendResponse = (data: any) => {
    console.log(data);
    if (data.output) {
      setOutput((prev) => [...prev, data.output]); // Append new output
    }

    setWaitingForInput(data.requestingInput); // Update input request state
    setIsComplete(data.isComplete); // Update completion state
  };

  useEffect(() => {
    if (!waitingForInput && !isComplete) {
      const interval = setInterval(async () => {
        await fetchFromBackend("", false); // Poll backend with no additional input
      }, 500); // Adjust polling interval as needed (500ms here)
      return () => clearInterval(interval); // Clear polling interval when done
    }
  }, [waitingForInput, isComplete]);

  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <Navbar
        taskVisible={showTask}
        outputVisible={showOutput}
        taskWidth={taskWidthState}
        outputWidth={outputWidthState}
        showOutput={showOutput}
        showTask={showTask}
        onToggleTask={() => setShowTask(!showTask)}
        onToggleOutput={() => setShowOutput(!showOutput)}
        onRun={handleRunCode}
        onClearOutput={() => setOutput([])}
      />
      <div className="overflow-hidden border-t-4 border-gray-300 flex flex-grow">
        {showTask && (
          <TaskDescription
            taskWidth={taskWidthState}
            title={title}
            description={description}
            tags={tags}
            difficulty={difficulty}
            testCases={testCases}
          />
        )}
        {showEditor && (
          <Editor
            code={code}
            onCodeChange={setCode}
            editorWidth={editorWidthState}
          />
        )}
        {showOutput && (
          <Output
            output={output}
            userInput={userInput}
            waitingForInput={waitingForInput}
            isComplete={isComplete}
            outputWidth={outputWidthState}
            onInputChange={(e) => setUserInput(e.target.value)}
            onSendInput={handleSendInput}
          />
        )}
      </div>
    </div>
  );
};

export default IDE;
