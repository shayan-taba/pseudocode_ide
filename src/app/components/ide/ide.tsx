"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./ide_components/nav_bar";
import Instructions from "./ide_components/instructions/instructions";
import Editor from "./ide_components/editor/editor";
import Results from "./ide_components/results/results";
import Popup from "./ide_components/input_popup";

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

  const [expandInstructions, setExpandInstructions] = useState<boolean>(false);
  const [expandEditor, setExpandEditor] = useState<boolean>(false);
  const [expandResults, setExpandResults] = useState<boolean>(false);

  const [testIndex, setTestIndex] = useState<number>(0);

  const [inputMessage, setInputMessage] = useState<string>("");

  const [instructionState, setInstructionState] = useState<"task" | "solution">(
    "task"
  );

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const toggleInstructionState = () => {
    setInstructionState((prevState) =>
      prevState === "task" ? "solution" : "task"
    );
  };

  const [resultState, setResultState] = useState<"outcome" | "output">(
    "outcome"
  );

  const toggleResultsState = () => {
    setResultState((prevState) =>
      prevState === "outcome" ? "output" : "outcome"
    );
  };

  useEffect(() => {
    if (!testCases) {
      setTestIndex(-1); // -1 means playground mode
    }
  }, []);

  useEffect(() => {
  }, [output]);

  // Calculate widths dynamically
  useEffect(() => {
    if (expandInstructions) {
      setExpandEditor(false);
      setExpandResults(false);
    }
  }, [expandInstructions]);

  useEffect(() => {
    if (expandEditor) {
      setExpandInstructions(false);
      setExpandResults(false);
    }
  }, [expandEditor]);

  useEffect(() => {
    if (expandResults) {
      setExpandInstructions(false);
      setExpandEditor(false);
    }
  }, [expandResults]);

  const fetchFromBackend = async (input: string, run: boolean) => {
    if (code.trim()) {
      const response = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pseudocode: code,
          userInput: input,
          run: run,
          test_case_input:
            testIndex != -1 ? testCases[testIndex].input : undefined,
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
    setIsPopupOpen(false);
    setWaitingForInput(false); // Hide input box while backend processes
    await fetchFromBackend(userInput, false); // Send user input to backend
    setUserInput(""); // Clear input field
  };

  const handleBackendResponse = (data: any) => {
    console.log(data.output, "prior output", output);
    if (data.output) {
      setInputMessage(data.output);
      setOutput((prev) => [...prev, data.output]); // Append new output
    }

    setWaitingForInput(data.requestingInput); // Update input request state
    setIsComplete(data.isComplete); // Update completion state
  };

  useEffect(() => {
    setIsPopupOpen(waitingForInput);

    if (!waitingForInput && !isComplete) {
      const interval = setInterval(async () => {
        await fetchFromBackend("", false); // Poll backend with no additional input
      }, 500); // Adjust polling interval as needed (500ms here)
      return () => clearInterval(interval); // Clear polling interval when done
    }
  }, [waitingForInput, isComplete]);

  return (
    <div id="IDE" className="flex flex-col h-screen bg-zinc-950">
      <Navbar />
      <div id="IDE_Panel" className="flex flex-row flex-grow overflow-hidden">
        {expandInstructions && (
          <Instructions
            width={"w-[100%] m-5"}
            title={title}
            description={description}
            tags={tags}
            difficulty={difficulty}
            testCases={testCases}
            expandInstructions={expandInstructions}
            setExpandInstructions={setExpandInstructions}
            instructionState={instructionState}
            toggleInstructionState={toggleInstructionState}
          />
        )}

        {expandEditor && (
          <Editor
            width={"w-[100%] m-5"}
            code={code}
            onCodeChange={setCode}
            onRun={handleRunCode}
            expandEditor={expandEditor}
            setExpandEditor={setExpandEditor}
          />
        )}

        {expandResults && (
          <Results
            width={"w-[100%] m-5"}
            output={output}
            isComplete={isComplete}
            onClearOutput={() => setOutput([])}
            expandResults={expandResults}
            setExpandResults={setExpandResults}
            resultState={resultState}
            toggleResultsState={toggleResultsState}
          />
        )}

        {!expandInstructions && !expandEditor && !expandResults && (
          <>
            <Instructions
              width={"w-1/4"}
              title={title}
              description={description}
              tags={tags}
              difficulty={difficulty}
              testCases={testCases}
              expandInstructions={expandInstructions}
              setExpandInstructions={setExpandInstructions}
              instructionState={instructionState}
              toggleInstructionState={toggleInstructionState}
            />

            <div className="divider flex flex-col flex-grow justify-between gap-6 w-[75%]">
              <div className="h-[49%]">
                <Editor
                  width={"flex-grow"}
                  code={code}
                  onCodeChange={setCode}
                  onRun={handleRunCode}
                  expandEditor={expandEditor}
                  setExpandEditor={setExpandEditor}
                />
              </div>
              <div className="h-[49%] flex-grow">
                <Results
                  width={"flex-grow"}
                  output={output}
                  isComplete={isComplete}
                  onClearOutput={() => setOutput([])}
                  expandResults={expandResults}
                  setExpandResults={setExpandResults}
                  resultState={resultState}
                  toggleResultsState={toggleResultsState}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <Popup
        isOpen={isPopupOpen}
        userInput={userInput}
        onInputChange={handleInputChange}
        onSubmit={handleSendInput}
        message={inputMessage}
      />
    </div>
  );
};

export default IDE;
